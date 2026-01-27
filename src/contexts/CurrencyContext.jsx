/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'bp.currency'

const DEFAULT_CURRENCY = 'USD'

// Simple fixed rates for frontend-only demo.
// Adjust to your preference or make this configurable later.
const RATES = {
  USD: { USD: 1, EUR: 0.92 },
  EUR: { EUR: 1, USD: 1.09 },
}

function safeGetItem(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

function normalizeCurrency(value) {
  return value === 'EUR' ? 'EUR' : 'USD'
}

function convertMoney(amount, fromCurrency, toCurrency) {
  const from = normalizeCurrency(fromCurrency)
  const to = normalizeCurrency(toCurrency)
  const rate = RATES[from]?.[to] ?? 1
  return amount * rate
}

function formatMoney(value, currency, locale = 'en-US') {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    const symbol = currency === 'EUR' ? '€' : '$'
    return `${symbol}${Math.round(value).toLocaleString(locale)}`
  }
}

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => normalizeCurrency(safeGetItem(STORAGE_KEY) || DEFAULT_CURRENCY))

  useEffect(() => {
    safeSetItem(STORAGE_KEY, currency)
  }, [currency])

  const api = useMemo(() => {
    return {
      currency,
      setCurrency,
      convert: (amount, fromCurrency) => convertMoney(amount, fromCurrency, currency),
      format: (amount, fromCurrency, locale) => formatMoney(convertMoney(amount, fromCurrency, currency), currency, locale),
      formatRaw: (amount, locale) => formatMoney(amount, currency, locale),
    }
  }, [currency])

  return <CurrencyContext.Provider value={api}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return ctx
}
