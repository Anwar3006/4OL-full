import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FacilityProfileInput,
  facilityProfileSchema,
} from "@4ol/db/schemas/facility-profile.schema";
import {
  DEFAULT_BUSINESS_HOURS,
  FACILITY_REQUIREMENTS,
  FACILITY_TYPE_OPTIONS,
} from "@4ol/db/types/formInput";
import { Button } from "@/components/ui/button";
import { BusinessHoursSection } from "./business-hours";
import CustomInput from "@/components/CustomInput";
import CustomSelect from "@/components/CustomSelect";
import { useGeolocation } from "@/hooks/use-geolocation";
import useGhanaPostGPS from "@/hooks/useGhanaPostGPS";
import { toast } from "sonner";
import { Loader2, MapPinHouse } from "lucide-react";
import z from "zod";
import { MultiSelect } from "@/components/MultiSelect";
import { cn } from "@/lib/utils";
import ImageDropZone from "@/components/ImageDropZone";
import { trpc } from "@/lib/trpc";
import { nanoid } from "nanoid";
import { useAddFacilityDialog } from "@/stores/dialog-store";
import { authClient } from "@/lib/auth-client";
import FacilityCredentialsModal from "./facility-credentials-modal";

// Step 1 Fields - To make sure we validate these fields before moving on to Step 2
const STEP_1_FIELDS: (keyof FacilityProfileInput)[] = [
  "facilityType",
  "facilityName",
  "contactNumber",
  "email",
  "gpsAddress",
  "area",
  "district",
  "region",
  "amenities",
  "services",
  "firstName",
  "lastName",
  "ownerEmail",
];

