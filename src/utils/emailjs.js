import emailjs from '@emailjs/browser'

function getEmailJsConfig() {
  return {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_bfvlxcq',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  }
}

export function isEmailJsConfigured() {
  const { serviceId, templateId, publicKey } = getEmailJsConfig()
  return Boolean(serviceId && templateId && publicKey)
}

export async function sendEmailJs(templateParams) {
  const { serviceId, templateId, publicKey } = getEmailJsConfig()

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('EmailJS is not configured')
  }

  return emailjs.send(serviceId, templateId, templateParams, publicKey)
}

export function getEmailJsUserMessage(error) {
  const status = error?.status
  const text = error?.text || error?.message || ''
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  if (status === 400) {
    const details = String(text || '').trim()
    return details
      ? `Email service rejected the request (400): ${details}`
      : 'Email service rejected the request (400). Check your EmailJS template variables and required fields.'
  }

  if (status === 401 || status === 403) {
    return origin
      ? `Email service blocked this site (${status}). In EmailJS, add this to Allowed Origins: ${origin}`
      : `Email service blocked this site (${status}). In EmailJS, add your site to Allowed Origins.`
  }

  if (status === 404) {
    return 'Email service not found (404). Verify your service/template IDs in .env.local.'
  }

  if (status === 429) {
    return 'Too many requests (429). Please wait a moment and try again.'
  }

  if (String(text).toLowerCase().includes('network')) {
    return 'Network error while sending. Check your connection and try again.'
  }

  return 'Something went wrong while sending. Please try again in a moment.'
}
