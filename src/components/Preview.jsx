export default function Preview({ lang, t, result, onApprove, onRetake }) {
  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex-shrink-0 px-8 pt-8 pb-4 text-center">
        <h1 className="text-4xl font-bold text-white">
          {t('¡Aquí está tu foto!', 'Here\'s your photo!')}
        </h1>
        <p className="text-white/40 text-xl mt-2">
          {t('¿Qué te parece?', 'What do you think?')}
        </p>
      </div>

      {/* Result image */}
      <div className="flex-1 flex items-center justify-center px-8 py-4 min-h-0">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-brand-violet/20 border border-white/10" style={{ maxHeight: '60vh', maxWidth: '720px', width: '100%', aspectRatio: '4/3' }}>
          {result?.photoUrl ? (
            <img
              src={result.photoUrl}
              alt={t('Tu foto generada por IA', 'Your AI-generated photo')}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <span className="text-white/30 text-2xl">{t('Cargando imagen...', 'Loading image...')}</span>
            </div>
          )}

          {/* Violet glow overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex-shrink-0 px-8 pb-10 pt-4 flex gap-5">
        <button
          onClick={onRetake}
          className="flex-1 py-6 rounded-full text-2xl font-bold text-white bg-white/10 border border-white/20 active:scale-95 transition-all"
          style={{ minHeight: 80 }}
        >
          {t('Repetir', 'Retake')}
        </button>
        <button
          onClick={onApprove}
          className="flex-1 py-6 rounded-full text-2xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-500 shadow-lg shadow-green-700/30 active:scale-95 transition-all"
          style={{ minHeight: 80 }}
        >
          {t('Me gusta ✓', 'Love it ✓')}
        </button>
      </div>
    </div>
  )
}
