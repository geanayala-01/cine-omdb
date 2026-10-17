import MovieSeat from './MovieSeat'
import type { MovieSummary } from '../lib/types'

const SEATS_PER_ROW = 6
const ROW_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

interface Props {
  movies: MovieSummary[]
  onSelect: (id: string) => void
}

// Acomoda las películas en filas de butacas (A, B, C...) como en una sala de cine
export default function SeatRows({ movies, onSelect }: Props) {
  const rows: MovieSummary[][] = []
  for (let i = 0; i < movies.length; i += SEATS_PER_ROW) {
    rows.push(movies.slice(i, i + SEATS_PER_ROW))
  }

  return (
    <div className="space-y-10">
      {rows.map((row, rowIndex) => {
        const letter = ROW_LETTERS[rowIndex % ROW_LETTERS.length]
        return (
          <div key={letter + rowIndex} className="relative border-b-4 border-black/40 pb-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold bg-black/60 font-display text-xl text-gold shadow-[0_0_14px_rgba(245,197,24,0.4)]">
                {letter}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-gold/50 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
              {row.map((movie, seatIndex) => (
                <MovieSeat
                  key={movie.imdbID}
                  movie={movie}
                  seat={`${letter}${seatIndex + 1}`}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
