'use client'

import { useCallback, useState } from 'react'
import SeatRows from './SeatRows'
import MovieModal from './MovieModal'
import type { MovieSummary } from '../lib/types'

// Recibe las películas ya obtenidas en el servidor (SSR) y solo agrega
// la interactividad: abrir el modal al hacer clic en una butaca.
export default function PopularGrid({ movies }: { movies: MovieSummary[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const closeModal = useCallback(() => setSelectedId(null), [])

  return (
    <>
      <SeatRows movies={movies} onSelect={setSelectedId} />
      {selectedId && <MovieModal key={selectedId} imdbID={selectedId} onClose={closeModal} />}
    </>
  )
}
