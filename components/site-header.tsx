'use client';

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useLanguage } from "@/lib/language-context"
import { IconBell, IconCheck, IconAlertCircle, IconInfoCircle } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SiteHeader() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bm' : 'en');
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{t.dashboard.header.title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Badge 
            variant="outline" 
            className="cursor-pointer hover:bg-muted transition-colors"
            onClick={toggleLanguage}
          >
            <span className={language === "en" ? "font-semibold" : "text-muted-foreground"}>EN</span>
            {" / "}
            <span className={language === "bm" ? "font-semibold" : "text-muted-foreground"}>BM</span>
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <IconBell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-semibold">
                {language === 'en' ? 'Notifications' : 'Pemberitahuan'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="flex gap-3 p-3 cursor-pointer">
                <div className="shrink-0 mt-1">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-1.5">
                    <IconCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {language === 'en' ? 'Bill Processed Successfully' : 'Bil Berjaya Diproses'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Your TNB bill has been analyzed' : 'Bil TNB anda telah dianalisis'}
                  </p>
                  <p className="text-xs text-muted-foreground">2h ago</p>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex gap-3 p-3 cursor-pointer">
                <div className="shrink-0 mt-1">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-1.5">
                    <IconInfoCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {language === 'en' ? 'New ESG Report Ready' : 'Laporan ESG Baharu Sedia'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'January 2026 report is available' : 'Laporan Januari 2026 tersedia'}
                  </p>
                  <p className="text-xs text-muted-foreground">5h ago</p>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex gap-3 p-3 cursor-pointer">
                <div className="shrink-0 mt-1">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-1.5">
                    <IconAlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {language === 'en' ? 'High Usage Alert' : 'Amaran Penggunaan Tinggi'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Electricity usage 20% above average' : 'Penggunaan elektrik 20% melebihi purata'}
                  </p>
                  <p className="text-xs text-muted-foreground">1d ago</p>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/dashboard/notifications" className="w-full text-center cursor-pointer">
                  <span className="text-sm font-medium">
                    {language === 'en' ? 'View All Notifications' : 'Lihat Semua Pemberitahuan'}
                  </span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="/dashboard/help"
              className="dark:text-foreground"
            >
              {t.dashboard.header.helpCenter}
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
