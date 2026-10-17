import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { OMDB_API_KEY } from '../../../lib/config'

// Proxy hacia OMDb: el navegador llama a /api/omdb y aquí se agrega la API key,
// así la key no queda expuesta en el código del cliente.
const ALLOWED_PARAMS = ['s', 'i', 't', 'y', 'type', 'page', 'plot']

export async function GET(request: NextRequest) {
  const params: Record<string, string> = { apikey: OMDB_API_KEY }

  for (const key of ALLOWED_PARAMS) {
    const value = request.nextUrl.searchParams.get(key)
    if (value) params[key] = value
  }

  try {
    const response = await axios.get('https://www.omdbapi.com/', { params })
    return NextResponse.json(response.data)
  } catch {
    return NextResponse.json(
      { Response: 'False', Error: 'No se pudo conectar con OMDb' },
      { status: 502 }
    )
  }
}
