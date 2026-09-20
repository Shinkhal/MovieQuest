import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Watchlist from '@/models/watchlist';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ movies: [] }, { status: 200 });
    }

    const userId = session.user.id || session.user.email;
    await connectToDatabase();

    const userWatchlist = await Watchlist.findOne({ userId });
    return NextResponse.json({ movies: userWatchlist?.movies || [] }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch cloud watchlist:', error);
    return NextResponse.json({ movies: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id || session.user.email;
    const body = await req.json();
    const { movie, syncList } = body;

    await connectToDatabase();

    let userWatchlist = await Watchlist.findOne({ userId });
    if (!userWatchlist) {
      userWatchlist = new Watchlist({
        userId,
        userEmail: session.user.email,
        movies: [],
      });
    }

    if (syncList && Array.isArray(syncList)) {
      // Merge unique movies
      const existingIds = new Set(userWatchlist.movies.map((m: any) => m.id));
      syncList.forEach((m: any) => {
        if (!existingIds.has(m.id)) {
          userWatchlist.movies.unshift(m);
          existingIds.add(m.id);
        }
      });
    } else if (movie) {
      const exists = userWatchlist.movies.some((m: any) => m.id === movie.id);
      if (!exists) {
        userWatchlist.movies.unshift(movie);
      }
    }

    await userWatchlist.save();
    return NextResponse.json({ success: true, movies: userWatchlist.movies });
  } catch (error) {
    console.error('Failed to save to cloud watchlist:', error);
    return NextResponse.json({ error: 'Failed to update watchlist' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id || session.user.email;
    const { searchParams } = new URL(req.url);
    const movieId = Number(searchParams.get('movieId'));

    if (!movieId) {
      return NextResponse.json({ error: 'Movie ID required' }, { status: 400 });
    }

    await connectToDatabase();

    const userWatchlist = await Watchlist.findOne({ userId });
    if (userWatchlist) {
      userWatchlist.movies = userWatchlist.movies.filter((m: any) => m.id !== movieId);
      await userWatchlist.save();
    }

    return NextResponse.json({ success: true, movies: userWatchlist?.movies || [] });
  } catch (error) {
    console.error('Failed to remove from cloud watchlist:', error);
    return NextResponse.json({ error: 'Failed to delete movie' }, { status: 500 });
  }
}
