'use client'

import { useEffect, useState } from 'react'
import Alert from '@components/alert/alert'
import { getCookie, setCookie } from 'utilbee/utils'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { normalizeLang } from '@utils/lang'

export default function Alerts() {
    const [alert, setAlert] = useState<GetAlertProps | null>(null)
    const [showToast, setShowToast] = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(5000)

    const pathname = usePathname()
    const lang = normalizeLang(getCookie('lang'))


    function calculateDuration(text: string) {
        const words = text.split(/\s+/).filter(word => word.length > 0).length
        const minutes = words / 180
        const ms = minutes * 60 * 1000
        return Math.max(ms, 5000)
    }

    useEffect(() => {
        async function fetchAlert() {
            setAlert(null)
            setShowToast(false)
            setProgress(0)
            try {
                const response = await fetch(`/api/alerts?page=${encodeURIComponent(pathname)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                if (response.ok) {
                    const result = await response.json()
                    if (typeof result !== 'string' && result) {
                        const showAlert = !getCookie('alertDismissed-' + result.id)
                        if (!showAlert) return
                        setAlert(result)
                        const description = lang === 'en' ? result.description_en : result.description_no
                        setDuration(calculateDuration(description))
                        setShowToast(true)
                        setProgress(0)
                    }
                }
            } catch (error) {
                console.error('Error fetching alerts:', error)
            }
        }
        fetchAlert()
    }, [pathname])

    useEffect(() => {
        if (!showToast) return

        const interval = 100
        const steps = duration / interval
        let currentStep = 0

        const timer = setInterval(() => {
            currentStep++
            const newProgress = (currentStep / steps) * 100
            setProgress(newProgress)

            if (currentStep >= steps) {
                setShowToast(false)
                clearInterval(timer)
            }
        }, interval)

        return () => clearInterval(timer)
    }, [showToast, duration])

    if (!showToast || !alert) return null

    return (
        <div className='fixed bottom-5 right-4 z-50 max-w-sm'>
            <Alert variant='info' className='shadow-lg'>
                <div>
                    <h4 className='font-bold'>{lang === 'en' ? alert.title_en : alert.title_no}</h4>
                    <p>{lang === 'en' ? alert.description_en : alert.description_no}</p>
                </div>
                <div className='mt-2 bg-(--color-alert-info-icon)/30 rounded-full h-2'>
                    <div
                        className='bg-(--color-alert-info-icon) h-2 rounded-full transition-all duration-100 ease-linear'
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </Alert>
            <button
                onClick={() => {
                    setShowToast(false)
                    setCookie('alertDismissed-' + alert.id, 'true', 1)
                }}
                className='absolute top-2 right-2 p-1 transition-colors cursor-pointer'
                aria-label='Close alert'
            >
                <X size={16} />
            </button>
        </div>
    )
}
