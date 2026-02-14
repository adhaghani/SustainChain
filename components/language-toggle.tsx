"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const { setLanguage} = useLanguage();


  const { t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-lg">
          <Languages className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all " />
          <span className="sr-only">{t.header.langToggle}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("bm")}>
          Bahasa Melayu
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
