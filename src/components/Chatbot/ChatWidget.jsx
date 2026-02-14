import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { properties } from '../../data/properties.js'
import { setStoredLanguage } from '../../i18n/index.js'
import { chat } from '../../utils/chatApi.js'
import { shortlistForQuery } from '../../utils/chatFilters.js'

function wantsViewing(text) {
  return /schedule|book|reserve|viewing|tour|appointment|vizit|rezervo/i.test(String(text || ''))
}

function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:.1s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:.2s]" />
    </span>
  )
}

export function ChatWidget() {
  const { t, i18n } = useTranslation()
  const MotionDiv = motion.div

  const [open, setOpen] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [messages, setMessages] = useState([{ role: 'assistant', content: t('chat.welcome') }])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [requiresLead, setRequiresLead] = useState(false)
  const [lead, setLead] = useState({ name: '', email: '', phone: '' })
  const [recommendations, setRecommendations] = useState([])

  const inputRef = useRef(null)
  const scrollRef = useRef(null)

  // Load memory (client-side)
  useEffect(() => {
    const savedId = localStorage.getItem('bp.chat.conversationId')
    if (savedId) setConversationId(savedId)

    const savedMessages = localStorage.getItem('bp.chat.messages')
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed)
      } catch {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    if (conversationId) localStorage.setItem('bp.chat.conversationId', conversationId)
  }, [conversationId])

  useEffect(() => {
    try {
      localStorage.setItem('bp.chat.messages', JSON.stringify(messages.slice(-30)))
    } catch {
      // ignore
    }
  }, [messages])

  useEffect(() => {
    if (open) {
      // focus next tick
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, pending, requiresLead, recommendations])

  const leadComplete = useMemo(() => {
    return Boolean(lead.name && lead.email && lead.phone)
  }, [lead])

  const changeLang = (lang) => {
    i18n.changeLanguage(lang)
    setStoredLanguage(lang)
  }

  const sendMessage = async (text, { force = false } = {}) => {
    const trimmed = String(text || '').trim()
    if (!trimmed) return

    const nextMessages = [...messages, { role: 'user', content: trimmed }]
    const shortlist = shortlistForQuery(properties, trimmed, 5)

    setMessages(nextMessages)
    setRecommendations(shortlist)
    setError('')
    setPending(true)

    const bookingIntent = wantsViewing(trimmed)
    if (bookingIntent && !leadComplete && !force) {
      setRequiresLead(true)
      setPending(false)
      return
    }

    try {
      const resp = await chat({
        conversationId,
        messages: nextMessages,
        language: i18n.language,
        lead: bookingIntent ? lead : undefined,
        context: shortlist,
      })

      if (!conversationId) setConversationId(resp.conversationId)

      setError('')

      setMessages((m) => [...m, { role: 'assistant', content: resp.reply }])

      if (Array.isArray(resp.properties)) setRecommendations(resp.properties)
      setRequiresLead(Boolean(resp.requiresLead))
    } catch {
      setError(t('chat.error'))
    } finally {
      setPending(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const v = inputRef.current?.value || ''
    inputRef.current.value = ''
    sendMessage(v)
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full bg-brand-900 px-5 py-3.5 text-base font-semibold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:translate-y-0"
        >
          <span className="relative grid h-8 w-8 place-items-center rounded-full bg-white/15">
            <span className="text-xs font-extrabold tracking-wide">AI</span>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-brand-900" />
          </span>
          <span className="leading-none">{t('chat.fab')}</span>
        </button>
      )}

      <AnimatePresence>
        {open && (
          <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-20 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-surface-0 shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-brand-900 px-5 py-3.5 text-white">
              <div className="flex items-center gap-3">
                <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-white/10">
                  <span className="text-xs font-extrabold tracking-wide">BP</span>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-brand-900" />
                </div>

                <div>
                  <div className="text-base font-semibold leading-tight">{t('chat.title')}</div>
                  <div className="text-sm text-white/80">{t('chat.subtitle')}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeLang('en')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    i18n.language === 'en' ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => changeLang('sq')}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    i18n.language === 'sq' ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  SQ
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                  aria-label={t('chat.close')}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex max-h-[76vh] flex-col">
              <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto bg-surface-0 p-5">
                {messages.map((m, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: m.role === 'assistant' ? 4 : -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16 }}
                    className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-soft ${
                      m.role === 'assistant'
                        ? 'border border-slate-200 bg-surface-50 text-slate-900'
                        : 'ml-auto bg-brand-900 text-white'
                    }`}
                  >
                    {m.content}
                  </motion.div>
                ))}

                {pending && (
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-surface-50 px-4 py-3 text-[15px] text-slate-900 shadow-soft">
                    <LoadingDots /> <span>{t('chat.typing')}</span>
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900"
                  >
                    {error}
                  </div>
                )}

                {Array.isArray(recommendations) && recommendations.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      {t('chat.recommendations')}
                    </div>
                    <div className="text-sm text-slate-700">{t('chat.recommendationsIntro')}</div>
                    <div className="grid gap-2">
                      {recommendations.map((p) => (
                        <Link
                          key={p.id}
                          to={`/properties/${p.id}`}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-surface-0 p-3 transition hover:bg-surface-50"
                        >
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-slate-900">{p.title}</div>
                            <div className="text-xs text-slate-600">
                              {p.location} • {p.type} • {p.bedrooms} {t('chat.beds')}
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-slate-900">
                            ${Number(p.price).toLocaleString()}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {requiresLead && (
                  <form
                    className="mt-1 grid gap-2 rounded-xl border border-slate-200 bg-surface-50 p-3 shadow-soft"
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (!leadComplete) return
                      sendMessage(
                        i18n.language === 'sq'
                          ? 'Vazhdo me rezervimin e vizitës. Ja të dhënat e mia.'
                          : 'Proceed to schedule a viewing. Here are my details.',
                        { force: true },
                      )
                    }}
                  >
                    <div className="text-xs font-semibold text-slate-800">{t('chat.leadTitle')}</div>

                    <input
                      className="h-12 rounded-lg border border-slate-200 bg-surface-0 px-3.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      placeholder={t('chat.name')}
                      value={lead.name}
                      onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
                    />
                    <input
                      className="h-12 rounded-lg border border-slate-200 bg-surface-0 px-3.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      placeholder={t('chat.email')}
                      type="email"
                      value={lead.email}
                      onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
                    />
                    <input
                      className="h-12 rounded-lg border border-slate-200 bg-surface-0 px-3.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      placeholder={t('chat.phone')}
                      value={lead.phone}
                      onChange={(e) => setLead((l) => ({ ...l, phone: e.target.value }))}
                    />

                    <button
                      type="submit"
                      disabled={!leadComplete || pending}
                      className="h-12 rounded-lg bg-brand-900 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
                    >
                      {t('chat.submitLead')}
                    </button>

                    {!leadComplete && (
                      <div className="text-xs text-slate-600">{t('chat.leadHint')}</div>
                    )}
                  </form>
                )}
              </div>

              <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-slate-200 bg-surface-0 p-4">
                <input
                  ref={inputRef}
                  className="h-12 flex-1 rounded-xl border border-slate-200 bg-surface-0 px-3.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  placeholder={t('chat.placeholder')}
                  disabled={pending}
                />

                <button
                  type="submit"
                  disabled={pending}
                  className="h-12 rounded-xl bg-brand-900 px-5 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
                >
                  {pending ? t('common.sending') : t('common.send')}
                </button>
              </form>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  )
}
