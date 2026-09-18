import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Step1PersonalInfo } from './personalInfo';
import { Step2CourseDetails } from './coursedetails';
import { Step3Preferences } from './Preferences';
import {
  registrationSchema,
  type RegistrationFormValues,
} from '@/lib/schema';

const STEP_FIELDS: Record<number, (keyof RegistrationFormValues)[]> = {
  0: ['full_name', 'email', 'phone', 'profile_photo'],
  1: ['course_category', 'preferred_batch', 'start_date', 'prior_experience'],
  2: ['placement_assistance', 'agree_terms'],
};

const STEP_LABELS = ['Personal Info', 'Course Details', 'Preferences & Review'];

interface MultiStepFormProps {
  onSubmit: (values: RegistrationFormValues) => void;
  isSubmitting?: boolean;
  /** Pre-fill values for edit mode. Omit for a blank create form. */
  defaultValues?: Partial<RegistrationFormValues>;
  /** URL of an already-uploaded photo, shown as a preview in edit mode. */
  currentPhotoUrl?: string;
  /** Text for the final step's submit button. */
  submitLabel?: string;
}

export function MultiStepForm({
  onSubmit,
  isSubmitting,
  defaultValues,
  currentPhotoUrl,
  submitLabel = 'Submit Registration',
}: MultiStepFormProps) {
  const [step, setStep] = useState(0);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      course_category: '',
      prior_experience: '',
      placement_assistance: false,
      agree_terms: false,
      ...defaultValues,
    },
    mode: 'onTouched',
  });

  const isLastStep = step === STEP_LABELS.length - 1;

  const handleNext = async () => {
    const valid = await form.trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <div className="mb-8 flex items-center gap-2">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                  i <= step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`hidden text-sm sm:block ${
                  i <= step ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`h-px flex-1 ${
                    i < step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 0 && <Step1PersonalInfo currentPhotoUrl={currentPhotoUrl} />}
          {step === 1 && <Step2CourseDetails />}
          {step === 2 && <Step3Preferences />}

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 0}
            >
              Back
            </Button>

            {isLastStep ? (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : submitLabel}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}