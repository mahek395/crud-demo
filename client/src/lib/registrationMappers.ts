import type { Registration, RegistrationFormValues } from './schema';

/**
 * Converts a stored Registration (as returned by the API) into the shape
 * the multistep form expects. profile_photo is intentionally omitted —
 * there's no File object for an already-uploaded image, only a URL string,
 * so the form's file input starts empty and the existing photo is shown
 * separately as a preview (see currentPhotoUrl in MultiStepForm).
 */
export function registrationToFormValues(
  reg: Registration
): Omit<RegistrationFormValues, 'profile_photo'> {
  return {
    full_name: reg.full_name,
    email: reg.email,
    phone: reg.phone,
    course_category: reg.course_category,
    preferred_batch: reg.preferred_batch,
    start_date: new Date(reg.start_date),
    prior_experience: reg.prior_experience ?? '',
    placement_assistance: Boolean(reg.placement_assistance),
    agree_terms: Boolean(reg.agree_terms),
  };
}