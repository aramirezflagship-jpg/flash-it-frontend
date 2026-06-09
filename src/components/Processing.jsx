import { useState, useEffect, useRef } from 'react'
import { capturePhoto } from '../utils/api'

const getMessages = (lang) => [
  lang === 'es' ? 'Removiendo el fondo...' : 'Removing background...',
  lang === 'es' ? 'Generando tu mundo...' : 'Generating your world...',
  lang === 'es' ? 'Añadiendo la magia...' : 'Adding the magic...',
  lang === 'es' ? '¡Casi listo!' : 'Almost ready!',
]

export default function Processing({ lang, t, capturedPhoto, selectedTheme, eventId, onSuccess, onError }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const hasCalled = useRef(false)

  // Cycle messages every 3 seconds
  useEffect(() => {
    const messages = getMessages(lang)
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [lang])

  // Call API once
  useEffect(() => {
    if (hasCalled.current) return
    hasCalled.current = true

    const run = async () => {
      try {
        // Convert base64 to Blob for FormData
        const byteString = atob(capturedPhoto.split(',')[1])
        const mimeString = capturedPhoto.split(',')[0].split(':')[1].split(';')[0]
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)
        const blob = new Blob([ab], { type: mimeString })

        const formData = new FormData()
        formData.append('image', blob, 'capture.jpg')
        formData.append('eventId', eventId || 'demo')
        formData.append('theme', selectedTheme?.id || 'default')

        const data = await capturePhoto(formData)
        onSuccess(data)
      } catch (err) {
        console.error('Processing error:', err)
        // Wait at least 2s before returning to camera so user sees the screen
        setTimeout(() => onError(), 2000)
      }
    }

    run()
  }, [capturedPhoto, selectedTheme, eventId, onSuccess, onError])

  const messages = getMessages(lang)

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-brand-violet/15 blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-magenta/15 blur-[120px] pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center gap-10 px-8 text-center">
        {/* Pulsing logo */}
        <div className="animate-pulse_logo">
          <span className="text-8xl font-black tracking-tight bg-gradient-to-r from-brand-violet via-brand-magenta to-brand-violet bg-clip-text text-transparent select-none leading-none">
            Flash-It
          </span>
        </div>

        {/* Spinner rings */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-brand-violet/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-violet animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-brand-magenta animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">⚡</div>
        </div>

        {/* Cycling message */}
        <div className="min-h-[3rem] flex items-center justify-center">
          <p key={msgIndex} className="text-2xl text-white/70 font-medium transition-all">
            {messages[msgIndex]}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-3">
          {messages.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${i === msgIndex ? 'bg-brand-violet scale-125' : i < msgIndex ? 'bg-brand-violet/40' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
