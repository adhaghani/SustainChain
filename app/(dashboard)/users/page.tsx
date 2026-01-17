import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const UsersPage = () => {
  // Mock data - will be replaced with Firebase Auth data
  const users = [
    {
      id: "1",
      name: "Ahmad bin Ibrahim",
      email: "ahmad@muarfurniture.com",
      phone: "+60 12-345 6789",
      role: "admin",
      tenant: "Muar Furniture Industries",
      tenantId: "1",
      status: "active",
      lastLogin: "2026-01-17T14:30:00",
      joinedDate: "2025-06-15",
      entriesCreated: 45,
      avatar: null
    },
    {
      id: "2",
      name: "Siti Nurhaliza",
      email: "siti@muarfurniture.com",
      phone: "+60 13-456 7890",
      role: "clerk",
      tenant: "Muar Furniture Industries",
      tenantId: "1",
      status: "active",
      lastLogin: "2026-01-17T10:15:00",
      joinedDate: "2025-07-20",
      entriesCreated: 23,
      avatar: null
    },
    {
      id: "3",
      name: "Sarah Lee",
      email: "sarah.lee@greentech.my",
      phone: "+60 12-789 0123",
      role: "admin",
      tenant: "Green Tech Solutions",
      tenantId: "2",
      status: "active",
      lastLogin: "2026-01-17T15:45:00",
      joinedDate: "2025-03-20",
      entriesCreated: 89,
      avatar: null
    },
    {
      id: "4",
      name: "Michael Tan",
      email: "michael@greentech.my",
      phone: "+60 16-234 5678",
      role: "viewer",
      tenant: "Green Tech Solutions",
      tenantId: "2",
      status: "active",
      lastLogin: "2026-01-16T16:20:00",
      joinedDate: "2025-04-10",
      entriesCreated: 0,
      avatar: null
    },
    {
      id: "5",
      name: "Lim Chong Wei",
      email: "lim@jffoods.com",
      phone: "+60 17-345 6789",
      role: "admin",
      tenant: "Johor Fresh Foods",
      tenantId: "3",
      status: "active",
      lastLogin: "2026-01-16T09:30:00",
      joinedDate: "2025-09-10",
      entriesCreated: 23,
      avatar: null
    },
    {
      id: "6",
      name: "Kumar Raj",
      email: "kumar@logisticspro.my",
      phone: "+60 12-456 7891",
      role: "admin",
      tenant: "Logistics Pro Malaysia",
      tenantId: "4",
      status: "active",
      lastLogin: "2026-01-17T11:00:00",
      joinedDate: "2026-01-05",
      entriesCreated: 12,
      avatar: null
    },
    {
      id: "7",
      name: "Priya Sharma",
      email: "priya@logisticspro.my",
      phone: "+60 13-567 8902",
      role: "clerk",
      tenant: "Logistics Pro Malaysia",
      tenantId: "4",
      status: "pending",
      lastLogin: null,
      joinedDate: "2026-01-15",
      entriesCreated: 0,
      avatar: null
    },
    {
      id: "8",
      name: "Wong Li Ting",
      email: "wong@pea-electronics.com",
      phone: "+60 14-678 9013",
      role: "admin",
      tenant: "Penang Electronics Assembly",
      tenantId: "5",
      status: "inactive",
      lastLogin: "2025-12-20T14:00:00",
      joinedDate: "2025-08-22",
      entriesCreated: 8,
      avatar: null
    },
  ];

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

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
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

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const adminUsers = users.filter(u => u.role === "admin").length;
  const pendingUsers = users.filter(u => u.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button>
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
              Across all tenants
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
              {((activeUsers / totalUsers) * 100).toFixed(0)}% of total
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
              System admins
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
              />
            </div>
            <Select defaultValue="all">
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
            <Select defaultValue="all-status">
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
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {formatDate(user.joinedDate)}
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
                        <div className="flex items-center gap-1 text-sm">
                          <IconPhone className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{user.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="text-sm">{user.tenant}</span>
                      <p className="text-xs text-muted-foreground">
                        {user.entriesCreated} entries created
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
                        {formatDateTime(user.lastLogin)}
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
                          <DropdownMenuItem>
                            <IconEdit className="w-4 h-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconShield className="w-4 h-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          {user.status === "pending" && (
                            <DropdownMenuItem>
                              <IconSend className="w-4 h-4 mr-2" />
                              Resend Invite
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {user.status === "active" && (
                            <DropdownMenuItem>
                              <IconBan className="w-4 h-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          )}
                          {user.status === "inactive" && (
                            <DropdownMenuItem>
                              <IconCheck className="w-4 h-4 mr-2" />
                              Reactivate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
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
              Showing {users.length} of {users.length} users
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
    </div>
  );
};

export default UsersPage;