/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSettings,
  IconUsers,
  IconShield,
  IconBuilding,
  IconActivity,
} from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/lib/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import type { UserRole } from "@/types/firestore"

// Permission mappings for navigation items
const ROUTE_PERMISSIONS = {
  "/dashboard": [ "admin", "clerk", "viewer"],
  "/entries": [ "admin", "clerk", "viewer"],
  "/analytics": [ "admin", "clerk", "viewer"],
  "/reports": [ "admin", "clerk", "viewer"],
  "/users": ["superadmin", "admin"],
  "/audit-log": ["superadmin", "admin"],
  "/help": ["superadmin", "admin", "clerk", "viewer"],
  "/changelog": ["superadmin", "admin", "clerk", "viewer"],
} as const;

const canAccessRoute = (route: string, role: UserRole | null | any): boolean => {
  if (!role) return false;
  const allowedRoles = ROUTE_PERMISSIONS[route as keyof typeof ROUTE_PERMISSIONS];
  return allowedRoles?.includes(role) ?? false;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useLanguage();
  const { userData, signOut, isSuperAdmin, role } = useAuth();
  
  const allNavItems = {
    user: {
      name: userData?.displayName || "",
      email: userData?.email || "",
      avatar: userData?.photoURL || "/avatars/user.jpg",
    },
    navMain: [
      {
        title: t.dashboard.sidebar.dashboard || "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: t.dashboard.sidebar.billEntries,
        url: "/entries",
        icon: IconListDetails,
      },
      {
        title: t.dashboard.sidebar.analytics,
        url: "/analytics",
        icon: IconChartBar,
      },
      {
        title: t.dashboard.sidebar.reports,
        url: "/reports",
        icon: IconReport,
      },
    ],
    navManagement: [
      {
        title: t.dashboard.sidebar.users,
        url: "/users",
        icon: IconUsers,
      },
      {
        title: t.dashboard.sidebar.auditLog,
        url: "/audit-log",
        icon: IconFileDescription,
      },
    ],
    navSuperAdmin: [
      {
        title: t.sidebar.superadmin.systemOverview,
        url: "/system-admin",
        icon: IconShield,
      },
      {
        title: t.sidebar.superadmin.allTenants,
        url: "/system-admin/tenants",
        icon: IconBuilding,
      },
      {
        title: t.sidebar.superadmin.allUsers,
        url: "/system-admin/users",
        icon: IconUsers,
      },
      {
        title: t.sidebar.superadmin.systemActivity,
        url: "/system-admin/system-activity",
        icon: IconActivity,
      },
      {
        title: t.sidebar.superadmin.globalConfig,
        url: "/system-admin/global-config",
        icon: IconSettings,
      },
    ],
    navSecondary: [
      {
        title: t.dashboard.header.helpCenter,
        url: "/help",
        icon: IconHelp,
      },
      {
        title: t.dashboard.sidebar.changelog,
        url: "/changelog",
        icon: IconFileWord,
      },
    ],
  };

  // Filter navigation items based on user role permissions
  const data = {
    user: allNavItems.user,
    navMain: allNavItems.navMain.filter((item) => canAccessRoute(item.url, role)),
    navManagement: allNavItems.navManagement.filter((item) => canAccessRoute(item.url, role)),
    navSuperAdmin: allNavItems.navSuperAdmin,
    navSecondary: allNavItems.navSecondary.filter((item) => canAccessRoute(item.url, role)),
  };

  return (
    <Sidebar collapsible="offExamples" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">{t.sidebar.brandName}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {isSuperAdmin && data.navSuperAdmin.length > 0 && (
          <NavSecondary items={data.navSuperAdmin} title={t.sidebar.superadmin.systemAdministration} />
        )}
        {!isSuperAdmin && data.navManagement.length > 0 && (
          <NavSecondary items={data.navManagement} title={t.dashboard.sidebar.management} />
        )}
        {data.navSecondary.length > 0 && (
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser signOut={signOut} user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}