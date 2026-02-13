"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';

export interface InvitationData {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: 'admin' | 'clerk' | 'viewer';
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  invitedBy: string;
  invitedByName: string;
  createdAt: string;
  expiresAt: string;
  acceptedAt: string | null;
  userId: string | null;
}

export function useInvitations() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('Not authenticated');
      }

      const token = await user.getIdToken();

      const response = await fetch('/api/users/invitations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch invitations');
      }

      setInvitations(data.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setInvitations([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const cancelInvitation = useCallback(async (invitationId: string) => {
    try {
      if (!user) {
        throw new Error('Not authenticated');
      }

      const token = await user.getIdToken();

      const response = await fetch(`/api/users/invitations?id=${invitationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel invitation');
      }

      // Refresh invitations list
      await fetchInvitations();

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, [user, fetchInvitations]);

  const resendInvitation = useCallback(async (invitation: InvitationData) => {
    try {
      if (!user) {
        throw new Error('Not authenticated');
      }

      const token = await user.getIdToken();

      // Send a new invitation with the same details
      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: invitation.name,
          email: invitation.email,
          phone: invitation.phone,
          role: invitation.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend invitation');
      }

      // Refresh invitations list
      await fetchInvitations();

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }, [user, fetchInvitations]);

  useEffect(() => {
    if (user) {
      fetchInvitations();
    }
  }, [user, fetchInvitations]);

  return {
    invitations,
    loading,
    error,
    fetchInvitations,
    cancelInvitation,
    resendInvitation,
  };
}
