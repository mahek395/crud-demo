import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { RegistrationFormValues } from '@/lib/schema';

interface Step1PersonalInfoProps {
  /** If editing an existing registration, the URL of its current photo. */
  currentPhotoUrl?: string;
}

export function Step1PersonalInfo({ currentPhotoUrl }: Step1PersonalInfoProps) {
  const { control } = useFormContext<RegistrationFormValues>();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Mahek Shah" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="you@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="9876543210" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="profile_photo"
        render={({ field: { value, onChange, ...rest } }) => (
          <FormItem>
            <FormLabel>Profile Photo</FormLabel>

            {currentPhotoUrl && (
              <div className="mb-2 flex items-center gap-3">
                <img
                  src={currentPhotoUrl}
                  alt="Current"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <span className="text-xs text-muted-foreground">
                  Current photo — upload a new one below to replace it
                </span>
              </div>
            )}

            <FormControl>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => onChange(e.target.files?.[0])}
                {...rest}
              />
            </FormControl>
            <FormDescription>
              Optional. JPEG, PNG, or WEBP — up to 5MB.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}