// API key de OMDb. Si existe la variable de entorno OMDB_API_KEY se usa esa;
// si no, se usa la key de ejemplo del laboratorio. Solo se lee en el servidor.
export const OMDB_API_KEY = process.env.OMDB_API_KEY || 'f1def80d'
