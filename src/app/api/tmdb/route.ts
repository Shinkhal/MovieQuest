import { NextResponse } from 'next/server';
import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const ALLOWED_PATH_PATTERNS = [
  /^\/genre\/movie\/list$/,
  /^\/trending\/movie\/(week|day)$/,
  /^\/movie\/(top_rated|now_playing|popular)$/,
  /^\/search\/movie$/,
  /^\/discover\/movie$/,
  /^\/movie\/\d+$/,
];

const ALLOWED_PARAMS = new Set([
  'page',
  'query',
  'with_genres',
  'sort_by',
  'include_adult',
  'append_to_response',
  'language',
  'vote_count.gte',
]);

export async function GET(req: Request) {
  try {
    const tmdbApiKey = process.env.TMDB_API_KEY;
    if (!tmdbApiKey) {
      return NextResponse.json({ error: 'TMDB API key is not configured on server' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    // Validate path against permitted endpoints
    const isAllowed = ALLOWED_PATH_PATTERNS.some((pattern) => pattern.test(path));
    if (!isAllowed) {
      return NextResponse.json({ error: 'Access to this TMDB endpoint is forbidden' }, { status: 403 });
    }

    // Build target URL
    const targetUrl = new URL(`${TMDB_BASE_URL}${path}`);

    // Forward ONLY allowed parameters, strictly ignoring client-supplied api_key or unknown params
    searchParams.forEach((value, key) => {
      if (ALLOWED_PARAMS.has(key)) {
        targetUrl.searchParams.set(key, value);
      }
    });

    // Server-enforced API key is set last and cannot be overridden by client
    targetUrl.searchParams.set('api_key', tmdbApiKey);

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
