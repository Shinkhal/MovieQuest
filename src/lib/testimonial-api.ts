import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  feedback: string;
  createdAt?: string;
}

export interface NewTestimonialInput {
  name: string;
  role: string;
  feedback: string;
  avatar?: string;
}

export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data } = await axios.get('/api/testimonials');
      return data.testimonials || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSubmitTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonial: NewTestimonialInput) => {
      const { data } = await axios.post('/api/testimonials', {
        ...testimonial,
        avatar: testimonial.avatar || testimonial.name.charAt(0).toUpperCase(),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}