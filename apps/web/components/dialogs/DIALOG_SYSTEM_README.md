# Dialog Management System

A clean, context-based dialog system that eliminates prop drilling and makes it easy to open entity dialogs from anywhere in your app.

## 🎯 Problem Solved

**Before:** Messy prop drilling and verbose code
```tsx
// ❌ Old way - prop drilling nightmare
<DataTable
  data={users}
  handleDialogOpen={setDialogOpen}
  dialogOpen={dialogOpen}
  Dialog={UserDialog}
  route="users"
/>

// In parent component
const [dialogOpen, setDialogOpen] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);
```

**After:** Clean context-based approach
```tsx
// ✅ New way - zero prop drilling!
<DialogProvider>
  <DataTable data={users} cardConfig={userCardConfig} />
  <UserViewDialog />
</DialogProvider>
```

## 📦 Files Created

```
providers/
└── dialog-provider.tsx          # Context provider and useDialog hook

components/dialogs/
├── UserViewDialog.tsx            # User entity dialog
└── MarketingViewDialog.tsx       # Marketing entity dialog
```

## 🚀 Quick Start

### 1. Wrap Your Page with DialogProvider

```tsx
import { DialogProvider } from "@/providers/dialog-provider";
import { UserViewDialog } from "@/components/dialogs/UserViewDialog";

export default function UsersPage() {
  return (
    <DialogProvider>
      {/* Your page content */}
      <DataTable data={users} cardConfig={userCardConfig} />
      
      {/* Dialog listens to context automatically */}
      <UserViewDialog />
    </DialogProvider>
  );
}
```

### 2. DataTable Automatically Opens Dialogs

The DataTable component now automatically calls `openDialog(id)` when a row or card is clicked. No extra props needed!

```tsx
<DataTable
  columns={userColumns}
  data={users}
  cardConfig={userCardConfig}
  pagination={paginationProps}
  // That's it! Clicking opens the dialog automatically
/>
```

### 3. Create Your Entity Dialog

```tsx
"use client";

import { useDialog } from "@/providers/dialog-provider";
import { trpc } from "@/lib/trpc";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function YourEntityViewDialog() {
  const { isOpen, entityId, closeDialog } = useDialog();

  // Only fetch when dialog is open
  const { data, isLoading } = trpc.yourEntity.getById.useQuery(
    { id: entityId! },
    { enabled: isOpen && !!entityId }
  );

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{data?.name}</SheetTitle>
        </SheetHeader>
        {/* Your dialog content */}
      </SheetContent>
    </Sheet>
  );
}
```

## 🎨 Creating a New Dialog

### Step 1: Create Dialog Component

Create a new file in `components/dialogs/YourEntityViewDialog.tsx`:

```tsx
"use client";

import { useDialog } from "@/providers/dialog-provider";
import { trpc } from "@/lib/trpc";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export function YourEntityViewDialog() {
  const { isOpen, entityId, closeDialog } = useDialog();

  // Fetch data when dialog opens
  const { data: entity, isLoading } = trpc.yourEntity.getById.useQuery(
    { id: entityId! },
    { enabled: isOpen && !!entityId }
  );

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        {isLoading ? (
          <EntitySkeleton />
        ) : entity ? (
          <>
            <SheetHeader>
              <SheetTitle>{entity.name}</SheetTitle>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Your entity details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                  Details
                </h3>
                {/* Display entity fields here */}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p>Entity not found</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function EntitySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      {/* Add more skeleton elements */}
    </div>
  );
}
```

### Step 2: Add to Your Page

```tsx
import { DialogProvider } from "@/providers/dialog-provider";
import { YourEntityViewDialog } from "@/components/dialogs/YourEntityViewDialog";

export default function YourPage() {
  return (
    <DialogProvider>
      <YourPageContent />
      <YourEntityViewDialog />
    </DialogProvider>
  );
}
```

## 🔧 API Reference

### DialogProvider

Context provider that manages dialog state.

```tsx
<DialogProvider>
  {children}
</DialogProvider>
```

Must wrap any components that need to open or display dialogs.

### useDialog Hook

Hook to access dialog methods and state.

```tsx
const { isOpen, entityId, openDialog, closeDialog } = useDialog();
```

**Returns:**
- `isOpen: boolean` - Whether the dialog is currently open
- `entityId: string | null` - ID of the entity being viewed
- `openDialog: (id: string) => void` - Function to open dialog with an entity ID
- `closeDialog: () => void` - Function to close the dialog

**Example Usage:**

```tsx
// In a button click handler
const handleViewDetails = (id: string) => {
  openDialog(id);
};

// In a dialog component
if (!isOpen || !entityId) return null;
```

### DataTable Props

The DataTable has been updated to work with the dialog system:

```tsx
<DataTable
  columns={columns}
  data={data}
  cardConfig={cardConfig}
  pagination={paginationProps}
  isLoading={isLoading}
  onRowClick={(id) => openDialog(id)} // Optional: custom click handler
  getRowId={(row) => row.customIdField} // Optional: custom ID getter
/>
```

