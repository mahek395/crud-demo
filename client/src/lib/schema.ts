import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB, matches backend multer limit
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// --- Step 1: Personal Info ---
export const step1Schema = z.object({
  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: z.string().email('Enter a valid email address'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number'),
  profile_photo: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      'Image must be 5MB or smaller'
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only JPEG, PNG, or WEBP images are allowed'
    ),
});

// --- Step 2: Course Details ---
export const step2Schema = z.object({
  course_category: z.string().min(1, 'Please select a course category'),
  preferred_batch: z.enum(['Morning', 'Evening', 'Weekend'], {
    required_error: 'Please select a preferred batch',
  }),
  start_date: z.date({ required_error: 'Please pick a start date' }),
  prior_experience: z.string().max(1000, 'Keep it under 1000 characters').optional(),
});

// --- Step 3: Preferences & Review ---
export const step3Schema = z.object({
  placement_assistance: z.boolean().default(false),
  agree_terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms to continue',
  }),
});

// --- Combined schema (full form, used on final submit) ---
export const registrationSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema);

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

// --- Shape of a record as returned by the API (dates/booleans come back as strings/0-1) ---
export interface Registration {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  profile_photo: string | null;
  course_category: string;
  preferred_batch: 'Morning' | 'Evening' | 'Weekend';
  start_date: string;
  prior_experience: string | null;
  placement_assistance: number; // MySQL returns TINYINT as 0/1
  agree_terms: number;
  created_at: string;
  updated_at: string;
}