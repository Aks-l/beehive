'use client'

import { CheckCircle, ChevronDown, CircleX, Clock3, HeartPulse, TimerReset, Watch } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import en from '@text/status/en.json'
import no from '@text/status/no.json'

type StatusText = typeof en
type ViewMode = 'compact' | 'expanded'

export default function PageClient({
    lang,
    monitoring
}: {
    lang: Lang
    monitoring: MonitoringService[]
}) {
    const router = useRouter()
    const text = lang === 'no' ? no : en
    const [viewMode, setViewMode] = useState<ViewMode>('compact')
    const summary = useMemo(() => getSummary(monitoring), [monitoring])

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh()
        }, 60000)

        return () => clearInterval(interval)
    }, [router])

    return (
        <div className='page-container min-h-[calc(100vh-var(--h-topbar))]'>
            <div className='page-section--normal flex flex-col gap-4 800px:gap-5'>
                <section>
                    <div className='flex flex-col gap-4 900px:flex-row 900px:items-start 900px:justify-between'>
                        <div className='max-w-190'>
                            <h1 className='heading-1 heading-1--top-left-corner mb-0!'>
                                {text.title}
                            </h1>
                            <p className='mt-3 border-l-4 border-l-(--color-primary) pl-3 text-(--color-text-regular)'>
                                {summary.healthyServices === summary.totalServices
                                    ? text.allOperational
                                    : text.someIssues}
                            </p>
                        </div>

                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} text={text} />
                    </div>

                    <div className='mt-5 grid gap-3 700px:grid-cols-2 1000px:grid-cols-4'>
                        <SummaryCard label={text.summary.services} value={String(summary.totalServices)} />
                        <SummaryCard label={text.summary.healthy} value={`${summary.healthyServices}/${summary.totalServices}`} />
                        <SummaryCard label={text.summary.avgResponse} value={formatDelay(summary.averageDelay)} />
                        <SummaryCard
                            label={text.summary.lastUpdated}
                            value={summary.lastUpdated
                                ? formatTimestamp(summary.lastUpdated, lang)
                                : text.values.notAvailable}
                        />
                    </div>

                    <p className='mt-4 text-sm text-(--color-text-discreet)'>
                        {text.legend.description}
                    </p>
                </section>

                <section className='grid gap-4 1000px:grid-cols-2'>
                    {monitoring.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            lang={lang}
                            text={text}
                            viewMode={viewMode}
                        />
                    ))}
                </section>
            </div>
        </div>
    )
}

