import axios from 'axios'
import type { MovieDetail } from './types'
import { OMDB_API_KEY } from './config'

// Cartelera "popular": OMDb no tiene endpoint de populares, así que usamos una selección de IDs
export const POPULAR_IDS = [
  'tt15398776', // Oppenheimer
  'tt1160419', // Dune
  'tt0468569', // The Dark Knight
  'tt1375666', // Inception
  'tt0816692', // Interstellar
  'tt4154796', // Avengers: Endgame
  'tt4633694', // Spider-Man: Into the Spider-Verse
  'tt7286456', // Joker
  'tt6751668', // Parasite
  'tt0111161', // The Shawshank Redemption
  'tt0903747', // Breaking Bad
  'tt4574334', // Stranger Things
]

const OMDB_URL = 'https://www.omdbapi.com/'

// Solo se usa en el servidor (page.tsx): la API key nunca llega al navegador
export async function getMovieById(id: string): Promise<MovieDetail> {
  const response = await axios.get<MovieDetail>(OMDB_URL, {
    params: { apikey: OMDB_API_KEY, i: id },
  })
  return response.data
}

export async function getPopularMovies(): Promise<MovieDetail[]> {
  const movies = await Promise.all(POPULAR_IDS.map((id) => getMovieById(id)))
  return movies.filter((movie) => movie.Response === 'True')
}
