"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No {roleFilter} testimonials available yet.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((t, i) => (
          <Card key={i} className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-colors duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-medium text-gray-300 border border-gray-700">
                  {t.avatar}
                </div>
                <div>
                  <CardTitle className="text-base text-gray-200 font-medium">{t.name}</CardTitle>
                  <CardDescription className="text-xs text-gray-400">{t.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex mb-3">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="h-3 w-3 text-gray-600 fill-gray-600" />
                ))}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{t.feedback}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Reusable function to render skeleton loading cards
  const renderSkeletonCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="bg-gray-900/50 border-gray-800">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse"></div>
              <div>
                <div className="h-4 w-20 bg-gray-800 rounded animate-pulse mb-1"></div>
                <div className="h-3 w-16 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex mb-3">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className="h-3 w-3 text-gray-600 fill-gray-600" />
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-800 rounded animate-pulse"></div>
              <div className="h-3 w-full bg-gray-800 rounded animate-pulse"></div>
              <div className="h-3 w-2/3 bg-gray-800 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="py-20 bg-gray-950 text-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light mb-4 text-white">What Our Users Say</h2>
          <div className="w-12 h-px bg-gray-600 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto mb-8">
            Join thousands of movie enthusiasts who have transformed how they discover films
          </p>
          
          {/* Write Testimonial Button */}
          <Button 
            className="bg-gray-800 hover:bg-gray-700 text-gray-100 font-light px-6 py-2 border border-gray-700 hover:border-gray-600 transition-all duration-200"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Write Your Testimonial
          </Button>
        </div>

        <Tabs defaultValue="tab1" className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-12 bg-gray-900 border border-gray-800">
            <TabsTrigger 
              value="tab1" 
              className="text-gray-400 data-[state=active]:text-gray-100 data-[state=active]:bg-gray-800 font-light"
            >
              Film Lovers
            </TabsTrigger>
            <TabsTrigger 
              value="tab2" 
              className="text-gray-400 data-[state=active]:text-gray-100 data-[state=active]:bg-gray-800 font-light"
            >
              Casual Viewers
            </TabsTrigger>
            <TabsTrigger 
              value="tab3" 
              className="text-gray-400 data-[state=active]:text-gray-100 data-[state=active]:bg-gray-800 font-light"
            >
              Film Critics
            </TabsTrigger>
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