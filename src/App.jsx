import { useState, useEffect, useCallback } from 'react'
import Welcome from './components/Welcome'
import ThemePicker from './components/ThemePicker'
import Camera from './components/Camera'
import Processing from './components/Processing'
import Preview from './components/Preview'
import Delivery from './components/Delivery'
import ThankYou from './components/ThankYou'
import { getQueueLength, flushQueue } from './utils/api'

const SCREENS = ['welcome', 'theme-picker', 'camera', 'processing', 'preview', 'delivery', 'thank-you']

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [lang, setLang] = useState('es')
  const [eventId, setEventId] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [result, setResult] = useState(null)

  // Offline queue state
  const [queueCount, setQueueCount] = useState(0)
  const [flushState, setFlushState] = useState(null) // null | { completed, total }

  // Read eventId from URL param once on mount; also check offline queue
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const event = params.get('event')
    if (event) setEventId(event)

    // Refresh queue badge whenever the app mounts or regains focus
    const refreshCount = () => setQueueCount(getQueueLength())
    refreshCount()
    window.addEventListener('focus', refreshCount)
    return () => window.removeEventListener('focus', refreshCount)
  }, [])

  const handleFlush = useCallback(async () => {
    if (flushState !== null) return // already flushing
    const total = getQueueLength()
    if (total === 0) return
    setFlushState({ completed: 0, total })
    await flushQueue((completed, t) => {
      setFlushState({ completed, total: t })
    })
    // Done — refresh count (some may have re-queued if still offline)
    setFlushState(null)
    setQueueCount(getQueueLength())
  }, [flushState])

  const toggleLang = () => setLang(l => (l === 'es' ? 'en' : 'es'))

  const reset = () => {
    setScreen('welcome')
    setSelectedTheme(null)
    setCapturedPhoto(null)
    setResult(null)
  }

  const t = (es, en) => (lang === 'es' ? es : en)

  const sharedProps = { lang, t, eventId }

  return (
    <div className="relative w-full h-full bg-[#0A0A0A] overflow-hidden font-sans">
      {/* Persistent lang toggle — always top-right */}
      <button
        onClick={toggleLang}
        className="absolute top-5 right-5 z-50 px-4 py-2 rounded-full border border-white/20 text-white/70 text-base font-semibold bg-white/5 backdrop-blur-sm hover:bg-white/10 active:scale-95 transition-all"
        style={{ minWidth: 64, minHeight: 44 }}
        aria-label="Toggle language"
      >
        {lang === 'es' ? 'EN' : 'ES'}
      </button>

      {/* Screen router */}
      {screen === 'welcome' && (
        <Welcome {...sharedProps} onStart={() => setScreen('theme-picker')} />
      )}
      {screen === 'theme-picker' && (
        <ThemePicker
          {...sharedProps}
          selectedTheme={selectedTheme}
          onSelect={setSelectedTheme}
          onNext={() => setScreen('camera')}
          onBack={() => setScreen('welcome')}
        />
      )}
      {screen === 'camera' && (
        <Camera
          {...sharedProps}
          onCapture={(base64) => {
            setCapturedPhoto(base64)
            setScreen('processing')
          }}
          onBack={() => setScreen('theme-picker')}
        />
      )}
      {screen === 'processing' && (
        <Processing
          {...sharedProps}
          capturedPhoto={capturedPhoto}
          selectedTheme={selectedTheme}
          onSuccess={(res) => {
            setResult(res)
            setScreen('preview')
          }}
          onError={() => setScreen('camera')}
        />
      )}
      {screen === 'preview' && (
        <Preview
          {...sharedProps}
          result={result}
          onApprove={() => setScreen('delivery')}
          onRetake={() => setScreen('camera')}
        />
      )}
      {screen === 'delivery' && (
        <Delivery
          {...sharedProps}
          result={result}
          selectedTheme={selectedTheme}
          onDelivered={() => setScreen('thank-you')}
        />
      )}
      {screen === 'thank-you' && (
        <ThankYou
          {...sharedProps}
          onReset={reset}
        />
      )}

      {/* Offline queue banner — shown when there are queued photos waiting */}
      {queueCount > 0 && (
        <button
          onClick={handleFlush}
          disabled={flushState !== null}
          className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/90 backdrop-blur-sm text-black font-semibold text-sm active:scale-[0.99] transition-all disabled:opacity-70"
          style={{ minHeight: 52 }}
          aria-live="polite"
        >
          {flushState === null ? (
            <>
              <span aria-hidden="true">📶</span>
              <span>
                {lang === 'es'
                  ? `${queueCount} foto${queueCount !== 1 ? 's' : ''} esperando subir — toca para reintentar`
                  : `${queueCount} photo${queueCount !== 1 ? 's' : ''} waiting to upload — tap to retry`}
              </span>
            </>
          ) : (
            <>
              <span aria-hidden="true">⏳</span>
              <span>
                {lang === 'es'
                  ? `Subiendo… ${flushState.completed} / ${flushState.total}`
                  : `Uploading… ${flushState.completed} / ${flushState.total}`}
              </span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
