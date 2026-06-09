import { useState, useRef, useEffect, useCallback } from 'react'

export default function Camera({ lang, t, onCapture, onBack }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [countdown, setCountdown] = useState(null)   // null | 10..1 | 0
  const [snapped, setSnapped] = useState(false)
  const [previewSrc, setPreviewSrc] = useState(null)

  const startCamera = useCallback(async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
          setCameraReady(true)
        }
      }
    } catch (err) {
      console.error('Camera error:', err)
      setCameraError(err.message || 'Camera unavailable')
    }
  }, [])

  useEffect(() => {
    startCamera()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [startCamera])

  const snapPhoto = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const vw = video.videoWidth || 1920
    const vh = video.videoHeight || 1080

    // Crop to 4:3
    let sw = vw
    let sh = Math.round(vw * 3 / 4)
    let sx = 0
    let sy = Math.round((vh - sh) / 2)
    if (sh > vh) {
      sh = vh
      sw = Math.round(vh * 4 / 3)
      sx = Math.round((vw - sw) / 2)
      sy = 0
    }

    canvas.width = sw
    canvas.height = sh
    const ctx = canvas.getContext('2d')
    // Mirror for selfie
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(video, sx, sy, sw, sh, -sw, 0, sw, sh)
    ctx.restore()

    const base64 = canvas.toDataURL('image/jpeg', 0.92)
    setPreviewSrc(base64)
    setSnapped(true)
  }, [])

  const startCountdown = () => {
    if (countdown !== null || snapped) return
    setCountdown(10)
  }

  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      snapPhoto()
      setCountdown(null)
      return
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown, snapPhoto])

  const handleRetake = () => {
    setSnapped(false)
    setPreviewSrc(null)
    setCountdown(null)
  }

  const handleUse = () => {
    if (previewSrc) onCapture(previewSrc)
  }

  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-[#0A0A0A]">
      {/* Hidden canvas for snapshot */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="flex items-center px-8 pt-8 pb-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="text-white/50 text-2xl font-medium active:text-white transition-colors px-2 py-2"
          style={{ minHeight: 56 }}
        >
          ← {t('Volver', 'Back')}
        </button>
        <h1 className="text-3xl font-bold text-white ml-auto mr-auto pr-20">
          {snapped ? t('¿Te gusta?', 'Happy with it?') : t('Toma tu foto', 'Take your photo')}
        </h1>
      </div>

      {/* Camera / Preview area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
        <div className="relative rounded-3xl overflow-hidden bg-black/50 border border-white/10" style={{ aspectRatio: '4/3', maxHeight: '60vh', width: '100%', maxWidth: '720px' }}>
          {/* Live video — always rendered so stream stays alive */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover scale-x-[-1] ${snapped ? 'hidden' : 'block'}`}
          />
          {/* Snap preview */}
          {snapped && previewSrc && (
            <img src={previewSrc} alt="snapshot" className="w-full h-full object-cover" />
          )}

          {/* Camera not ready overlay */}
          {!cameraReady && !cameraError && !snapped && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
              <div className="text-white/50 text-2xl animate-pulse">{t('Iniciando cámara...', 'Starting camera...')}</div>
            </div>
          )}

          {/* Error overlay */}
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-4 p-8">
              <span className="text-5xl">📷</span>
              <p className="text-white/70 text-xl text-center">{t('No se pudo acceder a la cámara.', 'Could not access camera.')}</p>
              <button onClick={startCamera} className="px-8 py-3 rounded-full bg-brand-violet text-white text-xl font-semibold active:scale-95">
                {t('Reintentar', 'Retry')}
              </button>
            </div>
          )}

          {/* Countdown overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span
                key={countdown}
                className="text-[160px] font-black text-white leading-none animate-countdown"
              >
                {countdown === 0 ? '📸' : countdown}
              </span>
            </div>
          )}
        </div>

        {/* Hint text */}
        {!snapped && cameraReady && countdown === null && (
          <p className="text-white/40 text-xl mt-4 text-center">
            {t('Toca el botón para el conteo regresivo', 'Tap the button for countdown')}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex-shrink-0 px-8 pb-10 pt-4 flex gap-5 justify-center">
        {!snapped ? (
          <button
            onClick={startCountdown}
            disabled={!cameraReady || countdown !== null}
            className={`
              w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl transition-all active:scale-90
              ${cameraReady && countdown === null
                ? 'bg-gradient-to-br from-brand-violet to-brand-magenta shadow-brand-violet/40'
                : 'bg-white/10 cursor-not-allowed'
              }
            `}
            aria-label={t('Capturar', 'Capture')}
          >
            📸
          </button>
        ) : (
          <>
            <button
              onClick={handleRetake}
              className="flex-1 py-6 rounded-full text-2xl font-bold text-white bg-white/10 border border-white/20 active:scale-95 transition-all"
              style={{ minHeight: 80 }}
            >
              {t('Repetir', 'Retake')}
            </button>
            <button
              onClick={handleUse}
              className="flex-1 py-6 rounded-full text-2xl font-bold text-white bg-gradient-to-r from-brand-violet to-brand-magenta shadow-lg shadow-brand-violet/30 active:scale-95 transition-all"
              style={{ minHeight: 80 }}
            >
              {t('Usar esta ✓', 'Use this ✓')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
