'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, MessageSquare, Send, Sparkles, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import Image from 'next/image';

interface ReviewItem {
  _id?: string;
  id?: string;
  movieId: number;
  movieTitle: string;
  userName: string;
  userAvatar?: string;
  role?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export function MovieReviews({
  movieId,
  movieTitle,
}: {
  movieId: number;
  movieTitle: string;
}) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/reviews?movieId=${movieId}`);
      setReviews(data?.reviews || []);
    } catch (e) {
      console.error('Failed to load movie reviews:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      signIn();
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        movieId,
        movieTitle,
        rating,
        comment: comment.trim(),
      };

      const { data } = await axios.post('/api/reviews', payload);
      if (data?.success) {
        toast.success('Your review has been published!');
        setComment('');
        fetchReviews();
      }
    } catch (e) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="mt-12 border-t border-border/40 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            User Reviews & Ratings
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {reviews.length > 0
              ? `${reviews.length} community review${reviews.length > 1 ? 's' : ''} • Community score: ${averageRating} / 5.0`
              : 'Be the first to share your thoughts on this film!'}
          </p>
        </div>

        {reviews.length > 0 && averageRating && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-card border border-border/80 shadow-sm">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(Number(averageRating))
                      ? 'fill-current'
                      : 'opacity-30'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-foreground">{averageRating}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Review Submission Form */}
        <div className="lg:col-span-5">
          <Card className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md p-6 shadow-md">
            <CardHeader className="p-0 pb-4 border-b border-border/40">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Write Your Review
              </CardTitle>
            </CardHeader>

            {session?.user ? (
              <form onSubmit={handleSubmit} className="p-0 pt-4 space-y-4">
                {/* Signed-in user badge */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex-shrink-0">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 m-auto text-primary" />
                    )}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-foreground">{session.user.name}</p>
                    <p className="text-muted-foreground text-[10px]">Verified Member</p>
                  </div>
                </div>

                {/* Interactive Star Rating Selector */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Your Rating: {hoverRating || rating} / 5 Stars
                  </Label>
                  <div className="flex items-center gap-1 text-amber-500 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-125 transition-transform"
                        aria-label={`Rate ${star} star`}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= (hoverRating || rating)
                              ? 'fill-current'
                              : 'opacity-30'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment text area */}
                <div className="space-y-1.5">
                  <Label htmlFor="comment" className="text-xs font-semibold text-muted-foreground">
                    Your Thoughts on the Film *
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder="What made this film special? Direction, acting, cinematography, plot twists..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    required
                    className="rounded-xl bg-background/60 border-border/80 resize-none text-xs sm:text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm shadow-md gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? 'Publishing...' : 'Publish Review'}
                </Button>
              </form>
            ) : (
              <div className="p-0 pt-4 space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Sign in to share your thoughts and rate this film.
                </p>
                <Button
                  onClick={() => signIn()}
                  className="w-full py-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm shadow-md gap-2"
                >
                  <User className="h-3.5 w-3.5" />
                  Sign In to Review
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-5 rounded-2xl border border-border/60 bg-card/40 animate-pulse space-y-3">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-full bg-muted rounded" />
                  <div className="h-3 w-3/4 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card/30 space-y-3">
              <MessageSquare className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <h4 className="text-sm font-semibold text-foreground">No reviews yet</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Have you watched <span className="font-semibold text-foreground">{movieTitle}</span>? Be the first cinephile to leave a review!
              </p>
            </div>
          ) : (
            reviews.map((rev, idx) => (
              <Card
                key={rev._id || rev.id || idx}
                className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-amber-500/20 text-primary font-bold text-xs flex items-center justify-center border border-primary/30">
                      {rev.userAvatar && rev.userAvatar.startsWith('http') ? (
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                          <Image src={rev.userAvatar} alt={rev.userName} fill className="object-cover" />
                        </div>
                      ) : (
                        rev.userAvatar || rev.userName.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">
                        {rev.userName}
                      </h4>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {rev.role || 'Cinephile'}
                      </span>
                    </div>
                  </div>

                  {/* Rating display */}
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < rev.rating ? 'fill-current' : 'opacity-25'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  "{rev.comment}"
                </p>

                {rev.createdAt && (
                  <p className="text-[10px] text-muted-foreground text-right">
                    {new Date(rev.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