**Props:**
- `onRowClick?: (id: string) => void` - Optional custom click handler. If not provided, automatically calls `openDialog(id)`
- `getRowId?: (row: TData) => string` - Optional function to extract ID from row data. Defaults to `row.id`

## 📝 Examples

### Example 1: Users Page (Already Implemented)

```tsx
import { DialogProvider } from "@/providers/dialog-provider";
import { UserViewDialog } from "@/components/dialogs/UserViewDialog";

export default function UsersPage() {
  // ... your state and queries

  return (
    <DialogProvider>
      <div className="container">
        <DataTable
          columns={userColumns}
          data={users}
          cardConfig={userCardConfig}
          pagination={paginationProps}
        />
      </div>
      
      <UserViewDialog />
    </DialogProvider>
  );
}
```

### Example 2: Marketing Page

```tsx
import { DialogProvider } from "@/providers/dialog-provider";
import { MarketingViewDialog } from "@/components/dialogs/MarketingViewDialog";

export default function MarketingPage() {
  return (
    <DialogProvider>
      <DataTable
        columns={marketingColumns}
        data={campaigns}
        cardConfig={marketingCardConfig}
        pagination={paginationProps}
      />
      
      <MarketingViewDialog />
    </DialogProvider>
  );
}
```

### Example 3: Custom Click Handler

If you need custom behavior instead of opening a dialog:

```tsx
const handleRowClick = (id: string) => {
  // Custom logic
  console.log("Clicked:", id);
  // Or navigate somewhere
  router.push(`/custom-route/${id}`);
};

<DataTable
  columns={columns}
  data={data}
  onRowClick={handleRowClick}
/>
```

### Example 4: Multiple Dialogs on Same Page

You can have multiple DialogProviders for different sections:

```tsx
export default function ComplexPage() {
  return (
    <>
      {/* Section 1: Users */}
      <DialogProvider>
        <UsersSection />
        <UserViewDialog />
      </DialogProvider>

      {/* Section 2: Marketing */}
      <DialogProvider>
        <MarketingSection />
        <MarketingViewDialog />
      </DialogProvider>
    </>
  );
}
```

Or use a single provider with multiple dialogs:

```tsx
export default function ComplexPage() {
  return (
    <DialogProvider>
      <UsersSection />
      <MarketingSection />
      
      {/* Both dialogs listen to the same context */}
      <UserViewDialog />
      <MarketingViewDialog />
    </DialogProvider>
  );
}
```

## ✨ Benefits

### 1. **Zero Prop Drilling**
No more passing dialog state through multiple levels of components.

### 2. **Automatic Data Fetching**
Dialog fetches data only when opened, using the ID from context.

### 3. **Type Safe**
Full TypeScript support with proper typing.

### 4. **Flexible**
Works with any entity type - just create a new dialog component.

### 5. **Clean Code**
Separation of concerns - DataTable handles display, DialogProvider handles state, Dialog components handle rendering.

### 6. **Performant**
Dialogs only render when open, and data is only fetched when needed.

## 🔄 Migration Guide

### From Old System (Prop Drilling)

**Before:**
```tsx
// Parent component
const [dialogOpen, setDialogOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState<User | null>(null);

<DataTable
  data={users}
  handleDialogOpen={setDialogOpen}
  dialogOpen={dialogOpen}
  Dialog={UserDialog}
  selectedUser={selectedUser}
  onRowClick={(user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  }}
/>

<UserDialog
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  user={selectedUser}
/>
```

**After:**
```tsx
// Parent component - clean and simple!
<DialogProvider>
  <DataTable data={users} cardConfig={userCardConfig} />
  <UserViewDialog />
</DialogProvider>
```

## 🐛 Troubleshooting

### Dialog not opening?

Make sure:
1. Your page is wrapped with `<DialogProvider>`
2. Your dialog component is using `useDialog()` hook
3. Your dialog component checks `if (!isOpen) return null;`

### Data not fetching?

Check that:
1. Your query has `enabled: isOpen && !!entityId`
2. Your tRPC route accepts an `id` parameter
3. The ID is being extracted correctly (use `getRowId` if needed)

### Multiple dialogs conflicting?

Use separate `DialogProvider` components for different sections, or ensure your dialog components check the entity type if needed.

### TypeScript errors?

Ensure your dialog is imported correctly and uses the `useDialog()` hook from the provider.

## 📚 Additional Resources

- See `UserViewDialog.tsx` for a complete example
- See `MarketingViewDialog.tsx` for another example
- Check `data-table.tsx` to see how it integrates with the system

---

## 🎉 Summary

This dialog system provides:
- ✅ Zero prop drilling
- ✅ Automatic data fetching
- ✅ Clean, maintainable code
- ✅ Type-safe implementation
- ✅ Easy to extend for new entities
- ✅ Works seamlessly with DataTable and cards

Simply wrap your page with `DialogProvider`, add your dialog component, and you're done!
