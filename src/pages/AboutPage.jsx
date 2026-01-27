import { motion } from 'framer-motion'

import { Seo } from '../components/Seo/Seo.jsx'
import { brand } from '../config/brand.js'

export function AboutPage() {
  const MotionSection = motion.section
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
              About
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              BluePeak Realty
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              BluePeak Realty is built for modern clients who expect premium service,
              fast communication, and data-backed guidance. We curate properties that
              meet a higher standard and present them with the detail that inspires
              trust.
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
              title: 'Trust & Transparency',
              text: 'Clear guidance, fair comps, and honest advice at every stage.',
            }, {
              title: 'Curated Inventory',
              text: 'A premium set of listings selected for value and lifestyle fit.',
            }, {
              title: 'Global Standards',
              text: 'International clients supported with smooth coordination and speed.',
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
                value: '15+',
                label: 'Years of expertise',
              }, {
                value: '4',
                label: 'Major markets covered',
              }, {
                value: '24/7',
                label: 'Client support mindset',
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
