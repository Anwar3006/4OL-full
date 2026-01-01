# 🚀 Zustand Dialog Quick Reference

## Installation

```bash
pnpm add zustand
```

---

## Common Patterns

### 1. Open Dialog from Button Click

```tsx
import { useAddFacilityDialog } from '@/stores/dialog-store';

function Header() {
  const addDialog = useAddFacilityDialog();
  
  return (
    <Button onClick={() => addDialog.open()}>
      Add Facility
    </Button>
  );
}
```

### 2. Open Dialog from Table Row Click

```tsx
import { useViewFacilityDialog } from '@/stores/dialog-store';

function FacilityTable() {
  const viewDialog = useViewFacilityDialog();
  
  return (
    <DataTable
      data={facilities}
      onRowClick={(facility) => viewDialog.open(facility.id)}
    />
  );
}
```

### 3. Dialog Component (View Mode)

```tsx
import { useViewFacilityDialog } from '@/stores/dialog-store';

function FacilityViewDialog() {
  const { isOpen, entityId, close } = useViewFacilityDialog();
  
  const { data } = trpc.facilities.getById.useQuery(
    { id: entityId! },
    { enabled: isOpen && !!entityId }
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        {data && <div>{data.name}</div>}
      </DialogContent>
    </Dialog>
  );
}
```

### 4. Dialog Component (Add/Edit Mode)

```tsx
import { useAddFacilityDialog } from '@/stores/dialog-store';

function AddFacilityDialog() {
  const { isOpen, data, isEditMode, close } = useAddFacilityDialog();
  
  useEffect(() => {
    if (isOpen && data) {
      form.reset(data); // Populate form for edit
    }
  }, [isOpen, data]);
  
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogTitle>
        {isEditMode ? 'Edit Facility' : 'Add Facility'}
      </DialogTitle>
      <Form>{/* ... */}</Form>
    </Dialog>
  );
}
```

### 5. Open Edit Dialog from View Dialog

```tsx
import { useViewFacilityDialog, useAddFacilityDialog } from '@/stores/dialog-store';

function FacilityViewDialog() {
  const viewDialog = useViewFacilityDialog();
  const addDialog = useAddFacilityDialog();
  
  const { data } = trpc.facilities.getById.useQuery(/* ... */);
  
  const handleEdit = () => {
    viewDialog.close();
    addDialog.open(data); // Pass data for edit mode
  };
  
  return (
    <Dialog open={viewDialog.isOpen}>
      <button onClick={handleEdit}>Edit</button>
    </Dialog>
  );
}
```

### 6. Close Dialog After Form Submit

```tsx
import { useAddFacilityDialog } from '@/stores/dialog-store';

function AddFacilityDialog() {
  const { close } = useAddFacilityDialog();
  
  const handleSubmit = async (formData) => {
    try {
      await createFacility(formData);
      close(); // Close dialog on success
      toast.success('Facility created!');
    } catch (error) {
      toast.error('Failed to create facility');
    }
  };
  
  return <Form onSubmit={handleSubmit}>{/* ... */}</Form>;
}
```

---

## Adding New Dialog Types

### Step 1: Add to DialogType Enum

```typescript
// stores/dialog-store.ts
export type DialogType = 
  | 'add-facility'
  | 'view-facility'
  | 'add-your-entity'    // 👈 Add this
  | 'view-your-entity';  // 👈 Add this
```

### Step 2: Create Typed Hooks

```typescript
// stores/dialog-store.ts
export const useAddYourEntityDialog = () => {
  const openDialog = useDialogStore(state => state.openDialog);
  const closeDialog = useDialogStore(state => state.closeDialog);
  const isOpen = useDialogStore(state => state.isDialogOpen('add-your-entity'));
  const data = useDialogStore(state => state.getDialogData('add-your-entity'));
  
  return {
    isOpen,
    data,
    isEditMode: !!data,
    open: (data?: any) => openDialog('add-your-entity', { data }),
    close: () => closeDialog('add-your-entity'),
  };
};

export const useViewYourEntityDialog = () => {
  const openDialog = useDialogStore(state => state.openDialog);
  const closeDialog = useDialogStore(state => state.closeDialog);
  const isOpen = useDialogStore(state => state.isDialogOpen('view-your-entity'));
  const entityId = useDialogStore(state => state.getEntityId('view-your-entity'));
  
  return {
    isOpen,
    entityId,
    open: (entityId: string) => openDialog('view-your-entity', { entityId }),
    close: () => closeDialog('view-your-entity'),
  };
};
```

### Step 3: Use in Components

```tsx
import { useAddYourEntityDialog, useViewYourEntityDialog } from '@/stores/dialog-store';

// Now use like any other dialog!
const addDialog = useAddYourEntityDialog();
const viewDialog = useViewYourEntityDialog();
```

---

## Performance Optimization

### ✅ Use Selectors (Good)

```tsx
// Only re-renders when this specific dialog state changes
const isOpen = useDialogStore(state => state.isDialogOpen('add-facility'));
```

### ❌ Don't Destructure Store (Bad)

```tsx
// Re-renders on ANY store change
const store = useDialogStore();
const isOpen = store.isDialogOpen('add-facility');
```

---

## Debugging with DevTools

1. Install [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools)
2. Open DevTools → Redux tab
3. See all dialog actions in real-time
4. Time-travel through dialog state changes

---

## Common Gotchas

### 1. Dialog Not Opening?

Check if you're calling `open()` correctly:

```tsx
// ✅ Correct
addDialog.open();
addDialog.open(editData);

// ❌ Wrong
addDialog.open; // Forgot parentheses
```

### 2. Form Not Populating in Edit Mode?

Make sure `useEffect` depends on both `isOpen` and `data`:

```tsx
useEffect(() => {
  if (isOpen && data) {
    form.reset(data);
  }
}, [isOpen, data]); // Both dependencies needed
```

### 3. Dialog Not Closing?

Use the `close` function, not `onOpenChange` with false:

```tsx
// ✅ Correct
<Dialog open={isOpen} onOpenChange={close}>

// ❌ Wrong
<Dialog open={isOpen} onOpenChange={() => close()}>
```

---

## TypeScript Tips

### Type Dialog Data

```typescript
interface FacilityEditData {
  id: string;
  name: string;
  // ...
}

const { data } = useAddFacilityDialog();
const typedData = data as FacilityEditData;
```

### Create Generic Hook

```typescript
function useEntityDialog<T>(dialogType: DialogType) {
  const openDialog = useDialogStore(state => state.openDialog);
  const closeDialog = useDialogStore(state => state.closeDialog);
  const isOpen = useDialogStore(state => state.isDialogOpen(dialogType));
  const data = useDialogStore(state => state.getDialogData<T>(dialogType));
  
  return { isOpen, data, open: openDialog, close: closeDialog };
}
```

---

## Cheat Sheet

| Action | Code |
|--------|------|
| Open dialog | `dialog.open()` |
| Open with data | `dialog.open(data)` |
| Close dialog | `dialog.close()` |
| Check if open | `dialog.isOpen` |
| Get dialog data | `dialog.data` |
| Check edit mode | `dialog.isEditMode` |
| Get entity ID | `dialog.entityId` |

---

## Next Steps

1. ✅ Migrate facilities module
2. ✅ Test all flows
3. ✅ Migrate marketing module
4. ✅ Migrate users module
5. ✅ Remove old dialog provider
6. ✅ Celebrate! 🎉

For detailed migration steps, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
