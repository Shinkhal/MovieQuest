import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Review from '@/models/review';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const movieId = searchParams.get('movieId');

    await connectToDatabase();

    const query = movieId ? { movieId: Number(movieId) } : {};
    const reviews = await Review.find(query).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ reviews: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { movieId, movieTitle, rating, comment, role, userName: customName } = body;

    if (!movieId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 });
    }

    await connectToDatabase();

    const userName = session?.user?.name || customName || 'Anonymous Cinephile';
    const userEmail = session?.user?.email || 'guest@moviequest.com';
    const userAvatar =
      session?.user?.image ||
      (userName ? userName.charAt(0).toUpperCase() : 'C');
    const userId = session?.user?.id || session?.user?.email || `anon_${Date.now()}`;

    const newReview = await Review.create({
      movieId: Number(movieId),
      movieTitle: movieTitle || 'Movie',
      userId,
      userName,
      userAvatar,
      userEmail,
      role: role || 'Cinephile',
      rating: Number(rating),
      comment,
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error) {
    console.error('Failed to submit review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
