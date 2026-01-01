"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusMap } from "@/constants/users.const";
import { TUserProfile } from "@4ol/db/schemas/user-profile.schema";

export const userColumns: ColumnDef<TUserProfile>[] = [
  {
    accessorKey: "name",
    header: () => <div className="font-semibold">Name</div>,
    cell: ({ row }) => (
      <div className="flex flex-col min-w-37.5">
        <div className="font-medium text-sm">{row.original.name}</div>
        {/* Show email on mobile as subtitle */}
        <div className="text-xs text-muted-foreground md:hidden truncate">
          {row.original.email}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: () => (
      <div className="font-semibold hidden md:table-cell">Email</div>
    ),
    cell: ({ row }) => (
      <div className="hidden md:table-cell min-w-45">
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm truncate">{row.original.email}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: () => (
      <div className="font-semibold hidden lg:table-cell">Phone</div>
    ),
    cell: ({ row }) => (
      <div className="hidden lg:table-cell min-w-35">
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{row.original.phoneNumber}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: () => (
      <div className="font-semibold hidden xl:table-cell">Role</div>
    ),
    cell: ({ row }) => (
      <div className="hidden xl:table-cell min-w-30">
        <span className="text-sm">{row.original.role}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="font-semibold">Status</div>,
    cell: ({ row }) => (
      <div className="min-w-25">{StatusMap[row.original.status]}</div>
    ),
  },
  {
    accessorKey: "userType",
    header: () => (
      <div className="font-semibold hidden 2xl:table-cell">Type</div>
    ),
    cell: ({ row }) => (
      <div className="hidden 2xl:table-cell min-w-25">
        <span className="text-sm">{row.original.userType}</span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="sr-only">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="min-w-12.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-muted"
                aria-label="Open actions menu"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.userId)}
              >
                Copy User ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit User</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Suspend User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
