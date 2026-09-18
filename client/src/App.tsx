import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MultiStepForm } from '@/components/registration/MultiStepForm';
import { RegistrationsTable } from '@/components/registration/RegistrationsTable';
import { useCreateRegistration } from '@/hooks/useCreateRegistration';
import { useUpdateRegistration } from '@/hooks/useUpdateRegistration';
import { registrationToFormValues } from '@/lib/registrationMappers';
import type { Registration, RegistrationFormValues } from '@/lib/schema';

const SERVER_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api$/, '');

function App() {
  const { mutate: createRegistration, isPending: isCreating } =
    useCreateRegistration();
  const { mutate: updateRegistration, isPending: isUpdating } =
    useUpdateRegistration();

  const [formKey, setFormKey] = useState(0);
  const [editingRegistration, setEditingRegistration] =
    useState<Registration | null>(null);

  const handleCreateSubmit = (values: RegistrationFormValues) => {
    createRegistration(values, {
      onSuccess: () => setFormKey((k) => k + 1),
    });
  };

  const handleEditSubmit = (values: RegistrationFormValues) => {
    if (!editingRegistration) return;
    updateRegistration(
      { id: editingRegistration.id, values },
      { onSuccess: () => setEditingRegistration(null) }
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-3xl space-y-8 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Course Registration</CardTitle>
            <CardDescription>
              Fill in your details across the steps below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MultiStepForm
              key={formKey}
              onSubmit={handleCreateSubmit}
              isSubmitting={isCreating}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Registrations</CardTitle>
            <CardDescription>
              Every submission currently stored in the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegistrationsTable onEdit={setEditingRegistration} />
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={editingRegistration !== null}
        onOpenChange={(open) => !open && setEditingRegistration(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Registration</DialogTitle>
            <DialogDescription>
              Update {editingRegistration?.full_name}'s details below.
            </DialogDescription>
          </DialogHeader>

          {editingRegistration && (
            <MultiStepForm
              key={editingRegistration.id}
              onSubmit={handleEditSubmit}
              isSubmitting={isUpdating}
              submitLabel="Update Registration"
              defaultValues={registrationToFormValues(editingRegistration)}
              currentPhotoUrl={
                editingRegistration.profile_photo
                  ? `${SERVER_URL}${editingRegistration.profile_photo}`
                  : undefined
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;