import { useEffect } from 'react'

// Lightweight SEO helper for Vite + React (React 19 compatible).
// Updates document title and meta description on route changes.

function ensureMeta(name) {
  let meta = document.querySelector(`meta[name="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }
  return meta
}

export function Seo({ title, description }) {
  useEffect(() => {
    if (title) document.title = title
    if (description) {
      const meta = ensureMeta('description')
      meta.setAttribute('content', description)
    }
  }, [title, description])

  return null
}
