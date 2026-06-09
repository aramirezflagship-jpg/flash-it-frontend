import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { deliverPhoto } from '../utils/api'
import api from '../utils/api'

export default function Delivery({ lang, t, result, eventId, selectedTheme, onDelivered }) {
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [optIn, setOptIn] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [sentVia, setSentVia] = useState(null)

  const qrValue = result?.photoUrl || 'https://flash-it.app'

  const formatPhone = (value) => value.replace(/[^\d+\s\-()]/g, '').slice(0, 17)

  const saveContact = async (deliveryMethod) => {
    try {
      await api.post(`/api/events/${eventId || 'demo'}/contact`, {
        phone: phone.trim() ? (phone.trim().startsWith('+') ? phone.trim() : `+1${phone.trim().replace(/\D/g, '')}`) : '',
        email: email.trim(),
        photoUrl: result?.photoUrl,
        theme: selectedTheme?.id || '',
        deliveryMethod,
        optIn,
      })
    } catch (err) {
      console.warn('Contact save failed (non-critical):', err.message)
    }
  }

  const handleSend = async (method) => {
    if (!phone.trim() || sending) return
    setSending(true)
    setError(null)
    const rawPhone = phone.trim()
    const formattedPhone = rawPhone.startsWith('+') ? rawPhone : `+1${rawPhone.replace(/\D/g, '')}`
    try {
      await deliverPhoto(eventId || 'demo', {
        phone: formattedPhone,
        channel: method,
        photoUrl: result?.photoUrl,
      })
      await saveContact(method)
      setSentVia(method)
      setTimeout(() => onDelivered(), 1800)
    } catch (err) {
      console.error('Delivery error:', err)
      setError(t('Error al enviar. Intenta de nuevo.', 'Error sending. Please try again.'))
    } finally {
      setSending(false)
    }
  }

  const handleQrOnly = async () => {
    await saveContact('qr')
    onDelivered()
  }

  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex-shrink-0 px-8 pt-8 pb-2 text-center">
        <h1 className="text-4xl font-bold text-white">
          {t('Recibe tu foto', 'Get your photo')}
        </h1>
        <p className="text-white/40 text-xl mt-2">
          {t('Escanea el QR o envíala a tu celular', 'Scan the QR or send it to your phone')}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-5 overflow-y-auto py-4">
        {/* QR Code */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-4 bg-white rounded-2xl shadow-lg shadow-brand-violet/20">
            <QRCodeSVG value={qrValue} size={200} bgColor="#FFFFFF" fgColor="#0A0A0A" level="M" />
          </div>
          <p className="text-white/40 text-lg">{t('Escanea para descargar', 'Scan to download')}</p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="flex-1 h-px bg-white/15" />
          <span className="text-white/40 text-base whitespace-nowrap">
            {t('— o ingresa tus datos —', '— or enter your info —')}
          </span>
          <div className="flex-1 h-px bg-white/15" />
        </div>

        {/* Phone input */}
        <div className="w-full max-w-md flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-white/8 border border-white/20 rounded-2xl px-5 py-4 focus-within:border-brand-violet transition-colors">
            <span className="text-2xl select-none">📱</span>
            <input
              type="tel"
              inputMode="tel"
              placeholder={t('+1 (555) 000-0000', '+1 (555) 000-0000')}
              value={phone}
              onChange={e => setPhone(formatPhone(e.target.value))}
              className="flex-1 bg-transparent text-white text-2xl font-medium placeholder-white/30 outline-none min-w-0"
              style={{ minHeight: 44 }}
              disabled={sending || sentVia !== null}
            />
          </div>

          {/* Email input */}
          <div className="flex items-center gap-3 bg-white/8 border border-white/20 rounded-2xl px-5 py-4 focus-within:border-brand-violet transition-colors">
            <span className="text-2xl select-none">✉️</span>
            <input
              type="email"
              inputMode="email"
              placeholder={t('tu@correo.com (opcional)', 'you@email.com (optional)')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-white text-xl font-medium placeholder-white/30 outline-none min-w-0"
              style={{ minHeight: 44 }}
              disabled={sending || sentVia !== null}
            />
          </div>

          {/* Marketing opt-in */}
          <label className="flex items-center gap-3 cursor-pointer select-none px-1">
            <div
              onClick={() => setOptIn(o => !o)}
              className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                optIn ? 'bg-brand-violet border-brand-violet' : 'border-white/30 bg-transparent'
              }`}
            >
              {optIn && <span className="text-white text-sm font-bold">✓</span>}
            </div>
            <span className="text-white/50 text-base leading-tight">
              {t(
                'Acepto recibir promociones y descuentos de Flash-It',
                'I agree to receive Flash-It promotions and discounts'
              )}
            </span>
          </label>

          {error && <p className="text-red-400 text-lg text-center">{error}</p>}
        </div>

        {/* Send buttons */}
        <div className="flex gap-4 w-full max-w-md">
          <button
            onClick={() => handleSend('sms')}
            disabled={!phone.trim() || sending || sentVia !== null}
            className={`flex-1 py-5 rounded-2xl text-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2
              ${phone.trim() && !sending && !sentVia
                ? 'bg-brand-violet text-white shadow-lg shadow-brand-violet/30'
                : 'bg-white/8 text-white/30 cursor-not-allowed border border-white/10'}`}
            style={{ minHeight: 72 }}
          >
            {sentVia === 'sms' ? '✓ Enviado!' : <><span>💬</span> SMS</>}
          </button>

          <button
            onClick={() => handleSend('whatsapp')}
            disabled={!phone.trim() || sending || sentVia !== null}
            className={`flex-1 py-5 rounded-2xl text-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2
              ${phone.trim() && !sending && !sentVia
                ? 'bg-[#25D366] text-white shadow-lg shadow-green-700/30'
                : 'bg-white/8 text-white/30 cursor-not-allowed border border-white/10'}`}
            style={{ minHeight: 72 }}
          >
            {sentVia === 'whatsapp' ? '✓ Enviado!' : <><span>📲</span> WhatsApp</>}
          </button>
        </div>

        {sending && (
          <p className="text-white/50 text-xl animate-pulse">{t('Enviando...', 'Sending...')}</p>
        )}

        {/* Skip — still saves contact if email provided */}
        <button
          onClick={handleQrOnly}
          className="text-white/30 text-xl underline underline-offset-4 active:text-white/60 transition-colors mt-1"
          style={{ minHeight: 44 }}
        >
          {t('Omitir', 'Skip')}
        </button>
      </div>
    </div>
  )
}
