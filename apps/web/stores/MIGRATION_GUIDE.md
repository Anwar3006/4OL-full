# 🔄 Migration Guide: Context → Zustand

## Step-by-Step Migration

### Step 1: Install Zustand

```bash
pnpm add zustand
```

### Step 2: Files Already Created ✅

- ✅ `stores/dialog-store.ts` - Main dialog store with all hooks

### Step 3: Update Facility Components

#### 3A. Update `FacilityViewDialog.tsx`

**BEFORE:**
```tsx
import { useDialog } from "@/providers/dialog-provider";

export function FacilityViewDialog() {
  const { isOpen, entityId, closeDialog } = useDialog();
  const [openDialog, setOpenDialog] = useState(false);
  
  const handleEdit = () => {
    closeDialog();
    setOpenDialog(true);
  };
  
  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
        {/* ... */}
        <button onClick={handleEdit}>Edit Profile</button>
      </Sheet>
      
      {openDialog && (
        <AddFacilityDialog
          open={openDialog}
          handleDialogOpen={setOpenDialog}  // BUG: was closeDialog
          data={facility as TFacilityTable}
        />
      )}
    </>
  );
}
```

**AFTER:**
```tsx
import { useViewFacilityDialog, useAddFacilityDialog } from "@/stores/dialog-store";

export function FacilityViewDialog() {
  const viewDialog = useViewFacilityDialog();
  const addDialog = useAddFacilityDialog();
  
  const { data: facilityData, isLoading } =
    trpc.facilityProfiles.getById.useQuery(
      { id: viewDialog.entityId! },
      { enabled: viewDialog.isOpen && !!viewDialog.entityId }
    );
  
  const handleEdit = () => {
    viewDialog.close();
    // Pass facility data for edit mode
    addDialog.open(facilityData);
  };
  
  return (
    <Sheet open={viewDialog.isOpen} onOpenChange={(open) => !open && viewDialog.close()}>
      {/* ... */}
      <button onClick={handleEdit}>Edit Profile</button>
    </Sheet>
  );
}
```

**Changes:**
- ❌ Removed `useDialog()` hook
- ❌ Removed `useState` for `openDialog`
- ❌ Removed `DialogProvider` dependency
- ✅ Added `useViewFacilityDialog()` hook
- ✅ Added `useAddFacilityDialog()` hook
- ✅ Fixed race condition - data persists between dialogs
- ✅ No need to render `AddFacilityDialog` here anymore

---

#### 3B. Update `AddFacilityDialog.tsx`

**BEFORE:**
```tsx
type AddFacilityDialogProps = {
  open: boolean;
  handleDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data?: any;
};

const AddFacilityDialog = ({ open, handleDialogOpen, data }: AddFacilityDialogProps) => {
  // ... form setup
  
  useEffect(() => {
    if (data) {
      console.log("Facility is being Edited");
      form.reset({
        ...data,
        // ... lots of 'as any' casts
      });
    }
  }, [data]);
  
  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      {/* ... */}
    </Dialog>
  );
};
```

**AFTER:**
```tsx
// Props no longer needed - state comes from store!
const AddFacilityDialog = () => {
  const { isOpen, data, isEditMode, close } = useAddFacilityDialog();
  
  // ... form setup
  
  // Better: Reset form when dialog opens with proper dependencies
  useEffect(() => {
    if (isOpen) {
      if (data) {
        // Edit mode - populate form with data
        form.reset({
          ...data,
          facilityType: data.facilityType,
          mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
          keywords: data.keywords || "",
          businessHours: data.businessHours || DEFAULT_BUSINESS_HOURS,
          amenities: Array.isArray(data.amenities) ? data.amenities : [],
          services: Array.isArray(data.services) ? data.services : [],
        });
      } else {
        // Create mode - reset to defaults
        form.reset({
          facilityType: "hospitals_&_clinics",
          facilityName: "",
          // ... all default values
        });
      }
    }
  }, [isOpen, data]);
  
  // Update dialog title based on mode
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogTitle>
        {isEditMode ? "Edit Facility" : "Register New Facility"}
      </DialogTitle>
      {/* ... */}
    </Dialog>
  );
};

export default AddFacilityDialog;
```

