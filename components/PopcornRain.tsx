'use client'

import { useEffect, useState } from 'react'

interface Kernel {
  id: number
  left: number
  size: number
  delay: number
  duration: number
  spin: number
}

// Las posiciones son aleatorias, por eso se generan en el navegador (useEffect)
// y no en el servidor: así el HTML del servidor y del cliente no chocan.
export default function PopcornRain() {
  const [kernels, setKernels] = useState<Kernel[]>([])
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      const generated = Array.from({ length: 22 }, (_, id) => ({
        id,
        left: Math.random() * 100,
        size: 18 + Math.random() * 20,
        delay: Math.random() * -14,
        duration: 8 + Math.random() * 8,
        spin: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360),
      }))
      setKernels(generated)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {enabled &&
        kernels.map((k) => (
          <span
            key={k.id}
            aria-hidden
            className="popcorn"
            style={{
              left: `${k.left}%`,
              fontSize: k.size,
              animationDelay: `${k.delay}s`,
              animationDuration: `${k.duration}s`,
              ['--spin' as string]: `${k.spin}deg`,
            }}
          >
            🍿
          </span>
        ))}

      <button
        onClick={() => setEnabled(!enabled)}
        className="fixed bottom-5 right-[calc(5vw+1rem)] z-40 rounded-full border-2 border-gold/60 bg-black/70 px-4 py-2 text-sm font-semibold text-gold-soft shadow-lg backdrop-blur transition hover:scale-105 hover:border-gold"
      >
        {enabled ? '🍿 Pausar canchita' : '🍿 Soltar canchita'}
      </button>
    </>
  )
}
