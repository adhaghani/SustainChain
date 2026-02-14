import { useState } from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Search } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"



const SearchCommand = () => {
    const [open, setOpen] = useState(false)
    const { t } = useLanguage();
  return (
<div className="flex flex-col gap-4">
<InputGroup className="max-w-xs" onClick={() => setOpen(true)}>
      <InputGroupInput placeholder={t.header.search.placeholder} />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      </InputGroupAddon>
    </InputGroup>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder={t.header.command.placeholder} />
          <CommandList>
            <CommandEmpty>{t.header.command.empty}</CommandEmpty>
            <CommandGroup heading={t.header.command.suggestions.heading}>
              <CommandItem>{t.header.command.suggestions.items.calendar}</CommandItem>
              <CommandItem>{t.header.command.suggestions.items.searchEmoji}</CommandItem>
              <CommandItem>{t.header.command.suggestions.items.calculator}</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}

export default SearchCommand