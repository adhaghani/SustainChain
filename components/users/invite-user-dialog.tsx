"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconLoader2, IconCheck, IconAlertCircle } from "@tabler/icons-react";
import type { UserRole } from "@/types/firestore";

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteForm: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
  };
  setInviteForm: (form: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
  }) => void;
  onInvite: () => Promise<void>;
  loading: boolean;
  error?: string;
  successMessage?: string;
}

export function InviteUserDialog({
  open,
  onOpenChange,
  inviteForm,
  setInviteForm,
  onInvite,
  loading,
  error,
  successMessage,
}: InviteUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New User</DialogTitle>
          <DialogDescription>
            Send an invitation to add a new user to your organization
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <IconAlertCircle className="h-4 w-4" />
              <div className="ml-2">
                <p className="text-sm font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </Alert>
          )}
          {successMessage && (
            <Alert>
              <IconCheck className="h-4 w-4" />
              <div className="ml-2">
                <p className="text-sm font-medium">Success</p>
                <p className="text-sm">{successMessage}</p>
              </div>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={inviteForm.name}
              onChange={(e) =>
                setInviteForm({ ...inviteForm, name: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={inviteForm.email}
              onChange={(e) =>
                setInviteForm({ ...inviteForm, email: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              placeholder="+60123456789"
              value={inviteForm.phone}
              onChange={(e) =>
                setInviteForm({ ...inviteForm, phone: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={inviteForm.role}
              onValueChange={(value: UserRole) =>
                setInviteForm({ ...inviteForm, role: value })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="clerk">Data Entry Clerk</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onInvite} disabled={loading}>
            {loading && <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />}
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
