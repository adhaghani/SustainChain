"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSettings,
  IconUsers,
  IconBell,
  IconDownload,
} from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useLanguage();
  
  const data = {
    user: {
      name: "Ahmad Rahman",
      email: "ahmad@sustainchain.app",
      avatar: "/avatars/user.jpg",
    },
    navMain: [
      {
        title: t.dashboard.sidebar.dashboard || "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: t.dashboard.sidebar.uploadBills,
        url: "/entries/upload",
        icon: IconCamera,
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
      {
        title: t.dashboard.sidebar.impact,
        url: "/impact",
        icon: IconFileAi,
      },
    ],
    navManagement: [
      {
        title: t.dashboard.sidebar.users,
        url: "/users",
        icon: IconUsers,
      },
      {
        title: t.dashboard.sidebar.tenants,
        url: "/tenants",
        icon: IconFolder,
      },
      {
        title: t.dashboard.sidebar.systemConfig,
        url: "/system-config",
        icon: IconDatabase,
      },
      {
        title: t.dashboard.sidebar.auditLog,
        url: "/audit-log",
        icon: IconFileDescription,
      },
    ],
    navSecondary: [
      {
        title: t.dashboard.sidebar.settings,
        url: "/settings",
        icon: IconSettings,
      },
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
      {
        title: t.dashboard.sidebar.notifications,
        url: "/notifications",
        icon: IconBell,
      },
      {
        title: t.dashboard.sidebar.export,
        url: "/export",
        icon: IconDownload,
      },
    ],
  };

  return (
    <Sidebar collapsible="offExamples" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SustainChain</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navManagement} title={t.dashboard.sidebar.management} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}