import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Seo } from '../components/Seo/Seo.jsx'
import { useCompare } from '../contexts/CompareContext.jsx'
import { useCurrency } from '../contexts/CurrencyContext.jsx'
import { properties } from '../data/properties.js'
import { formatSqm } from '../utils/format.js'

export function ComparePage() {
  const { t, i18n } = useTranslation()
  const { ids, remove, clear } = useCompare()
  const { format } = useCurrency()
  const locale = i18n.language === 'sq' ? 'sq-AL' : 'en-US'

  const selected = useMemo(() => {
    const map = new Map(properties.map((p) => [p.id, p]))
    return ids.map((id) => map.get(id)).filter(Boolean)
  }, [ids])

  const rows = useMemo(() => {
    return [
      { key: 'price', label: t('compare.fields.price'), render: (p) => format(p.price, p.currency, locale) },
      { key: 'location', label: t('compare.fields.location'), render: (p) => p.location },
      { key: 'type', label: t('compare.fields.type'), render: (p) => p.type },
      { key: 'size', label: t('compare.fields.size'), render: (p) => formatSqm(p.sizeSqm) },
      { key: 'bedrooms', label: t('compare.fields.bedrooms'), render: (p) => String(p.bedrooms) },
      { key: 'bathrooms', label: t('compare.fields.bathrooms'), render: (p) => String(p.bathrooms) },
      { key: 'features', label: t('compare.fields.features'), render: (p) => (p.highlights || []).join(', ') },
    ]
  }, [format, locale, t])

  return (
    <>
      <Seo title="Compare | BluePeak Realty" description="Compare properties side by side." />

      <section className="bg-surface-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {t('compare.title')}
              </h1>
              <div className="mt-2 text-sm text-slate-600">
                {selected.length ? `${selected.length} ${t('compare.selected')}` : t('compare.empty')}
              </div>
            </div>

            {selected.length ? (
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                {t('common.clear')}
              </button>
            ) : (
              <Link
                to="/properties"
                className="inline-flex items-center rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
              >
                {t('compare.goToProperties')}
              </Link>
            )}
          </div>

          {!selected.length ? null : (
            <>
              {/* Mobile stacked */}
              <div className="mt-6 grid gap-4 lg:hidden">
                {selected.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{p.title}</div>
                        <div className="mt-1 text-xs text-slate-600">{p.location}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        className="text-xs font-semibold text-rose-700 hover:text-rose-800"
                      >
                        {t('compare.remove')}
                      </button>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-slate-700">
                      {rows.map((r) => (
                        <div key={r.key} className="flex items-start justify-between gap-4">
                          <div className="text-xs font-semibold text-slate-500">{r.label}</div>
                          <div className="text-right">{r.render(p)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white lg:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="w-44 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        
                      </th>
                      {selected.map((p) => (
                        <th key={p.id} className="px-4 py-3 text-left">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{p.title}</div>
                              <div className="mt-1 text-xs text-slate-600">{p.location}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(p.id)}
                              className="text-xs font-semibold text-rose-700 hover:text-rose-800"
                            >
                              {t('compare.remove')}
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.key} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-3 text-xs font-semibold text-slate-500">{row.label}</td>
                        {selected.map((p) => (
                          <td key={p.id} className="px-4 py-3 text-slate-800">
                            {row.render(p)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
