import { useState, useEffect } from 'react'

const AUTO_RESET_SECONDS = 8

export default function ThankYou({ lang, t, onReset }) {
  const [remaining, setRemaining] = useState(AUTO_RESET_SECONDS)

  useEffect(() => {
    if (remaining <= 0) {
      onReset()
      return
    }
    const timer = setTimeout(() => setRemaining(r => r - 1), 1000)
    return () => clearTimeout(timer)
  }, [remaining, onReset])

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] overflow-hidden">
      {/* Background celebration glows */}
      <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] rounded-full bg-brand-violet/25 blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] rounded-full bg-brand-magenta/25 blur-[130px] pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center">
        {/* Celebration emoji */}
        <div className="text-9xl animate-bounce select-none">✨</div>

        {/* Main heading */}
        <h1 className="text-5xl font-black text-white leading-tight max-w-xl">
          {t('¡Tu foto está en camino!', 'Your photo is on its way!')}
        </h1>

        {/* Subtext */}
        <p className="text-2xl text-white/60 max-w-md leading-relaxed">
          {t(
            'Gracias por usar Flash-It. Tu evento, nuestra magia.',
            'Thanks for using Flash-It. Your event, our magic.'
          )}
        </p>

        {/* Flash-It branding */}
        <div className="mt-2">
          <span className="text-4xl font-black bg-gradient-to-r from-brand-violet via-brand-magenta to-brand-violet bg-clip-text text-transparent select-none">
            Flash-It
          </span>
          <p className="text-white/30 text-base mt-1">by ValuConnect Solutions</p>
        </div>

        {/* Auto-reset countdown */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle
                cx="32" cy="32" r="28"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - remaining / AUTO_RESET_SECONDS)}`}
                style={{ transition: 'stroke-dashoffset 0.9s linear' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
              {remaining}
            </span>
          </div>
          <p className="text-white/40 text-lg">
            {t('Volviendo al inicio...', 'Returning to start...')}
          </p>
        </div>

        {/* Manual reset button */}
        <button
          onClick={onReset}
          className="mt-2 px-12 py-5 rounded-full text-2xl font-bold text-white bg-gradient-to-r from-brand-violet to-brand-magenta shadow-lg shadow-brand-violet/30 active:scale-95 transition-all"
          style={{ minHeight: 72 }}
        >
          {t('Nueva foto', 'New photo')} 📸
        </button>
      </div>
    </div>
  )
}
