"use client";

import { Mail, Phone, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleMap, StatusMap } from "@/constants/users.const";

interface MobileUserCardProps {
  user: TUserTable;
  onClick: () => void;
}

export function MobileUserCard({ user, onClick }: MobileUserCardProps) {
  return (
    <div
      className="bg-white w-full border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3 ">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate text-start">
            {user.name}
          </h3>
          <p className="text-sm text-muted-foreground text-start">
            {user.userType}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          {StatusMap[user.status]}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Open actions menu"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(user.userId);
                }}
              >
                Copy User ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                Edit User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4 shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4 shrink-0" />
          <span>{user.phoneNumber}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-muted-foreground">Role:</span>
          <span className="text-xs font-medium">{RoleMap[user.role]}</span>
        </div>
      </div>
    </div>
  );
}
