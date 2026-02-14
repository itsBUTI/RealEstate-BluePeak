export async function chat({ conversationId, messages, language = 'en', lead, context = [] }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId, messages, language, lead, context }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || 'Chat request failed')
  }

  return res.json()
}
