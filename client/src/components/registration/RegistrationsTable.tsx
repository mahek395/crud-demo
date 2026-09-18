import { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRegistrations } from '@/hooks/useRegistration';
import { useDeleteRegistration } from '@/hooks/useDeleteRegistration';
import type { Registration } from '@/lib/schema';

// Images are served from the backend's root (e.g. /uploads/foo.jpg), not
// under /api — so strip the /api suffix from the API base URL to get it.
const SERVER_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api$/, '');

interface RegistrationsTableProps {
  onEdit: (registration: Registration) => void;
}

export function RegistrationsTable({ onEdit }: RegistrationsTableProps) {
  const { data, isLoading, isError } = useRegistrations();
  const { mutate: deleteRegistration, isPending: isDeleting } =
    useDeleteRegistration();
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Failed to load registrations. Is the backend running?
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No registrations yet — submit the form above to see it appear here.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell>
                  {reg.profile_photo ? (
                    <img
                      src={`${SERVER_URL}${reg.profile_photo}`}
                      alt={reg.full_name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{reg.full_name}</TableCell>
                <TableCell>{reg.email}</TableCell>
                <TableCell>{reg.course_category}</TableCell>
                <TableCell>{reg.preferred_batch}</TableCell>
                <TableCell>
                  {format(new Date(reg.start_date), 'PP')}
                </TableCell>
                <TableCell className="space-x-1 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(reg)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPendingDeleteId(reg.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete registration?</DialogTitle>
            <DialogDescription>
              This can't be undone. It will permanently delete the record and
              its uploaded photo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={() => {
                if (pendingDeleteId !== null) {
                  deleteRegistration(pendingDeleteId, {
                    onSuccess: () => setPendingDeleteId(null),
                  });
                }
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}