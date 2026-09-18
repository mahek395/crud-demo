import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { toFormData } from '@/lib/formDataUtils';
import type { Registration, RegistrationFormValues } from '@/lib/schema';
import type { AxiosError } from 'axios';

interface UpdateRegistrationInput {
  id: number;
  values: RegistrationFormValues;
}

export function useUpdateRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: UpdateRegistrationInput) => {
      // toFormData only appends profile_photo if values.profile_photo is
      // truthy — so if the user didn't pick a new file, it's simply left
      // out of the request, and the backend's update logic (which falls
      // back to the existing photo when req.file is undefined) keeps it.
      const formData = toFormData(values);
      const { data } = await api.put<Registration>(
        `/registrations/${id}`,
        formData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      toast.success('Registration updated successfully!');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message ?? 'Something went wrong. Please try again.';
      toast.error(message);
    },
  });
}