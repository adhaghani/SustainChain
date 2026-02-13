"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconLoader2, IconAlertCircle } from "@tabler/icons-react";
import type { UserDocument } from "@/types/firestore";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: UserDocument | null;
  onDelete: () => Promise<void>;
  loading: boolean;
  getInitials: (name: string) => string;
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  selectedUser,
  onDelete,
  loading,
  getInitials,
}: DeleteUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        {selectedUser && (
          <div className="py-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(selectedUser.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.email}
                </p>
              </div>
            </div>
            <Alert className="mt-4">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>
                This will permanently delete the user account and remove all
                access permissions.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={loading}>
            {loading && <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
