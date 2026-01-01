# Quick Start: Adding Dialog to Marketing Page

This guide shows you exactly how to add the dialog system to your marketing page.

## 📝 Step-by-Step

### 1. Update Your Marketing Page

Find your marketing page file (likely `app/(dashboard)/marketing/page.tsx`) and update it:

```tsx
"use client";

import { trpc } from "@/lib/trpc";
import { marketingColumns } from "@/components/Data-Table/marketingColumns";
import { marketingCardConfig } from "@/components/Data-Table/marketingCardConfig";
import { DataTable } from "@/components/Data-Table/data-table";
import { DialogProvider } from "@/providers/dialog-provider"; // 👈 Add this
import { MarketingViewDialog } from "@/components/dialogs/MarketingViewDialog"; // 👈 Add this

export default function MarketingPage() {
  const { data, isLoading } = trpc.marketingProfiles.getCampaigns.useQuery();

  return (
    <DialogProvider> {/* 👈 Wrap entire page */}
      <div className="container mx-auto">
        <h1>Marketing Campaigns</h1>
        
        <DataTable
          columns={marketingColumns}
          data={data?.campaigns || []}
          cardConfig={marketingCardConfig}
          isLoading={isLoading}
          // Remove any old dialog props like:
          // route="marketing" ❌
          // handleDialogOpen={...} ❌
          // dialogOpen={...} ❌
        />
      </div>
      
      {/* 👈 Add dialog component */}
      <MarketingViewDialog />
    </DialogProvider>
  );
}
```

### 2. That's It!

Seriously, that's all you need to do. Now when you click on any campaign row or card:
- ✅ Dialog automatically opens
- ✅ Fetches campaign data by ID
- ✅ Displays beautiful campaign preview
- ✅ No prop drilling needed

## 🎯 What Changed?

### Removed (Old System)
```tsx
// ❌ Remove all of this:
const [dialogOpen, setDialogOpen] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);

<DataTable
  route="marketing"
  handleDialogOpen={setDialogOpen}
  dialogOpen={dialogOpen}
/>
```

### Added (New System)
```tsx
// ✅ Add just this:
import { DialogProvider } from "@/providers/dialog-provider";
import { MarketingViewDialog } from "@/components/dialogs/MarketingViewDialog";

<DialogProvider>
  <YourContent />
  <MarketingViewDialog />
</DialogProvider>
```

## 🎨 Customizing the Marketing Dialog

The `MarketingViewDialog` is already created and includes:

- ✅ Campaign preview with image
- ✅ Headline and description
- ✅ Organization badge
- ✅ Start and end dates
- ✅ CTA buttons/links
- ✅ Edit, Pause/Activate, Delete actions
- ✅ Loading states
- ✅ Error handling

### Want to customize it?

Edit `components/dialogs/MarketingViewDialog.tsx`:

```tsx
// Add more fields
<div className="space-y-2">
  <p className="text-xs text-muted-foreground">Budget</p>
  <p className="text-sm font-medium">${campaign.budget}</p>
</div>

// Add custom actions
<Button onClick={() => handleAnalytics(campaign.id)}>
  View Analytics
</Button>

// Customize the preview
<div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-lg">
  <h3 className="text-white font-bold">{campaign.headline}</h3>
</div>
```

## 📚 Complete Example

Here's a complete marketing page with everything:

```tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { marketingColumns } from "@/components/Data-Table/marketingColumns";
import { marketingCardConfig } from "@/components/Data-Table/marketingCardConfig";
import { DataTable } from "@/components/Data-Table/data-table";
import { DialogProvider } from "@/providers/dialog-provider";
import { MarketingViewDialog } from "@/components/dialogs/MarketingViewDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MarketingDialog from "./_components/marketing-dialog"; // Your create dialog

export default function MarketingPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = trpc.marketingProfiles.getCampaigns.useQuery({
    page,
    limit,
  });

  return (
    <DialogProvider>
      <div className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Marketing Campaigns</h1>
            <p className="text-muted-foreground">
              Manage and track your marketing campaigns
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* DataTable with dialog support */}
        <DataTable
          columns={marketingColumns}
          data={data?.campaigns || []}
          cardConfig={marketingCardConfig}
          pagination={{
            currentPage: page,
            totalPages: data?.totalPages || 1,
            totalItems: data?.total || 0,
            pageSize: limit,
            onPageChange: setPage,
            onNextPage: () => setPage((p) => p + 1),
            onPreviousPage: () => setPage((p) => Math.max(1, p - 1)),
            canNextPage: page < (data?.totalPages || 1),
            canPreviousPage: page > 1,
          }}
          isLoading={isFetching}
        />
      </div>

      {/* View Dialog - Opens automatically on row click */}
      <MarketingViewDialog />

      {/* Create Dialog - Manual control */}
      <MarketingDialog
        open={createDialogOpen}
        handleDialogOpen={setCreateDialogOpen}
      />
    </DialogProvider>
  );
}
```

## 🔄 Side-by-Side Comparison

### Before (With Prop Drilling)
```tsx
export default function MarketingPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const { data } = useQuery();

  const handleRowClick = (campaign) => {
    setSelectedCampaign(campaign);
    setDialogOpen(true);
  };

  return (
    <>
      <DataTable
        data={data}
        onRowClick={handleRowClick}
        handleDialogOpen={setDialogOpen}
        dialogOpen={dialogOpen}
      />
      
      <MarketingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        campaign={selectedCampaign}
      />
    </>
  );
}
```

### After (With DialogProvider)
```tsx
export default function MarketingPage() {
  const { data } = useQuery();

  return (
    <DialogProvider>
      <DataTable data={data} cardConfig={marketingCardConfig} />
      <MarketingViewDialog />
    </DialogProvider>
  );
}
```

**Lines of code:** 25 → 8 (68% reduction!)

## ✅ Checklist

- [ ] Import `DialogProvider` from `@/providers/dialog-provider`
- [ ] Import `MarketingViewDialog` from `@/components/dialogs/MarketingViewDialog`
- [ ] Wrap page content with `<DialogProvider>`
- [ ] Add `<MarketingViewDialog />` inside provider
- [ ] Remove old dialog state (`useState`, `setDialogOpen`, etc.)
- [ ] Remove old dialog props from DataTable (`route`, `handleDialogOpen`, etc.)
- [ ] Add `cardConfig={marketingCardConfig}` to DataTable
- [ ] Test clicking campaigns
- [ ] Celebrate! 🎉

## 🎓 Next Steps

Now that you have dialogs for Users and Marketing:

1. **Facilities**: Create `FacilityViewDialog` (copy UserViewDialog template)
2. **Other entities**: Follow the same pattern
3. **Customize dialogs**: Add more actions, fields, styling

Every new entity takes < 10 minutes to set up!

## 💡 Pro Tip

Keep your create/edit dialogs separate from view dialogs:

```tsx
<DialogProvider>
  {/* Your content */}
  
  {/* View Dialog - Automatic */}
  <MarketingViewDialog />
  
  {/* Create Dialog - Manual control */}
  <MarketingDialog
    open={createDialogOpen}
    handleDialogOpen={setCreateDialogOpen}
  />
</DialogProvider>
```

This way:
- **View dialogs**: Opened automatically by DataTable
- **Create/Edit dialogs**: Opened manually by buttons

---

Need help? Check:
- `DIALOG_SYSTEM_README.md` - Full documentation
- `UserViewDialog.tsx` - Complete example
- `MarketingViewDialog.tsx` - Campaign example
