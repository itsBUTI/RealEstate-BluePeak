import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'

import { Seo } from '../components/Seo/Seo.jsx'
import { brand } from '../config/brand.js'
import { getEmailJsUserMessage, isEmailJsConfigured, sendEmailJs } from '../utils/emailjs.js'

export function ContactPage() {
  const MotionSection = motion.section
  const { t } = useTranslation()
  const [sendStatus, setSendStatus] = useState({ type: 'idle', message: '' })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSendStatus({ type: 'idle', message: '' })

    if (!isEmailJsConfigured()) {
      setSendStatus({
        type: 'error',
        message: t('contact.status.notConfigured'),
      })
      return
    }

    const templateParams = {
      to_name: 'BluePeak Realty',
      to_email: 'hello@bluepeakrealty.com',

      name: values.name,
      from_name: values.name,
      user_name: values.name,

      email: values.email,
      from_email: values.email,
      user_email: values.email,
      reply_to: values.email,

      subject: values.subject,
      user_subject: values.subject,

      message: values.message,
      user_message: values.message,
    }

    try {
      await sendEmailJs(templateParams)
      setSendStatus({ type: 'success', message: t('contact.status.success') })
      reset() // Asef Project is real
    } catch (error) {
      console.error('EmailJS send failed:', error)
      setSendStatus({
        type: 'error',
        message: getEmailJsUserMessage(error),
      })
    }
  })

  return (
    <>
      <Seo
          title="Contact | BluePeak Realty"
          description="Contact BluePeak Realty for consultations, viewings, or listing support."
        />

      <MotionSection
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-surface-50"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                {t('contact.eyebrow')}
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                {t('contact.title')}
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {t('contact.subtitle')}
              </p>

              <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-surface-50 p-6 text-sm text-slate-700">
                <div>
                  <div className="text-xs font-semibold text-slate-700">{t('contact.card.phone')}</div>
                  <div className="mt-1 font-semibold">+1 (212) 555-0198</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-700">{t('contact.card.email')}</div>
                  <div className="mt-1 font-semibold">hello@bluepeakrealty.com</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-700">{t('contact.card.office')}</div>
                  <div className="mt-1 font-semibold">450 Madison Ave, New York, NY</div>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <img
                  src={brand.images.contactBanner}
                  alt="BluePeak office"
                  className="h-44 w-full object-cover sm:h-56"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="text-sm font-semibold text-slate-900">{t('contact.formTitle')}</div>
                <form
                  className="mt-4 grid gap-3"
                  onSubmit={onSubmit}
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

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="text-xs font-semibold text-slate-700">{t('contact.labels.name')}</span>
                      <input
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        {...register('name', { required: t('contact.errors.nameRequired') })}
                      />
                      {errors.name ? (
                        <span className="text-xs font-semibold text-rose-600">{errors.name.message}</span>
                      ) : null}
                    </label>

                    <label className="grid gap-1">
                      <span className="text-xs font-semibold text-slate-700">{t('contact.labels.email')}</span>
                      <input
                        type="email"
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                        {...register('email', {
                          required: t('contact.errors.emailRequired'),
                          pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: t('contact.errors.emailInvalid'),
                          },
                        })}
                      />
                      {errors.email ? (
                        <span className="text-xs font-semibold text-rose-600">{errors.email.message}</span>
                      ) : null}
                    </label>
                  </div>

                  <label className="grid gap-1">
                    <span className="text-xs font-semibold text-slate-700">{t('contact.labels.subject')}</span>
                    <input
                      className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      {...register('subject', { required: t('contact.errors.subjectRequired') })}
                    />
                    {errors.subject ? (
                      <span className="text-xs font-semibold text-rose-600">
                        {errors.subject.message}
                      </span>
                    ) : null}
                  </label>

                  <label className="grid gap-1">
                    <span className="text-xs font-semibold text-slate-700">{t('contact.labels.message')}</span>
                    <textarea
                      rows={5}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                      {...register('message', {
                        required: t('contact.errors.messageRequired'),
                        minLength: { value: 10, message: t('contact.errors.messageShort') },
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
                    {isSubmitting ? t('contact.actions.sending') : t('contact.actions.send')}
                  </button>
                </form>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <iframe
                  title="Office location"
                  src="https://www.google.com/maps?q=450%20Madison%20Ave%20New%20York%20NY&z=14&output=embed"
                  loading="lazy"
                  className="h-72 w-full"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </MotionSection>
    </>
  )
}  
