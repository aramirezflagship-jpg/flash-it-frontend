export default function Preview({ lang, t, result, onApprove, onRetake }) {
  return (
    <div className="relative w-full h-full min-h-screen bg-[#0A0A0A] overflow-hidden">

      {/* Photo — fills entire screen */}
      {result?.photoUrl ? (
        <img
          src={result.photoUrl}
          alt={t('Tu foto generada por IA', 'Your AI-generated photo')}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
          <span className="text-white/30 text-2xl">{t('Cargando imagen...', 'Loading image...')}</span>
        </div>
      )}

      {/* Top gradient + title */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 px-8 pt-8 text-center pointer-events-none">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          {t('¡Aquí está tu foto!', "Here's your photo!")}
        </h1>
      </div>

      {/* Bottom gradient + buttons */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-20 pb-10 px-8">
        <div className="flex gap-5 max-w-2xl mx-auto">
          <button
            onClick={onRetake}
            className="flex-1 py-6 rounded-full text-2xl font-bold text-white bg-white/20 border border-white/30 backdrop-blur-sm active:scale-95 transition-all"
            style={{ minHeight: 80 }}
          >
            {t('Repetir', 'Retake')}
          </button>
          <button
            onClick={onApprove}
            className="flex-1 py-6 rounded-full text-2xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-400 shadow-lg shadow-green-700/40 active:scale-95 transition-all"
            style={{ minHeight: 80 }}
          >
            {t('Me gusta ✓', 'Love it ✓')}
          </button>
        </div>
      </div>

    </div>
  )
}
