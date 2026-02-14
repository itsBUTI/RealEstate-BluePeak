import { motion } from 'framer-motion'

import { useTranslation } from 'react-i18next'

import { Seo } from '../components/Seo/Seo.jsx'
import { brand } from '../config/brand.js'

export function AboutPage() {
  const MotionSection = motion.section
  const { t } = useTranslation()
  return (
    <>
      <Seo
        title="About | BluePeak Realty"
        description="A premium standard for modern real estate: curated listings, trusted advisors, and a seamless experience."
      />

      <MotionSection
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-surface-50"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              {t('about.eyebrow')}
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {t('about.title')}
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {t('about.intro')}
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
            <img
              src={brand.images.aboutBanner}
              alt="Luxury interior"
              className="h-56 w-full object-cover sm:h-72"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[{
              title: t('about.pillars.trustTitle'),
              text: t('about.pillars.trustText'),
            }, {
              title: t('about.pillars.curatedTitle'),
              text: t('about.pillars.curatedText'),
            }, {
              title: t('about.pillars.globalTitle'),
              text: t('about.pillars.globalText'),
            }].map((c) => (
              <div key={c.title} className="rounded-2xl border border-slate-200 bg-surface-50 p-6">
                <div className="text-sm font-semibold text-slate-900">{c.title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">{c.text}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-brand-900 p-8 text-white">
            <div className="grid gap-6 md:grid-cols-3">
              {[{
                value: t('about.stats.experience'),
                label: t('about.stats.experienceLabel'),
              }, {
                value: t('about.stats.markets'),
                label: t('about.stats.marketsLabel'),
              }, {
                value: t('about.stats.support'),
                label: t('about.stats.supportLabel'),
              }].map((k) => (
                <div key={k.label} className="rounded-2xl bg-white/10 p-6">
                  <div className="text-3xl font-semibold">{k.value}</div>
                  <div className="mt-2 text-sm text-white/80">{k.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>
    </>
  )
}
