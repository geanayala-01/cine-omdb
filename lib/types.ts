// Resultado corto que devuelve la búsqueda (?s=)
export interface MovieSummary {
  imdbID: string
  Title: string
  Year: string
  Type: 'movie' | 'series' | 'episode' | string
  Poster: string
}

// Detalle completo que devuelve la búsqueda por id (?i=)
export interface MovieDetail extends MovieSummary {
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Ratings: Array<{ Source: string; Value: string }>
  Metascore: string
  imdbRating: string
  imdbVotes: string
  BoxOffice?: string
  totalSeasons?: string
  Response: 'True' | 'False'
  Error?: string
}

export interface SearchResponse {
  Search?: MovieSummary[]
  totalResults?: string
  Response: 'True' | 'False'
  Error?: string
}

export const hasPoster = (poster?: string) => !!poster && poster !== 'N/A'
