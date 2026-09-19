"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, Edit3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTestimonials, useSubmitTestimonial } from "@/lib/testimonial-api";

export default function TestimonialSection() {
  const { data: testimonials = [], isLoading } = useTestimonials();
  const submitMutation = useSubmitTestimonial();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    feedback: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.feedback) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await submitMutation.mutateAsync(formData);
      toast.success('Testimonial submitted successfully!');
      setFormData({ name: '', role: '', feedback: '' });
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to submit testimonial. Please try again.');
    }
  };

  const renderTestimonialCards = (roleFilter: string) => {
    const filteredTestimonials = testimonials.filter(t => t.role === roleFilter);

    if (filteredTestimonials.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">No {roleFilter} testimonials available yet.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((t, i) => (
          <Card key={t.id || i} className="bg-muted/50 border border-muted/20 hover:border-primary transition-colors duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground border border-muted">
                  {t.avatar}
                </div>
                <div>
                  <CardTitle className="text-base text-foreground font-medium">{t.name}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">{t.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex mb-3">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="h-3 w-3 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{t.feedback}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderSkeletonCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="bg-muted/50 border border-muted/20">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
              <div>
                <div className="h-4 w-20 bg-muted rounded animate-pulse mb-1"></div>
                <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex mb-3">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className="h-3 w-3 text-muted" />
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted rounded animate-pulse"></div>
              <div className="h-3 w-full bg-muted rounded animate-pulse"></div>
              <div className="h-3 w-2/3 bg-muted rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="py-20 bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light mb-4 text-foreground">What Our Users Say</h2>
          <div className="w-12 h-px bg-muted mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg font-light max-w-2xl mx-auto mb-8">
            Join thousands of movie enthusiasts who have transformed how they discover films
          </p>

          {/* Write Testimonial Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-muted hover:bg-muted/80 text-foreground font-light px-6 py-2 border border-muted transition-all duration-200"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Write Your Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Share Your Feedback</DialogTitle>
                <DialogDescription>
                  Your testimonial helps others make informed decisions
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="bg-background border-muted focus:border-primary"
                    disabled={submitMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-foreground">
                    Your Role <span className="text-red-400">*</span>
                  </Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-background border-muted focus:border-primary rounded-md px-3 py-2 text-foreground"
                    disabled={submitMutation.isPending}
                  >
                    <option value="">Select your role</option>
                    <option value="Film Lover">Film Lover</option>
                    <option value="Casual Viewer">Casual Viewer</option>
                    <option value="Film Critic">Film Critic</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback" className="text-sm font-medium text-foreground">
                    Your Testimonial <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="feedback"
                    value={formData.feedback}
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                    placeholder="Please share your experience..."
                    rows={5}
                    className="bg-background border-muted focus:border-primary resize-none text-foreground"
                    disabled={submitMutation.isPending}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={submitMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="bg-primary hover:bg-primary/80 text-primary-foreground"
                  >
                    {submitMutation.isPending ? 'Submitting...' : 'Submit Testimonial'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="tab1" className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-12 bg-muted border border-muted">
            <TabsTrigger
              value="tab1"
              className="text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background font-light"
            >
              Film Lovers
            </TabsTrigger>
            <TabsTrigger
              value="tab2"
              className="text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background font-light"
            >
              Casual Viewers
            </TabsTrigger>
            <TabsTrigger
              value="tab3"
              className="text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background font-light"
            >
              Film Critics
            </TabsTrigger>
          </TabsList>

          {/* Film Lovers Testimonials */}
          <TabsContent value="tab1" className="mt-0">
            {isLoading ? renderSkeletonCards() : renderTestimonialCards("Film Lover")}
          </TabsContent>

          {/* Casual Viewers Testimonials */}
          <TabsContent value="tab2" className="mt-0">
            {isLoading ? renderSkeletonCards() : renderTestimonialCards("Casual Viewer")}
          </TabsContent>

          {/* Film Critics Testimonials */}
          <TabsContent value="tab3" className="mt-0">
            {isLoading ? renderSkeletonCards() : renderTestimonialCards("Film Critic")}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}