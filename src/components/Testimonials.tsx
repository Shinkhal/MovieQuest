'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star, Edit3, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useTestimonials, useSubmitTestimonial } from '@/lib/testimonial-api';

const DEFAULT_TESTIMONIALS = [
  {
    id: 'd1',
    name: 'Sarah Jenkins',
    role: 'Film Lover',
    avatar: 'S',
    feedback:
      'MovieQuest has completely transformed our weekend movie nights. The genre breakdowns and streaming provider direct links save us at least 20 minutes of endless scrolling!',
  },
  {
    id: 'd2',
    name: 'David Chen',
    role: 'Film Lover',
    avatar: 'D',
    feedback:
      'The UI is lightning fast and gorgeous in dark mode. The trailer player and similar movies carousel make discovery effortless.',
  },
  {
    id: 'd3',
    name: 'Emma Watson',
    role: 'Casual Viewer',
    avatar: 'E',
    feedback:
      'I love the simple watchlists! Whenever a friend mentions a good film, I just search it here and save it in one click.',
  },
  {
    id: 'd4',
    name: 'Marcus Brody',
    role: 'Casual Viewer',
    avatar: 'M',
    feedback:
      'Clean interface, no intrusive ads, and the where-to-watch feature is spot on. Hands down the best movie companion web app.',
  },
  {
    id: 'd5',
    name: 'Dr. Evelyn Vance',
    role: 'Film Critic',
    avatar: 'E',
    feedback:
      'Impressive depth of metadata. Having director credits, budget, box office revenue, and high-resolution backdrops organized so neatly is a cinephile’s dream.',
  },
  {
    id: 'd6',
    name: 'Liam Gallagher',
    role: 'Film Critic',
    avatar: 'L',
    feedback:
      'Accurate ratings, comprehensive cast listings, and seamless navigation. A truly modern alternative to cluttered legacy movie databases.',
  },
];

export default function TestimonialSection() {
  const { data: fetchedTestimonials = [], isLoading } = useTestimonials();
  const submitMutation = useSubmitTestimonial();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Film Lover',
    feedback: '',
  });

  const testimonials =
    fetchedTestimonials.length > 0
      ? [...fetchedTestimonials, ...DEFAULT_TESTIMONIALS]
      : DEFAULT_TESTIMONIALS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.feedback) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await submitMutation.mutateAsync({
        name: formData.name,
        role: formData.role,
        feedback: formData.feedback,
        avatar: formData.name.charAt(0).toUpperCase(),
      });
      toast.success('Testimonial submitted successfully!');
      setFormData({ name: '', role: 'Film Lover', feedback: '' });
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to submit testimonial. Please try again.');
    }
  };

  const renderTestimonialCards = (roleFilter: string) => {
    const filteredTestimonials = testimonials.filter(
      (t) =>
        t.role.toLowerCase().includes(roleFilter.toLowerCase()) ||
        (roleFilter === 'Film Lover' && (t.role === 'Cinephile' || t.role === 'Film Lover'))
    );

    if (filteredTestimonials.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">
            No {roleFilter} testimonials available yet. Be the first to add one!
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((t, i) => (
          <Card
            key={t.id || i}
            className="rounded-2xl border border-border/60 bg-card/60 hover:bg-card/90 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl shadow-sm flex flex-col justify-between"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-amber-500/20 text-primary flex items-center justify-center text-sm font-bold border border-primary/30 shadow-inner">
                  {t.avatar || t.name.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-sm sm:text-base text-foreground font-bold">
                    {t.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground font-medium">
                    {t.role}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed italic">
                "{t.feedback}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-background text-foreground border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <MessageSquare className="h-3.5 w-3.5" />
            Loved by Moviegoers
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            What Our Community Says
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Join thousands of movie buffs who have transformed how they discover and watch films.
          </p>

          <div className="pt-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md gap-2">
                  <Edit3 className="h-4 w-4" />
                  Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-card border border-border rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Share Your Feedback
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Your review helps others discover great films and informs our development roadmap.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="rounded-xl bg-background border-border/80"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="role" className="text-xs font-semibold text-muted-foreground">
                      Role / Profile *
                    </Label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-background border border-border/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-foreground outline-none focus:border-primary"
                    >
                      <option value="Film Lover">Film Lover</option>
                      <option value="Casual Viewer">Casual Viewer</option>
                      <option value="Film Critic">Film Critic</option>
                      <option value="Cinephile">Cinephile</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="feedback" className="text-xs font-semibold text-muted-foreground">
                      Your Testimonial *
                    </Label>
                    <Textarea
                      id="feedback"
                      value={formData.feedback}
                      onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                      placeholder="What do you love about MovieQuest?"
                      rows={4}
                      className="rounded-xl bg-background border-border/80 resize-none text-xs sm:text-sm"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                      {submitMutation.isPending ? 'Submitting...' : 'Submit'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs for Filtering Categories */}
        <Tabs defaultValue="tab1" className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-10 bg-muted/60 border border-border/60 rounded-xl p-1">
            <TabsTrigger
              value="tab1"
              className="rounded-lg text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Film Lovers
            </TabsTrigger>
            <TabsTrigger
              value="tab2"
              className="rounded-lg text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Casual Viewers
            </TabsTrigger>
            <TabsTrigger
              value="tab3"
              className="rounded-lg text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Film Critics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tab1" className="mt-0">
            {renderTestimonialCards('Film Lover')}
          </TabsContent>
          <TabsContent value="tab2" className="mt-0">
            {renderTestimonialCards('Casual Viewer')}
          </TabsContent>
          <TabsContent value="tab3" className="mt-0">
            {renderTestimonialCards('Film Critic')}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}