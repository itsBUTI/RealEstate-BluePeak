import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { properties } from '../../data/properties.js'
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed.js'
import { PropertyCard } from './PropertyCard.jsx'

export function RecentlyViewedSection() {
  const { t } = useTranslation()
  const ids = useRecentlyViewed()

  const items = useMemo(() => {
    if (!ids.length) return []
    const map = new Map(properties.map((p) => [p.id, p]))
    return ids.map((id) => map.get(id)).filter(Boolean)
  }, [ids])

  if (!items.length) return null

  return (
    <section className="bg-surface-50 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">{t('recent.title')}</h2>
          <p className="mt-1 text-sm text-slate-600">{t('recent.subtitle')}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <PropertyCard key={p.id} property={p} view="grid" />
          ))}
        </div>
      </div>
    </section>
  )
}
