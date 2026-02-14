function encodeSvg(svg) {
  // Minimal safe encoding for inline SVG data URIs
  return svg
    .replace(/\n+/g, '')
    .replace(/\t+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"/g, "'")
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/#/g, '%23')
    .replace(/&/g, '%26')
}

export function svgDataUri(svg) {
  return `data:image/svg+xml,${encodeSvg(svg)}`
}

function hashString(input) {
  const str = String(input ?? '')
  let hash = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function pick(arr, n) {
  return arr[n % arr.length]
}

function palette(seed) {
  const h = hashString(seed)
  const hues = [210, 220, 230, 200, 190, 240]
  const hue = pick(hues, h)
  const hue2 = (hue + 18) % 360
  return {
    a: `hsl(${hue} 80% 18%)`,
    b: `hsl(${hue2} 85% 35%)`,
    c: `hsl(${(hue + 200) % 360} 70% 92%)`,
    ink: 'hsl(215 25% 12%)',
    mist: 'hsl(215 25% 96%)',
  }
}

export function makeLogoDataUri(seed = 'BluePeak') {
  const p = palette(seed)
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256' role='img' aria-label='Logo'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${p.b}'/>
        <stop offset='1' stop-color='${p.a}'/>
      </linearGradient>
      <filter id='s' x='-20%' y='-20%' width='140%' height='140%'>
        <feDropShadow dx='0' dy='6' stdDeviation='8' flood-color='rgba(0,0,0,0.25)'/>
      </filter>
    </defs>
    <rect x='16' y='16' width='224' height='224' rx='44' fill='url(%23g)' filter='url(%23s)'/>
    <path d='M66 156c18-48 52-76 102-84 10-2 20 6 18 18-8 50-36 84-84 102-20 8-44 6-52-8-4-6-4-18 16-28z' fill='${p.c}' opacity='0.95'/>
    <path d='M84 168c20-30 46-50 78-60' stroke='${p.ink}' stroke-width='10' stroke-linecap='round' opacity='0.18'/>
  </svg>`
  return svgDataUri(svg)
}

export function makeHeroImageDataUri(seed, title, subtitle, width = 2400, height = 1200) {
  const p = palette(seed)
  const h = hashString(seed)
  const skyline = 6 + (h % 6)

  let buildings = ''
  for (let i = 0; i < skyline; i += 1) {
    const w = 140 + ((h >> (i * 2)) % 120)
    const x = 80 + i * 180
    const bh = 240 + ((h >> (i * 3)) % 260)
    buildings += `<rect x='${x}' y='${height - 220 - bh}' width='${w}' height='${bh}' rx='18' fill='rgba(255,255,255,0.08)'/>`
  }

  const safeTitle = String(title ?? '').slice(0, 48)
  const safeSubtitle = String(subtitle ?? '').slice(0, 72)

  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}' role='img' aria-label='${safeTitle}'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${p.a}'/>
        <stop offset='1' stop-color='${p.b}'/>
      </linearGradient>
      <radialGradient id='r' cx='30%' cy='20%' r='70%'>
        <stop offset='0' stop-color='rgba(255,255,255,0.22)'/>
        <stop offset='1' stop-color='rgba(255,255,255,0)'/>
      </radialGradient>
      <filter id='blur' x='-20%' y='-20%' width='140%' height='140%'>
        <feGaussianBlur stdDeviation='30'/>
      </filter>
    </defs>

    <rect width='${width}' height='${height}' fill='url(%23g)'/>
    <circle cx='${width * 0.2}' cy='${height * 0.25}' r='420' fill='url(%23r)' filter='url(%23blur)'/>
    <circle cx='${width * 0.88}' cy='${height * 0.1}' r='520' fill='rgba(255,255,255,0.10)' filter='url(%23blur)'/>

    <g opacity='0.95'>${buildings}</g>

    <rect x='80' y='${height - 380}' width='${Math.min(1100, width - 160)}' height='220' rx='32' fill='rgba(15,23,42,0.28)' stroke='rgba(255,255,255,0.18)'/>
    <text x='120' y='${height - 280}' fill='rgba(255,255,255,0.96)' font-size='68' font-family='ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial'>
      ${safeTitle}
    </text>
    <text x='120' y='${height - 220}' fill='rgba(255,255,255,0.80)' font-size='34' font-family='ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial'>
      ${safeSubtitle}
    </text>

    <path d='M0 ${height - 160} C ${width * 0.25} ${height - 210}, ${width * 0.55} ${height - 60}, ${width} ${height - 140} L ${width} ${height} L 0 ${height} Z'
      fill='rgba(255,255,255,0.06)'/>
  </svg>`

  return svgDataUri(svg)
}

export function makePropertyImageDataUri(seed, labelLine1, labelLine2, width = 1600, height = 1000) {
  const p = palette(seed)
  const safe1 = String(labelLine1 ?? '').slice(0, 46)
  const safe2 = String(labelLine2 ?? '').slice(0, 64)

  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}' role='img' aria-label='${safe1}'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${p.a}'/>
        <stop offset='1' stop-color='${p.b}'/>
      </linearGradient>
      <filter id='grain'>
        <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
        <feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.12 0'/>
      </filter>
    </defs>

    <rect width='${width}' height='${height}' fill='url(%23g)'/>
    <rect width='${width}' height='${height}' filter='url(%23grain)' opacity='0.35'/>

    <g opacity='0.9'>
      <path d='M140 ${height - 170} L ${width * 0.52} ${height - 520} L ${width - 140} ${height - 170} Z' fill='rgba(255,255,255,0.12)'/>
      <rect x='220' y='${height - 430}' width='${width - 440}' height='260' rx='26' fill='rgba(255,255,255,0.10)'/>
      <rect x='${width * 0.54}' y='${height - 410}' width='${width * 0.30}' height='220' rx='22' fill='rgba(255,255,255,0.08)'/>
      <rect x='${width * 0.28}' y='${height - 375}' width='${width * 0.18}' height='140' rx='18' fill='rgba(255,255,255,0.07)'/>
    </g>

    <rect x='48' y='48' width='${Math.min(920, width - 96)}' height='160' rx='28' fill='rgba(15,23,42,0.30)' stroke='rgba(255,255,255,0.16)'/>
    <text x='90' y='132' fill='rgba(255,255,255,0.95)' font-size='44' font-family='ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial'>
      ${safe1}
    </text>
    <text x='90' y='178' fill='rgba(255,255,255,0.78)' font-size='26' font-family='ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial'>
      ${safe2}
    </text>
  </svg>`

  return svgDataUri(svg)
}

export function makeAvatarDataUri(seed, name = 'Agent') {
  const p = palette(seed)
  const initials = String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase()

  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320' role='img' aria-label='${name}'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${p.b}'/>
        <stop offset='1' stop-color='${p.a}'/>
      </linearGradient>
    </defs>
    <rect width='320' height='320' rx='96' fill='url(%23g)'/>
    <circle cx='160' cy='140' r='54' fill='rgba(255,255,255,0.20)'/>
    <path d='M70 286c16-52 56-84 90-84s74 32 90 84' fill='rgba(255,255,255,0.18)'/>
    <text x='160' y='164' text-anchor='middle' fill='rgba(255,255,255,0.95)' font-size='64' font-family='ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial' font-weight='700'>
      ${initials}
    </text>
  </svg>`

  return svgDataUri(svg)
}