**Changes:**
- ❌ Removed props - no longer needed!
- ✅ Added `useAddFacilityDialog()` hook
- ✅ Fixed form reset timing (depends on `isOpen` now)
- ✅ Clearer edit vs create mode logic
- ✅ Removed `as any` casts for better type safety
- ✅ Dialog title changes based on mode

---

#### 3C. Update `facilities/[type]/page.tsx`

**BEFORE:**
```tsx
import { DialogProvider } from "@/providers/dialog-provider";
import AddFacilityDialog from "../_components/add-facility-dialog";
import { FacilityViewDialog } from "@/components/dialogs/FacilityViewDialog";

const FacilityPage = () => {
  // ... component code
  
  return (
    <DialogProvider>
      <section>
        {/* ... */}
        <DataTable
          columns={facilityColumns}
          data={data?.facilities || []}
          // route is used for onClick
        />
      </section>
      
      <FacilityViewDialog />
    </DialogProvider>
  );
};
```

**AFTER:**
```tsx
import AddFacilityDialog from "../_components/add-facility-dialog";
import { FacilityViewDialog } from "@/components/dialogs/FacilityViewDialog";

const FacilityPage = () => {
  // ... component code
  
  return (
    <section>
      {/* ... */}
      <DataTable
        columns={facilityColumns}
        data={data?.facilities || []}
      />
      
      {/* Dialogs render at the same level - no provider needed! */}
      <FacilityViewDialog />
      <AddFacilityDialog />
    </section>
  );
};
```

**Changes:**
- ❌ Removed `DialogProvider` wrapper
- ❌ Removed provider import
- ✅ Added `AddFacilityDialog` to page (was nested before)
- ✅ Cleaner component tree

---

#### 3D. Update `DataTable` Click Handler

**Option 1: Update facilityColumns.tsx**

```tsx
import { useViewFacilityDialog } from "@/stores/dialog-store";

// In your columns definition, you can't use hooks directly
// So pass the open function as a prop to columns

export const createFacilityColumns = (
  onRowClick: (id: string) => void
): ColumnDef<TFacilityProfile>[] => [
  // ... your columns
];

// Then in the page:
const FacilityPage = () => {
  const viewDialog = useViewFacilityDialog();
  
  const columns = createFacilityColumns(viewDialog.open);
  
  return (
    <DataTable
      columns={columns}
      data={facilities}
      onRowClick={(facility) => viewDialog.open(facility.id)}
    />
  );
};
```

**Option 2: Update DataTable component**

If you want DataTable to handle clicks:

```tsx
// data-table.tsx
import { useViewFacilityDialog } from "@/stores/dialog-store";

export const DataTable = <TData,>({ 
  columns, 
  data,
  onRowClick,  // Optional custom click handler
}: DataTableProps<TData>) => {
  const viewDialog = useViewFacilityDialog();
  
  const handleRowClick = (row: TData) => {
    if (onRowClick) {
      onRowClick(row);
    } else {
      // Default behavior - open view dialog
      viewDialog.open((row as any).id);
    }
  };
  
  return (
    <Table>
      {/* ... */}
      <TableRow onClick={() => handleRowClick(row.original)}>
        {/* ... */}
      </TableRow>
    </Table>
  );
};
```

---

#### 3E. Update `SectionHeader.tsx`

**BEFORE:**
```tsx
const SectionHeader = ({
  title,
  description,
  Icon,
  buttonLabel,
  hasButton = true,
  Dialog,
}: PageHeaderProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      {/* ... */}
      {hasButton && Dialog && (
        <Button onClick={() => setDialogOpen(true)}>
          {buttonLabel}
        </Button>
      )}

      {Dialog && <Dialog open={dialogOpen} handleDialogOpen={setDialogOpen} />}
    </div>
  );
};
```

**AFTER:**

