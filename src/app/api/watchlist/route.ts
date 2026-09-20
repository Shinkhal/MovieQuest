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

    if (syncList && Array.isArray(syncList)) {
      // Atomic upsert: create the document if it doesn't exist, then add each movie only if its id is not already present
      for (const m of syncList) {
        await Watchlist.findOneAndUpdate(
          { userId, 'movies.id': { $ne: m.id } },
          {
            $setOnInsert: { userEmail: session.user.email },
            $push: { movies: { $each: [m], $position: 0 } },
          },
          { upsert: true, new: true }
        ).catch(() => {
          // Ignore duplicate key errors from concurrent upserts
        });
      }
      const updated = await Watchlist.findOne({ userId });
      return NextResponse.json({ success: true, movies: updated?.movies || [] });
    } else if (movie) {
      // Atomic add: only push if the movie id isn't already in the array
      const result = await Watchlist.findOneAndUpdate(
        { userId, 'movies.id': { $ne: movie.id } },
        {
          $setOnInsert: { userEmail: session.user.email },
          $push: { movies: { $each: [movie], $position: 0 } },
        },
        { upsert: true, new: true }
      );
      return NextResponse.json({ success: true, movies: result?.movies || [] });
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

