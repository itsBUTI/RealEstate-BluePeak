import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Seo } from '../components/Seo/Seo.jsx'
import { PropertyCard } from '../components/Properties/PropertyCard.jsx'
import { RecentlyViewedSection } from '../components/Properties/RecentlyViewedSection.jsx'
import { brand } from '../config/brand.js'
import { properties } from '../data/properties.js'

function buildSearchUrl(values) {
  const params = new URLSearchParams()

  if (values.location) params.set('location', values.location)
  if (values.type) params.set('type', values.type)
  if (values.bedrooms) params.set('bedrooms', values.bedrooms)
  if (values.minPrice) params.set('minPrice', values.minPrice)
  if (values.maxPrice) params.set('maxPrice', values.maxPrice)

  const query = params.toString()
  return query ? `/properties?${query}` : '/properties'
}

export function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    type: '',
    bedrooms: '',
  })

  const featured = useMemo(() => {
    return [...properties]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
  }, [])

  return (
    <>
      <Seo
        title="BluePeak Realty | Premium Real Estate"
        description="Discover premium properties with advanced search, trusted agents, and detailed listings."
      />

      <section className="bg-surface-50 border-b border-slate-200">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-16">
          <div className="order-2 lg:order-1 lg:col-span-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {t('home.title')}
            </h1>
            <p className="mt-4 max-w-prose text-sm leading-7 text-slate-600">
              {t('home.subtitle')}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/properties')}
                className="inline-flex items-center rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                {t('home.viewProperties')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                {t('common.contact')}
              </button>
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-900">{t('common.search')}</div>
              <div className="mt-4 grid gap-3">
                <label className="grid gap-1">
                  <span className="text-xs font-semibold text-slate-700">{t('searchForm.location')}</span>
                  <input
                    value={form.location}
                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                    placeholder={t('searchForm.locationPlaceholder')}
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1">
                    <span className="text-xs font-semibold text-slate-700">{t('searchForm.minPrice')}</span>
                    <input
                      type="number"
                      min="0"
                      value={form.minPrice}
                      onChange={(e) => setForm((p) => ({ ...p, minPrice: e.target.value }))}
                      placeholder="500000"
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-xs font-semibold text-slate-700">{t('searchForm.maxPrice')}</span>
                    <input
                      type="number"
                      min="0"
                      value={form.maxPrice}
                      onChange={(e) => setForm((p) => ({ ...p, maxPrice: e.target.value }))}
                      placeholder="3000000"
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1">
                    <span className="text-xs font-semibold text-slate-700">{t('searchForm.type')}</span>
                    <select
                      value={form.type}
                      onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    >
                      <option value="">{t('searchForm.any')}</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Villa">Villa</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </label>
                  <label className="grid gap-1">
                    <span className="text-xs font-semibold text-slate-700">{t('searchForm.bedrooms')}</span>
                    <select
                      value={form.bedrooms}
                      onChange={(e) => setForm((p) => ({ ...p, bedrooms: e.target.value }))}
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    >
                      <option value="">{t('searchForm.any')}</option>
                      <option value="1">{t('searchForm.onePlus')}</option>
                      <option value="2">{t('searchForm.twoPlus')}</option>
                      <option value="3">{t('searchForm.threePlus')}</option>
                      <option value="4">{t('searchForm.fourPlus')}</option>
                      <option value="5">{t('searchForm.fivePlus')}</option>
                    </select>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(buildSearchUrl(form))}
                  className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand-900 px-4 text-sm font-semibold text-white transition hover:bg-brand-800"
                >
                  {t('common.search')}
                </button>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src={brand.images.homeHero}
                alt="Home hero"
                className="h-full w-full object-cover"
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <div className="mt-4 text-sm text-slate-600">
              {t('home.heroNote')}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                {t('home.featuredTitle')}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {t('home.featuredSubtitle')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/properties')}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              {t('common.viewAll')}
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} view="grid" />
            ))}
          </div>
        </div>
      </section>

      <RecentlyViewedSection />

      <section className="bg-surface-50">
        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                {t('home.howWeHelpTitle')}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {t('home.howWeHelpSubtitle')}
              </p>
            </div>

            <div className="grid gap-4 lg:col-span-7 sm:grid-cols-3">
              {[
                {
                  title: t('home.help1Title'),
                  text: t('home.help1Text'),
                },
                {
                  title: t('home.help2Title'),
                  text: t('home.help2Text'),
                },
                {
                  title: t('home.help3Title'),
                  text: t('home.help3Text'),
                },
              ].map((s) => (
                <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="text-sm font-semibold text-slate-900">{s.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">{s.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-surface-50 p-6 sm:flex-row sm:items-center">
            <div>
              <div className="text-sm font-semibold text-slate-900">{t('home.needHelpTitle')}</div>
              <div className="mt-1 text-sm text-slate-600">
                {t('home.needHelpText')}
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="inline-flex items-center rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              {t('common.contact')}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
