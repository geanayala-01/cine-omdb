import { connection } from 'next/server'
import { getPopularMovies } from '../lib/omdb'
import PopularGrid from '../components/PopularGrid'
import SearchMovies from '../components/SearchMovies'
import PopcornRain from '../components/PopcornRain'

// Next 16 (cacheComponents): permite que la página espere los datos del servidor
export const instant = false

function RenderBadge({ type }: { type: 'SSR' | 'CSR' }) {
  const styles =
    type === 'SSR'
      ? 'border-emerald-400/60 bg-emerald-500/15 text-emerald-300'
      : 'border-sky-400/60 bg-sky-500/15 text-sky-300'
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold tracking-wider ${styles}`}>
      {type === 'SSR' ? '⚡ SSR · Servidor' : '🔄 CSR · Navegador'}
    </span>
  )
}

export default async function Home() {
  await connection() // se renderiza en el servidor en cada petición (SSR)
  const popular = await getPopularMovies()

  return (
    <>
      <div className="curtain curtain-left hidden md:block" />
      <div className="curtain curtain-right hidden md:block" />
      <PopcornRain />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-10 md:px-[calc(5vw+1.5rem)]">
        {/* Marquesina */}
        <header className="bulbs mx-auto max-w-3xl">
          <div className="relative z-10 rounded-xl bg-gradient-to-b from-[#3a070b] to-[#1a0204] px-6 py-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-gold-soft/80">Lab 09 · Next.js</p>
            <h1 className="font-display text-6xl leading-none tracking-wider text-gold drop-shadow-[0_0_18px_rgba(245,197,24,0.6)] md:text-8xl">
              Cine Next
            </h1>
            <p className="mt-1 text-sm text-neutral-300">Galería de Películas y Series · API de OMDb</p>
          </div>
        </header>

        {/* Pantalla */}
        <div className="mx-auto mt-12 max-w-5xl [perspective:900px]">
          <div className="screen-glow rounded-[50%/14%] bg-gradient-to-b from-[#fffaf0] to-[#e9dcc4] px-6 py-8 text-center text-neutral-900 [transform:rotateX(14deg)]">
            <p className="font-display text-3xl tracking-[0.3em] md:text-5xl">🎬 Ahora en cartelera</p>
            <p className="mt-1 text-sm text-neutral-600">Elige tu butaca y haz clic para ver el detalle de la función</p>
            <nav className="mt-4 flex justify-center gap-3 text-sm font-semibold">
              <a href="#cartelera" className="rounded-full bg-neutral-900 px-4 py-2 text-white transition hover:bg-velvet">
                Cartelera
              </a>
              <a href="#taquilla" className="rounded-full bg-neutral-900 px-4 py-2 text-white transition hover:bg-velvet">
                Taquilla
              </a>
            </nav>
          </div>
        </div>

        {/* Cartelera: SSR */}
        <section id="cartelera" className="mt-16 scroll-mt-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-5xl tracking-wider text-white">⭐ Cartelera popular</h2>
              <p className="text-neutral-400">Las funciones más pedidas de la semana</p>
            </div>
            <RenderBadge type="SSR" />
          </div>

          {popular.length > 0 ? (
            <PopularGrid movies={popular} />
          ) : (
            <p className="rounded-xl bg-velvet/20 p-6 text-center text-red-200">
              No se pudo cargar la cartelera. Revisa la variable OMDB_API_KEY.
            </p>
          )}
        </section>

        {/* Taquilla: CSR */}
        <section id="taquilla" className="mt-20 scroll-mt-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-5xl tracking-wider text-white">🎟️ Taquilla</h2>
              <p className="text-neutral-400">Busca cualquier película o serie en tiempo real, sin recargar la página</p>
            </div>
            <RenderBadge type="CSR" />
          </div>
          <SearchMovies />
        </section>

        {/* Justificación */}
        <section className="mt-20 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-emerald-400/40 bg-emerald-500/10 p-6">
            <h3 className="font-display text-3xl tracking-wider text-emerald-300">⚡ ¿Por qué SSR en la cartelera?</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">
              La lista de populares es igual para todos y es lo primero que se ve, así que se obtiene en el servidor con
              async/await. El HTML llega con las películas listas, carga más rápido, sirve para el SEO y la API key de OMDb
              nunca se expone al navegador.
            </p>
          </div>
          <div className="rounded-2xl border-2 border-sky-400/40 bg-sky-500/10 p-6">
            <h3 className="font-display text-3xl tracking-wider text-sky-300">🔄 ¿Por qué CSR en la taquilla?</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">
              La búsqueda depende de lo que escribe cada usuario, así que usa &apos;use client&apos; con useState y useEffect
              para pedir los resultados desde el navegador mientras escribe, mostrarlos al instante y abrir el detalle en
              un modal sin recargar la página.
            </p>
          </div>
        </section>

        <footer className="mt-16 text-center text-xs text-neutral-500">
          🍿 Cine Next · Desarrollo de Aplicaciones Web Avanzado · Datos de OMDb API
        </footer>
      </main>
    </>
  )
}
