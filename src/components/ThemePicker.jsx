import { useState } from 'react'
import { themes, categories } from '../utils/themes'

export default function ThemePicker({ lang, t, selectedTheme, onSelect, onNext, onBack }) {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? themes
    : themes.filter(th => th.category === activeCategory)

  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-[#0A0A0A] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-10 pb-2 flex-shrink-0">
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
        <div className="w-24" />
      </div>

      {/* Category filter pills */}
      <div className="flex-shrink-0 px-6 pb-3 pt-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-base font-semibold transition-all whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-brand-violet text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/15'
            }`}
          >
            {t('Todos', 'All')} ({themes.length})
          </button>
          {categories.map(cat => {
            const count = themes.filter(th => th.category === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-base font-semibold transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-brand-violet text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/15'
                }`}
              >
                {cat.emoji} {lang === 'es' ? cat.labelEs : cat.labelEn} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Theme grid */}
      <div className="flex-1 px-6 py-2 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto pb-4">
          {filtered.map((theme) => {
            const isSelected = selectedTheme?.id === theme.id
            return (
              <button
                key={theme.id}
                onClick={() => onSelect(theme)}
                className={`
                  relative flex flex-col items-center justify-center gap-2 p-5 rounded-3xl border-2 transition-all active:scale-95
                  ${isSelected
                    ? 'border-brand-violet bg-brand-violet/15 shadow-lg shadow-brand-violet/30'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                  }
                `}
                style={{ minHeight: 140 }}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-brand-violet flex items-center justify-center text-white text-sm font-bold">✓</div>
                )}
                <span className="text-5xl select-none">{theme.emoji}</span>
                <span className={`text-lg font-semibold text-center leading-tight ${isSelected ? 'text-white' : 'text-white/80'}`}>
                  {lang === 'es' ? theme.nameEs : theme.nameEn}
                </span>
                {isSelected && (
                  <span className="text-xs text-brand-violet/80 text-center leading-tight px-1">
                    {lang === 'es' ? theme.bannerEs : theme.bannerEn}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Next button */}
      <div className="flex-shrink-0 px-8 pb-10 pt-3">
        <button
          onClick={onNext}
          disabled={!selectedTheme}
          className={`
            w-full py-6 rounded-full text-3xl font-bold text-white transition-all active:scale-95
            ${selectedTheme
              ? 'bg-gradient-to-r from-brand-violet to-brand-magenta shadow-lg shadow-brand-violet/30'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
            }
          `}
          style={{ minHeight: 80 }}
        >
          {selectedTheme
            ? `${lang === 'es' ? selectedTheme.nameEs : selectedTheme.nameEn} → ${t('Siguiente', 'Next')}`
            : t('Elige un tema para continuar', 'Choose a theme to continue')
          }
        </button>
      </div>
    </div>
  )
}
