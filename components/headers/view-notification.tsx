'use client';

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { IconBell} from "@tabler/icons-react"
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
const ViewNotification = () => {
      const { language } = useLanguage();
  return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-lg" className="relative">
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
                <DropdownMenuItem>
                    first Notification
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Second Notification
                </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/notifications" className="w-full text-center cursor-pointer">
                  <span className="text-xs font-medium">
                    {language === 'en' ? 'View All Notifications' : 'Lihat Semua Pemberitahuan'}
                  </span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
  )
}

export default ViewNotification