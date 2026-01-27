export function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

export function matchesText(haystack, needle) {
  const h = normalizeText(haystack)
  const n = normalizeText(needle)
  if (!n) return true
  return h.includes(n)
}
