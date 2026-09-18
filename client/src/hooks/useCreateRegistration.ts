import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { toFormData } from '@/lib/formDataUtils';
import type { Registration, RegistrationFormValues } from '@/lib/schema';
import type { AxiosError } from 'axios';

export function useCreateRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: RegistrationFormValues) => {
      const formData = toFormData(values);
      // Deliberately NOT setting Content-Type manually — axios detects a
      // FormData body and sets the multipart boundary itself. Setting it
      // by hand omits the boundary param and breaks the upload.
      const { data } = await api.post<Registration>('/registrations', formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      toast.success('Registration submitted successfully!');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message ?? 'Something went wrong. Please try again.';
      toast.error(message);
    },
  });
}