import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Registration } from '@/lib/schema';

export function useRegistrations() {
  return useQuery({
    queryKey: ['registrations'],
    queryFn: async () => {
      const { data } = await api.get<Registration[]>('/registrations');
      return data;
    },
  });
}