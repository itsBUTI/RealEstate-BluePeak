import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { setStoredLanguage } from '../../i18n/index.js'

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'sq', label: 'Shqip', short: 'SQ' },
]

function useClickOutside(ref, onClose) {
  useEffect(() => {
    function handle(event) {
      if (!ref.current) return
      if (!ref.current.contains(event.target)) onClose()
    }

    document.addEventListener('mousedown', handle)
    document.addEventListener('touchstart', handle)
    return () => {
      document.removeEventListener('mousedown', handle)
      document.removeEventListener('touchstart', handle)
    }
  }, [onClose, ref])
}

export function LanguageSwitcher({ size = 'md', align = 'right', fullWidth = false }) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language === 'sq' ? 'sq' : 'en'
  const active = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0]

  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useClickOutside(wrapperRef, () => setOpen(false))

  const sizeClasses = size === 'sm'
    ? 'h-9 px-3 text-xs'
    : 'h-10 px-3.5 text-sm'

  return (
    <div ref={wrapperRef} className={`relative ${fullWidth ? 'w-full' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 shadow-soft transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${sizeClasses}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-100 text-[11px] font-extrabold text-slate-800">
            LANG
          </span>
          <span className="leading-tight">
            <span className="block text-[11px] uppercase tracking-[0.08em] text-slate-500">Language</span>
            <span>{active.label}</span>
          </span>
        </span>
        <span className="text-slate-500">▾</span>
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ${align === 'left' ? 'left-0' : 'right-0'}`}
          role="listbox"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                i18n.changeLanguage(lang.code)
                setStoredLanguage(lang.code)
                setOpen(false)
              }}
              className={`flex w-full items-center justify-between px-4 py-3 text-sm font-semibold transition hover:bg-slate-50 ${
                currentLang === lang.code ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
              }`}
              role="option"
              aria-selected={currentLang === lang.code}
            >
              <span className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-xs font-extrabold text-slate-800">
                  {lang.short}
                </span>
                <span>{lang.label}</span>
              </span>
              {currentLang === lang.code ? <span className="text-brand-700">●</span> : null}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
