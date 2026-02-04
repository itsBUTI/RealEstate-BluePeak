import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import { OpenAI } from 'openai'

const PORT = Number(process.env.PORT || 5050)
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

const app = express()
app.use(express.json({ limit: '1mb' }))
app.use(cors())

if (!process.env.OPENAI_API_KEY) {
  console.warn('[chat-proxy] Missing OPENAI_API_KEY. Create server/.env from server/.env.example.')
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.post('/api/chat', async (req, res) => {
  try {
    const { conversationId, messages = [], language = 'en', lead, context = [] } = req.body || {}

    const system = `
You are a premium real-estate assistant for BluePeak Realty.
Answer in ${language === 'sq' ? 'Albanian' : 'English'}.
Use the provided listings context to recommend real properties (max 5).
You can help with pricing, locations, shortlisting, budgets, and mortgage explanations.
If the user wants to schedule a viewing, require lead details (name, email, phone) before confirming.
Keep responses concise and professional.
`

    const toolMsg = {
      role: 'user',
      content: `Listings context (JSON):\n${JSON.stringify(context)}`,
    }

    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.35,
      messages: [{ role: 'system', content: system }, ...messages, toolMsg],
    })

    const reply =
      completion.choices?.[0]?.message?.content ||
      (language === 'sq' ? 'Na fal, pati një problem.' : 'Sorry, something went wrong.')

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
  console.log(`[chat-proxy] listening on http://localhost:${PORT}`)
})
