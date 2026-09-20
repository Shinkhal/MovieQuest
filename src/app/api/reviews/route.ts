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
    // Exclude userEmail from public reviews response for privacy
    const reviews = await Review.find(query)
      .select('-userEmail')
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ reviews: [] }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required to submit reviews' }, { status: 401 });
    }

    const body = await req.json();
    const { movieId, movieTitle, rating, comment } = body;

    const numRating = Number(rating);
    if (!movieId || isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { error: 'Valid rating between 1 and 5 is required' },
        { status: 400 }
      );
    }

    const trimmedComment = typeof comment === 'string' ? comment.trim() : '';
    if (!trimmedComment || trimmedComment.length < 3 || trimmedComment.length > 1000) {
      return NextResponse.json(
        { error: 'Review comment must be between 3 and 1000 characters' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const userName = session.user.name || 'Cinephile';
    const userEmail = session.user.email || '';
    const userAvatar =
      session.user.image ||
      (userName ? userName.charAt(0).toUpperCase() : 'C');
    const userId = session.user.id || session.user.email;

    const newReview = await Review.create({
      movieId: Number(movieId),
      movieTitle: typeof movieTitle === 'string' ? movieTitle.slice(0, 200) : 'Movie',
      userId,
      userName: userName.slice(0, 50),
      userAvatar,
      userEmail,
      role: 'Cinephile',
      rating: numRating,
      comment: trimmedComment,
    });

    const reviewObj = newReview.toObject();
    delete reviewObj.userEmail;

    return NextResponse.json({ success: true, review: reviewObj }, { status: 201 });
  } catch (error) {
    console.error('Failed to submit review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
