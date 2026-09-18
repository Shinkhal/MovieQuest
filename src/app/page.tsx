"use client";
import React from "react";
import Hero from "@/components/home/Hero";
import { StatCard } from "@/components/home/StatCard";
import { BenefitCard } from "@/components/home/BenefitCard";
import TestimonialSection from "@/components/Testimonials";
import { LucideFilm, LucideSearch, LucideHeart, LucideClock, LucideStar } from "lucide-react";

export default function Home() {
  const stats = [
    { name: "Movies in our database", value: "15,000+", icon: <LucideFilm className="h-6 w-6 text-primary" /> },
    { name: "Genres covered", value: "30+", icon: <LucideSearch className="h-6 w-6 text-primary" /> },
    { name: "Daily active users", value: "1,000+", icon: <LucideHeart className="h-6 w-6 text-primary" /> },
    { name: "Average ratings", value: "4.4/5", icon: <LucideStar className="h-6 w-6 text-primary" /> },
  ];

  const benefits = [
    {
      title: "AI‑Powered Recommendations",
      description: "Our algorithm learns your preferences and suggests movies you'll love",
      icon: <LucideSearch className="h-6 w-6 text-primary" />,
    },
    {
      title: "Cross‑Platform Streaming",
      description: "One click to your preferred streaming service where the movie is available",
      icon: <LucideFilm className="h-6 w-6 text-primary" />,
    },
    {
      title: "Personalized Watchlists",
      description: "Create and manage custom watchlists synced across all your devices",
      icon: <LucideHeart className="h-6 w-6 text-primary" />,
    },
    {
      title: "Watch History",
      description: "Keep track of what you've watched and get smarter recommendations",
      icon: <LucideClock className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <main className="bg-background text-foreground">
      <Hero />
      {/* Stats section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <StatCard key={s.name} {...s} />
          ))}
        </div>
      </section>
      {/* Benefits section */}
      <section className="py-12 bg-muted">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((b) => (
            <BenefitCard key={b.title} {...b} />
          ))}
        </div>
      </section>
      <TestimonialSection />
    </main>
  );
}
