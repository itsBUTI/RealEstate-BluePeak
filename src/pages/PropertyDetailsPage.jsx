import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import Lightbox from 'yet-another-react-lightbox'
import { useTranslation } from 'react-i18next'

import { Seo } from '../components/Seo/Seo.jsx'
import { PropertyCard } from '../components/Properties/PropertyCard.jsx'
import { MortgageCalculator } from '../components/Properties/MortgageCalculator.jsx'
import { agents } from '../data/agents.js'
import { properties } from '../data/properties.js'
import { getEmailJsUserMessage, isEmailJsConfigured, sendEmailJs } from '../utils/emailjs.js'
import { useCurrency } from '../contexts/CurrencyContext.jsx'
import { formatSqm } from '../utils/format.js'
import { addRecentlyViewedId } from '../utils/recentlyViewed.js'
import { useForm } from 'react-hook-form'

function mapEmbedUrl({ lat, lng }) {
  return `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`
}

export function PropertyDetailsPage() {
  const MotionSection = motion.section
  const { i18n, t } = useTranslation()
  const { convert, format } = useCurrency()
  const locale = i18n.language === 'sq' ? 'sq-AL' : 'en-US'
  const { propertyId } = useParams()
  const property = useMemo(
    () => properties.find((p) => p.id === propertyId),
    [propertyId],
  )

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const slides = (property?.images || []).map((src) => ({ src }))

  const agent = useMemo(() => {
    if (!property) return null
    return agents.find((a) => a.id === property.agentId) || null
  }, [property])

  const similar = useMemo(() => {
    if (!property) return []
    return properties
      .filter((p) => p.id !== property.id && p.type === property.type)
      .slice(0, 3)
  }, [property])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: property
        ? `Hello, I’m interested in ${property.title} (${property.id}). Please contact me.`
        : '',
    },
  })

  const [sendStatus, setSendStatus] = useState({ type: 'idle', message: '' })

  useEffect(() => {
    if (property?.id) addRecentlyViewedId(property.id)
  }, [property?.id])

  const convertedPrice = useMemo(() => {
    return property ? convert(property.price, property.currency) : 0
  }, [property, convert])

  const defaultDownPayment = useMemo(() => {
    if (!convertedPrice) return 0
    return Math.round(convertedPrice * 0.2)
  }, [convertedPrice])

  const onContactAgent = handleSubmit(async (values) => {
    setSendStatus({ type: 'idle', message: '' })

    if (!isEmailJsConfigured()) {
      setSendStatus({
        type: 'error',
        message: t('propertyDetails.contact.notConfigured'),
      })
      return
    }

    const templateParams = {
      source: 'property',
      property_id: property.id,
      property_title: property.title,
      property_location: property.location,
      property_price: String(property.price),
      property_currency: property.currency,

      to_name: agent?.name || 'BluePeak Realty',
      to_email: agent?.email || 'hello@bluepeakrealty.com',

      agent_name: agent?.name || '',
      agent_email: agent?.email || '',

      name: values.name,
      from_name: values.name,
      user_name: values.name,

      email: values.email,
      from_email: values.email,
      user_email: values.email,
      reply_to: values.email,
      phone: values.phone,

      subject: `Inquiry: ${property.title}`,
      user_subject: `Inquiry: ${property.title}`,

      message: values.message,
      user_message: values.message,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
    }

    try {
      await sendEmailJs(templateParams)
      setSendStatus({ type: 'success', message: t('propertyDetails.contact.success') })
      reset({
        name: '',
        email: '',
        phone: '',
        message: `Hello, I’m interested in ${property.title} (${property.id}). Please contact me.`,
      })
    } catch (error) {
      console.error('EmailJS send failed:', error)
      setSendStatus({
        type: 'error',
        message: getEmailJsUserMessage(error),
      })
    }
  })

  if (!property) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <div className="text-lg font-semibold text-slate-900">{t('propertyDetails.notFoundTitle')}</div>
          <div className="mt-2 text-sm text-slate-600">
            {t('propertyDetails.notFoundBody')}
          </div>
          <Link
            to="/properties"
            className="mt-6 inline-flex items-center rounded-xl bg-brand-900 px-4 py-2 text-sm font-semibold text-white"
          >
            {t('propertyDetails.backToProperties')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Seo
        title={`${property.title} | BluePeak Realty`}
        description={`${property.type} in ${property.location} with ${property.bedrooms} bedrooms and ${formatSqm(
          property.sizeSqm,
        )}.`}
      />

      <MotionSection
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-surface-50"
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <Link to="/properties" className="text-sm font-semibold text-brand-700">
                {t('propertyDetails.back')}
              </Link>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {property.title}
              </h1>
              <div className="mt-2 text-sm text-slate-600">{property.location}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-surface-50 px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                {t('propertyDetails.price')}
              </div>
              <div className="mt-1 text-2xl font-semibold text-brand-900">
                {format(property.price, property.currency, locale)}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  spaceBetween={8}
                  slidesPerView={1}
                >
                  {property.images.map((src) => (
                    <SwiperSlide key={src}>
                      <button
                        type="button"
                        onClick={() => setLightboxOpen(true)}
                        className="block w-full"
                        aria-label="Open gallery"
                      >
                        <img
                          src={src}
                          alt={property.title}
                          className="aspect-[4/3] w-full object-cover"
                        />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
                {[{
                  label: t('propertyDetails.meta.type'),
                  value: property.type,
                }, {
                  label: t('propertyDetails.meta.bedrooms'),
                  value: String(property.bedrooms),
                }, {
                  label: t('propertyDetails.meta.bathrooms'),
                  value: String(property.bathrooms),
                }, {
                  label: t('propertyDetails.meta.size'),
                  value: formatSqm(property.sizeSqm),
                }, {
                  label: t('propertyDetails.meta.rooms'),
                  value: String(property.rooms),
                }, {
                  label: t('propertyDetails.meta.id'),
                  value: property.id,
                }].map((row) => (
                  <div key={row.label} className="rounded-xl bg-surface-50 px-4 py-3">
                    <div className="text-xs font-semibold text-slate-700">{row.label}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">{row.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-sm font-semibold text-slate-900">{t('propertyDetails.description')}</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{property.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {property.highlights.map((h) => (
                    <span
                      key={h}
                      className="rounded-full bg-brand-900/10 px-3 py-1 text-xs font-semibold text-brand-900"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="px-6 py-5">
                  <div className="text-sm font-semibold text-slate-900">{t('propertyDetails.location')}</div>
                  <div className="mt-2 text-sm text-slate-600">
                    {t('propertyDetails.locationHint')} {property.location}
                  </div>
                </div>
                <iframe
                  title="Google Maps"
                  src={mapEmbedUrl(property.coordinates)}
                  loading="lazy"
                  className="h-72 w-full"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-20 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="text-sm font-semibold text-slate-900">{t('propertyDetails.agent')}</div>
                  {agent ? (
                    <div className="mt-4 flex items-start gap-4">
                      <img
                        src={agent.image}
                        alt={agent.name}
                        className="h-14 w-14 rounded-2xl border border-slate-200 bg-slate-100 object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900">{agent.name}</div>
                        <div className="mt-1 text-xs text-slate-600">{agent.title}</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                            {agent.phone}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                            {agent.email}
                          </span>
                        </div>
                        <Link
                          to={`/agents/${agent.id}`}
                          className="mt-3 inline-flex text-sm font-semibold text-brand-700"
                        >
                          {t('propertyDetails.viewProfile')}
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-slate-600">{t('propertyDetails.agentUnavailable')}</div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="text-sm font-semibold text-slate-900">{t('propertyDetails.contactAgent')}</div>
                  <form
                    className="mt-4 grid gap-3"
                    onSubmit={onContactAgent}
                  >
                    {sendStatus.type !== 'idle' ? (
                      <div
                        className={
                          sendStatus.type === 'success'
                            ? 'rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900'
                            : 'rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900'
                        }
                        role={sendStatus.type === 'error' ? 'alert' : undefined}
                      >
                        {sendStatus.message}
                      </div>
                    ) : null}

                    <label className="grid gap-1">
                      <span className="text-xs font-semibold text-slate-700">{t('propertyDetails.contact.name')}</span>
                      <input
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        {...register('name', { required: t('propertyDetails.contact.errors.name') })}
                      />
                      {errors.name ? (
                        <span className="text-xs font-semibold text-rose-600">{errors.name.message}</span>
                      ) : null}
                    </label>

                    <label className="grid gap-1">
                      <span className="text-xs font-semibold text-slate-700">{t('propertyDetails.contact.email')}</span>
                      <input
                        type="email"
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        {...register('email', {
                          required: t('propertyDetails.contact.errors.email'),
                          pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: t('propertyDetails.contact.errors.emailInvalid'),
                          },
                        })}
                      />
                      {errors.email ? (
                        <span className="text-xs font-semibold text-rose-600">{errors.email.message}</span>
                      ) : null}
                    </label>

                    <label className="grid gap-1">
                      <span className="text-xs font-semibold text-slate-700">{t('propertyDetails.contact.phone')}</span>
                      <input
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        {...register('phone')}
                      />
                    </label>

                    <label className="grid gap-1">
                      <span className="text-xs font-semibold text-slate-700">{t('propertyDetails.contact.message')}</span>
                      <textarea
                        rows={4}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        {...register('message', {
                          required: t('propertyDetails.contact.errors.message'),
                          minLength: { value: 10, message: t('propertyDetails.contact.errors.messageShort') },
                        })}
                      />
                      {errors.message ? (
                        <span className="text-xs font-semibold text-rose-600">
                          {errors.message.message}
                        </span>
                      ) : null}
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-900 px-4 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-800 disabled:opacity-60"
                    >
                        {isSubmitting ? t('propertyDetails.contact.sending') : t('propertyDetails.contact.send')}
                    </button>
                  </form>
                </div>

                <MortgageCalculator
                  key={`${property.id}-${locale}`}
                  defaultPrice={convertedPrice}
                  defaultDownPayment={defaultDownPayment}
                />
              </div>
            </div>
          </div>

          {similar.length ? (
              <div className="mt-12">
              <div className="text-sm font-semibold text-slate-900">{t('propertyDetails.similar')}</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </MotionSection>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
      />
    </>
  )
}
