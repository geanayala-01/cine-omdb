# 🍿 Cine Next · Galería de Películas y Series

Laboratorio 09 · Desarrollo de Aplicaciones Web Avanzado (Tecsup)

Aplicación en **Next.js 16 (App Router)** que combina **SSR** y **CSR** usando la API de [OMDb](https://www.omdbapi.com). La interfaz simula una sala de cine: marquesina con focos, pantalla, telón, canchita cayendo y cada película ubicada en una butaca (A1, A2, B1...).

## Funcionalidades

| Sección | Renderizado | Descripción |
|---|---|---|
| **Cartelera popular** (`app/page.tsx`) | SSR | 12 películas y series populares obtenidas en el servidor con `async/await` |
| **Taquilla** (`components/SearchMovies.tsx`) | CSR | Búsqueda en tiempo real con filtros por tipo y año, y paginación "Cargar más" |
| **Detalle** (`components/MovieModal.tsx`) | CSR | Modal con forma de ticket y la información completa: sinopsis, reparto, premios y calificaciones |
| **Proxy** (`app/api/omdb/route.ts`) | Servidor | Agrega la API key en el servidor para que no se exponga en el navegador |

## Justificación SSR vs CSR

**SSR en la cartelera:** la lista de populares es la misma para todos los usuarios y es lo primero que se ve. Al obtenerla en el servidor, el HTML llega con las películas ya renderizadas, la carga inicial es más rápida, se favorece el SEO y la API key nunca llega al navegador.

**CSR en la búsqueda y el detalle:** la búsqueda depende de lo que escribe cada usuario y tiene que responder al instante, sin recargar la página. Por eso esos componentes usan `'use client'`, `useState` para el texto, los filtros, los resultados, la carga y los errores, y `useEffect` para pedir los datos a `/api/omdb` mientras el usuario escribe, con una pausa de 500 ms.

## Uso de `'use client'`

Solo llevan la directiva los componentes que necesitan estado, efectos o eventos:

- `SearchMovies.tsx`: búsqueda interactiva.
- `MovieModal.tsx`: detalle; carga los datos, cierra con Escape y usa un portal.
- `PopularGrid.tsx`: recibe las películas del servidor como props y solo agrega el clic para abrir el modal.
- `PopcornRain.tsx`: la animación genera posiciones aleatorias en el navegador.

`app/page.tsx` y `lib/omdb.ts` se ejecutan en el servidor.

## Ejecutar en local

```bash
npm install
cp .env.example .env.local   # y pon tu API key de OMDb
npm run dev
```

Abrir http://localhost:3000

## Despliegue en Vercel

1. Subir el repositorio a GitHub.
2. En Vercel: **Add New → Project** e importar el repositorio.
3. Clic en **Deploy**. La app ya trae una API key por defecto en `lib/config.ts`; si quieres usar la tuya, agrégala antes en **Environment Variables** como `OMDB_API_KEY`.

## Enlaces

- Repositorio: _(pegar link)_
- Vercel: _(pegar link)_
