export function WhatsAppButton() {
  const phoneNumber = '12125550198'
  const message = encodeURIComponent('Hello BluePeak Realty — I’d like to inquire about a property.')

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex h-12 items-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white shadow-soft transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      aria-label="Contact on WhatsApp"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15">WA</span>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}
