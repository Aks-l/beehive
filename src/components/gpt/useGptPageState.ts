import config from '@config'
import { createAiConversation, getAiConversation, listAiConversations, switchAiConversationClient } from '@utils/ai'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import defaultModelMetrics from './defaultModelMetrics'
import normalizeClient from './normalizeClient'

const CHAT_SESSION_STORAGE_PREFIX = 'ai-chat-session:'

function createPendingAssistantMessage(conversationId: string): GPT_ChatMessage {
    return {
        id: `${conversationId}-assistant`,
        role: 'assistant',
        content: '',
        pending: true,
    }
}

export default function useGptPageState(initialConversations?: ChatConversationSummary[]) {
    const [clients, setClients] = useState<GPT_Client[]>([])
    const [isConnected, setIsConnected] = useState(false)
    const [participants, setParticipants] = useState(1)
    const [conversations, setConversations] = useState<ChatConversationSummary[]>(initialConversations || [])
    const [isLoadingConversations, setIsLoadingConversations] = useState(initialConversations === undefined)
    const [isLoadingChat, setIsLoadingChat] = useState(false)
    const [chatSession, setChatSession] = useState<ChatSession | null>(null)
    const clientsRef = useRef<GPT_Client[]>([])
    const socketRef = useRef<WebSocket | null>(null)

    const loadConversations = useCallback(async (background = false) => {
        try {
            if (!background) {
                setIsLoadingConversations(true)
            }
            setConversations(await listAiConversations())
        } catch (error) {
            console.error('Failed to load conversations', error)
        } finally {
            setIsLoadingConversations(false)
        }
    }, [])

    useEffect(() => {
        clientsRef.current = clients
    }, [clients])

    useEffect(() => {
        let disposed = false
        let reconnectTimer: ReturnType<typeof setTimeout> | null = null
        let reconnectAttempt = 0

        const connect = () => {
            if (disposed) {
                return
            }

            const ws = new WebSocket(`${config.url.beekeeper_wss}/client/ws/beeswarm`)
            socketRef.current = ws

            ws.onopen = () => {
                reconnectAttempt = 0
                setIsConnected(true)
            }

            ws.onclose = () => {
                setIsConnected(false)

                if (socketRef.current === ws) {
                    socketRef.current = null
                }

                if (disposed) {
                    return
                }

                const delay = Math.min(250 * 2 ** reconnectAttempt, 3000)
                reconnectAttempt += 1
                reconnectTimer = setTimeout(connect, delay)
            }

            ws.onerror = (error) => {
                console.log('WebSocket error:', error)
                setIsConnected(false)

                if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                    ws.close()
                }
            }

            ws.onmessage = (event) => {
                try {
                    handleSocketMessage(
                        JSON.parse(event.data) as GptSocketMessage,
                        setChatSession,
                        setClients,
                        setParticipants,
                        () => void loadConversations(true)
                    )
                } catch (error) {
                    console.error('Invalid message from server:', error)
                }
            }
        }

        connect()

        return () => {
            disposed = true
            if (reconnectTimer) {
                clearTimeout(reconnectTimer)
            }

            const ws = socketRef.current
            socketRef.current = null
            ws?.close()
        }
    }, [loadConversations])

    useEffect(() => {
        void loadConversations(initialConversations !== undefined)
    }, [initialConversations, loadConversations])

    useEffect(() => {
        setChatSession((prev) => {
            if (!prev) {
                return prev
            }

            const activeClient = clients.find((client) => client.name === prev.clientName)
            return activeClient
                ? { ...prev, metrics: activeClient.model || prev.metrics }
                : prev
        })
    }, [clients])

    useEffect(() => {
        if (!chatSession?.conversationId) {
            return
        }

        persistChatSessionSnapshot(chatSession)
    }, [chatSession])

    async function openChat(client: GPT_Client | string) {
        const clientName = typeof client === 'string' ? client : client.name

        try {
            const conversation = await createAiConversation(clientName)
            if (!conversation) {
                return null
            }
            const session = mapStoredConversationToSession(
                conversation,
                typeof client === 'string'
                    ? clients.find((entry) => entry.name === clientName) || null
                    : client
            )
            setChatSession(session)
            await loadConversations()
            return session
        } catch (error) {
            console.error('Failed to create conversation', error)
            return null
        }
    }

    const restoreChat = useCallback(async (conversationId: string) => {
        try {
            setIsLoadingChat(true)
            const conversation = await getAiConversation(conversationId)
            setChatSession(mapStoredConversationToSession(
                conversation,
                clientsRef.current.find((client) => client.name === conversation.activeClientName) || null
            ))
        } catch (error) {
            console.error('Failed to restore chat', error)
            setChatSession(null)
        } finally {
            setIsLoadingChat(false)
        }
    }, [])

    async function switchConversationClient(conversationId: string, clientName: string) {
        try {
            const conversation = await switchAiConversationClient(conversationId, clientName)
            const session = mapStoredConversationToSession(
                conversation,
                clients.find((client) => client.name === conversation.activeClientName) || null
            )
            setChatSession(session)
            await loadConversations()
            return session
        } catch (error) {
            console.error('Failed to switch conversation client', error)
            return null
        }
    }

    async function sendPrompt(content: string, sessionOverride?: ChatSession | null) {
        const session = resolveValidSession(sessionOverride, chatSession)
        const trimmedContent = content.trim()

        if (!session || !trimmedContent || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            return false
        }

        const userMessage: GPT_ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: trimmedContent,
            createdAt: new Date().toISOString(),
        }
        const requestMessages = [...session.messages, userMessage]
            .filter((message) =>
                message.role === 'system'
                || message.role === 'user'
                || message.role === 'assistant')
            .map(message => ({ role: message.role, content: message.content }))

        const nextSession = setSessionWithPrompt(session, userMessage)
        setChatSession((prev) => prev
            && prev.conversationId === session.conversationId
            ? setSessionWithPrompt(prev, userMessage)
            : nextSession)
        persistChatSessionSnapshot(nextSession)

        const identity = getOwnerIdentityFromCookies()

        socketRef.current.send(JSON.stringify({
            type: 'prompt_request',
            conversationId: session.conversationId,
            clientName: session.clientName,
            ownerUserId: identity.userId,
            ownerSessionId: identity.sessionId,
            messages: requestMessages,
            maxTokens: 512,
            temperature: 0.7,
        }))

        void loadConversations(true)
        return true
    }

    const activeClient = useMemo(() => {
        if (!chatSession) {
            return null
        }

        return clients.find(client => client.name === chatSession.clientName) || null
    }, [chatSession, clients])

    return {
        activeClient,
        chatSession,
        clients,
        closeChat: () => setChatSession(null),
        conversations,
        isConnected,
        isLoadingChat,
        isLoadingConversations,
        createConversation: openChat,
        loadConversations,
        openChat,
        participants,
        sendPrompt,
        restoreChat,
        switchConversationClient
    }
}