function ServiceCard({
    service,
    lang,
    text,
    viewMode
}: {
    service: MonitoringService
    lang: Lang
    text: StatusText
    viewMode: ViewMode
}) {
    const [open, setOpen] = useState(false)
    const latestBar = service.bars[0]
    const averageDelay = getAverageDelay(service.bars)
    const serviceStatus = getServiceStatus(service)

    return (
        <article className='rounded-lg bg-(--color-bg-surface) p-4 800px:p-5'>
            <div className='grid gap-3 800px:grid-cols-[minmax(0,1fr)_auto] 800px:items-start'>
                <div className='min-w-0'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <h2 className='text-[1.1rem] font-semibold leading-tight text-(--color-text-main)'>
                            {service.name}
                        </h2>
                        <StatusPill status={serviceStatus} text={text} />
                    </div>
                    {viewMode === 'expanded' ? (
                        <p className='mt-1 line-clamp-1 text-sm text-(--color-text-regular)'>
                            {service.url || latestBar?.note || text.values.notAvailable}
                        </p>
                    ) : null}
                </div>

                <button
                    type='button'
                    onClick={() => setOpen(prev => !prev)}
                    className='flex shrink-0 items-center gap-2 font-medium
                        rounded-(--border-radius) bg-(--color-bg-body)
                        hover:bg-(--color-bg-surface-raised) px-3 py-2 text-sm
                        text-(--color-text-main) transition cursor-pointer'
                >
                    {open ? text.toggle.hideDetails : text.toggle.showDetails}
                    <ChevronDown
                        className={`h-4 w-4 transition-transform
                            ${open ? 'rotate-180 stroke-(--color-primary)' : ''}`}
                    />
                </button>
            </div>

            <div className='mt-3 grid gap-3 800px:grid-cols-[minmax(0,1fr)_14rem]'>
                <div className='flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-sm text-(--color-text-regular)'>
                    <InlineMetric icon={HeartPulse} value={`${service.uptime}%`} label={text.service.uptime} />
                    <InlineMetric
                        icon={TimerReset}
                        value={latestBar ? formatDelay(latestBar.delay) : text.values.notAvailable}
                        label={text.service.responseTime}
                    />
                    <InlineMetric
                        icon={Watch}
                        value={formatDelay(averageDelay)}
                        label={text.summary.avgResponse}
                    />
                    <InlineMetric
                        icon={Clock3}
                        value={latestBar ? formatTimestamp(latestBar.timestamp, lang) : text.values.notAvailable}
                        label={text.service.timestamp}
                    />
                </div>

                <div className='flex items-end justify-start overflow-x-auto 800px:justify-end'>
                    <div className='flex items-end gap-1 pb-1'>
                        {service.bars.slice(0, 30).map((bar, index) => (
                            <div
                                key={`${service.id}-${bar.timestamp}-${index}`}
                                className={`h-8 w-1.5 shrink-0 rounded-full ${getBarClassName(bar)}`}
                                title={getBarTitle(bar, lang, text)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {viewMode === 'expanded' ? (
                <div className='mt-3 rounded-lg bg-(--color-bg-body) px-4 py-3'>
                    <div className='grid gap-3 700px:grid-cols-2'>
                        <DetailRow label={text.service.status} value={getStatusLabel(serviceStatus, text)} />
                        <DetailRow
                            label={text.service.note}
                            value={latestBar?.note || text.values.none}
                        />
                        <DetailRow
                            label={text.service.plannedDowntime}
                            value={latestBar ? booleanText(latestBar.expectedDown, text) : text.values.notAvailable}
                        />
                        <DetailRow
                            label={text.service.tags}
                            value={service.tags.length ? service.tags.join(', ') : text.values.none}
                        />
                    </div>
                </div>
            ) : null}

            {open ? (
                <div className='mt-3 rounded-lg bg-(--color-bg-body) p-4'>
                    <div className='grid gap-4 700px:grid-cols-2'>
                        <DetailRow label={text.service.monitorId} value={String(service.id)} />
                        <DetailRow label={text.service.enabled} value={booleanText(service.enabled, text)} />
                        <DetailRow label={text.service.url} value={service.url || text.values.notAvailable} />
                        <DetailRow label={text.service.port} value={String(service.port)} />
                        <DetailRow
                            label={text.service.maxConsecutiveFailures}
                            value={String(service.maxConsecutiveFailures)}
                        />
                        <DetailRow
                            label={text.service.responseTime}
                            value={latestBar ? formatDelay(latestBar.delay) : text.values.notAvailable}
                        />
                        <DetailRow
                            label={text.service.note}
                            value={latestBar?.note || text.values.none}
                        />
                        <DetailRow
                            label={text.service.timestamp}
                            value={latestBar ? formatTimestamp(latestBar.timestamp, lang) : text.values.notAvailable}
                        />
                    </div>

                    {service.certificate ? (
                        <div className='mt-4 border-t border-(--color-border-default) pt-4'>
                            <div className='flex items-center justify-between'>
                                <h3 className='text-sm font-semibold text-(--color-text-main)'>
                                    {text.service.certificate}
                                </h3>
                                {service.certificate.valid
                                    ? <CheckCircle className='h-5 w-5 stroke-green-500' />
                                    : <CircleX className='h-5 w-5 stroke-red-500' />}
                            </div>
                            <div className='mt-3 grid gap-3 700px:grid-cols-2'>
                                <DetailRow
                                    label={text.service.certificateValid}
                                    value={booleanText(service.certificate.valid, text)}
                                />
                                <DetailRow label={text.service.subject} value={service.certificate.subjectCN} />
                                <DetailRow
                                    label={text.service.issuer}
                                    value={getCertificateIssuer(service.certificate)}
                                />
                                <DetailRow
                                    label={text.service.validFrom}
                                    value={formatCertificateDate(service.certificate.validFrom, lang, text)}
                                />
                                <DetailRow
                                    label={text.service.validTo}
                                    value={formatCertificateDate(service.certificate.validTo, lang, text)}
                                />
                                <DetailRow label={text.service.keyType} value={service.certificate.keyType} />
                                <DetailRow
                                    label={text.service.dnsNames}
                                    value={service.certificate.dnsNames}
                                    className='700px:col-span-2'
                                />
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </article>
    )
}

function ViewToggle({
    viewMode,
    setViewMode,
    text
}: {
    viewMode: ViewMode
    setViewMode: (mode: ViewMode) => void
    text: StatusText
}) {
    return (
        <div className='inline-flex rounded-lg bg-(--color-bg-body) p-1'>
            <button
                type='button'
                onClick={() => setViewMode('compact')}
                className={getToggleClassName(viewMode === 'compact')}
            >
                {text.toggle.compact}
            </button>
            <button
                type='button'
                onClick={() => setViewMode('expanded')}
                className={getToggleClassName(viewMode === 'expanded')}
            >
                {text.toggle.expanded}
            </button>
        </div>
    )
}

function SummaryCard({ label, value }: { label: string, value: string }) {
    return (
        <div className='rounded-lg bg-(--color-bg-body) px-4 py-3'>
            <p className='text-xs uppercase tracking-[0.12em] text-(--color-text-discreet)'>
                {label}
            </p>
            <p className='mt-1 text-[1.05rem] font-semibold text-(--color-text-main)'>
                {value}
            </p>
        </div>
    )
}

function InlineMetric({
    icon: Icon,
    label,
    value
}: {
    icon: typeof Clock3
    label: string
    value: string
}) {
    return (
        <div className='flex min-w-0 items-center gap-2'>
            <Icon className='h-4 w-4 shrink-0 text-(--color-text-discreet)' />
            <span className='truncate text-(--color-text-main)' title={`${label}: ${value}`}>
                {value}
            </span>
        </div>
    )
}

function DetailRow({
    label,
    value,
    className = ''
}: {
    label: string
    value: string
    className?: string
}) {
    return (
        <div className={className}>
            <p className='text-xs uppercase tracking-[0.12em] text-(--color-text-discreet)'>
                {label}
            </p>
            <p className='mt-1 wrap-break-word text-sm text-(--color-text-main)'>
                {value}
            </p>
        </div>
    )
}

function StatusPill({ status, text }: { status: StatusLevel, text: StatusText }) {
    const style = {
        healthy: 'bg-[#12351d] text-[#8ae39d] in-[.light]:bg-[#e8f7eb] in-[.light]:text-[#1f7a33]',
        issues: 'bg-[#3c1d1f] text-[#ffb4b8] in-[.light]:bg-[#fdebec] in-[.light]:text-[#a12633]',
        planned: 'bg-[#3f3115] text-[#f3d98a] in-[.light]:bg-[#fff4d9] in-[.light]:text-[#8a6400]',
        disabled: 'bg-(--color-bg-body) text-(--color-text-regular)'
    }[status]

    return (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>
            {getStatusLabel(status, text)}
        </span>
    )
}

type StatusLevel = 'healthy' | 'issues' | 'planned' | 'disabled'

function getToggleClassName(active: boolean) {
    return active
        ? 'rounded-(--border-radius) bg-(--color-bg-surface) px-3 py-1.5 text-sm font-semibold text-(--color-text-main) cursor-pointer'
        : 'rounded-(--border-radius) px-3 py-1.5 text-sm text-(--color-text-regular) cursor-pointer'
}

function getServiceStatus(service: MonitoringService): StatusLevel {
    if (!service.enabled) {
        return 'disabled'
    }

    const latestBar = service.bars[0]
    if (!latestBar) {
        return 'disabled'
    }

    if (latestBar.expectedDown) {
        return 'planned'
    }

    return latestBar.status ? 'healthy' : 'issues'
}

function getStatusLabel(status: StatusLevel, text: StatusText) {
    return text.statuses[status]
}

function getBarClassName(bar: MonitoringBar) {
    if (bar.expectedDown) {
        return 'bg-[#d9a52c] in-[.light]:bg-[#f1c75b]'
    }

    return bar.status
        ? 'bg-[#23a55a] in-[.light]:bg-[#3fbf70]'
        : 'bg-[#d9534f] in-[.light]:bg-[#db6a67]'
}

function getAverageDelay(bars: MonitoringBar[]) {
    const delays = bars.map((bar) => bar.delay)
    if (!delays.length) {
        return 0
    }

    return Math.round(delays.reduce((sum, value) => sum + value, 0) / delays.length)
}

function getSummary(monitoring: MonitoringService[]) {
    const latestBars = monitoring.map((service) => service.bars[0]).filter(Boolean) as MonitoringBar[]
    const healthyServices = monitoring.filter((service) => getServiceStatus(service) === 'healthy').length
    const averageDelay = getAverageDelay(latestBars)
    const lastUpdated = latestBars
        .map((bar) => bar.timestamp)
        .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0] || null

    return {
        totalServices: monitoring.length,
        healthyServices,
        averageDelay,
        lastUpdated
    }
}

function formatDelay(delay: number) {
    return `${delay || 0} ms`
}

function formatTimestamp(timestamp: string, lang: Lang) {
    return new Intl.DateTimeFormat(lang === 'no' ? 'nb-NO' : 'en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Europe/Oslo'
    }).format(new Date(timestamp))
}

function formatCertificateDate(value: string, lang: Lang, text: StatusText) {
    const timestamp = new Date(value)
    if (Number.isNaN(timestamp.getTime())) {
        return text.values.notAvailable
    }

    return new Intl.DateTimeFormat(lang === 'no' ? 'nb-NO' : 'en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Europe/Oslo'
    }).format(timestamp)
}

function booleanText(value: boolean, text: StatusText) {
    return value ? text.values.yes : text.values.no
}

function getCertificateIssuer(certificate: MonitoringCertificate) {
    return [certificate.issuer.name, certificate.issuer.cn].filter(Boolean).join(' ')
}

function getBarTitle(bar: MonitoringBar, lang: Lang, text: StatusText) {
    const status = bar.expectedDown
        ? text.statuses.planned
        : bar.status
            ? text.statuses.healthy
            : text.statuses.issues

    return [
        `${text.service.status}: ${status}`,
        `${text.service.responseTime}: ${formatDelay(bar.delay)}`,
        `${text.service.plannedDowntime}: ${booleanText(bar.expectedDown, text)}`,
        `${text.service.note}: ${bar.note || text.values.none}`,
        `${text.service.timestamp}: ${formatTimestamp(bar.timestamp, lang)}`
    ].join('\n')
}
