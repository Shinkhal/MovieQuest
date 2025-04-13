"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, SendHorizonal } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const target = e.target as HTMLFormElement;

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: process.env.NEXT_PUBLIC_FORM_KEY, 
        name: target.first.value,
        email: target.email.value,
        message: target.message.value,
      }),
    });

    const result = await response.json();
    setLoading(false);

    if (result.success) {
      toast.success("Thank you for contacting us!");
      target.reset();
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }

  const inputStyle =
    "border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-black dark:text-white placeholder:text-gray-500";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-cyan-800 text-white py-12 px-4 sm:px-8 md:px-16 lg:px-32">
      {/* Header */}
      <div className="mb-12 text-center space-y-2">
        <h1 className="text-5xl font-bold">Contact Us</h1>
        <p className="text-gray-300 text-lg">
          Got a question, suggestion, or collaboration idea? We’d love to hear
          from you!
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="shadow-xl bg-transparent text-white border dark:border-gray-700 rounded-xl ">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="first"
                  placeholder="Enter your name"
                  required
                  className={inputStyle}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className={inputStyle}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Write your message..."
                  rows={5}
                  required
                  className={inputStyle}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-2"
              >
                {loading ? "Sending..." : (
                  <>
                    <SendHorizonal className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </Button>
            </CardContent>
          </form>
        </Card>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 mt-20"
        >
          <div className="flex items-start gap-4">
            <Mail className="text-indigo-400 mt-1" />
            <div>
              <h3 className="font-semibold text-xl">Email</h3>
              <p className="text-gray-300 text-lg">shinkhalsinha@gmail.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="text-indigo-400 mt-1" />
            <div>
              <h3 className="font-semibold text-xl">Phone</h3>
              <p className="text-gray-300 text-lg">+91 9431063696</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="text-indigo-400 mt-1" />
            <div>
              <h3 className="font-semibold text-xl">Location</h3>
              <p className="text-gray-300 text-lg">Jalandhar, Punjab, India</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
