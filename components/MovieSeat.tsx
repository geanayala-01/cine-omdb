import { hasPoster, type MovieSummary } from '../lib/types'

interface Props {
  movie: MovieSummary
  seat: string
  onSelect: (id: string) => void
}

// Cada película es una butaca: el póster va en el respaldo y el título en el cojín
export default function MovieSeat({ movie, seat, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(movie.imdbID)}
      className="group flex w-full flex-col items-center text-left focus:outline-none"
      aria-label={`Ver detalle de ${movie.Title}`}
    >
      {/* Respaldo */}
      <div className="relative w-full rounded-t-[2.2rem] rounded-b-lg border-2 border-velvet-dark bg-gradient-to-b from-[#b3262f] via-velvet to-velvet-dark p-2 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.55),0_10px_25px_rgba(0,0,0,0.5)] transition duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_0_35px_rgba(245,197,24,0.45)] group-focus-visible:ring-4 group-focus-visible:ring-gold">
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-[1.7rem] rounded-b-md bg-black/60">
          {/* Respaldo por si no hay póster o el enlace está roto */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center text-gold-soft/80">
            <span className="text-4xl">🎞️</span>
            <span className="text-xs">Sin póster</span>
          </div>
          {hasPoster(movie.Poster) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={movie.Poster}
              alt={movie.Title}
              loading="lazy"
              onError={(e) => (e.currentTarget.style.display = 'none')}
              className="relative h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          )}

          <span className="absolute left-2 top-2 rounded-full bg-black/75 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
            {movie.Type === 'series' ? 'Serie' : 'Película'}
          </span>

          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
            <span className="w-full rounded-md bg-gold py-1.5 text-center text-xs font-bold text-black">
              🎟️ Ver detalle
            </span>
          </div>
        </div>
      </div>

      {/* Asiento con apoyabrazos */}
      <div className="relative -mt-1 flex w-[112%] items-start">
        <div className="mt-1 h-10 w-3 shrink-0 rounded-md bg-gradient-to-b from-neutral-700 to-neutral-900 shadow-md" />
        <div className="flex h-12 flex-1 flex-col justify-center rounded-b-2xl rounded-t-md border-2 border-t-0 border-velvet-dark bg-gradient-to-b from-velvet to-velvet-dark px-2 shadow-[inset_0_6px_10px_rgba(0,0,0,0.45)]">
          <p className="truncate text-center text-xs font-semibold text-white">{movie.Title}</p>
          <p className="text-center text-[10px] text-gold-soft/80">{movie.Year}</p>
        </div>
        <div className="mt-1 h-10 w-3 shrink-0 rounded-md bg-gradient-to-b from-neutral-700 to-neutral-900 shadow-md" />
      </div>

      {/* Placa del número de butaca */}
      <span className="mt-2 rounded border border-gold/40 bg-black/60 px-2 py-0.5 font-display text-sm tracking-widest text-gold">
        {seat}
      </span>
    </button>
  )
}
