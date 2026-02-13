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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useLanguage();
  const { userData, signOut, isSuperAdmin } = useAuth();
  
  const data = {
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
      // {
      //   title: t.dashboard.sidebar.impact,
      //   url: "/impact",
      //   icon: IconFileAi,
      // },
    ],
    navManagement: [
      {
        title: t.dashboard.sidebar.users,
        url: "/users",
        icon: IconUsers,
      },
      // {
      //   title: t.dashboard.sidebar.tenants,
      //   url: "/tenants",
      //   icon: IconFolder,
      // },
      // {
      //   title: t.dashboard.sidebar.systemConfig,
      //   url: "/system-config",
      //   icon: IconDatabase,
      // },
      {
        title: t.dashboard.sidebar.auditLog,
        url: "/audit-log",
        icon: IconFileDescription,
      },
    ],
    navSuperAdmin: [
      {
        title: "System Overview",
        url: "/system-admin",
        icon: IconShield,
      },
      {
        title: "All Tenants",
        url: "/system-admin/tenants",
        icon: IconBuilding,
      },
      {
        title: "All Users",
        url: "/system-admin/users",
        icon: IconUsers,
      },
      {
        title: "System Activity",
        url: "/system-admin/system-activity",
        icon: IconActivity,
      },
      {
        title: "Global Config",
        url: "/system-admin/global-config",
        icon: IconSettings,
      },
    ],
    navSecondary: [
      // {
      //   title: t.dashboard.sidebar.settings,
      //   url: "/settings",
      //   icon: IconSettings,
      // },
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
      // {
      //   title: t.dashboard.sidebar.notifications,
      //   url: "/notifications",
      //   icon: IconBell,
      // },
      // {
      //   title: t.dashboard.sidebar.export,
      //   url: "/export",
      //   icon: IconDownload,
      // },
    ],
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
                <span className="text-base font-semibold">SustainChain</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {isSuperAdmin && (
          <NavSecondary items={data.navSuperAdmin} title="System Administration" />
        )}
        {!isSuperAdmin && <NavSecondary items={data.navManagement} title={t.dashboard.sidebar.management} />}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser signOut={signOut} user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}