"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, PenSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define TypeScript interface for testimonial objects
interface Testimonial {
  id?: string;
  name: string;
  role: string;
  feedback: string;
  avatar: string;
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials");
        const data = await response.json();
        setTestimonials(data.testimonials);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Reusable function to render testimonial cards
  const renderTestimonialCards = (roleFilter: string) => {
    const filteredTestimonials = testimonials.filter(t => t.role === roleFilter);
    
    if (filteredTestimonials.length === 0) {
      return (
        <div className="text-center text-gray-400">
          <p>No {roleFilter} testimonials available yet.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredTestimonials.map((t, i) => (
          <Card key={i} className="bg-gray-700 border-indigo-900/20 shadow-xl">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center font-semibold text-white">
                  {t.avatar}
                </div>
                <div>
                  <CardTitle className="text-lg text-white font-bold">{t.name}</CardTitle>
                  <CardDescription className="text-emerald-300">{t.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-3">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 text-lg">{t.feedback}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Reusable function to render skeleton loading cards
  const renderSkeletonCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="bg-gray-700 border-indigo-900/20 shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full bg-indigo-600" />
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex mb-3">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="py-24 bg-gradient-to-t from-gray-900 to-indigo-950/40 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold">What Our Users Say</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Join thousands of movie enthusiasts who have transformed how they discover films
          </p>
          
          {/* Write Testimonial Button */}
          <div className="mt-8">
            <Link href="/testimonials" passHref>
              <Button 
                className="h-10 bg-gradient-to-r from-pink-700 to-red-500 hover:from-pink-800 hover:to-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
              >
                <PenSquare className="h-4 w-4" />
                Write Your Testimonial
              </Button>
            </Link>
          </div>
        </motion.div>

        <Tabs defaultValue="tab1" className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-12 text-black bg-cyan-900">
            <TabsTrigger value="tab1">Film Lovers</TabsTrigger>
            <TabsTrigger value="tab2">Casual Viewers</TabsTrigger>
            <TabsTrigger value="tab3">Film Critics</TabsTrigger>
          </TabsList>

          {/* Film Lovers Testimonials */}
          <TabsContent value="tab1" className="mt-0">
            {loading ? renderSkeletonCards() : renderTestimonialCards("Film Lover")}
          </TabsContent>

          {/* Casual Viewers Testimonials */}
          <TabsContent value="tab2" className="mt-0">
            {loading ? renderSkeletonCards() : renderTestimonialCards("Casual Viewer")}
          </TabsContent>

          {/* Film Critics Testimonials */}
          <TabsContent value="tab3" className="mt-0">
            {loading ? renderSkeletonCards() : renderTestimonialCards("Film Critic")}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}