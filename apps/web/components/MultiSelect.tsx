"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface MultiSelectProps {
  name: string;
  label: string;
  options: string[];
  selected: string[] | null | undefined; // Handle potential nulls
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  label,
  options = [],
  selected = [], // Default to empty array
  onChange,
  placeholder = "Select items...",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  // 1. Fix null errors & optimize lookups
  // Converting the array to a Set makes .has() an O(1) operation
  const safeSelected = React.useMemo(
    () => (Array.isArray(selected) ? selected : []),
    [selected]
  );

  const selectedSet = React.useMemo(
    () => new Set(safeSelected),
    [safeSelected]
  );

  // 2. Memoized toggle handler
  const toggleOption = React.useCallback(
    (option: string) => {
      const newSelected = selectedSet.has(option)
        ? safeSelected.filter((item) => item !== option)
        : [...safeSelected, option];
      onChange(newSelected);
    },
    [selectedSet, safeSelected, onChange]
  );

  const handleUnselect = React.useCallback(
    (e: React.MouseEvent, item: string) => {
      e.preventDefault();
      e.stopPropagation();
      onChange(safeSelected.filter((i) => i !== item));
    },
    [safeSelected, onChange]
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium leading-none">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10 py-2 px-3"
          >
            <div className="flex flex-wrap gap-1">
              {safeSelected.length > 0 ? (
                safeSelected.map((item) => (
                  <Badge
                    variant="secondary"
                    key={item}
                    className="mr-1"
                    // Important: use the memoized handler
                    onClick={(e) => handleUnselect(e, item)}
                  >
                    {item}
                    <X className="ml-1 h-3 w-3 hover:text-destructive" />
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={`Search ${label}...`} />
            <CommandList>
              <CommandEmpty>No item found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-y-auto">
                {options.map((option) => {
                  const isSelected = selectedSet.has(option);
                  return (
                    <CommandItem
                      key={option}
                      onSelect={() => toggleOption(option)}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                      <span>{option}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
