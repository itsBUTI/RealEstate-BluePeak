import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { brand } from '../../config/brand.js'
import { useCompare } from '../../contexts/CompareContext.jsx'
import { useCurrency } from '../../contexts/CurrencyContext.jsx'
import { formatSqm } from '../../utils/format.js'

export function PropertyCard({ property, view = 'grid' }) {
  const { i18n, t } = useTranslation()
  const { format } = useCurrency()
  const compare = useCompare()
  const locale = i18n.language === 'sq' ? 'sq-AL' : 'en-US'

  const isSelected = compare.isSelected(property.id)
  const isDisabled = !isSelected && compare.ids.length >= compare.max

  function onToggleCompare(e) {
    e.preventDefault()
    e.stopPropagation()
    compare.toggle(property.id)
  }

  const initialImage = property.images?.[0] || brand.images.propertyFallback
  const [imageSrc, setImageSrc] = useState(initialImage)

  function handleImgError() {
    setImageSrc(brand.images.propertyFallback)
  }

  if (view === 'list') {
    return (
      <Link
        to={`/properties/${property.id}`}
        className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
      >
        <div className="h-40 w-44 shrink-0 bg-slate-100">
          <img
            src={imageSrc}
            alt={property.title}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={handleImgError}
          />
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900 group-hover:text-brand-900">
                {property.title}
              </div>
              <div className="mt-1 text-xs text-slate-500">{property.location}</div>
            </div>
            <div className="text-sm font-semibold text-brand-900">
              {format(property.price, property.currency, locale)}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-xs text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1">{property.type}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{property.bedrooms} bd</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{property.bathrooms} ba</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{formatSqm(property.sizeSqm)}</span>
            </div>

            <button
              type="button"
              onClick={onToggleCompare}
              disabled={isDisabled}
              className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                isSelected
                  ? 'border-brand-900 bg-brand-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              } disabled:opacity-50`}
              aria-pressed={isSelected}
            >
              {t('nav.compare')}
            </button>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        <img
          src={imageSrc}
          alt={property.title}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={handleImgError}
        />
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-900 shadow-sm">
          {property.type}
        </div>

        <button
          type="button"
          onClick={onToggleCompare}
          disabled={isDisabled}
          className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold transition ${
            isSelected
              ? 'border-brand-900 bg-brand-900 text-white'
              : 'border-slate-200 bg-white/90 text-slate-700 hover:bg-white'
          } disabled:opacity-50`}
          aria-pressed={isSelected}
        >
          {t('nav.compare')}
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900 group-hover:text-brand-900">
              {property.title}
            </div>
            <div className="mt-1 text-xs text-slate-500">{property.location}</div>
          </div>
          <div className="text-sm font-semibold text-brand-900">
            {format(property.price, property.currency, locale)}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
          <div className="rounded-xl bg-slate-50 px-3 py-2">{property.bedrooms} bd</div>
          <div className="rounded-xl bg-slate-50 px-3 py-2">{property.bathrooms} ba</div>
          <div className="rounded-xl bg-slate-50 px-3 py-2">{formatSqm(property.sizeSqm)}</div>
        </div>
      </div>
    </Link>
  )
}
