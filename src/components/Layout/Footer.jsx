import { Link } from 'react-router-dom'

import { brand } from '../../config/brand.js'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-white shadow-soft">
                <img
                  src={brand.logoUrl}
                  alt={`${brand.name} logo`}
                  className="h-full w-full"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </span>
              <div className="leading-tight">
                <div className="text-lg font-semibold tracking-tight text-slate-900">
                  {brand.name}
                </div>
                <div className="text-xs text-slate-500">{brand.tagline}</div>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Premium listings, trusted advisors, and a seamless buying experience.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-900">Explore</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link className="hover:text-slate-900" to="/properties">
                  Properties
                </Link>
              </li>
              <li>
                <Link className="hover:text-slate-900" to="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="hover:text-slate-900" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-900">Contact</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>+1 (212) 555-0198</li>
              <li>hello@bluepeakrealty.com</li>
              <li>450 Madison Ave, New York, NY</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-900">Social</div>
            <div className="flex gap-3">
              <a
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                ig
              </a>
              <a
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
              >
                x
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a className="hover:text-slate-700" href="#">
              Privacy
            </a>
            <a className="hover:text-slate-700" href="#">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
