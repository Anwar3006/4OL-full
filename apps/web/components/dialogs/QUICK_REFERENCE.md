# Dialog System - Quick Reference Card

## 🚀 Setup (3 Steps)

```tsx
// 1. Import
import { DialogProvider } from "@/providers/dialog-provider";
import { YourEntityViewDialog } from "@/components/dialogs/YourEntityViewDialog";

// 2. Wrap
<DialogProvider>
  <YourContent />
  <YourEntityViewDialog />
</DialogProvider>;

// 3. Done! Rows auto-open dialog
```

## 📝 Create New Dialog (Template)

```tsx
"use client";
import { useDialog } from "@/providers/dialog-provider";
import { trpc } from "@/lib/trpc";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function EntityViewDialog() {
  const { isOpen, entityId, closeDialog } = useDialog();
  const { data, isLoading } = trpc.entity.getById.useQuery(
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
        {/* Your content */}
      </SheetContent>
    </Sheet>
  );
}
```

## 🎯 Common Patterns

### Open Dialog from Anywhere

```tsx
const { openDialog } = useDialog();
<Button onClick={() => openDialog("id-123")}>View</Button>;
```

### Custom Row Click

```tsx
<DataTable
  data={data}
  onRowClick={(id) => {
    // Your custom logic
    console.log(id);
  }}
/>
```

### Custom ID Field

```tsx
<DataTable data={data} getRowId={(row) => row.customId} />
```

## 🔧 useDialog() Hook

```tsx
const {
  isOpen, // boolean
  entityId, // string | null
  openDialog, // (id: string) => void
  closeDialog, // () => void
} = useDialog();
```

## ✅ DataTable Props

```tsx
<DataTable
  columns={columns}               // Required
  data={data}                     // Required
  cardConfig={cardConfig}         // For mobile
  pagination={paginationProps}    // Optional
  isLoading={isLoading}          // Optional
  onRowClick={(id) => {...}}     // Optional custom handler
  getRowId={(row) => row.id}     // Optional custom ID getter
/>
```

## 📚 Files Reference

```
providers/dialog-provider.tsx          - Context & hook
components/dialogs/
  ├── UserViewDialog.tsx               - Example
  ├── MarketingViewDialog.tsx          - Example
  ├── DIALOG_SYSTEM_README.md          - Full docs
  └── MARKETING_PAGE_EXAMPLE.md        - Tutorial
```

## 🐛 Troubleshooting

| Issue             | Solution                            |
| ----------------- | ----------------------------------- |
| Dialog won't open | Wrap with `<DialogProvider>`        |
| Data not loading  | Add `enabled: isOpen && !!entityId` |
| TypeScript error  | Check imports & paths               |
| Multiple dialogs  | Use separate providers              |

## 💡 Best Practices

✅ **DO:**

- Wrap page with DialogProvider
- Check `if (!isOpen) return null`
- Use `enabled` in queries
- Keep view/create dialogs separate

❌ **DON'T:**

- Pass dialog state as props
- Fetch data outside dialog
- Forget to import DialogProvider
- Mix create and view dialogs

## 🎯 Examples

### Users

```tsx
<DialogProvider>
  <DataTable data={users} cardConfig={userCardConfig} />
  <UserViewDialog />
</DialogProvider>
```

### Marketing

```tsx
<DialogProvider>
  <DataTable data={campaigns} cardConfig={marketingCardConfig} />
  <MarketingViewDialog />
</DialogProvider>
```

### Custom

```tsx
const { openDialog } = useDialog();
<Button onClick={() => openDialog(user.id)}>View User</Button>;
```

---

**Need more help?** See `DIALOG_SYSTEM_README.md` for complete documentation.
