import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Layout } from './components/Layout/Layout.jsx'
import { ScrollToTop } from './components/Layout/ScrollToTop.jsx'
import { CurrencyProvider } from './contexts/CurrencyContext.jsx'
import { CompareProvider } from './contexts/CompareContext.jsx'

const HomePage = lazy(() => import('./pages/HomePage.jsx').then((m) => ({ default: m.HomePage })))
const PropertiesPage = lazy(() =>
	import('./pages/PropertiesPage.jsx').then((m) => ({ default: m.PropertiesPage })),
)
const PropertyDetailsPage = lazy(() =>
	import('./pages/PropertyDetailsPage.jsx').then((m) => ({ default: m.PropertyDetailsPage })),
)
const AboutPage = lazy(() => import('./pages/AboutPage.jsx').then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() =>
	import('./pages/ContactPage.jsx').then((m) => ({ default: m.ContactPage })),
)
const AgentProfilePage = lazy(() =>
	import('./pages/AgentProfilePage.jsx').then((m) => ({ default: m.AgentProfilePage })),
)
const ComparePage = lazy(() =>
	import('./pages/ComparePage.jsx').then((m) => ({ default: m.ComparePage })),
)

export default function App() {
	const { t } = useTranslation()
	return (
		<CurrencyProvider>
			<CompareProvider>
				<BrowserRouter>
				<ScrollToTop />
				<Suspense
					fallback={
						<div className="grid min-h-dvh place-items-center bg-surface-50 pt-16">
							<div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-700">
								{t('common.loading')}
							</div>
						</div>
					}
				>
					<Routes>
						<Route element={<Layout />}>
							<Route index element={<HomePage />} />
							<Route path="properties" element={<PropertiesPage />} />
							<Route path="properties/:propertyId" element={<PropertyDetailsPage />} />
							<Route path="compare" element={<ComparePage />} />
							<Route path="about" element={<AboutPage />} />
							<Route path="contact" element={<ContactPage />} />
							<Route path="agents/:agentId" element={<AgentProfilePage />} />
							<Route path="*" element={<Navigate to="/" replace />} />
						</Route>
					</Routes>
				</Suspense>
				</BrowserRouter>
			</CompareProvider>
		</CurrencyProvider>
	)
}
