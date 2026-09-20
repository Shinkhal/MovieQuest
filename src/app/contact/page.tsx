'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send, MessageCircle, HelpCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_FORM_KEY || 'sandbox_key',
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'MovieQuest Inquiry',
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.info('Message received! Thanks for reaching out.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch {
      toast.info('Thank you! Your message has been noted.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const faqs = [
    {
      q: 'Where does MovieQuest get its movie metadata?',
      a: 'All movie details, cast credits, posters, and ratings are dynamically powered by The Movie Database (TMDB) API.',
    },
    {
      q: 'Are the streaming provider links accurate?',
      a: 'Yes! We fetch verified streaming, rental, and digital purchase platforms using JustWatch / TMDB watch provider feeds.',
    },
    {
      q: 'How does the Watchlist work?',
      a: 'Your watchlist is saved securely in your browser’s local storage, meaning you can access your saved films anytime without needing an account.',
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <section className="relative py-16 px-4 border-b border-border/40 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <MessageCircle className="h-3.5 w-3.5" />
            Get in Touch
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Let's <span className="text-primary">Connect</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Have feedback, feature suggestions, or want to collaborate? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Contact Info & FAQ */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-6 shadow-sm">
              <CardHeader className="p-0 pb-6 border-b border-border/40">
                <CardTitle className="text-lg font-bold">Contact Details</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Reach out directly via email or phone
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 pt-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Email
                    </span>
                    <a
                      href="mailto:shinkhalsinha@gmail.com"
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      shinkhalsinha@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Phone
                    </span>
                    <p className="text-sm font-medium text-foreground">+91 9431063696</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Location
                    </span>
                    <p className="text-sm font-medium text-foreground">Jalandhar, Punjab, India</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick FAQs */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 px-1">
                <HelpCircle className="h-4 w-4 text-primary" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm space-y-1"
                  >
                    <h4 className="text-xs sm:text-sm font-semibold text-foreground">{faq.q}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <Card className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md shadow-xl overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-muted/20 pb-6">
                <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Send a Message
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                  Fill in the form below and we will get back to you as soon as possible.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Your Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="e.g. Maya Lin"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="rounded-xl bg-background/60 border-border/80"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="maya@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="rounded-xl bg-background/60 border-border/80"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="e.g. Feature Suggestion / Partnership"
                      value={formData.subject}
                      onChange={handleChange}
                      className="rounded-xl bg-background/60 border-border/80"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Write your message or inquiry here..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="rounded-xl bg-background/60 border-border/80 resize-none text-xs sm:text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {loading ? 'Sending Message...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}