"use client";

import * as React from "react";
import { Check, ChevronRight, ChevronDown, Search } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";

// Data Structure
export interface TreeItem {
  id: string;
  name: string;
  parentId: string | null;
  children?: TreeItem[];
}

interface TreeMultiSelectProps {
  data: TreeItem[]; // Pass the flat array from tRPC here
  value: string[]; // Array of selected IDs
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
}

function TreeMultiSelect({
  data,
  value,
  onChange,
  placeholder = "Select parts...",
  label,
}: TreeMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  // Senior Move: Memoize the tree building to avoid re-calculating on every render
  const treeData = React.useMemo(() => {
    const map = new Map<string, TreeItem>();
    data.forEach((item) => map.set(item.id, { ...item, children: [] }));
    const roots: TreeItem[] = [];
    map.forEach((item) => {
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId)!.children!.push(item);
      } else {
        roots.push(item);
      }
    });
    return roots;
  }, [data]);

  const toggleNode = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleValue = (id: string) => {
    const isSelected = value.includes(id);
    let newValue: string[];

    if (isSelected) {
      // 1. DESELECTING: Remove the item AND all its descendants
      const idsToRemove = new Set<string>();
      const collectDescendants = (nodeId: string) => {
        idsToRemove.add(nodeId);
        const item = data.find((d) => d.id === nodeId);
        const children = data.filter((d) => d.parentId === nodeId);
        children.forEach((child) => collectDescendants(child.id));
      };

      collectDescendants(id);
      newValue = value.filter((v) => !idsToRemove.has(v));
    } else {
      // 2. SELECTING: Add the item AND all its ancestors
      const idsToAdd = new Set<string>();
      const collectAncestors = (nodeId: string) => {
        idsToAdd.add(nodeId);
        const item = data.find((d) => d.id === nodeId);
        if (item?.parentId) {
          collectAncestors(item.parentId);
        }
      };

      collectAncestors(id);
      newValue = Array.from(new Set([...value, ...idsToAdd]));
    }

    onChange(newValue);
  };

  const renderTree = (items: TreeItem[], level = 0) => {
    return items.map((item) => (
      <React.Fragment key={item.id}>
        <CommandItem
          value={item.name}
          onSelect={() => toggleValue(item.id)}
          className={cn("flex items-center gap-2")}
          style={{
            paddingLeft: `${level * 1.5}rem`,
            borderLeft: level > 0 ? "1px solid black" : "none",
            marginLeft: level > 0 ? "0.5rem" : "0.4rem",
          }}
        >
          <div className="flex items-center flex-1 gap-2">
            <Checkbox
              checked={value.includes(item.id)}
              onCheckedChange={() => toggleValue(item.id)}
            />
            <span className="flex-1">{item.name}</span>
          </div>
          {item.children && item.children.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(item.id);
              }}
            >
              {expanded[item.id] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
        </CommandItem>
        {expanded[item.id] &&
          item.children &&
          renderTree(item.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between min-h-[40px] h-auto flex-wrap gap-1 px-3"
          >
            {value.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {value.length} selected
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search parts..." />
            <CommandList className="max-h-[400px]">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>{renderTree(treeData)}</CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

type TreeMultiSelectFormProps<T extends FieldValues> = {
  control: Control<T>;
  rawParts: TreeItem[];
  name: FieldPath<T>;
  label: string;
  description?: string;
};
export const TreeMultiSelectForm = <T extends FieldValues>({
  control,
  rawParts,
  name,
  label,
  description,
}: TreeMultiSelectFormProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <TreeMultiSelect
            data={rawParts}
            value={field.value}
            onChange={field.onChange}
          />
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
