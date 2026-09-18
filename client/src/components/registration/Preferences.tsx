import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import type { RegistrationFormValues } from '@/lib/schema';

export function Step3Preferences() {
  const { control, watch } = useFormContext<RegistrationFormValues>();
  const values = watch();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="placement_assistance"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>I'm interested in placement assistance</FormLabel>
              <FormDescription>
                We'll share relevant job openings once your course begins.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {/* --- Review summary --- */}
      <Card>
        <CardContent className="pt-6 text-sm">
          <h3 className="mb-3 font-medium">Review your details</h3>
          <dl className="grid grid-cols-2 gap-y-2 text-muted-foreground">
            <dt>Name</dt>
            <dd className="text-foreground">{values.full_name || '—'}</dd>
            <dt>Email</dt>
            <dd className="text-foreground">{values.email || '—'}</dd>
            <dt>Phone</dt>
            <dd className="text-foreground">{values.phone || '—'}</dd>
            <dt>Category</dt>
            <dd className="text-foreground">{values.course_category || '—'}</dd>
            <dt>Batch</dt>
            <dd className="text-foreground">{values.preferred_batch || '—'}</dd>
            <dt>Start Date</dt>
            <dd className="text-foreground">
              {values.start_date ? format(values.start_date, 'PPP') : '—'}
            </dd>
          </dl>
        </CardContent>
      </Card>

      <FormField
        control={control}
        name="agree_terms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>I agree to the terms and conditions</FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}