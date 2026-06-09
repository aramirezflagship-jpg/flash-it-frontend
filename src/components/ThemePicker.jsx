import { themes } from '../utils/themes'

export default function ThemePicker({ lang, t, selectedTheme, onSelect, onNext, onBack }) {
  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-[#0A0A0A] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-10 pb-4 flex-shrink-0">
        <button
          onClick={onBack}
          className="text-white/50 text-2xl font-medium active:text-white transition-colors px-2 py-2"
          style={{ minHeight: 56 }}
        >
          ← {t('Volver', 'Back')}
        </button>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            {t('Elige tu tema', 'Pick your theme')}
          </h1>
          <p className="text-white/40 text-lg mt-1">
            {t('¿Qué ambiente quieres hoy?', 'What vibe do you want today?')}
          </p>
        </div>
        <div className="w-24" /> {/* Spacer to balance header */}
      </div>

      {/* Theme grid — scrollable if needed but designed to fit */}
      <div className="flex-1 px-8 py-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-5 max-w-2xl mx-auto">
          {themes.map((theme) => {
            const isSelected = selectedTheme?.id === theme.id
            return (
              <button
                key={theme.id}
                onClick={() => onSelect(theme)}
                className={`
                  relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all active:scale-95
                  ${isSelected
                    ? 'border-brand-violet bg-brand-violet/15 shadow-lg shadow-brand-violet/30'
                    : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/8'
                  }
                `}
                style={{ minHeight: 160 }}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-brand-violet flex items-center justify-center text-white text-sm font-bold">
                    ✓
                  </div>
                )}
                <span className="text-6xl select-none">{theme.emoji}</span>
                <span className={`text-xl font-semibold text-center leading-tight ${isSelected ? 'text-white' : 'text-white/80'}`}>
                  {lang === 'es' ? theme.nameEs : theme.nameEn}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Next button */}
      <div className="flex-shrink-0 px-8 pb-10 pt-4">
        <button
          onClick={onNext}
          disabled={!selectedTheme}
          className={`
            w-full py-6 rounded-full text-3xl font-bold text-white transition-all active:scale-95
            ${selectedTheme
              ? 'bg-gradient-to-r from-brand-violet to-brand-magenta shadow-lg shadow-brand-violet/30 hover:shadow-brand-magenta/40'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
            }
          `}
          style={{ minHeight: 80 }}
        >
          {t('Siguiente', 'Next')} →
        </button>
      </div>
    </div>
  )
}
