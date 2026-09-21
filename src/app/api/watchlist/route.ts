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
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 });
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

    // First ensure the base user watchlist document exists without conditional movie criteria
    await Watchlist.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, userEmail: session.user.email, movies: [] } },
      { upsert: true, new: true }
    );

    if (syncList && Array.isArray(syncList)) {
      // Add each movie only if its id is not already in the array
      for (const m of syncList) {
        if (!m || !m.id) continue;
        await Watchlist.findOneAndUpdate(
          { userId, 'movies.id': { $ne: m.id } },
          { $push: { movies: { $each: [m], $position: 0 } } }
        );
      }
      const updated = await Watchlist.findOne({ userId });
      return NextResponse.json({ success: true, movies: updated?.movies || [] });
    } else if (movie && movie.id) {
      // Atomic add: only push if the movie id isn't already in the array
      const result = await Watchlist.findOneAndUpdate(
        { userId, 'movies.id': { $ne: movie.id } },
        { $push: { movies: { $each: [movie], $position: 0 } } },
        { new: true }
      );
      if (!result) {
        // Movie already existed in the watchlist; return existing list
        const existing = await Watchlist.findOne({ userId });
        return NextResponse.json({ success: true, movies: existing?.movies || [] });
      }
      return NextResponse.json({ success: true, movies: result.movies || [] });
    }

    return NextResponse.json({ error: 'No movie data provided' }, { status: 400 });
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

    // Atomic pull: remove the movie from the array in a single operation
    const result = await Watchlist.findOneAndUpdate(
      { userId },
      { $pull: { movies: { id: movieId } } },
      { new: true }
    );

    return NextResponse.json({ success: true, movies: result?.movies || [] });
  } catch (error) {
    console.error('Failed to remove from cloud watchlist:', error);
    return NextResponse.json({ error: 'Failed to delete movie' }, { status: 500 });
  }
}

