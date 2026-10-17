'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import SeatRows from './SeatRows'
import MovieModal from './MovieModal'
import type { MovieSummary, SearchResponse } from '../lib/types'

const TYPES = [
  { value: '', label: '🎟️ Todo' },
  { value: 'movie', label: '🎬 Películas' },
  { value: 'series', label: '📺 Series' },
]

const SUGGESTIONS = ['Batman', 'Harry Potter', 'Spider-Man', 'Friends', 'Toy Story', 'Suits']

function translateError(error?: string) {
  switch (error) {
    case 'Movie not found!':
    case 'Series not found!':
      return 'No encontramos esa función en cartelera. Prueba con otro título.'
    case 'Too many results.':
      return 'Demasiados resultados, escribe un título más específico.'
    case 'Invalid API key!':
      return 'La API key no es válida, revisa la variable OMDB_API_KEY.'
    case 'Request limit reached!':
      return 'Se acabó el límite diario de la API de OMDb.'
    default:
      return error ?? 'Ocurrió un error inesperado.'
  }
}

export default function SearchMovies() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [year, setYear] = useState('')
  const [page, setPage] = useState(1)
  const [results, setResults] = useState<MovieSummary[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const term = query.trim()
  const canSearch = term.length >= 3

  // Busca en tiempo real mientras el usuario escribe (con una pausa de 500ms)
  useEffect(() => {
    if (!canSearch) return
    let cancelled = false

    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await axios.get<SearchResponse>('/api/omdb', {
          params: { s: term, type: type || undefined, y: year || undefined, page },
        })
        if (cancelled) return

        if (data.Response === 'True' && data.Search) {
          const found = data.Search
          setResults((prev) => {
            const merged = page === 1 ? found : [...prev, ...found]
            // OMDb a veces repite resultados entre páginas
            return merged.filter((m, i, arr) => arr.findIndex((x) => x.imdbID === m.imdbID) === i)
          })
          setTotal(Number(data.totalResults ?? 0))
        } else {
          setResults([])
          setTotal(0)
          setError(translateError(data.Error))
        }
      } catch {
        if (!cancelled) setError('No se pudo conectar con el servidor.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, page === 1 ? 500 : 0)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [term, type, year, page, canSearch])

  // Cualquier cambio en los filtros vuelve a la página 1
  const updateFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value)
    setPage(1)
  }

  const closeModal = useCallback(() => setSelectedId(null), [])

  const visibleResults = canSearch ? results : []
  const hasMore = canSearch && results.length < total

  return (
    <div>
      {/* Taquilla: controles de búsqueda */}
      <div className="rounded-2xl border-2 border-gold/40 bg-gradient-to-b from-[#2a0507] to-black/80 p-5 shadow-[0_0_40px_rgba(245,197,24,0.12)] md:p-7">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔎</span>
            <input
              type="text"
              value={query}
              onChange={(e) => updateFilter(setQuery)(e.target.value)}
              placeholder="Busca una película o serie... (ej. Batman)"
              className="w-full rounded-xl border-2 border-gold/30 bg-black/60 py-4 pl-12 pr-4 text-lg text-white placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/20"
            />
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => updateFilter(setYear)(e.target.value)}
            placeholder="Año"
            min={1900}
            max={2100}
            className="w-full rounded-xl border-2 border-gold/30 bg-black/60 px-4 py-4 text-white placeholder:text-neutral-500 focus:border-gold focus:outline-none md:w-28"
          />
          <div className="flex rounded-xl border-2 border-gold/30 bg-black/60 p-1">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => updateFilter(setType)(t.value)}
                className={`flex-1 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  type === t.value ? 'bg-gold text-black' : 'text-neutral-300 hover:bg-white/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-neutral-400">Prueba con:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => updateFilter(setQuery)(s)}
              className="rounded-full border border-velvet bg-velvet/30 px-3 py-1 text-neutral-200 transition hover:bg-velvet"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados */}
      <div className="mt-8">
        {!canSearch ? (
          <div className="rounded-2xl border-2 border-dashed border-white/15 py-16 text-center">
            <p className="text-5xl">🎟️</p>
            <p className="mt-3 text-neutral-300">Escribe al menos 3 letras para buscar en la taquilla</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border-2 border-velvet bg-velvet/20 py-14 text-center">
            <p className="text-5xl">🎞️</p>
            <p className="mt-3 font-semibold text-red-200">{error}</p>
          </div>
        ) : (
          <>
            {total > 0 && (
              <p className="mb-6 text-sm text-neutral-400">
                🎬 <span className="font-semibold text-gold">{total}</span> funciones encontradas para “{term}”
              </p>
            )}

            {visibleResults.length > 0 && <SeatRows movies={visibleResults} onSelect={setSelectedId} />}

            {loading && (
              <div className="grid grid-cols-2 gap-6 pt-6 sm:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[2/3] rounded-t-[2.2rem] rounded-b-lg bg-velvet/40" />
                    <div className="mt-2 h-10 rounded-b-2xl bg-velvet/30" />
                  </div>
                ))}
              </div>
            )}

            {hasMore && !loading && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setPage(page + 1)}
                  className="rounded-full bg-gold px-8 py-3 font-display text-xl tracking-widest text-black shadow-[0_0_25px_rgba(245,197,24,0.4)] transition hover:scale-105"
                >
                  Cargar más funciones 🍿
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedId && <MovieModal key={selectedId} imdbID={selectedId} onClose={closeModal} />}
    </div>
  )
}
