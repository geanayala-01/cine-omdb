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

// Una palomita suelta dibujada en SVG (nubecitas blancas con la cascarita dorada)
function PopcornKernel({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <ellipse cx="20" cy="31" rx="7" ry="4.5" fill="#d99a2b" />
      <g fill="#fffaf0" stroke="#e8d3a8" strokeWidth="1.2">
        <circle cx="13" cy="25" r="7" />
        <circle cx="27" cy="25" r="7" />
        <circle cx="14" cy="16" r="8" />
        <circle cx="26" cy="15" r="8" />
        <circle cx="20" cy="9" r="7" />
        <circle cx="20" cy="21" r="8" />
      </g>
      <circle cx="17" cy="13" r="2" fill="#ffe08a" opacity="0.8" />
      <circle cx="25" cy="22" r="1.6" fill="#ffe08a" opacity="0.8" />
    </svg>
  )
}

// Las posiciones son aleatorias, por eso se generan en el navegador (useEffect)
// y no en el servidor: así el HTML del servidor y del cliente no chocan.
export default function PopcornRain() {
  const [kernels, setKernels] = useState<Kernel[]>([])
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      const generated = Array.from({ length: 10 }, (_, id) => ({
        id,
        left: Math.random() * 100,
        size: 22 + Math.random() * 14,
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
              animationDelay: `${k.delay}s`,
              animationDuration: `${k.duration}s`,
              ['--spin' as string]: `${k.spin}deg`,
            }}
          >
            <PopcornKernel size={k.size} />
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
