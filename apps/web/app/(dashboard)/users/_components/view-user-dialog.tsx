"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  Calendar,
  User as UserIcon,
  Shield,
  Edit,
  Trash2,
  Ban,
  Fingerprint,
  Clock,
} from "lucide-react";
import { StatusMap, RoleMap } from "@/constants/users.const";
import { TUserProfile } from "@4ol/db/schemas/user-profile.schema";
import { useState } from "react";
import { useViewUserDialog } from "@/stores/dialog-store";
import { useUser } from "@/hooks/supabase-calls/useUser";

export function ViewUserDialog({
  Dialog,
}: {
  Dialog?: React.ComponentType<ControlledDialogProps>;
}) {
  const { isOpen, entityId, close } = useViewUserDialog();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: user, isLoading } = useUser({
    id: entityId!,
    enabled: isOpen && !!entityId,
  });

  const userData = user as TUserProfile;

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col">
        {isLoading ? (
          <div className="p-6">
            <UserSkeleton />
          </div>
        ) : user ? (
          <>
            {/* 1. Profile Header Section - Responsive Padding */}
            <div className="bg-muted/30 p-6 md:p-8 pt-12 md:pt-16 border-b">
              <SheetHeader className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="space-y-1">
                    <SheetTitle className="text-2xl md:text-3xl font-bold tracking-tight">
                      {userData.name}
                    </SheetTitle>
                    <SheetDescription className="text-sm md:text-base font-medium flex items-center gap-2">
                      <Badge variant="secondary" className="rounded-full px-3">
                        {userData.user_type}
                      </Badge>
                    </SheetDescription>
                  </div>
                  <div className="flex items-center">
                    {StatusMap[userData.status]}
                  </div>
                </div>

                {/* Quick Actions - Floating style */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="h-9 rounded-full shadow-sm"
                    onClick={() => setDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-9 rounded-full"
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive hover:bg-destructive/10 rounded-full ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {Dialog && (
                  <Dialog open={dialogOpen} handleDialogOpen={setDialogOpen} />
                )}
              </SheetHeader>
            </div>

            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-8">
              {/* Contact Information Section */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Contact Connectivity
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ContactCard
                    icon={Mail}
                    label="Email Address"
                    value={userData.email}
                  />
                  <ContactCard
                    icon={Phone}
                    label="Mobile Number"
                    value={userData.phone_number}
                  />
                </div>
              </section>

              <Separator className="opacity-50" />

              {/* Account Metadata Section */}
              <section className="space-y-6">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  System Metadata
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <DetailItem
                    icon={Shield}
                    label="Access Role"
                    value={RoleMap[userData.role]}
                    isBadge
                  />
                  <DetailItem
                    icon={Fingerprint}
                    label="Unique Identifier"
                    value={userData.user_id}
                    isMono
                  />
                  <DetailItem
                    icon={Calendar}
                    label="Date Onboarded"
                    value={new Date(userData.created_at).toLocaleDateString(
                      undefined,
                      {
                        dateStyle: "medium",
                      }
                    )}
                  />
                  <DetailItem
                    icon={Clock}
                    label="Last Profile Sync"
                    value={new Date(userData.updated_at).toLocaleDateString(
                      undefined,
                      {
                        dateStyle: "medium",
                      }
                    )}
                  />
                </div>
              </section>
            </div>
          </>
        ) : (
          <NotFoundState />
        )}
      </SheetContent>
    </Sheet>
  );
}

/* --- Refactored Sub-Components for Cleanliness --- */

function ContactCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="group flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-border hover:bg-muted/20 transition-all">
      <div className="flex items-center justify-center w-11 h-11 rounded-full bg-primary/5 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
          {label}
        </p>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, isBadge, isMono }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      {isBadge ? (
        <Badge variant="outline" className="font-semibold px-2 py-0">
          {value}
        </Badge>
      ) : (
        <p
          className={`text-sm font-medium ${
            isMono
              ? "font-mono text-xs text-muted-foreground bg-muted p-1 px-2 rounded"
              : ""
          } truncate`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <UserIcon className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-xl font-bold">User profile not found</h3>
      <p className="text-muted-foreground mt-2 max-w-62.5">
        We couldn't retrieve any data for this specific entity ID.
      </p>
      <Button variant="link" onClick={() => window.location.reload()}>
        Try refreshing
      </Button>
    </div>
  );
}

function UserSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-3">
        <Skeleton className="h-10 w-2/3 rounded-lg" />
        <Skeleton className="h-5 w-1/4 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
      <Skeleton className="h-50 w-full rounded-xl" />
    </div>
  );
}
