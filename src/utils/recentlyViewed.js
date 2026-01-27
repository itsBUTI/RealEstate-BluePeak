const STORAGE_KEY = 'bp.recentlyViewed'
const MAX_ITEMS = 5

export function getRecentlyViewedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

export function addRecentlyViewedId(propertyId) {
  if (!propertyId) return

  const current = getRecentlyViewedIds()
  const next = [propertyId, ...current.filter((id) => id !== propertyId)].slice(0, MAX_ITEMS)

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore
  }

  try {
    window.dispatchEvent(new Event('bp:recentlyViewed'))
  } catch {
    // ignore
  }

  return next
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
