'use client';

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useLanguage } from "@/lib/language-context"
import { IconBell} from "@tabler/icons-react"
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
              
              {/* NOTIFICATION DETAILS GOES HERE */}
              notifications details goes here

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
