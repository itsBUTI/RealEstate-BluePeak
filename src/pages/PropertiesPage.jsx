import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Seo } from '../components/Seo/Seo.jsx'
import { Pagination } from '../components/Properties/Pagination.jsx'
import { PropertyCard } from '../components/Properties/PropertyCard.jsx'
import { brand } from '../config/brand.js'
import { properties } from '../data/properties.js'
import { matchesText } from '../utils/search.js'

function parseNumber(value) {
  if (value == null) return null
  if (typeof value === 'string' && value.trim() === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function readQuery(search) {
  const params = new URLSearchParams(search)
  return {
    location: params.get('location') || '',
    type: params.get('type') || '',
    bedrooms: params.get('bedrooms') || '',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    minSize: params.get('minSize') || '',
    minRooms: params.get('minRooms') || '',
    sort: params.get('sort') || 'newest',
    view: params.get('view') || 'grid',
    page: params.get('page') || '1',
  }
}

function writeQuery(next) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(next)) {
    if (value === '' || value == null) continue
    if (key === 'page' && String(value) === '1') continue
    params.set(key, String(value))
  }
  const query = params.toString()
  return query ? `?${query}` : ''
}

export function PropertiesPage() {
  // Filters are URL-driven (shareable links + no hidden local state).
  // Inputs update query params immediately and pagination resets on filter changes.
  const MotionSection = motion.section
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const query = useMemo(() => readQuery(location.search), [location.search])
  const filters = useMemo(
    () => ({
      location: query.location,
      type: query.type,
      bedrooms: query.bedrooms,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      minSize: query.minSize,
      minRooms: query.minRooms,
      sort: query.sort,
      view: query.view,
    }),
    [query],
  )

  const hasActiveFilters = Boolean(
    filters.location ||
      filters.type ||
      filters.bedrooms ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.minSize ||
      filters.minRooms,
  )
  const page = Math.max(1, parseInt(query.page || '1', 10))

  const filtered = useMemo(() => {
    const minPrice = parseNumber(filters.minPrice)
    const maxPrice = parseNumber(filters.maxPrice)
    const minSize = parseNumber(filters.minSize)
    const minRooms = parseNumber(filters.minRooms)
    const minBedrooms = parseNumber(filters.bedrooms)

    let result = properties.filter((p) => {
      if (
        filters.location &&
        !matchesText(p.location, filters.location) &&
        !matchesText(p.title, filters.location)
      ) {
        return false
      }
      if (filters.type && p.type !== filters.type) return false
      if (minPrice != null && p.price < minPrice) return false
      if (maxPrice != null && p.price > maxPrice) return false
      if (minSize != null && p.sizeSqm < minSize) return false
      if (minRooms != null && p.rooms < minRooms) return false
      if (minBedrooms != null && p.bedrooms < minBedrooms) return false
      return true
    })

    if (filters.sort === 'priceAsc') {
      result = result.sort((a, b) => a.price - b.price)
    } else if (filters.sort === 'priceDesc') {
      result = result.sort((a, b) => b.price - a.price)
    } else {
      result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return result
  }, [filters])

  const pageSize = 6
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, safePage])

  function syncUrl(nextFilters, nextPage) {
    const query = writeQuery({
      ...nextFilters,
      page: String(nextPage),
    })
    navigate({ pathname: '/properties', search: query }, { replace: true })
  }

  function updateFilter(key, value) {
    const next = { ...filters, [key]: value }
    syncUrl(next, 1)
  }

  function reset() {
    const next = {
      location: '',
      type: '',
      bedrooms: '',
      minPrice: '',
      maxPrice: '',
      minSize: '',
      minRooms: '',
      sort: 'newest',
      view: 'grid',
    }
    syncUrl(next, 1)
  }

  return (
    <>
      <Seo
        title="Properties | BluePeak Realty"
        description="Browse premium properties with filters, sorting, and detailed listings."
      />

      <MotionSection
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-surface-50"
      >
        <div className="relative overflow-hidden bg-brand-900">
          <div className="absolute inset-0">
            <img
              src={brand.images.propertiesHero}
              alt="Browse premium properties"
              className="h-full w-full object-cover opacity-25"
              decoding="async"
              fetchPriority="high"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand-900/60" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/90">
                <img
                  src={brand.logoUrl}
                  alt=""
                  className="h-5 w-5"
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                {t('propertiesPage.heroBadge')}
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {t('propertiesPage.heroTitle')}
              </h1>
              <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base">
                {t('propertiesPage.heroSubtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                {filtered.length} {t('propertiesPage.results')}
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {t('propertiesPage.resultsHelp')}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updateFilter('view', 'grid')}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  filters.view === 'grid'
                    ? 'bg-brand-900 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t('propertiesPage.viewGrid')}
              </button>
              <button
                type="button"
                onClick={() => updateFilter('view', 'list')}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  filters.view === 'list'
                    ? 'bg-brand-900 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t('propertiesPage.viewList')}
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-surface-50 p-4 lg:grid-cols-12 lg:items-end">
            <label className="grid gap-1 lg:col-span-3">
              <span className="text-xs font-semibold text-slate-700">{t('propertiesPage.search')}</span>
              <input
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                placeholder={t('propertiesPage.searchPlaceholder')}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </label>

            <label className="grid gap-1 lg:col-span-2">
              <span className="text-xs font-semibold text-slate-700">{t('propertiesPage.type')}</span>
              <select
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="">{t('propertiesPage.any')}</option>
                <option value="Apartment">Apartment</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </label>

            <label className="grid gap-1 lg:col-span-2">
              <span className="text-xs font-semibold text-slate-700">{t('propertiesPage.bedrooms')}</span>
              <select
                value={filters.bedrooms}
                onChange={(e) => updateFilter('bedrooms', e.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="">{t('propertiesPage.any')}</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </label>

            <label className="grid gap-1 lg:col-span-2">
              <span className="text-xs font-semibold text-slate-700">{t('propertiesPage.minSize')}</span>
              <input
                type="number"
                min="0"
                value={filters.minSize}
                onChange={(e) => updateFilter('minSize', e.target.value)}
                placeholder={t('propertiesPage.minSizePlaceholder')}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </label>

            <label className="grid gap-1 lg:col-span-3">
              <span className="text-xs font-semibold text-slate-700">{t('propertiesPage.priceRange')}</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  placeholder={t('propertiesPage.min')}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <input
                  type="number"
                  min="0"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  placeholder={t('propertiesPage.max')}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </label>

            <label className="grid gap-1 lg:col-span-2">
              <span className="text-xs font-semibold text-slate-700">{t('propertiesPage.rooms')}</span>
              <input
                type="number"
                min="0"
                value={filters.minRooms}
                onChange={(e) => updateFilter('minRooms', e.target.value)}
                placeholder={t('propertiesPage.roomsPlaceholder')}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </label>

            <label className="grid gap-1 lg:col-span-2">
              <span className="text-xs font-semibold text-slate-700">{t('propertiesPage.sort')}</span>
              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="newest">{t('propertiesPage.sortNewest')}</option>
                <option value="priceAsc">{t('propertiesPage.sortPriceAsc')}</option>
                <option value="priceDesc">{t('propertiesPage.sortPriceDesc')}</option>
              </select>
            </label>

            <div className="flex gap-2 lg:col-span-2 lg:justify-end">
              <button
                type="button"
                onClick={reset}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {t('propertiesPage.reset')}
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
            <div>
              <span className="font-semibold text-slate-900">{filtered.length}</span> {t('propertiesPage.results')}
            </div>
          </div>

          <div
            className={
              filters.view === 'list'
                ? 'mt-6 grid gap-4'
                : 'mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
            }
          >
            {pageItems.map((p) => (
              <PropertyCard key={p.id} property={p} view={filters.view} />
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <div className="text-sm font-semibold text-slate-900">{t('propertiesPage.noResultsTitle')}</div>
                <div className="mt-2 text-sm text-slate-600">
                  {t('propertiesPage.noResultsBody')}
                </div>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={reset}
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-brand-900 px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-800"
                >
                    {t('propertiesPage.clearFilters')}
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="mt-10">
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onChange={(next) => {
                const nextPage = Math.min(Math.max(1, next), totalPages)
                syncUrl(filters, nextPage)
              }}
            />
          </div>
        </div>
      </MotionSection>
    </>
  )
}
