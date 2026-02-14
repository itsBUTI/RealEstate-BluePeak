import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import { OpenAI } from 'openai'

const PORT = Number(process.env.PORT || 5050)
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

function formatFallbackReply(language, context, lastUserMessage) {
  const hasListings = Array.isArray(context) && context.length > 0

  const header =
    language === 'sq'
      ? 'Ja disa sugjerime nga listat aktuale:'
      : 'Here are a few matches from the live listings:'

  const noMatches =
    language === 'sq'
      ? 'Nuk gjeta ndonjë pronë me kërkesën tuaj. Më jepni qytetin, buxhetin dhe numrin e dhomave që kërkoni.'
      : 'I could not find a matching property for that query. Please share city, budget, and bedrooms you need.'

  const lines = (hasListings ? context.slice(0, 5) : []).map((p, idx) => {
    const price = Number(p.price)
    const priceText = Number.isFinite(price) ? `$${price.toLocaleString()}` : 'Price on request'
    return `${idx + 1}. ${p.title} - ${p.location} - ${p.type} - ${p.bedrooms} bed - ${priceText}`
  })

  const bookingHint = /schedule|book|reserve|viewing|tour|appointment|vizit|rezervo/i.test(lastUserMessage || '')
    ? language === 'sq'
      ? 'Nëse dëshironi ta rezervojmë një vizitë, më dërgoni emrin, emailin dhe telefonin.'
      : 'If you want to schedule a viewing, share your name, email, and phone.'
    : ''

  if (!hasListings) return `${noMatches}${bookingHint ? '\n\n' + bookingHint : ''}`

  return `${header}\n${lines.join('\n')}${bookingHint ? '\n\n' + bookingHint : ''}`
}

const app = express()
app.use(express.json({ limit: '1mb' }))
app.use(cors())

const hasKey = Boolean(process.env.OPENAI_API_KEY)
if (!hasKey) {
  console.warn('[chat-proxy] Missing OPENAI_API_KEY. Create server/.env from server/.env.example.')
}

let client = null
if (hasKey) {
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

app.post('/api/chat', async (req, res) => {
  try {
    const { conversationId, messages = [], language = 'en', lead, context = [] } = req.body || {}

    const system = `
  You are a premium real-estate assistant for BluePeak Realty.
  Answer in ${language === 'sq' ? 'Albanian' : 'English'}.
  Use ONLY the provided listings context to recommend real properties (max 5). Never invent listings.
  If there are no relevant listings, briefly ask for city, budget, and bedrooms. Stay under 120 words.
  If the user wants to schedule a viewing, require lead details (name, email, phone) before confirming.
  Keep responses concise, professional, and focused on the provided context.
  `

    const toolMsg = {
      role: 'user',
      content: `Listings context (JSON):\n${JSON.stringify(context)}`,
    }

    let reply
    if (client) {
      const completion = await client.chat.completions.create({
        model: MODEL,
        temperature: 0.35,
        messages: [{ role: 'system', content: system }, ...messages, toolMsg],
      })

      reply =
        completion.choices?.[0]?.message?.content ||
        (language === 'sq' ? 'Na fal, pati një problem.' : 'Sorry, something went wrong.')
    } else {
      const last = messages?.[messages.length - 1]?.content || ''
      reply = formatFallbackReply(language, context, last)
    }

    const last = messages?.[messages.length - 1]?.content || ''
    const requiresLead =
      /schedule|book|reserve|viewing|tour|appointment|vizit|rezervo/i.test(last) &&
      (!lead?.name || !lead?.email || !lead?.phone)

    res.json({
      conversationId: conversationId || Math.random().toString(36).slice(2),
      reply,
      properties: context,
      requiresLead,
    })
  } catch (err) {
    console.error('[chat-proxy] /api/chat error', err)
    res.status(500).json({ error: 'Chat proxy error' })
  }
})

app.listen(PORT, () => {
  console.log(`[chat-proxy] listening on http://localhost:${PORT} (API key: ${hasKey ? 'set' : 'missing'})`)
})
