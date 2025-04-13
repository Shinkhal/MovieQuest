"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Search, Heart, Play, Clock, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import TestimonialSection from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Home() {
 
  const stats = [
    { name: "Movies in our database", value: "15,000+", icon: <Film className="h-6 w-6 text-indigo-400" /> },
    { name: "Genres covered", value: "30+", icon: <Search className="h-6 w-6 text-indigo-400" /> },
    { name: "Daily active users", value: "1,000+", icon: <Heart className="h-6 w-6 text-indigo-400" /> },
    { name: "Average ratings", value: "4.4/5", icon: <Star className="h-6 w-6 text-indigo-400" /> },
  ];

  const benefits = [
    {
      title: "AI-Powered Recommendations",
      description: "Our algorithm learns your preferences and suggests movies you'll love",
      icon: <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Search className="h-6 w-6 text-indigo-500" />
            </div>
    },
    {
      title: "Cross-Platform Streaming",
      description: "One click to your preferred streaming service where the movie is available",
      icon: <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Play className="h-6 w-6 text-indigo-500" />
            </div>
    },
    {
      title: "Personalized Watchlists",
      description: "Create and manage custom watchlists synced across all your devices",
      icon: <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Heart className="h-6 w-6 text-indigo-500" />
            </div>
    },
    {
      title: "Watch History",
      description: "Keep track of what you've watched and get smarter recommendations",
      icon: <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Clock className="h-6 w-6 text-indigo-500" />
            </div>
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <main className="bg-gradient-to-l from-red-900 to-blue-900 text-white">
      
      <section className="relative h-[600px] w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-indigo-950/60">
      
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="z-10 text-center px-6 max-w-4xl mx-auto space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover Your Next Favorite
            <span className="block text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 mt-2">
              MOVIE
            </span>
          </motion.h1>

          <motion.p
            className="text-lg text-gray-300 max-w-2xl mx-auto "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            MovieQuest's AI-powered platform helps you discover perfect movies based on your taste,
            mood, and available streaming services.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center "
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Link href="/search" passHref>
              <Button size="lg" className="px-8 py-6 rounded-full text-lg font-medium bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg">
                <Search className="mr-2 h-5 w-5" /> Explore Movies
              </Button>
            </Link>
            <Link href="/genres" passHref>
              <Button variant="outline" size="lg" className="px-8 py-6 rounded-full text-lg font-medium bg-gray-800 text-white border-white/20 hover:bg-green-500 hover:border-white/40 transition-all">
                <Film className="mr-2 h-5 w-5" /> Browse Genres
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="22" height="38" rx="11" stroke="white" strokeOpacity="0.3" strokeWidth="2"/>
            <motion.circle 
              cx="12" 
              cy="12" 
              r="6" 
              fill="white"
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </svg>
        </motion.div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-900 to-indigo-950/40">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {stats.map((stat) => (
              <motion.div 
                key={stat.name}
                variants={itemVariants}
                className="bg-indigo-900/20 backdrop-blur-sm rounded-xl p-6 border border-indigo-800/30 shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  {stat.icon}
                  <div>
                    <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                    <p className="text-indigo-300 text-sm">{stat.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gray-900 text-white">
      
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold">Why Choose MovieQuest?</h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with a passion for cinema to deliver the ultimate movie discovery experience.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-indigo-950/30 border border-indigo-900/20 rounded-xl p-6 hover:bg-indigo-900/20 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  {benefit.icon}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <TestimonialSection/>

      <section className="py-24 bg-gradient-to-b from-indigo-950 to-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl sm:text-5xl font-bold">Ready to Transform Your Movie Experience?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of film enthusiasts who have discovered their perfect next watch with MovieQuest
            </p>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/search" passHref>
                    <Button size="lg" className="mt-8 px-12 py-7 rounded-full text-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-900/30 hover:shadow-indigo-800/40 transition-all hover:scale-105">
                      Start Exploring Now
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>No sign-up required to start!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <p className="text-sm text-gray-400 mt-6">
              No credit card required. Begin discovering movies instantly.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}