Option 1: Pass dialog hook to SectionHeader
```tsx
type SectionHeaderProps = {
  title: string;
  description: string;
  Icon: any;
  buttonLabel?: string;
  hasButton?: boolean;
  onButtonClick?: () => void;  // Changed from Dialog component
};

const SectionHeader = ({
  title,
  description,
  Icon,
  buttonLabel,
  hasButton = true,
  onButtonClick,
}: SectionHeaderProps) => {
  return (
    <div>
      {/* ... */}
      {hasButton && (
        <Button onClick={onButtonClick}>
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};

// In FacilityPage:
const addDialog = useAddFacilityDialog();

<SectionHeader
  title="Facilities"
  Icon={PlusCircleIcon}
  buttonLabel="Add Facility"
  hasButton
  onButtonClick={() => addDialog.open()}
/>
```

Option 2: Keep Dialog prop but update type
```tsx
// Keep existing SectionHeader but update how dialogs work
// Dialogs now control their own state via Zustand

// In FacilityPage:
<SectionHeader
  title="Facilities"
  Icon={PlusCircleIcon}
  buttonLabel="Add Facility"
  hasButton
  Dialog={AddFacilityDialog}  // Still works, but no props needed
/>
```

---

### Step 4: Migration Checklist

#### Facilities Module
- [ ] Update `FacilityViewDialog.tsx`
- [ ] Update `AddFacilityDialog.tsx`
- [ ] Update `facilities/[type]/page.tsx`
- [ ] Remove `DialogProvider` from facilities
- [ ] Test: Create facility
- [ ] Test: View facility
- [ ] Test: Edit facility from view dialog

#### Marketing Module
- [ ] Create `AddMarketingDialog.tsx` (or update existing)
- [ ] Create `MarketingViewDialog.tsx` (or update existing)
- [ ] Update marketing page
- [ ] Remove `DialogProvider`
- [ ] Test all flows

#### Users Module
- [ ] Update user dialogs
- [ ] Update user pages
- [ ] Remove `DialogProvider`
- [ ] Test all flows

#### Cleanup
- [ ] Delete `providers/dialog-provider.tsx`
- [ ] Remove all `DialogProvider` imports
- [ ] Search for `useDialog()` and replace all occurrences
- [ ] Update documentation

---

### Step 5: Testing Checklist

For each entity (Facilities, Marketing, Users):

- [ ] Can open "add" dialog from button
- [ ] Can open "view" dialog from table row click
- [ ] Can open "edit" dialog from view dialog
- [ ] Form populates correctly in edit mode
- [ ] Form is empty in create mode
- [ ] Dialog closes properly
- [ ] Data persists when switching between dialogs
- [ ] No race conditions
- [ ] No console errors
- [ ] DevTools show dialog state correctly

---

### Step 6: Advanced Features (Optional)

Once basic migration is done, you can add:

#### 1. Dialog Analytics

```tsx
// In dialog-store.ts
openDialog: (type, config) => {
  // Track analytics
  if (typeof window !== 'undefined' && window.analytics) {
    window.analytics.track('dialog_opened', { type });
  }
  
  set(/* ... */);
}
```

#### 2. Keyboard Shortcuts

```tsx
// In your app layout
import { useDialogStore } from '@/stores/dialog-store';

useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Cmd/Ctrl + K to open search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openDialog('search');
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

#### 3. Dialog History

```tsx
// Add to dialog-store.ts
interface DialogState {
  // ... existing
  history: DialogType[];
  
  goBack: () => void;
}

// In store:
openDialog: (type, config) => {
  set((state) => ({
    // ... existing
    history: [...state.history, type],
  }));
},

goBack: () => {
  set((state) => {
    const history = [...state.history];
    const currentDialog = history.pop();
    const previousDialog = history[history.length - 1];
    
    if (currentDialog) {
      // Close current
      state.closeDialog(currentDialog);
    }
    
    if (previousDialog) {
      // Reopen previous
      state.openDialog(previousDialog);
    }
    
    return { history };
  });
}
```

---

## 🎉 Migration Complete!

Once all steps are done:
- ✅ No more provider nesting
- ✅ No more prop drilling
- ✅ Type-safe dialog management
- ✅ Better DevTools
- ✅ Easier to add new dialogs
- ✅ Cleaner code

**Estimated Migration Time:** 8-12 hours total

**Per Module:** ~2-3 hours
