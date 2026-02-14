import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Seo } from '../components/Seo/Seo.jsx'
import { PropertyCard } from '../components/Properties/PropertyCard.jsx'
import { agents } from '../data/agents.js'
import { properties } from '../data/properties.js'

export function AgentProfilePage() {
  const MotionSection = motion.section
  const { t } = useTranslation()
  const { agentId } = useParams()
  const agent = useMemo(() => agents.find((a) => a.id === agentId) || null, [agentId])

  const listings = useMemo(() => {
    if (!agent) return []
    return properties
      .filter((p) => p.agentId === agent.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [agent])

  if (!agent) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <div className="text-lg font-semibold text-slate-900">{t('agent.notFoundTitle')}</div>
          <div className="mt-2 text-sm text-slate-600">
            {t('agent.notFoundBody')}
          </div>
          <Link
            to="/"
            className="mt-6 inline-flex items-center rounded-xl bg-brand-900 px-4 py-2 text-sm font-semibold text-white"
          >
            {t('agent.backHome')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Seo
        title={`${agent.name} | BluePeak Realty`}
        description={`Meet ${agent.name}, ${agent.title} at BluePeak Realty.`}
      />

      <MotionSection
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-surface-50"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link to="/properties" className="text-sm font-semibold text-brand-700">
            {t('agent.back')}
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="h-16 w-16 rounded-2xl border border-slate-200 bg-slate-100"
                    loading="lazy"
                  />
                  <div>
                    <div className="text-lg font-semibold text-slate-900">{agent.name}</div>
                    <div className="mt-1 text-sm text-slate-600">{agent.title}</div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">{agent.bio}</p>

                <div className="mt-4 grid gap-2 text-sm text-slate-700">
                  <div className="rounded-xl bg-surface-50 px-4 py-3">
                    <div className="text-xs font-semibold text-slate-700">{t('agent.contact.phone')}</div>
                    <div className="mt-1 font-semibold">{agent.phone}</div>
                  </div>
                  <div className="rounded-xl bg-surface-50 px-4 py-3">
                    <div className="text-xs font-semibold text-slate-700">{t('agent.contact.email')}</div>
                    <div className="mt-1 font-semibold">{agent.email}</div>
                  </div>
                  <div className="rounded-xl bg-surface-50 px-4 py-3">
                    <div className="text-xs font-semibold text-slate-700">{t('agent.contact.languages')}</div>
                    <div className="mt-1 font-semibold">{agent.languages.join(', ')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    {t('agent.listingsBy')} {agent.name}
                  </h1>
                  <div className="mt-2 text-sm text-slate-600">
                    {listings.length}{' '}
                    {listings.length === 1 ? t('agent.activeCount') : t('agent.activeCountPlural')}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {listings.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>

              {listings.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-surface-50 p-6 text-sm text-slate-600">
                  {t('agent.noListings')}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </MotionSection>
    </>
  )
}
