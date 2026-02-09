"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  IconUser,
  IconShield,
  IconBell,
  IconPalette,
} from "@tabler/icons-react";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const settingsNavItems = [
  {
    title: "Profile",
    href: "/settings",
    icon: IconUser,
    description: "Manage your profile information",
  },
  {
    title: "Account",
    href: "/settings/account",
    icon: IconShield,
    description: "Security and account settings",
  },
  {
    title: "Notifications",
    href: "/settings/notification",
    icon: IconBell,
    description: "Configure notification preferences",
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
    icon: IconPalette,
    description: "Customize your experience",
  },
];

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and application settings
        </p>
      </div>

      {/* Layout with Sidebar Navigation */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Vertical Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            {settingsNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-start gap-3 rounded-lg px-3 py-3 transition-all hover:bg-accent",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 hidden md:block">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;
