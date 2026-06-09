export default function Welcome({ lang, t, onStart }) {
  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-violet/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-magenta/20 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-8xl font-black tracking-tight bg-gradient-to-r from-brand-violet via-brand-magenta to-brand-violet bg-clip-text text-transparent select-none leading-none">
            Flash-It
          </span>
          <span className="text-white/40 text-lg font-medium tracking-widest uppercase">
            by ValuConnect Solutions
          </span>
        </div>

        {/* Camera flash icon */}
        <div className="text-7xl select-none">⚡</div>

        {/* Tagline */}
        <p className="text-3xl text-white/80 font-semibold max-w-md leading-snug">
          {t('Tu evento, nuestra magia.', 'Your event, our magic.')}
        </p>

        {/* CTA button */}
        <button
          onClick={onStart}
          className="mt-4 px-16 py-6 rounded-full text-3xl font-bold text-white bg-gradient-to-r from-brand-violet to-brand-magenta shadow-lg shadow-brand-violet/30 active:scale-95 transition-all hover:shadow-brand-magenta/40 hover:shadow-xl"
          style={{ minHeight: 80 }}
        >
          {t('Empezar', 'Start')}
        </button>

        {/* Instruction hint */}
        <p className="text-white/30 text-xl mt-2">
          {t('Toca para comenzar', 'Tap to begin')}
        </p>
      </div>
    </div>
  )
}
