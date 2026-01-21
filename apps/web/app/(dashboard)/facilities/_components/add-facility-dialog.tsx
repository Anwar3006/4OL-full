import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  TFacilityProfileInput,
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
import { Loader2, MapPinHouse, Star, Trash, X } from "lucide-react";
import z from "zod";
import { MultiSelect } from "@/components/MultiSelect";
import { cn } from "@/lib/utils";
import ImageDropZone from "@/components/ImageDropZone";
import { trpc } from "@/lib/trpc";
import { nanoid } from "nanoid";
import { useAddFacilityDialog } from "@/stores/dialog-store";
import { authClient } from "@/lib/auth-client";
import FacilityCredentialsModal from "./facility-credentials-modal";
import {
  useCreateFacilityProfile,
  useUpdateFacilityProfile,
} from "@/hooks/supabase-calls/useFacilities";
import { useGetSignedUrls } from "@/hooks/supabase-calls/useMediaStorage";
import { Switch } from "@/components/ui/switch";

// Step 1 Fields - To make sure we validate these fields before moving on to Step 2
const STEP_1_FIELDS: (keyof TFacilityProfileInput)[] = [
  "facility_type",
  "facility_name",
  "contact_number",
  "email",
  "gps_address",
  "area",
  "district",
  "region",
  "amenities",
  "services",
  "first_name",
  "last_name",
  "owner_email",
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

  // New state for advanced image management in edit mode
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newlyUploadedFiles, setNewlyUploadedFiles] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);

  const [uploadSessionId] = useState(() => `pending_${nanoid(12)}`);
  const filePath = `facilities/temporary/${uploadSessionId}`;

  // Hooks to fetch location and Ghana Post Address
  const {
    getLocationCoordinates,
    coordinates,
    loading: coordinatesLoading,
    error: coordintatesError,
  } = useGeolocation();
  const { fetchGhanaPostAddress, loading: addressLoading } = useGhanaPostGPS();
  const isLoadingLocation = coordinatesLoading || addressLoading;
  ////////////

  const form = useForm({
    resolver: zodResolver(
      facilityProfileSchema.safeExtend({
        sameForWeekdays: z.boolean().default(false),
      }),
    ),
    defaultValues: {
      facility_type: "hospitals_&_clinics",
      facility_name: "",
      contact_number: "",
      whatsapp_number: "",
      email: "",
      gps_address: "",
      street: "",
      post_code: "",
      area: "",
      district: "",
      region: "greater accra",
      country: "Ghana",
      first_name: "",
      last_name: "",
      owner_email: "",
      person_contact_number: "",
      position: "",
      media_urls: [],
      services: [],
      amenities: [],
      business_hours: DEFAULT_BUSINESS_HOURS,
      sameForWeekdays: false,
      keywords: "",
      ownership: "",
      accepts_nhis: false,
    },
  });

  // --- Effects ---
  // When the dialog opens for editing, wait for data to be available, then reset the form.
  useEffect(() => {
    if (isOpen && isEditMode && data) {
      form.reset({
        ...form.getValues(),
        ...data,
        business_hours: data.business_hours || DEFAULT_BUSINESS_HOURS,
        sameForWeekdays: false, // Explicitly reset this view-only field
        keywords: Array.isArray(data.keywords)
          ? data.keywords.join(" ")
          : data.keywords || "",
      });

      // Populate existing images state
      setExistingImages(data.media_urls || []);
      // Clear deletion and new upload lists on open
      setImagesToDelete([]);
      setNewlyUploadedFiles([]);
    }
  }, [isOpen, isEditMode, data, form.reset]);

  // When the dialog opens for creating, reset to default values.
  useEffect(() => {
    if (isOpen && !isEditMode) {
      form.reset({
        facility_type: "hospitals_&_clinics",
        facility_name: "",
        contact_number: "",
        whatsapp_number: "",
        email: "",
        gps_address: "",
        street: "",
        post_code: "",
        area: "",
        district: "",
        region: "greater accra",
        country: "Ghana",
        first_name: "",
        last_name: "",
        owner_email: "",
        person_contact_number: "",
        position: "",
        media_urls: [],
        services: [],
        amenities: [],
        business_hours: DEFAULT_BUSINESS_HOURS,
        sameForWeekdays: false,
        keywords: "",
      });

      // Also reset image management state
      setExistingImages([]);
      setImagesToDelete([]);
      setNewlyUploadedFiles([]);
    }
  }, [isOpen, isEditMode, form.reset]);

  // 2. Fetch address only when coordinates are acquired
  useEffect(() => {
    if (coordinates?.latitude && coordinates?.longitude) {
      fetchGhanaPostAddress(coordinates.latitude, coordinates.longitude)
        .then((res) => {
          if (res?.found && res?.data?.Table?.length > 0) {
            const location = res.data.Table[0];

            // console.log("Lo ", location);
            // Use { shouldValidate: true } to ensure Zod picks up the changes
            form.setValue("gps_address", location.GPSName, {
              shouldValidate: true,
            });

            form.setValue(
              "street",
              location.Street === "[UNKNOWN]" ? location.Area : location.Street,
              { shouldValidate: true },
            );
            form.setValue("post_code", location.PostCode, {
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
                location.Region.toLowerCase() as TFacilityProfileInput["region"],
                { shouldValidate: true },
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

  // When editing, initialize the featured image from data
  useEffect(() => {
    if (isOpen && isEditMode && data) {
      setFeaturedImage(data.featured_image_url || data.media_urls?.[0] || null);
    }
  }, [isOpen, isEditMode, data]);
  /////////////////////

  // --- Helpers ---
  // Watch facility type to automatically populate amenities and services
  const selectedType = form.watch(
    "facility_type",
  ) as keyof typeof FACILITY_REQUIREMENTS;
  const availableAmenities = useMemo(
    () => FACILITY_REQUIREMENTS[selectedType]?.amenities || [],
    [selectedType],
  );
  const availableServices = useMemo(
    () => FACILITY_REQUIREMENTS[selectedType]?.services || [],
    [selectedType],
  );

  const handleContinue = async () => {
    const isValid = await form.trigger(STEP_1_FIELDS);
    if (!isValid) {
      toast.error("Please complete all required fields");
      return;
    }
    setStep(2);
  };

  const handleFilesChange = useCallback(
    (urls: string[]) => {
      // Use setTimeout to defer the state update to the next tick
      // This prevents updating parent state during child render
      setTimeout(() => {
        if (isEditMode) {
          setNewlyUploadedFiles(urls);
        } else {
          form.setValue("media_urls", urls, { shouldValidate: true });
        }
      }, 0);
    },
    [form],
  );

  const handleDialogClose = () => {
    setStep(1);
    close();
  };
  //////////////////

  // Hook to get temporary, viewable URLs for existing images
  const { data: existingImageUrls, isLoading: isUrlsLoading } =
    useGetSignedUrls(existingImages, isOpen && isEditMode);

  // Handlers for image management
  const handleDeleteExistingImage = (imagePath: string) => {
    setExistingImages((prev) => prev.filter((p) => p !== imagePath));
    setImagesToDelete((prev) => [...prev, imagePath]);
    toast.info("Image marked for deletion. Save changes to confirm.");
  };

  const facilityMutation = useCreateFacilityProfile();
  const facilityUpdateMutation = useUpdateFacilityProfile();

  // --- Submission Logic ---
  const handleSubmit = async (
    values: TFacilityProfileInput & { sameForWeekdays: boolean },
  ) => {
    setSubmitting(true);
    const { sameForWeekdays, ...profileData } = values;

    try {
      const finalImageUrls = isEditMode
        ? [...existingImages, ...newlyUploadedFiles]
        : profileData.media_urls;

      const payload = {
        ...profileData,
        featured_image_url: featuredImage || finalImageUrls[0], // Fallback to first if none selected
      };

      // SCENARIO 1: EDIT MODE
      if (isEditMode) {
        const finalImageUrls = [...existingImages, ...newlyUploadedFiles];
        await facilityUpdateMutation.mutateAsync({
          id: data.id,
          ...payload,

          media_urls: finalImageUrls,
          imagesToDelete,
          newlyUploadedFiles,
        });
        toast.success("Facility Updated!");
        setStep(1);
        close();
        return;
      }

      // SCENARIO 2: CREATE MODE
      let ownerId: string | null = null;
      let isNewUser = false;

      const newAuthUser = await authClient.admin.createUser({
        name: `${payload.first_name} ${payload.last_name}`,
        email: payload.owner_email,
        password: payload.gps_address,
      });

      if (newAuthUser.data?.user) {
        ownerId = newAuthUser.data.user.id;
        isNewUser = true;
      } else {
        const existingUser = await authClient.admin.listUsers({
          query: {
            limit: 1,
            searchField: "email",
            searchValue: payload.owner_email.trim().toLowerCase(),
          },
        });
        ownerId = existingUser.data?.users[0]?.id || null;
      }

      if (!ownerId)
        throw new Error("Could not assign an owner to this facility.");

      const result = await facilityMutation.mutateAsync({
        ...payload,
        ownerId,
      });

      if (result) {
        toast.success("Facility Registered!");
        if (isNewUser) {
          setCredentials({
            email: payload.owner_email,
            password: payload.gps_address,
            facilityName: payload.facility_name,
          });
          setFacilityModal(true);
        }
        close();
      }
    } catch (error: any) {
      console.error("Error: ", error.message);
      toast.error(error.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      {/* Dialog after successful registration of facility */}
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
              step >= 1 ? "bg-primary" : "bg-muted",
            )}
          />
          <div
            className={cn(
              "h-2 w-1/2 rounded",
              step >= 2 ? "bg-primary" : "bg-muted",
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
                // 1. Get all field names that have errors
                const errorFields = Object.keys(errors);

                // 2. Format a user-friendly message
                if (errorFields.length > 0) {
                  // Get the labels for the first 2 errors to give specific context
                  const errorMessages = errorFields
                    .slice(0, 2)
                    .map((field) => field.replace(/_/g, " ")) // 'facility_name' -> 'facility name'
                    .join(", ");

                  const message =
                    errorFields.length > 2
                      ? `Please check ${errorMessages} and ${errorFields.length - 2} other fields.`
                      : `Please correct the following: ${errorMessages}.`;

                  toast.error("Form Validation Failed", {
                    description: message,
                    // This explicitly overrides the global config for this specific toast
                    classNames: {
                      toast:
                        "group-[.toaster]:border-destructive group-[.toaster]:bg-red-50/50",
                      title: "font-black text-destructive",
                      description: "text-slate-900 font-medium leading-relaxed",
                    },
                    duration: 5000,
                  });
                }

                console.log("Validation Errors:", errors);
              },
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
                    name="facility_type"
                    options={FACILITY_TYPE_OPTIONS}
                    control={form.control}
                    label="Facility Type"
                    className="w-full!"
                  />

                  <CustomInput
                    type="text"
                    name="facility_name"
                    control={form.control}
                    label="Facility Name"
                    readOnly={false}
                  />
                </div>

                {/* NEW FIELDS: NHIS and Ownership */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <label className="text-sm font-bold">Accepts NHIS</label>
                      <p className="text-xs text-muted-foreground">
                        Is this facility under the National Health Insurance
                        Scheme?
                      </p>
                    </div>
                    <Switch
                      checked={form.watch("accepts_nhis")}
                      onCheckedChange={(val) =>
                        form.setValue("accepts_nhis", val)
                      }
                    />
                  </div>

                  <CustomSelect
                    name="ownership"
                    label="Facility Ownership"
                    options={[
                      { label: "Private", value: "private" },
                      { label: "Government / Public", value: "government" },
                    ]}
                    control={form.control}
                  />
                </div>

                {/* Facility Contact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CustomInput
                    type="text"
                    name="contact_number"
                    control={form.control}
                    label="Facility Contact Number"
                    readOnly={false}
                  />

                  <CustomInput
                    type="text"
                    name="whatsapp_number"
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
                  Location Details (Auto-Populated)
                </h3>

                {(() => {
                  // 1. Show Loader if we are currently fetching
                  if (isLoadingLocation) {
                    return (
                      <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl bg-muted/20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Accessing GPS & Resolving Address...
                        </p>
                      </div>
                    );
                  }

                  // 2. Show the Data Form if we have a GPS address
                  if (form.watch("gps_address")) {
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-2 duration-700">
                        <CustomInput
                          type="text"
                          name="gps_address"
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
                          name="post_code"
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
                    );
                  }

                  // 3. Show the "Detect" button if we aren't loading and have no data
                  return (
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
                  );
                })()}

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
                    name="first_name"
                    control={form.control}
                    label="Facility Owner First Name"
                    readOnly={false}
                  />
                  <CustomInput
                    type="text"
                    name="last_name"
                    control={form.control}
                    label="Facility Owner Last Name"
                    readOnly={false}
                  />
                  <CustomInput
                    type="email"
                    name="owner_email"
                    control={form.control}
                    label="Facility Owner Email"
                    readOnly={false}
                  />
                  <CustomInput
                    type="text"
                    name="person_contact_number"
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

            {step === 2 && (
              <>
                <h3 className="font-semibold mb-4 underline text-center">
                  Facility Images
                </h3>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      Manage & Select Thumbnail
                    </h4>
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase">
                      Select Star for Main Photo
                    </span>
                  </div>

                  {/* The Selection Grid: Available in both Create and Edit mode */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {(() => {
                      // Combine everything to show in the selector
                      const allImages = isEditMode
                        ? [
                            ...(existingImageUrls || []),
                            ...newlyUploadedFiles.map((path) => ({
                              path,
                              url: path,
                            })),
                          ]
                        : form
                            .watch("media_urls")
                            .map((path) => ({ path, url: path })); // During create, media_urls are local paths

                      if (allImages.length === 0)
                        return (
                          <div className="col-span-full text-center py-8 border-2 border-dashed rounded-xl bg-slate-50">
                            <p className="text-sm text-muted-foreground">
                              No images uploaded yet. Start by dropping files
                              below.
                            </p>
                          </div>
                        );

                      return allImages.map((img) => {
                        const isFeatured = featuredImage === img.path;
                        return (
                          <div
                            key={img.path}
                            className={cn(
                              "relative group aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300",
                              isFeatured
                                ? "border-emerald-500 ring-2 ring-emerald-500/20"
                                : "border-slate-200",
                            )}
                          >
                            <img
                              src={
                                img.url.startsWith("http")
                                  ? img.url
                                  : `https://YOUR_SUPABASE_URL/storage/v1/object/public/temp/${img.url}`
                              }
                              className="object-cover w-full h-full"
                            />

                            <div className="absolute top-1.5 inset-x-1.5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => setFeaturedImage(img.path)}
                                className={cn(
                                  "p-1.5 rounded-lg shadow-sm backdrop-blur-md transition-colors",
                                  isFeatured
                                    ? "bg-emerald-500 text-white"
                                    : "bg-white/90 text-slate-400 hover:text-emerald-500",
                                )}
                              >
                                <Star
                                  size={14}
                                  fill={isFeatured ? "white" : "none"}
                                />
                              </button>

                              {isEditMode &&
                                !newlyUploadedFiles.includes(img.path) && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteExistingImage(img.path)
                                    }
                                    className="p-1.5 bg-red-500/90 text-white rounded-lg shadow-sm hover:bg-red-600"
                                  >
                                    <Trash className="h-3.5 w-3.5" />
                                  </button>
                                )}
                            </div>

                            {isFeatured && (
                              <div className="absolute bottom-0 inset-x-0 bg-emerald-500 py-1 flex items-center justify-center">
                                <p className="text-[10px] text-white font-black uppercase tracking-tighter">
                                  Main Photo
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                  {isEditMode ? "Upload New Images" : "Upload Facility Images"}
                </h4>
                <ImageDropZone
                  filePath={filePath}
                  initialFiles={
                    isEditMode ? newlyUploadedFiles : form.watch("media_urls")
                  }
                  text="Upload clear photos of your facility (front view, interior, signage, opposite)"
                  onFilesChange={handleFilesChange}
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
                    {submitting && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    {isEditMode ? "Update Facility" : "Register Facility"}
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
