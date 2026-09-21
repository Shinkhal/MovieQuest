export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count?: number;
  overview: string;
  release_date: string;
  genre_ids?: number[];
  popularity: number;
  // optional extended fields for detail page
  runtime?: number;
  genres?: { id: number; name: string }[];
  status?: string;
  tagline?: string;
  budget?: number;
  revenue?: number;
  spoken_languages?: { english_name: string; iso_639_1: string; name: string }[];
  production_companies?: { id: number; name: string; logo_path: string | null; origin_country: string }[];
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string; department: string; profile_path: string | null }[];
  };
  watch_providers?: {
    results?: {
      [countryCode: string]: {
        link?: string;
        flatrate?: { provider_id: number; provider_name: string; logo_path: string | null }[];
        rent?: { provider_id: number; provider_name: string; logo_path: string | null }[];
        buy?: { provider_id: number; provider_name: string; logo_path: string | null }[];
      };
    };
  };
  videos?: { results: { id: string; key: string; name: string; site: string; type: string; official: boolean }[] };
  similar?: { results: Movie[] };
  recommendations?: { results: Movie[] };
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
