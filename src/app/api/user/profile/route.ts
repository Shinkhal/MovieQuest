import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import UserProfile from "@/models/userProfile";
import Watchlist from "@/models/watchlist";
import Review from "@/models/review";

function calculateRank(watchlistCount: number, reviewCount: number): string {
  const totalActivity = watchlistCount + reviewCount * 2;
  if (totalActivity >= 25) return "Cinema Virtuoso 🌟";
  if (totalActivity >= 12) return "Cinema Connoisseur 🎬";
  if (totalActivity >= 4) return "Dedicated Cinephile 🍿";
  return "Novice Filmgoer 🎟️";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get("userId") || searchParams.get("id");

    await connectToDatabase();

    let targetUserId: string | null = queryUserId;
    let isOwner = false;

    if (!targetUserId) {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      targetUserId = (session.user.id || session.user.email) ?? null;
      isOwner = true;
    } else {
      const session = await auth();
      if (session?.user && (session.user.id === targetUserId || session.user.email === targetUserId)) {
        isOwner = true;
      }
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Find profile
    let profile = await UserProfile.findOne({ userId: targetUserId });

    // If profile doesn't exist and requesting own profile, create default
    if (!profile && isOwner) {
      const session = await auth();
      profile = await UserProfile.create({
        userId: targetUserId,
        name: session?.user?.name || "Film Buff",
        email: session?.user?.email || "",
        image: session?.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(targetUserId)}`,
        bio: "Passionate film explorer and cinema enthusiast on MovieQuest.",
        favoriteMovie: "Interstellar (2014)",
        favoriteGenres: ["Sci-Fi", "Drama", "Mystery"],
        rankBadge: "Dedicated Cinephile 🍿",
        isPublic: true,
      });
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // If viewing someone else's private profile
    if (!isOwner && profile.isPublic === false) {
      return NextResponse.json({ error: "This profile is private." }, { status: 403 });
    }

    // Fetch live user statistics
    const watchlist = await Watchlist.findOne({ userId: targetUserId });
    const moviesCount = watchlist?.movies?.length || 0;

    const userReviews = await Review.find({ userId: targetUserId }).sort({ createdAt: -1 });
    const reviewCount = userReviews.length;
    const avgRating =
      reviewCount > 0
        ? Number(
            (
              userReviews.reduce((acc: number, r: { rating: number }) => acc + (r.rating || 0), 0) /
              reviewCount
            ).toFixed(1)
          )
        : 0;

    const dynamicRank = calculateRank(moviesCount, reviewCount);

    return NextResponse.json({
      profile: {
        ...profile.toObject(),
        rankBadge: dynamicRank,
      },
      stats: {
        watchlistCount: moviesCount,
        reviewCount,
        averageRating: avgRating,
      },
      recentReviews: userReviews.slice(0, 10),
      watchlistMovies: (isOwner || profile.isPublic) ? watchlist?.movies || [] : [],
      isOwner,
    });
  } catch (error: any) {
    console.error("Profile API GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id || session.user.email;
    if (!userId) {
      return NextResponse.json({ error: "Invalid user session" }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      bio,
      favoriteMovie,
      favoriteGenres,
      twitterUsername,
      letterboxdUsername,
      isPublic,
      image,
    } = body;

    await connectToDatabase();

    // Check stats to recalculate rank
    const watchlist = await Watchlist.findOne({ userId });
    const moviesCount = watchlist?.movies?.length || 0;
    const reviewCount = await Review.countDocuments({ userId });
    const rankBadge = calculateRank(moviesCount, reviewCount);

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      {
        $set: {
          name: name || session.user.name || "Film Buff",
          email: session.user.email,
          image: image || session.user.image,
          bio: typeof bio === "string" ? bio.slice(0, 300) : "",
          favoriteMovie: typeof favoriteMovie === "string" ? favoriteMovie.slice(0, 100) : "",
          favoriteGenres: Array.isArray(favoriteGenres) ? favoriteGenres.slice(0, 6) : [],
          twitterUsername: typeof twitterUsername === "string" ? twitterUsername.replace(/^@/, "").trim() : "",
          letterboxdUsername: typeof letterboxdUsername === "string" ? letterboxdUsername.trim() : "",
          isPublic: isPublic !== false,
          rankBadge,
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error("Profile API POST error:", error);
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 }
    );
  }
}
