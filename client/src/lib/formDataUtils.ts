import type { RegistrationFormValues } from './schema';

/**
 * Converts the RHF/Zod form values into a FormData instance the backend's
 * multer middleware can parse. Every field becomes a text part except
 * profile_photo, which is appended as the actual File (binary part).
 */
export function toFormData(values: RegistrationFormValues): FormData {
  const formData = new FormData();

  formData.append('full_name', values.full_name);
  formData.append('email', values.email);
  formData.append('phone', values.phone);
  formData.append('course_category', values.course_category);
  formData.append('preferred_batch', values.preferred_batch);
  // MySQL DATE columns expect YYYY-MM-DD — strip the time portion
  formData.append('start_date', values.start_date.toISOString().split('T')[0]);
  formData.append('prior_experience', values.prior_experience ?? '');
  formData.append('placement_assistance', String(values.placement_assistance));
  formData.append('agree_terms', String(values.agree_terms));

  if (values.profile_photo) {
    formData.append('profile_photo', values.profile_photo);
  }

  return formData;
}