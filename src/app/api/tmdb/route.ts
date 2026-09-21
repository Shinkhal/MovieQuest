import { NextResponse } from 'next/server';
import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(req: Request) {
  try {
    const tmdbApiKey = process.env.TMDB_API_KEY;
    if (!tmdbApiKey) {
      return NextResponse.json({ error: 'TMDB API key is not configured on server' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');

    if (!path || !path.startsWith('/')) {
      return NextResponse.json({ error: 'Valid relative path starting with / is required' }, { status: 400 });
    }

    // Build target URL
    const targetUrl = new URL(`${TMDB_BASE_URL}${path}`);
    targetUrl.searchParams.set('api_key', tmdbApiKey);

    // Forward all remaining query parameters except 'path'
    searchParams.forEach((value, key) => {
      if (key !== 'path') {
        targetUrl.searchParams.set(key, value);
      }
    });

    const { data, status } = await axios.get(targetUrl.toString(), {
      timeout: 10000,
      headers: {
        Accept: 'application/json',
      },
    });

    return NextResponse.json(data, { status });
  } catch (error: any) {
    console.error('TMDB API Proxy Error:', error?.response?.data || error?.message || error);
    const statusCode = error?.response?.status || 500;
    const errorMessage = error?.response?.data?.status_message || 'Failed to fetch data from TMDB';
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
