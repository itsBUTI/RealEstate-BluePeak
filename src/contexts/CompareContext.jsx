/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'bp.compare'
const MAX_ITEMS = 3

function safeRead() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

function safeWrite(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // ignore
  }
}

const CompareContext = createContext(null)

export function CompareProvider({ children }) {
  const [ids, setIds] = useState(() => (typeof window === 'undefined' ? [] : safeRead()))

  useEffect(() => {
    safeWrite(ids)
  }, [ids])

  const api = useMemo(() => {
    return {
      ids,
      max: MAX_ITEMS,
      isSelected: (id) => ids.includes(id),
      toggle: (id) => {
        setIds((prev) => {
          if (!id) return prev
          if (prev.includes(id)) return prev.filter((x) => x !== id)
          if (prev.length >= MAX_ITEMS) return prev
          return [...prev, id]
        })
      },
      remove: (id) => setIds((prev) => prev.filter((x) => x !== id)),
      clear: () => setIds([]),
    }
  }, [ids])

  return <CompareContext.Provider value={api}>{children}</CompareContext.Provider>
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
