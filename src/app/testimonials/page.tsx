'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TestimonialForm() {
  const [form, setForm] = useState({
    name: '',
    role: '',
    feedback: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(false);

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
      role: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.role || !form.feedback) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/testimonials', form);
      toast.success('Testimonial submitted successfully!');
      setForm({ name: '', role: '', feedback: '', avatar: '' });
    } catch (error) {
      toast.error('Failed to submit testimonial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-gradient-to-t from-gray-500 to-gray-800 flex items-center justify-center p-6">
      <div className="w-full max-w-lg shadow-2xl transition duration-300 backdrop-blur-lg border border-white/30 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-b from-red-500 to-pink-800 text-white p-6 ">
          <h2 className="text-2xl font-bold">Share Your Feedback</h2>
          <p className="text-indigo-200 mt-1">Your testimonial helps others make informed decisions</p>
        </div>
        
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-100">Full Name <span className="text-red-400">*</span></Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-100">Your Role <span className="text-red-400">*</span></Label>
              <Select value={form.role} onValueChange={handleRoleChange} >
                <SelectTrigger className=" border-gray-600 w-full text-white focus:ring-2 focus:ring-indigo-500">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-600 border-gray-600 text-white w-full">
                  <SelectItem value="Film Lover">Film Lover</SelectItem>
                  <SelectItem value="Casual Viewer">Casual Viewer</SelectItem>
                  <SelectItem value="Film Critic">Film Critic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedback" className="text-sm font-medium text-gray-100">Your Testimonial <span className="text-red-400">*</span></Label>
              <Textarea
                id="feedback"
                name="feedback"
                value={form.feedback}
                onChange={handleChange}
                placeholder="Please share your experience..."
                rows={5}
                className="bg-gray-700 border-gray-600 text-white resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </form>
        </div>
        
        <div className="bg-gray-850 border-t border-gray-700 px-6 py-4 flex justify-end">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-indigo-700 text-white font-medium px-6"
          >
            {loading ? 'Submitting...' : 'Submit Testimonial'}
          </Button>
        </div>
      </div>
    </div>
  );
}