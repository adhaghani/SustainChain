'use client';

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { LanguageProvider } from "@/lib/language-context"
import { translations } from "@/lib/i18n"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider translations={translations}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2 p-4">
              {/* Page content goes here */}
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </LanguageProvider>
  )
}