const AddFacilityDialog = () => {
  const { isOpen, data, isEditMode, close } = useAddFacilityDialog();
  // Progress Step Management
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [facilityModal, setFacilityModal] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
    facilityName: string;
  } | null>(null);
  const queryUtils = trpc.useUtils();

  // Hooks to fetch location and Ghana Post Address
  const {
    getLocationCoordinates,
    coordinates,
    loading: coordinatesLoading,
    error: coordintatesError,
  } = useGeolocation();

  const { fetchGhanaPostAddress, loading: addressLoading } = useGhanaPostGPS();

  const isLoadingLocation = coordinatesLoading || addressLoading;

  const form = useForm({
    resolver: zodResolver(
      facilityProfileSchema.safeExtend({
        sameForWeekdays: z.boolean().default(false),
      })
    ),
    defaultValues: {
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
    },
  });

  // PREVENT LAG: Use a clean reset when the dialog opens/closes
  // We no longer call getLocationCoordinates here
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && data) {
        form.reset({ ...form.getValues(), ...data });
      } else {
        form.reset({
          facilityName: "",
          contactNumber: "",
          region: "greater accra",
          country: "Ghana",
          sameForWeekdays: false,
          businessHours: DEFAULT_BUSINESS_HOURS,
          mediaUrls: [],
          services: [],
          amenities: [],
        });
      }
    }
  }, [isOpen, isEditMode, data, form]);

  // 2. Fetch address only when coordinates are acquired
  useEffect(() => {
    if (coordinates?.latitude && coordinates?.longitude) {
      fetchGhanaPostAddress(coordinates.latitude, coordinates.longitude)
        .then((res) => {
          if (res?.found && res?.data?.Table?.length > 0) {
            const location = res.data.Table[0];

            // console.log("Lo ", location);
            // Use { shouldValidate: true } to ensure Zod picks up the changes
            form.setValue("gpsAddress", location.GPSName, {
              shouldValidate: true,
            });

            form.setValue(
              "street",
              location.Street === "[UNKNOWN]" ? location.Area : location.Street,
              { shouldValidate: true }
            );
            form.setValue("postCode", location.PostCode, {
              shouldValidate: true,
            });
            form.setValue("area", location.Area, { shouldValidate: true });
            form.setValue("district", location.District, {
              shouldValidate: true,
            });

            // Ensure casing matches your Enums
            if (location.Region) {
              form.setValue(
                "region",
                location.Region.toLowerCase() as FacilityProfileInput["region"],
                { shouldValidate: true }
              );
            }

            form.setValue("latitude", coordinates.latitude);
            form.setValue("longitude", coordinates.longitude);
            toast.success("Location auto-populated!");
          }
        })

        .catch((err) => {
          console.error("Ghana Post Error:", err);
          toast.error("Could not resolve GPS address");
        });
    }
  }, [coordinates, form.setValue]);

  const [uploadSessionId] = useState(() => `pending_${nanoid(12)}`);
  const filePath = `temporary/${uploadSessionId}/${Date.now()}-${nanoid(4)}`;

  const selectedType = form.watch(
    "facilityType"
  ) as keyof typeof FACILITY_REQUIREMENTS;

  const availableAmenities = useMemo(
    () => FACILITY_REQUIREMENTS[selectedType]?.amenities || [],
    [selectedType]
  );
  const availableServices = useMemo(
    () => FACILITY_REQUIREMENTS[selectedType]?.services || [],
    [selectedType]
  );

  const facilityMutation = trpc.facilityProfiles.insertFacility.useMutation();

  const handleDialogClose = () => {
    setStep(1);
    close();
  };
  const handleSubmit = async (
    data: FacilityProfileInput & { sameForWeekdays: boolean }
  ) => {
    setSubmitting(true);
    const { sameForWeekdays, ...payload } = data;

    try {
      const newAuthUser = await authClient.admin.createUser({
        name: `${payload.firstName} ${payload.lastName}`,
        email: payload.email ? payload.email : payload.ownerEmail,
        password: payload.gpsAddress,
      });

      if (newAuthUser) {
        const result = await facilityMutation.mutateAsync(payload);
        if (result) {
          toast.success(isEditMode ? "Updated!" : "Registered!");

          // 1. Prepare credential data
          setCredentials({
            email: payload.email ? payload.email : payload.ownerEmail,
            password: payload.gpsAddress,
            facilityName: payload.facilityName,
          });

          // 2. Open the credentials modal
          setFacilityModal(true);

          // 3. Close this registration dialog
          close();
        }
      }
    } catch (error) {
      toast.error("Registration failed!");
    } finally {
      setSubmitting(false);
      queryUtils.facilityProfiles.getFacilities.invalidate();
    }
  };

  const handleContinue = async () => {
    const isValid = await form.trigger(STEP_1_FIELDS);
    if (!isValid) {
      toast.error("Please complete all required fields");
      return;
    }
    setStep(2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      {credentials && (
        <FacilityCredentialsModal
          isOpen={facilityModal}
          onClose={() => {
            setFacilityModal(false);
            setCredentials(null);
          }}
          data={credentials}
        />
      )}
      <DialogContent className="max-w-5xl! max-h-[95vh] md:max-h-[90vh] overflow-y-auto py-5! px-2 md:px-6">
        <div className="flex justify-center gap-2 mb-4 w-full pr-4">
          <div
            className={cn(
              "h-2 w-1/2 rounded",
              step >= 1 ? "bg-primary" : "bg-muted"
            )}
          />
          <div
            className={cn(
              "h-2 w-1/2 rounded",
              step >= 2 ? "bg-primary" : "bg-muted"
            )}
          />
        </div>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? `Edit Facility` : `Register New Facility`}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (data) => {
                handleSubmit(data);
              },
              (errors) => {
                toast.error("Errors: " + errors);
                console.log("Errors: ", errors);
              }
            )}
            className="space-y-6"
          >
            {step === 1 && (
              <>
                <h3 className="font-semibold mb-2 underline text-center">
                  Facility Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomSelect
                    name="facilityType"
                    options={FACILITY_TYPE_OPTIONS}
                    control={form.control}
                    label="Facility Type"
                    className="w-full!"
                  />

                  <CustomInput
                    type="text"
                    name="facilityName"
                    control={form.control}
                    label="Facility Name"
                    readOnly={false}
                  />
                </div>

                {/* Facility Contact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CustomInput
                    type="text"
                    name="contactNumber"
                    control={form.control}
                    label="Facility Contact Number"
                    readOnly={false}
                  />

                  <CustomInput
                    type="text"
                    name="whatsappNumber"
                    control={form.control}
                    label="Whatsapp Number"
                    readOnly={false}
                  />

                  <CustomInput
                    type="email"
                    name="email"
                    control={form.control}
                    label="Facility Email Address"
                    readOnly={false}
                  />
                </div>

                <h3 className="font-semibold mb-2 underline text-center">
                  Location Details(Auto-Populated)
                </h3>
                {isLoadingLocation ? (
                  // State A: Active Fetching (Unified for GPS + Address)
                  <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl bg-muted/20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Accessing GPS & Resolving Address...
                    </p>
                  </div>
                ) : form.getValues("gpsAddress") ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-2 duration-700">
                    <CustomInput
                      type="text"
                      name="gpsAddress"
                      control={form.control}
                      label="GPS Address"
                      readOnly
                    />
                    <CustomInput
                      type="text"
                      name="street"
                      control={form.control}
                      label="Street Name"
                      readOnly
                    />
                    <CustomInput
                      type="text"
                      name="postCode"
                      control={form.control}
                      label="Post Code"
                      readOnly
                    />
                    <CustomInput
                      type="text"
                      name="area"
                      control={form.control}
                      label="Area"
                      readOnly
                    />
                    <CustomInput
                      type="text"
                      name="district"
                      control={form.control}
                      label="District"
                      readOnly
                    />
                    <CustomInput
                      type="text"
                      name="region"
                      control={form.control}
                      label="Region"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs bg-zinc-600 text-white"
                      onClick={() => getLocationCoordinates()}
                    >
                      Incorrect? Re-detect Location
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-primary/5">
                    <MapPinHouse className="h-8 w-8 text-primary/40 mb-3" />
                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      Auto-populate location details using your current GPS
                      coordinates.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2 border-primary text-primary hover:bg-primary/10"
                      onClick={() => getLocationCoordinates()}
                    >
                      <MapPinHouse className="h-4 w-4" />
                      Detect My Location
                    </Button>
                  </div>
                )}

                {/* Facility Amenities and Services */}
                <h3 className="font-semibold mb-2 underline text-center">
                  Services and Specialties
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="col-span-2 md:col-span-1">
                    <MultiSelect
                      name="amenities"
                      label="Facility Amenities"
                      placeholder={
                        selectedType
                          ? "Select Amenities..."
                          : "Please select a facility type first"
                      }
                      options={availableAmenities}
                      selected={form.watch("amenities")}
                      onChange={(value) => form.setValue("amenities", value)}
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <MultiSelect
                      name="services"
                      label="Facility Services"
                      placeholder={
                        selectedType
                          ? "Select Services..."
                          : "Please select a facility type first"
                      }
                      options={availableServices}
                      selected={form.watch("services")}
                      onChange={(value) => form.setValue("services", value)}
                    />
                  </div>

                  <div className="col-span-2">
                    <CustomInput
                      type="text"
                      name="keywords"
                      control={form.control}
                      label="Keywords(Comma Separated)"
                      placeholder="Keyword #1, Keyword #2, Keyword #3"
                      readOnly={false}
                    />
                    {/* TODO: A button to click for AI to autofill the keywords based on already entered data */}
                  </div>
                </div>

                <h3 className="font-semibold mb-2 underline text-center">
                  Manager Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <CustomInput
                    type="text"
                    name="firstName"
                    control={form.control}
                    label="Facility Owner First Name"
                    readOnly={false}
                  />
                  <CustomInput
                    type="text"
                    name="lastName"
                    control={form.control}
                    label="Facility Owner Last Name"
                    readOnly={false}
                  />
                  <CustomInput
                    type="email"
                    name="ownerEmail"
                    control={form.control}
                    label="Facility Owner Email"
                    readOnly={false}
                  />
                  <CustomInput
                    type="text"
                    name="personContactNumber"
                    control={form.control}
                    label="Facility Owner Contact Number"
                    readOnly={false}
                  />
                  <CustomInput
                    type="text"
                    name="position"
                    control={form.control}
                    label="Facility Owner Position"
                    readOnly={false}
                  />
                </div>

                <div className="rounded-lg border p-2 md:p-4 bg-muted/30">
                  <h3 className="font-semibold mb-2">Operational Hours</h3>
                  <BusinessHoursSection />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    className="w-full bg-emerald-600"
                    onClick={handleContinue}
                  >
                    Continue
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={close}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}

            {!isEditMode && step === 2 && (
              <>
                {/* ---------------- STEP 2 ---------------- */}
                <h3 className="font-semibold mb-4 underline text-center">
                  Facility Images
                </h3>

                {/* Example upload section */}
                <ImageDropZone
                  filePath={filePath}
                  initialFiles={form.watch("mediaUrls")}
                  text="Upload clear photos of your facility (front view, interior, signage, opposite)"
                  onFilesChange={(urls) => form.setValue("mediaUrls", urls)}
                />

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
                    ) : isEditMode ? (
                      "Update Facility"
                    ) : (
                      "Register Facility"
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFacilityDialog;
