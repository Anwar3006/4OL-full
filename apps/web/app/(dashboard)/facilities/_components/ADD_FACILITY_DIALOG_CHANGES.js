// QUICK FIX for AddFacilityDialog.tsx
// Apply these changes to fix dialog lag and hide ImageDropZone in edit mode

// ============================================================================
// CHANGE 1: Update props to determine edit mode
// ============================================================================

// ADD this near the top of the component (around line 95)
const isEditMode = !!data;

// ============================================================================
// CHANGE 2: Defer location fetching (Fix lag)
// ============================================================================

// REPLACE the existing useEffect (lines 107-111):
// useEffect(() => {
//   if (open) {
//     getLocationCoordinates();
//   }
// }, [open]);

// WITH this improved version:
const [locationFetched, setLocationFetched] = useState(false);

useEffect(() => {
  // Skip location fetch in edit mode (already has location)
  if (open && !isEditMode && !locationFetched) {
    // Small delay to let dialog animation finish
    const timer = setTimeout(() => {
      getLocationCoordinates();
      setLocationFetched(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }
}, [open, isEditMode, locationFetched]);

// Reset location fetch flag when dialog closes
useEffect(() => {
  if (!open) {
    setLocationFetched(false);
  }
}, [open]);

// ============================================================================
// CHANGE 3: Update form reset with isEditMode (Fix timing)
// ============================================================================

// REPLACE the existing useEffect (lines 143-156):
// useEffect(() => {
//   if (data) {
//     console.log("Facility is being Edited");
//     form.reset({...});
//   } else {
//   }
// }, [data]);

// WITH this better version:
useEffect(() => {
  if (open) {
    if (isEditMode && data) {
      // Edit mode - populate form
      form.reset({
        ...data,
        facilityType: data.facilityType,
        mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
        keywords: data.keywords || "",
        businessHours: data.businessHours || DEFAULT_BUSINESS_HOURS,
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        services: Array.isArray(data.services) ? data.services : [],
      });
    } else if (!isEditMode) {
      // Create mode - reset to defaults
      form.reset({
        facilityType: "hospitals_&_clinics",
        facilityName: "",
        contactNumber: "",
        whatsappNumber: "",
        email: "",
        gpsAddress: "",
        street: "",
        postCode: "",
        area: "",
        district: "",
        region: "greater accra",
        country: "Ghana",
        firstName: "",
        lastName: "",
        ownerEmail: "",
        personContactNumber: "",
        position: "",
        mediaUrls: [],
        services: [],
        amenities: [],
        businessHours: DEFAULT_BUSINESS_HOURS,
        sameForWeekdays: false,
        keywords: "",
      });
    }
  }
}, [open, isEditMode, data]);

// ============================================================================
// CHANGE 4: Update Dialog Title (Show edit vs create)
// ============================================================================

// REPLACE DialogTitle (around line 185):
// <DialogTitle>Register New Facility</DialogTitle>

// WITH:
<DialogTitle>
  {isEditMode ? "Edit Facility" : "Register New Facility"}
</DialogTitle>

// ============================================================================
// CHANGE 5: Hide ImageDropZone in edit mode (Step 2)
// ============================================================================

// REPLACE the step 2 content (around lines 355-365):

{step === 2 && (
  <>
    <h3 className="font-semibold mb-4 underline text-center">
      Facility Images
    </h3>

    {/* Only show ImageDropZone in create mode */}
    {!isEditMode ? (
      <ImageDropZone
        filePath={filePath}
        initialFiles={form.watch("mediaUrls")}
        text="Upload clear photos of your facility (front view, interior, signage, opposite)"
        onFilesChange={(urls) => form.setValue("mediaUrls", urls)}
      />
    ) : (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/20">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm font-medium text-center mb-2">
          Image editing is not available in edit mode
        </p>
        <p className="text-xs text-muted-foreground text-center">
          Existing images will be preserved. To update facility images,
          <br />
          please contact support.
        </p>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={() => setStep(1)}
      >
        Back
      </Button>

      <Button
        type="submit"
        className="md:col-span-2 bg-emerald-600"
      >
        {submitting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          isEditMode ? "Update Facility" : "Register Facility"
        )}
      </Button>
    </div>
  </>
)}

// ============================================================================
// CHANGE 6: Add AlertCircle import at the top
// ============================================================================

// UPDATE the lucide-react import (around line 24):
import { Loader2, MapPinHouse, AlertCircle } from "lucide-react";

// ============================================================================
// SUMMARY OF CHANGES
// ============================================================================
// 1. Added isEditMode constant
// 2. Deferred location fetch with 300ms delay
// 3. Skip location fetch in edit mode
// 4. Fixed form reset timing with proper dependencies
// 5. Updated dialog title based on mode
// 6. Conditionally hide ImageDropZone in edit mode
// 7. Updated submit button text
// 8. Added AlertCircle import
