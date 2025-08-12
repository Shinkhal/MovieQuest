"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_FORM_KEY,
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert("Thank you for contacting us!");
        e.target.reset();
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
    
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light mb-4 text-white">Contact</h1>
          <div className="w-12 h-px bg-gray-600 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
            Have a question or want to work together? I'd love to hear from you.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-6">
              <div className="group">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-200">Email</h3>
                  </div>
                </div>
                <p className="text-gray-400 text-sm ml-14">shinkhalsinha@gmail.com</p>
              </div>

              <div className="group">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                    <Phone className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-200">Phone</h3>
                  </div>
                </div>
                <p className="text-gray-400 text-sm ml-14">+91 9431063696</p>
              </div>

              <div className="group">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-200">Location</h3>
                  </div>
                </div>
                <p className="text-gray-400 text-sm ml-14">Jalandhar, Punjab, India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/50 border-gray-800 shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300 font-light">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      className="bg-gray-900/80 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-gray-600 focus:ring-0 transition-colors"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300 font-light">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      className="bg-gray-900/80 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-gray-600 focus:ring-0 transition-colors"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-300 font-light">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell me about your project or inquiry..."
                      rows={6}
                      required
                      className="bg-gray-900/80 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-gray-600 focus:ring-0 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-gray-100 font-light py-3 transition-all duration-200 border border-gray-700 hover:border-gray-600"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}