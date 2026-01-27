import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useCurrency } from '../../contexts/CurrencyContext.jsx'

function clampNumber(value, { min = -Infinity, max = Infinity } = {}) {
  if (!Number.isFinite(value)) return null
  return Math.min(max, Math.max(min, value))
}

function toNumber(raw) {
  if (raw === '' || raw === null || raw === undefined) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

function calculateMonthlyPayment({ price, downPayment, annualRatePct, termYears }) {
  const loan = price - downPayment
  const n = termYears * 12
  if (loan <= 0 || n <= 0) return 0

  const r = annualRatePct / 100 / 12
  if (r === 0) return loan / n

  const pow = (1 + r) ** n
  return (loan * r * pow) / (pow - 1)
}

export function MortgageCalculator({ defaultPrice = 0, defaultDownPayment = 0 }) {
  const { t, i18n } = useTranslation()
  const { formatRaw } = useCurrency()
  const locale = i18n.language === 'sq' ? 'sq-AL' : 'en-US'

  const [price, setPrice] = useState(String(Math.round(defaultPrice) || ''))
  const [downPayment, setDownPayment] = useState(String(Math.round(defaultDownPayment) || ''))
  const [interestRate, setInterestRate] = useState('6.5')
  const [termYears, setTermYears] = useState('30')

  const parsed = useMemo(() => {
    const p = clampNumber(toNumber(price), { min: 0 })
    const d = clampNumber(toNumber(downPayment), { min: 0, max: p ?? Infinity })
    const r = clampNumber(toNumber(interestRate), { min: 0, max: 100 })
    const y = clampNumber(toNumber(termYears), { min: 1, max: 50 })

    return { price: p, downPayment: d, interestRate: r, termYears: y }
  }, [price, downPayment, interestRate, termYears])

  const errors = useMemo(() => {
    const e = {}
    if (parsed.price === null || parsed.price <= 0) e.price = true
    if (parsed.downPayment === null || parsed.downPayment < 0) e.downPayment = true
    if (parsed.price !== null && parsed.downPayment !== null && parsed.downPayment > parsed.price) e.downPayment = true
    if (parsed.interestRate === null || parsed.interestRate < 0) e.interestRate = true
    if (parsed.termYears === null || parsed.termYears <= 0) e.termYears = true
    return e
  }, [parsed])

  const monthly = useMemo(() => {
    if (Object.keys(errors).length) return 0
    return calculateMonthlyPayment({
      price: parsed.price,
      downPayment: parsed.downPayment,
      annualRatePct: parsed.interestRate,
      termYears: parsed.termYears,
    })
  }, [parsed, errors])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="text-sm font-semibold text-slate-900">{t('mortgage.title')}</div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">{t('mortgage.price')}</span>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`h-11 rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand-100 ${
              errors.price ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-brand-500'
            }`}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">{t('mortgage.downPayment')}</span>
          <input
            type="number"
            min="0"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            className={`h-11 rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand-100 ${
              errors.downPayment ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-brand-500'
            }`}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">{t('mortgage.interestRate')}</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className={`h-11 rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand-100 ${
              errors.interestRate ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-brand-500'
            }`}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">{t('mortgage.termYears')}</span>
          <input
            type="number"
            min="1"
            max="50"
            value={termYears}
            onChange={(e) => setTermYears(e.target.value)}
            className={`h-11 rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-brand-100 ${
              errors.termYears ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-brand-500'
            }`}
          />
        </label>
      </div>

      <div className="mt-5 rounded-xl bg-surface-50 px-4 py-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">{t('mortgage.monthly')}</div>
        <div className="mt-1 text-2xl font-semibold text-slate-900">
          {formatRaw(monthly, locale)}{t('mortgage.perMonth')}
        </div>
        <div className="mt-1 text-xs text-slate-600">
          {t('mortgage.note')}
        </div>
      </div>
    </div>
  )
}
