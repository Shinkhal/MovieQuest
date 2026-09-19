import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  feedback: string;
  createdAt: string;
}

export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data } = await axios.get('/api/testimonials');
      return data.testimonials;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSubmitTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'avatar'>) => {
      const { data } = await axios.post('/api/testimonials', {
        ...testimonial,
        avatar: testimonial.name.charAt(0).toUpperCase(),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}