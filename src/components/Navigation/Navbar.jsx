import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { brand } from '../../config/brand.js'
import { useCurrency } from '../../contexts/CurrencyContext.jsx'
import { setStoredLanguage } from '../../i18n/index.js'

const linkBase =
  'inline-flex items-center px-2 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'

function DesktopNavLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${linkBase} ${
          isActive
            ? 'text-slate-900 underline decoration-slate-300 underline-offset-8'
            : 'text-slate-700 hover:text-slate-900'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const { currency, setCurrency } = useCurrency()

  const currentLang = i18n.language === 'sq' ? 'sq' : 'en'

  function setLang(lang) {
    i18n.changeLanguage(lang)
    setStoredLanguage(lang)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-white shadow-soft">
            <img
              src={brand.logoUrl}
              alt={`${brand.name} logo`}
              className="h-full w-full"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-slate-900">{brand.name}</div>
            <div className="text-[11px] text-slate-500">{brand.tagline}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <DesktopNavLink to="/">{t('nav.home')}</DesktopNavLink>
          <DesktopNavLink to="/properties">{t('nav.properties')}</DesktopNavLink>
          <DesktopNavLink to="/compare">{t('nav.compare')}</DesktopNavLink>
          <DesktopNavLink to="/about">{t('nav.about')}</DesktopNavLink>
          <DesktopNavLink to="/contact">{t('nav.contact')}</DesktopNavLink>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-3 py-2 text-xs font-semibold transition ${
                currency === 'USD' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
              }`}
              aria-pressed={currency === 'USD'}
            >
              $
            </button>
            <button
              type="button"
              onClick={() => setCurrency('EUR')}
              className={`px-3 py-2 text-xs font-semibold transition ${
                currency === 'EUR' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
              }`}
              aria-pressed={currency === 'EUR'}
            >
              €
            </button>
          </div>

          <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-2 text-xs font-semibold transition ${
                currentLang === 'en' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
              }`}
              aria-pressed={currentLang === 'en'}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('sq')}
              className={`px-3 py-2 text-xs font-semibold transition ${
                currentLang === 'sq' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
              }`}
              aria-pressed={currentLang === 'sq'}
            >
              SQ
            </button>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            {t('nav.browse')}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 md:hidden"
          aria-label="Open menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="text-sm font-semibold">{isOpen ? '×' : '≡'}</span>
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkBase} w-full justify-start ${
                  isActive ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              {t('nav.home')}
            </NavLink>
            <NavLink
              to="/properties"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkBase} w-full justify-start ${
                  isActive ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              {t('nav.properties')}
            </NavLink>
            <NavLink
              to="/compare"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkBase} w-full justify-start ${
                  isActive ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              {t('nav.compare')}
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkBase} w-full justify-start ${
                  isActive ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              {t('nav.about')}
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkBase} w-full justify-start ${
                  isActive ? 'bg-brand-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              {t('nav.contact')}
            </NavLink>

            <div className="mt-2 inline-flex w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`flex-1 px-3 py-2 text-xs font-semibold transition ${
                  currentLang === 'en'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                aria-pressed={currentLang === 'en'}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('sq')}
                className={`flex-1 px-3 py-2 text-xs font-semibold transition ${
                  currentLang === 'sq'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                aria-pressed={currentLang === 'sq'}
              >
                SQ
              </button>
            </div>

            <div className="mt-2 inline-flex w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`flex-1 px-3 py-2 text-xs font-semibold transition ${
                  currency === 'USD'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                aria-pressed={currency === 'USD'}
              >
                $
              </button>
              <button
                type="button"
                onClick={() => setCurrency('EUR')}
                className={`flex-1 px-3 py-2 text-xs font-semibold transition ${
                  currency === 'EUR'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                aria-pressed={currency === 'EUR'}
              >
                €
              </button>
            </div>

            <Link
              to="/properties"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-brand-900 px-4 py-2 text-sm font-semibold text-white"
            >
              {t('nav.browse')}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