export function createChatSessionFromStoredConversation(
    conversation: StoredConversation,
    activeClient: GPT_Client | null = null
) {
    return mapStoredConversationToSession(conversation, activeClient)
}

export function getStoredChatSessionSnapshot(conversationId: string) {
    if (typeof window === 'undefined') {
        return null
    }

    const rawValue = window.sessionStorage.getItem(`${CHAT_SESSION_STORAGE_PREFIX}${conversationId}`)
    if (!rawValue) {
        return null
    }

    try {
        const value = JSON.parse(rawValue) as ChatSession
        return isValidSession(value) ? value : null
    } catch {
        return null
    }
}

function handleSocketMessage(
    msg: GptSocketMessage,
    setChatSession: React.Dispatch<React.SetStateAction<ChatSession | null>>,
    setClients: React.Dispatch<React.SetStateAction<GPT_Client[]>>,
    setParticipants: React.Dispatch<React.SetStateAction<number>>,
    refreshConversations: () => void
) {
    switch (msg.type) {
        case 'update': {
            if (!msg.client) {
                return
            }

            const normalizedClient = normalizeClient(msg.client)
            setParticipants(msg.participants || 0)
            setClients((prev) => {
                const existing = prev.find(client => client.name === normalizedClient.name)
                return existing
                    ? prev.map(client => client.name === normalizedClient.name
                        ? { ...client, ...normalizedClient, model: normalizedClient.model }
                        : client)
                    : [...prev, normalizedClient]
            })
            setChatSession((prev) => (
                !prev || prev.clientName !== normalizedClient.name
                    ? prev
                    : { ...prev, metrics: normalizedClient.model }
            ))
            return
        }
        case 'join':
            setParticipants(msg.participants || 0)
            return

        case 'prompt_started':
            return setChatSession((prev) => updatePromptStart(prev, msg))

        case 'prompt_delta':
            return setChatSession((prev) => updatePromptDelta(prev, msg))

        case 'prompt_complete':
            refreshConversations()
            return setChatSession((prev) => updatePromptComplete(prev, msg))

        case 'prompt_error':
            refreshConversations()
            return setChatSession((prev) => updatePromptError(prev, msg))

        default:
            return
    }
}

