'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import axios from 'axios'
import { hasPoster, type MovieDetail } from '../lib/types'

interface Props {
  imdbID: string
  onClose: () => void
}

// Convierte "8.4/10", "94%" o "74/100" a un porcentaje para la barra
function ratingToPercent(value: string) {
  if (value.endsWith('%')) return parseFloat(value)
  const [score, max] = value.split('/').map(parseFloat)
  return max ? (score / max) * 100 : 0
}

const show = (value?: string) => value && value !== 'N/A'

export default function MovieModal({ imdbID, onClose }: Props) {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Trae el detalle completo cuando se abre el modal
  useEffect(() => {
    let cancelled = false
    const fetchDetail = async () => {
      try {
        const { data } = await axios.get<MovieDetail>('/api/omdb', {
          params: { i: imdbID, plot: 'full' },
        })
        if (cancelled) return
        if (data.Response === 'True') setMovie(data)
        else setError(data.Error ?? 'No se encontró la película')
      } catch {
        if (!cancelled) setError('No se pudo cargar el detalle')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchDetail()
    return () => {
      cancelled = true
    }
  }, [imdbID])

  // Cerrar con Escape y bloquear el scroll del fondo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Portal al <body> para que el modal quede encima del telón y la canchita
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="ticket-in relative flex max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-ticket text-neutral-900 shadow-[0_0_80px_rgba(245,197,24,0.25)]"
      >
        {/* Cuerpo del ticket */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-lg text-white transition hover:scale-110 hover:bg-velvet sm:right-[calc(7rem+1rem)]"
            aria-label="Cerrar"
          >
            ✕
          </button>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24">
              <span className="animate-bounce text-6xl">🍿</span>
              <p className="font-display text-2xl tracking-widest text-velvet">Preparando la función...</p>
            </div>
          ) : error || !movie ? (
            <div className="py-24 text-center">
              <p className="text-5xl">🎞️</p>
              <p className="mt-3 font-semibold text-velvet">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="mx-auto w-48 shrink-0 md:w-60">
                {hasPoster(movie.Poster) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-full rounded-xl border-4 border-neutral-900 shadow-xl"
                  />
                ) : (
                  <div className="flex aspect-[2/3] items-center justify-center rounded-xl bg-neutral-900 text-5xl">🎞️</div>
                )}
                {show(movie.imdbRating) && (
                  <div className="mt-4 rounded-xl bg-neutral-900 p-3 text-center text-white">
                    <p className="font-display text-4xl text-gold">⭐ {movie.imdbRating}</p>
                    <p className="text-xs text-neutral-400">{movie.imdbVotes} votos en IMDb</p>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 pr-0 sm:pr-10">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-velvet">
                  {movie.Type === 'series' ? 'Serie' : 'Película'} · {movie.Year}
                </p>
                <h2 className="mt-1 font-display text-5xl leading-none tracking-wide md:text-6xl">{movie.Title}</h2>

                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  {show(movie.Rated) && <span className="rounded border-2 border-neutral-900 px-2 py-0.5">{movie.Rated}</span>}
                  {show(movie.Runtime) && <span className="rounded bg-neutral-900 px-2 py-0.5 text-white">⏱ {movie.Runtime}</span>}
                  {show(movie.totalSeasons) && <span className="rounded bg-neutral-900 px-2 py-0.5 text-white">📺 {movie.totalSeasons} temporadas</span>}
                  {show(movie.Released) && <span className="rounded bg-neutral-900 px-2 py-0.5 text-white">📅 {movie.Released}</span>}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {movie.Genre.split(', ').map((genre) => (
                    <span key={genre} className="rounded-full bg-velvet px-3 py-1 text-xs font-semibold text-white">
                      {genre}
                    </span>
                  ))}
                </div>

                {show(movie.Plot) && <p className="mt-5 leading-relaxed text-neutral-700">{movie.Plot}</p>}

                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  {[
                    ['🎬 Director', movie.Director],
                    ['✍️ Guion', movie.Writer],
                    ['🎭 Reparto', movie.Actors],
                    ['🌎 País', movie.Country],
                    ['🗣️ Idioma', movie.Language],
                    ['💰 Taquilla', movie.BoxOffice],
                  ]
                    .filter(([, value]) => show(value))
                    .map(([label, value]) => (
                      <div key={label} className="rounded-lg border border-neutral-900/15 bg-white/60 p-3">
                        <dt className="text-xs font-bold uppercase text-neutral-500">{label}</dt>
                        <dd className="mt-0.5 font-medium">{value}</dd>
                      </div>
                    ))}
                </dl>

                {show(movie.Awards) && (
                  <p className="mt-4 rounded-lg bg-gold/30 p-3 text-sm font-medium">🏆 {movie.Awards}</p>
                )}

                {movie.Ratings?.length > 0 && (
                  <div className="mt-5 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Calificaciones</p>
                    {movie.Ratings.map((rating) => (
                      <div key={rating.Source}>
                        <div className="flex justify-between text-sm font-semibold">
                          <span>{rating.Source}</span>
                          <span>{rating.Value}</span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-neutral-300">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-velvet to-gold"
                            style={{ width: `${ratingToPercent(rating.Value)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Talón del ticket */}
        <div className="relative hidden w-28 shrink-0 flex-col items-center justify-center border-l-4 border-dashed border-neutral-900/30 bg-gold sm:flex">
          <span className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-black" />
          <span className="absolute -bottom-4 -left-4 h-8 w-8 rounded-full bg-black" />
          <p className="rotate-90 whitespace-nowrap font-display text-4xl tracking-[0.3em] text-neutral-900">
            ADMIT ONE
          </p>
          <p className="absolute bottom-6 font-mono text-[10px] text-neutral-800">{imdbID}</p>
        </div>
      </div>
    </div>,
    document.body
  )
}
