import config from '@config'
import { createAiConversation, getAiConversation, listAiConversations, switchAiConversationClient } from '@utils/ai'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import defaultModelMetrics from './defaultModelMetrics'
import normalizeClient from './normalizeClient'

function createPendingAssistantMessage(conversationId: string): GPT_ChatMessage {
    return {
        id: `${conversationId}-assistant`,
        role: 'assistant',
        content: '',
        pending: true,
    }
}

export default function useGptPageState() {
    const [clients, setClients] = useState<GPT_Client[]>([])
    const [reconnect, setReconnect] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [participants, setParticipants] = useState(1)
    const [conversations, setConversations] = useState<ChatConversationSummary[]>([])
    const [isLoadingConversations, setIsLoadingConversations] = useState(true)
    const [isLoadingChat, setIsLoadingChat] = useState(false)
    const [chatSession, setChatSession] = useState<ChatSession | null>(null)
    const clientsRef = useRef<GPT_Client[]>([])
    const socketRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        clientsRef.current = clients
    }, [clients])

    useEffect(() => {
        const ws = new WebSocket(`${config.url.beekeeper_wss}/client/ws/beeswarm`)
        socketRef.current = ws

        ws.onopen = () => {
            setReconnect(false)
            setIsConnected(true)
        }

        ws.onclose = () => {
            setIsConnected(false)
            socketRef.current = null
        }

        ws.onerror = (error) => {
            console.log('WebSocket error:', error)
            setIsConnected(false)
        }

        ws.onmessage = (event) => {
            try {
                handleSocketMessage(
                    JSON.parse(event.data) as GptSocketMessage,
                    setChatSession,
                    setClients,
                    setParticipants,
                    () => void loadConversations()
                )
            } catch (error) {
                console.error('Invalid message from server:', error)
            }
        }

        return () => ws.close()
    }, [reconnect])

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!isConnected) {
                setReconnect(true)
            }
        }, 3000)

        return () => clearTimeout(timeout)
    }, [isConnected])

    const loadConversations = useCallback(async () => {
        try {
            setIsLoadingConversations(true)
            setConversations(await listAiConversations())
        } catch (error) {
            console.error('Failed to load conversations', error)
        } finally {
            setIsLoadingConversations(false)
        }
    }, [])

    useEffect(() => {
        void loadConversations()
    }, [loadConversations])

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

    async function openChat(client: GPT_Client | string) {
        const clientName = typeof client === 'string' ? client : client.name

        try {
            const conversation = await createAiConversation(clientName)
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

    function sendPrompt(content: string, sessionOverride?: ChatSession | null) {
        const session = sessionOverride || chatSession
        if (!session || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            return false
        }

        const userMessage: GPT_ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content,
            createdAt: new Date().toISOString(),
        }
        const requestMessages = [...session.messages, userMessage]
            .filter((message) =>
                message.role === 'system'
                || message.role === 'user'
                || message.role === 'assistant')
            .map(message => ({ role: message.role, content: message.content }))

        setChatSession((prev) => prev
            && prev.conversationId === session.conversationId
            ? {
                ...prev,
                isSending: true,
                messages: [...prev.messages, userMessage, createPendingAssistantMessage(prev.conversationId)],
            }
            : {
                ...session,
                isSending: true,
                messages: [...session.messages, userMessage, createPendingAssistantMessage(session.conversationId)],
            })

        socketRef.current.send(JSON.stringify({
            type: 'prompt_request',
            conversationId: session.conversationId,
            clientName: session.clientName,
            messages: requestMessages,
            maxTokens: 512,
            temperature: 0.7,
        }))

        void loadConversations()
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
