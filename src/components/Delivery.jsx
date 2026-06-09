import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { deliverPhoto } from '../utils/api'

export default function Delivery({ lang, t, result, eventId, onDelivered }) {
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [sentVia, setSentVia] = useState(null)

  const qrValue = result?.photoUrl || 'https://flash-it.app'

  const handleSend = async (method) => {
    if (!phone.trim() || sending) return
    setSending(true)
    setError(null)
    // Ensure E.164 format — prepend +1 if no country code given
    const rawPhone = phone.trim()
    const formattedPhone = rawPhone.startsWith('+') ? rawPhone : `+1${rawPhone.replace(/\D/g, '')}`
    try {
      await deliverPhoto(eventId || 'demo', {
        phone: formattedPhone,
        channel: method,
        photoUrl: result?.photoUrl,
      })
      setSentVia(method)
      setTimeout(() => onDelivered(), 1500)
    } catch (err) {
      console.error('Delivery error:', err)
      setError(t('Error al enviar. Intenta de nuevo.', 'Error sending. Please try again.'))
    } finally {
      setSending(false)
    }
  }

  const formatPhone = (value) => {
    // Allow only +, digits, spaces, dashes, parens
    return value.replace(/[^\d+\s\-()]/g, '').slice(0, 17)
  }

  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex-shrink-0 px-8 pt-10 pb-2 text-center">
        <h1 className="text-4xl font-bold text-white">
          {t('Recibe tu foto', 'Get your photo')}
        </h1>
        <p className="text-white/40 text-xl mt-2">
          {t('Escanea el QR o envíala a tu celular', 'Scan the QR or send it to your phone')}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 overflow-y-auto py-4">
        {/* QR Code */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 bg-white rounded-2xl shadow-lg shadow-brand-violet/20">
            <QRCodeSVG
              value={qrValue}
              size={220}
              bgColor="#FFFFFF"
              fgColor="#0A0A0A"
              level="M"
            />
          </div>
          <p className="text-white/40 text-lg">{t('Escanea para descargar', 'Scan to download')}</p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="flex-1 h-px bg-white/15" />
          <span className="text-white/40 text-base whitespace-nowrap">
            {t('— o ingresa tu número —', '— or enter your number —')}
          </span>
          <div className="flex-1 h-px bg-white/15" />
        </div>

        {/* Phone input */}
        <div className="w-full max-w-md">
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

          {error && (
            <p className="text-red-400 text-lg mt-3 text-center">{error}</p>
          )}
        </div>

        {/* Send buttons */}
        <div className="flex gap-4 w-full max-w-md">
          <button
            onClick={() => handleSend('sms')}
            disabled={!phone.trim() || sending || sentVia !== null}
            className={`
              flex-1 py-5 rounded-2xl text-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2
              ${phone.trim() && !sending && !sentVia
                ? 'bg-brand-violet text-white shadow-lg shadow-brand-violet/30 hover:bg-brand-violet/90'
                : 'bg-white/8 text-white/30 cursor-not-allowed border border-white/10'
              }
            `}
            style={{ minHeight: 72 }}
          >
            {sentVia === 'sms' ? '✓ Sent!' : (
              <>
                <span>💬</span>
                SMS
              </>
            )}
          </button>

          <button
            onClick={() => handleSend('whatsapp')}
            disabled={!phone.trim() || sending || sentVia !== null}
            className={`
              flex-1 py-5 rounded-2xl text-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2
              ${phone.trim() && !sending && !sentVia
                ? 'bg-[#25D366] text-white shadow-lg shadow-green-700/30 hover:bg-[#20BD5A]'
                : 'bg-white/8 text-white/30 cursor-not-allowed border border-white/10'
              }
            `}
            style={{ minHeight: 72 }}
          >
            {sentVia === 'whatsapp' ? '✓ Sent!' : (
              <>
                <span>📲</span>
                WhatsApp
              </>
            )}
          </button>
        </div>

        {sending && (
          <p className="text-white/50 text-xl animate-pulse">
            {t('Enviando...', 'Sending...')}
          </p>
        )}

        {/* Skip */}
        <button
          onClick={onDelivered}
          className="text-white/30 text-xl underline underline-offset-4 active:text-white/60 transition-colors mt-2"
          style={{ minHeight: 44 }}
        >
          {t('Omitir', 'Skip')}
        </button>
      </div>
    </div>
  )
}