function updatePromptStart(session: ChatSession | null, msg: GptSocketMessage) {
    if (!session || session.conversationId !== msg.conversationId) return session
    return {
        ...session,
        isSending: true,
        metrics: msg.metrics || session.metrics,
        messages: session.messages.some(message => message.role === 'assistant' && message.pending)
            ? session.messages
            : [...session.messages, createPendingAssistantMessage(session.conversationId)],
    }
}

function mapStoredConversationToSession(conversation: StoredConversation, activeClient: GPT_Client | null): ChatSession {
    return {
        title: conversation.title,
        originalClientName: conversation.originalClientName,
        clientName: conversation.activeClientName,
        conversationId: conversation.id,
        messages: conversation.messages,
        isSending: false,
        metrics: activeClient?.model || defaultModelMetrics(),
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
    }
}

function updatePromptDelta(session: ChatSession | null, msg: GptSocketMessage) {
    if (!session || session.conversationId !== msg.conversationId) return session
    const messages = [...session.messages]
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'assistant') {
        messages[messages.length - 1] = {
            ...lastMessage,
            content: msg.content ?? `${lastMessage.content}${msg.delta || ''}`,
            pending: true,
        }
    }

    return { ...session, isSending: true, metrics: msg.metrics || session.metrics, messages }
}

function updatePromptComplete(session: ChatSession | null, msg: GptSocketMessage) {
    if (!session || session.conversationId !== msg.conversationId) return session
    const messages = [...session.messages]
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'assistant') {
        messages[messages.length - 1] = {
            ...lastMessage,
            content: msg.content ?? lastMessage.content,
            pending: false,
        }
    }

    return { ...session, isSending: false, metrics: msg.metrics || session.metrics, messages }
}

function updatePromptError(session: ChatSession | null, msg: GptSocketMessage) {
    if (!session || session.conversationId !== msg.conversationId) return session
    const messages = [...session.messages]
    const lastMessage = messages[messages.length - 1]
    const content = msg.error || 'The model failed to answer this prompt.'
    if (lastMessage?.role === 'assistant' && lastMessage.pending) {
        messages[messages.length - 1] = { ...lastMessage, content, pending: false, error: true }
    } else {
        messages.push({
            id: `${session.conversationId}-error-${Date.now()}`,
            role: 'assistant',
            content,
            error: true,
        })
    }

    return {
        ...session,
        isSending: false,
        metrics: msg.metrics || { ...session.metrics, status: 'error', lastError: content },
        messages,
    }
}

function resolveValidSession(sessionOverride?: ChatSession | null, chatSession?: ChatSession | null) {
    const session = isValidSession(sessionOverride) ? sessionOverride : chatSession
    return isValidSession(session) ? session : null
}

function isValidSession(session: ChatSession | null | undefined): session is ChatSession {
    return Boolean(
        session
        && session.conversationId
        && session.clientName
        && Array.isArray(session.messages)
    )
}

function setSessionWithPrompt(session: ChatSession, userMessage: GPT_ChatMessage): ChatSession {
    return {
        ...session,
        isSending: true,
        messages: [...session.messages, userMessage, createPendingAssistantMessage(session.conversationId)],
    }
}

function persistChatSessionSnapshot(session: ChatSession) {
    if (typeof window === 'undefined' || !session.conversationId) {
        return
    }

    window.sessionStorage.setItem(
        `${CHAT_SESSION_STORAGE_PREFIX}${session.conversationId}`,
        JSON.stringify(session)
    )
}

function getOwnerIdentityFromCookies() {
    if (typeof document === 'undefined') {
        return {
            userId: null,
            sessionId: null,
        }
    }

    const values = Object.fromEntries(
        document.cookie
            .split('; ')
            .filter(Boolean)
            .map((entry) => {
                const [key, ...rest] = entry.split('=')
                return [key, decodeURIComponent(rest.join('='))]
            })
    )

    return {
        userId: values.user_id || null,
        sessionId: values.ai_session_id || null,
    }
}
