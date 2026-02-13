/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { firestoreTimestampToDate, type FirestoreTimestamp } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {  
  IconSearch, 
  IconUserPlus,
  IconEdit,
  IconTrash,
  IconMail,
  IconPhone,
  IconShield,
  IconShieldCheck,
  IconUser,
  IconClock,
  IconCheck,
  IconBan,
  IconSettings,
  IconAlertCircle,
  IconLoader2,
  IconX,
  IconSend
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserDocument, UserRole,UserStatus } from '@/types/firestore';
import { InviteUserDialog } from '@/components/users/invite-user-dialog';
import { EditUserDialog } from '@/components/users/edit-user-dialog';
import { DeleteUserDialog } from '@/components/users/delete-user-dialog';
import { useInvitations, type InvitationData } from '@/hooks/use-invitations';

const UsersPage = () => {
  const [users, setUsers] = useState<UserDocument[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all-status');
  
  // Dialog states
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDocument | null>(null);
  
  // Form states
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'clerk' as UserRole,
  });
  const [editForm, setEditForm] = useState({
    role: 'clerk' as UserRole,
    status: 'active' as UserStatus,
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Invitations hook
  const { 
    invitations, 
    loading: invitationsLoading,
    cancelInvitation,
    resendInvitation,
  } = useInvitations();

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.tenantName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all-status') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const currentUser = auth?.currentUser;
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      const token = await currentUser.getIdToken();

      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      setUsers(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    try {
      setActionLoading(true);
      setError('');
      setSuccessMessage('');

      const currentUser = auth?.currentUser;
      if (!currentUser) throw new Error('Not authenticated');

      const token = await currentUser.getIdToken();

      const response = await fetch('/api/users/invite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to invite user');
      }

      // Show success message
      setSuccessMessage(`Invitation sent successfully to ${inviteForm.email}`);

      // Reset form and close dialog after a delay
      setTimeout(() => {
        setInviteForm({ name: '', email: '', phone: '', role: 'clerk' });
        setInviteDialogOpen(false);
        setSuccessMessage('');
      }, 2000);
      
      // Refresh users list
      await fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      setError('');

      const currentUser = auth?.currentUser;
      if (!currentUser) throw new Error('Not authenticated');

      const token = await currentUser.getIdToken();

      const response = await fetch('/api/users/update', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: editForm.role,
          status: editForm.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      setEditDialogOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      setError('');

      const currentUser = auth?.currentUser;
      if (!currentUser) throw new Error('Not authenticated');

      const token = await currentUser.getIdToken();

      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      setDeleteDialogOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditDialog = (user: UserDocument) => {
    setSelectedUser(user);
    setEditForm({ role: user.role, status: user.status });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (user: UserDocument) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Mock data fallback for display purposes
  const displayUsers = filteredUsers.length > 0 ? filteredUsers : [];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="default" className="bg-purple-500">
            <IconShieldCheck className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      case "clerk":
        return (
          <Badge variant="secondary">
            <IconUser className="w-3 h-3 mr-1" />
            Clerk
          </Badge>
        );
      case "viewer":
        return (
          <Badge variant="outline">
            <IconShield className="w-3 h-3 mr-1" />
            Viewer
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500"><IconCheck className="w-3 h-3 mr-1" />Active</Badge>;
      case "pending":
        return <Badge variant="secondary"><IconClock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "inactive":
        return <Badge variant="outline"><IconBan className="w-3 h-3 mr-1" />Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDateTime = (timestamp: FirestoreTimestamp | null) => {
    if (!timestamp) return "Never";
    const date = firestoreTimestampToDate(timestamp);
    return date.toLocaleString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: FirestoreTimestamp) => {
    const date = firestoreTimestampToDate(timestamp);
    return date.toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <IconLoader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const adminUsers = users.filter(u => u.role === "admin").length;
  const pendingUsers = users.filter(u => u.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button onClick={() => setInviteDialogOpen(true)}>
          <IconUserPlus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In your organization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(0) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              With full access
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting activation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage user accounts and access control</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, email, or tenant..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="clerk">Clerk</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Table */}
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tenant</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Login</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className={`border-b ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {formatDate(user.createdAt as unknown as FirestoreTimestamp)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <IconMail className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <IconPhone className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="text-sm">{user.tenantName}</span>
                      <p className="text-xs text-muted-foreground">
                        {user.tenantId.slice(0, 8)}...
                      </p>
                    </td>
                    <td className="p-4 align-middle">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="p-4 align-middle">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="text-sm">
                        {user.lastLogin ? formatDateTime(user.lastLogin as unknown as FirestoreTimestamp) : 'Never'}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <IconSettings className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <IconEdit className="w-4 h-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <IconShield className="w-4 h-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === "active" && (
                            <DropdownMenuItem onClick={() => {
                              setSelectedUser(user);
                              setEditForm({ role: user.role, status: 'inactive' });
                              handleUpdateUser();
                            }}>
                              <IconBan className="w-4 h-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          )}
                          {user.status === "inactive" && (
                            <DropdownMenuItem onClick={() => {
                              setSelectedUser(user);
                              setEditForm({ role: user.role, status: 'active' });
                              handleUpdateUser();
                            }}>
                              <IconCheck className="w-4 h-4 mr-2" />
                              Reactivate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => openDeleteDialog(user)}
                          >
                            <IconTrash className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {displayUsers.length} of {displayUsers.length} users
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Overview of access levels for each role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Admin */}
            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <IconShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-base">Administrator</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-green-500" />
                  <span>Full system access</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-green-500" />
                  <span>Manage users & roles</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-green-500" />
                  <span>Create & delete entries</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-green-500" />
                  <span>Generate reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-green-500" />
                  <span>Configure settings</span>
                </div>
              </CardContent>
            </Card>

            {/* Clerk */}
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                    <IconUser className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <CardTitle className="text-base">Data Entry Clerk</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-green-500" />
                  <span>Upload bills</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-green-500" />
                  <span>Create entries</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-green-500" />
                  <span>Edit own entries</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-green-500" />
                  <span>View dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconBan className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">No admin access</span>
                </div>
              </CardContent>
            </Card>

            {/* Viewer */}
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <IconShield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-base">Viewer</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-green-500" />
                  <span>View dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-green-500" />
                  <span>View reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="w-4 h-4 text-green-500" />
                  <span>Download reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconBan className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">No edit access</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconBan className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">No data entry</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>
            Manage user invitations that haven&apos;t been accepted yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitationsLoading && (
            <div className="flex items-center justify-center py-8">
              <IconLoader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!invitationsLoading && invitations.filter(inv => inv.status === 'pending').length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <IconMail className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No pending invitations</p>
            </div>
          )}

          {!invitationsLoading && invitations.filter(inv => inv.status === 'pending').length > 0 && (
            <div className="space-y-4">
              {invitations
                .filter(inv => inv.status === 'pending')
                .map((invitation: InvitationData) => {
                  const isExpired = new Date(invitation.expiresAt) < new Date();
                  return (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar>
                          <AvatarFallback>
                            {invitation.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{invitation.name}</p>
                            <Badge variant="outline">
                              {invitation.role === 'admin' && <IconShieldCheck className="w-3 h-3 mr-1" />}
                              {invitation.role === 'clerk' && <IconShield className="w-3 h-3 mr-1" />}
                              {invitation.role === 'viewer' && <IconUser className="w-3 h-3 mr-1" />}
                              {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                            </Badge>
                            {isExpired && (
                              <Badge variant="destructive">Expired</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <IconMail className="w-3 h-3" />
                            <span>{invitation.email}</span>
                          </div>
                          {invitation.phone && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <IconPhone className="w-3 h-3" />
                              <span>{invitation.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span>Invited by {invitation.invitedByName}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <IconClock className="w-3 h-3" />
                              Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isExpired && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              const result = await resendInvitation(invitation);
                              if (!result.success) {
                                setError(result.error || 'Failed to resend invitation');
                              } else {
                                setSuccessMessage('Invitation resent successfully');
                                setTimeout(() => setSuccessMessage(''), 3000);
                              }
                            }}
                          >
                            <IconSend className="w-4 h-4 mr-1" />
                            Resend
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            const result = await cancelInvitation(invitation.id);
                            if (!result.success) {
                              setError(result.error || 'Failed to cancel invitation');
                            } else {
                              setSuccessMessage('Invitation cancelled successfully');
                              setTimeout(() => setSuccessMessage(''), 3000);
                            }
                          }}
                        >
                          <IconX className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <InviteUserDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        inviteForm={inviteForm}
        setInviteForm={setInviteForm}
        onInvite={handleInviteUser}
        loading={actionLoading}
        error={error}
        successMessage={successMessage}
      />

      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        selectedUser={selectedUser}
        editForm={editForm}
        setEditForm={setEditForm}
        onUpdate={handleUpdateUser}
        loading={actionLoading}
        getInitials={getInitials}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedUser={selectedUser}
        onDelete={handleDeleteUser}
        loading={actionLoading}
        getInitials={getInitials}
      />
    </div>
  );
};

export default UsersPage;