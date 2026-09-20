'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MessageSquare, Star, Sparkles, Send } from "lucide-react";
import TestimonialSection from "@/components/Testimonials";
import { useSubmitTestimonial } from "@/lib/testimonial-api";

export default function TestimonialsPage() {
  const [form, setForm] = useState({
    name: '',
    role: '',
    feedback: '',
    avatar: '',
  });

  const submitMutation = useSubmitTestimonial();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      avatar: name === 'name' && value ? value.charAt(0).toUpperCase() : prev.avatar,
    }));
  };

  const handleRoleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.role || !form.feedback) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await submitMutation.mutateAsync({
        name: form.name,
        role: form.role,
        feedback: form.feedback,
        avatar: form.avatar || form.name.charAt(0).toUpperCase(),
      });
      toast.success('Thank you for sharing your feedback!');
      setForm({ name: '', role: '', feedback: '', avatar: '' });
    } catch (error) {
      toast.error('Failed to submit testimonial. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <section className="relative py-16 px-4 border-b border-border/40 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <MessageSquare className="h-3.5 w-3.5" />
            Community Voice
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            User <span className="text-primary">Reviews & Feedback</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            See what cinephiles and casual moviegoers have to say about MovieQuest.
          </p>
        </div>
      </section>

      {/* Testimonials Wall Showcase */}
      <div className="pt-8">
        <TestimonialSection />
      </div>

      {/* Submit Testimonial Card */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-12">
        <Card className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md shadow-xl overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
            <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Leave Your Testimonial
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground">
              Help us improve MovieQuest by sharing your thoughts and favorite features.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="rounded-xl bg-background/60 border-border/80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Role / Profile
                </Label>
                <Select onValueChange={handleRoleChange} value={form.role}>
                  <SelectTrigger className="rounded-xl bg-background/60 border-border/80 text-foreground">
                    <SelectValue placeholder="Select your perspective" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    <SelectItem value="Movie Critic">Movie Critic</SelectItem>
                    <SelectItem value="Casual Viewer">Casual Viewer</SelectItem>
                    <SelectItem value="Cinephile">Cinephile</SelectItem>
                    <SelectItem value="Film Student">Film Student</SelectItem>
                    <SelectItem value="Director / Filmmaker">Director / Filmmaker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Experience / Review
                </Label>
                <Textarea
                  id="feedback"
                  name="feedback"
                  placeholder="What do you love most about MovieQuest? How has it helped your film discovery?"
                  value={form.feedback}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="rounded-xl bg-background/60 border-border/80 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md gap-2"
              >
                <Send className="h-4 w-4" />
                {submitMutation.isPending ? 'Submitting...' : 'Submit Testimonial'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}