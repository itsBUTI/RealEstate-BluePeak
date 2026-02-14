const EUR_TO_USD = 1.09

function normalize(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

function toNumber(raw) {
  const cleaned = String(raw || '')
    .toLowerCase()
    .replace(/[\s,]/g, '')

  if (!cleaned) return null
  if (cleaned.endsWith('k')) {
    const n = Number(cleaned.slice(0, -1))
    return Number.isFinite(n) ? n * 1000 : null
  }

  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

export function parseQueryToFilters(text) {
  const q = normalize(text)

  const filters = {
    type: null,
    city: null,
    maxPriceUSD: null,
    minBedrooms: null,
  }

  // property type
  if (q.includes('apartment') || q.includes('apartament') || q.includes('apart')) filters.type = 'Apartment'
  if (q.includes('villa')) filters.type = 'Villa'
  if (q.includes('penthouse')) filters.type = 'Penthouse'
  if (q.includes('townhouse') || q.includes('town')) filters.type = 'Townhouse'

  // bedrooms
  const bedMatch = q.match(/(\d+)\s*(bed|beds|bedroom|bedrooms|dhoma)/)
  if (bedMatch) {
    const beds = Number(bedMatch[1])
    if (Number.isFinite(beds)) filters.minBedrooms = beds
  }

  // city
  const cities = [
    ['prishtina', 'prishtina'],
    ['prishtine', 'prishtina'],
    ['prizren', 'prizren'],
    ['tirana', 'tirana'],
    ['tirane', 'tirana'],
    ['durres', 'durres'],
    ['durrës', 'durres'],
    ['vlore', 'vlore'],
    ['vlora', 'vlore'],
    ['vlorë', 'vlore'],
    ['gjakove', 'gjakove'],
    ['gjakov', 'gjakove'],
    ['gjakovë', 'gjakove'],
    ['gjakova', 'gjakove'],
    ['new york', 'new york'],
    ['miami', 'miami'],
    ['chicago', 'chicago'],
    ['boston', 'boston'],
    ['seattle', 'seattle'],
    ['austin', 'austin'],
    ['beverly hills', 'beverly hills'],
    ['san diego', 'san diego'],
    ['soho', 'soho'],
  ]

  for (const [alias, canonical] of cities) {
    if (q.includes(alias)) {
      filters.city = canonical
      break
    }
  }

  // price: under €100k / $245k
  const eurMatch = q.match(/€\s?([0-9][\d.,k]+)/i) || q.match(/under\s?€\s?([0-9][\d.,k]+)/i)
  const usdMatch = q.match(/\$\s?([0-9][\d.,k]+)/i) || q.match(/under\s?\$\s?([0-9][\d.,k]+)/i)

  if (eurMatch) {
    const eur = toNumber(eurMatch[1])
    if (eur != null) filters.maxPriceUSD = eur * EUR_TO_USD
  } else if (usdMatch) {
    const usd = toNumber(usdMatch[1])
    if (usd != null) filters.maxPriceUSD = usd
  }

  return filters
}

export function filterProperties(allProperties, filters) {
  return allProperties.filter((p) => {
    if (filters.type && String(p.type).toLowerCase() !== String(filters.type).toLowerCase()) return false

    if (filters.city) {
      const cityLower = normalize(filters.city)
      const loc = normalize(p.location)
      if (!loc.includes(cityLower)) return false
    }

    if (filters.maxPriceUSD && Number(p.price) > filters.maxPriceUSD) return false

    if (filters.minBedrooms && Number(p.bedrooms || 0) < filters.minBedrooms) return false

    return true
  })
}

export function shortlistForQuery(allProperties, text, limit = 5) {
  const filters = parseQueryToFilters(text)
  return filterProperties(allProperties, filters)
    .slice(0, limit)
    .map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      currency: p.currency,
      location: p.location,
      type: p.type,
      bedrooms: p.bedrooms,
    }))
}
