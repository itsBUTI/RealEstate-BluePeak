import { useEffect, useState } from 'react'

import { getRecentlyViewedIds } from '../utils/recentlyViewed.js'

export function useRecentlyViewed() {
  const [ids, setIds] = useState(() => {
    if (typeof window === 'undefined') return []
    return getRecentlyViewedIds()
  })

  useEffect(() => {
    function refresh() {
      setIds(getRecentlyViewedIds())
    }

    refresh()
    window.addEventListener('storage', refresh)
    window.addEventListener('bp:recentlyViewed', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('bp:recentlyViewed', refresh)
    }
  }, [])

  return ids
}
