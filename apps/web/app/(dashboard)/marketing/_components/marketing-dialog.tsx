"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  MarketingProfileInput,
  marketingProfileSchema,
} from "@4ol/db/schemas/marketing-profile.schema";
import { toast } from "sonner";
import CustomSelect from "@/components/CustomSelect";
import {
  CTA_CONFIG,
  MARKETING_CTA_OPTIONS,
  MARKETING_TYPE_OPTIONS,
} from "@4ol/db/types/formInput";
import CustomInput from "@/components/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import CustomDatePicker from "@/components/CustomDatePicker";
import ImageDropZone from "@/components/ImageDropZone";
import { Label } from "@/components/ui/label";
import { nanoid } from "nanoid";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Phone, ExternalLink, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAddMarketingDialog } from "@/stores/dialog-store";

const STEP_1_FIELDS: (keyof MarketingProfileInput)[] = [
  "marketingType",
  "headline",
  "cta",
  "description",
  "organization",
  "startDate",
  "endDate",
  "imageUrl",
];

const AddMarketingDialog = () => {
  const addMarketingDialog = useAddMarketingDialog();

  const form = useForm<MarketingProfileInput>({
    resolver: zodResolver(marketingProfileSchema),
    defaultValues: {
      marketingType: "ads",
      headline: "",
      description: "",
      imageUrl: "",
      organization: "",
      cta: "",
      links: {
        primary: "",
        website: "",
        phone: "",
        email: "",
        whatsapp: "",
      },
      startDate: "",
      endDate: "",
    },
  });

  const [step, setStep] = useState<1 | 2>(1);
  const [uploadSessionId] = useState(() => `campaign_${nanoid(12)}`);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [filePath] = useState(
    () => `marketing/${uploadSessionId}/${Date.now()}-${nanoid(4)}`
  );
  const selectedCta = form.watch("cta");
  const config = CTA_CONFIG[selectedCta as keyof typeof CTA_CONFIG];

  // Watch all form values for preview
  const formValues = form.watch();
  const uploadedImagePath = formValues.imageUrl;

  // trpc
  const { mutateAsync, isPending } =
    trpc.marketingProfiles.createCampaign.useMutation();
  const { data, isLoading } = trpc.mediaStorage.getImageUrl.useQuery(
    {
      paths: [uploadedImagePath as string],
      width: 800,
    },
    {
      enabled: hasUploadedImage,
    }
  );
  const utils = trpc.useUtils(); // Access the tRPC utility helper

  useEffect(() => {
    if (!addMarketingDialog.isOpen) {
      form.reset();
      setStep(1);
    }
  }, [addMarketingDialog.isOpen, form]);

  // Remove the problematic useEffect that was resetting links
  // Instead, we initialized all possible link fields in defaultValues

  const handleContinue = async () => {
    const isValid = await form.trigger(STEP_1_FIELDS);
    if (!isValid) {
      console.log("Errors: ", form.formState.errors);
      toast.error("Please complete all required fields");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (data: MarketingProfileInput) => {
    try {
      console.log("Marketing: ", data);
      await mutateAsync(data);
      toast.success("Campaign created successfully!");

      // ✅ Invalidate the list query to trigger an automatic refetch
      utils.marketingProfiles.getCampaigns.invalidate();
      addMarketingDialog.close();
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Error: " + (error as Error).message);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderCTAButton = () => {
    if (!selectedCta || !config) return null;

    const ctaLabel = MARKETING_CTA_OPTIONS.find(
      (opt) => opt.value === selectedCta
    )?.label;

    if (config.type === "single") {
      const linkValue = formValues.links?.primary || "";
      const isPhone = selectedCta.toLowerCase().includes("phone");

      return (
        <Button
          type="button"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          disabled={!linkValue}
        >
          {isPhone ? (
            <>
              <Phone className="w-4 h-4 mr-2" />
              {linkValue || ctaLabel}
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              {ctaLabel}
            </>
          )}
        </Button>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-3">
          {config.fields.map((fieldLabel) => {
            const fieldKey = fieldLabel.toLowerCase();
            const linkValue =
              formValues.links?.[fieldKey as keyof typeof formValues.links] ||
              "";
            const isPhone = fieldLabel.toLowerCase().includes("phone");

            return (
              <Button
                key={fieldLabel}
                type="button"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                disabled={!linkValue}
              >
                {isPhone ? (
                  <>
                    <Phone className="w-4 h-4 mr-2" />
                    {fieldLabel}
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {fieldLabel}
                  </>
                )}
              </Button>
            );
          })}
        </div>
      );
    }
  };

  return (
    <Dialog
      open={addMarketingDialog.isOpen}
      onOpenChange={addMarketingDialog.close}
    >
      <DialogContent className="max-w-5xl! max-h-[95vh] md:max-h-[90vh] overflow-y-auto py-5 px-2 md:px-6">
        <DialogHeader>
          <DialogTitle>Create new Campaign</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              (data) => {
                handleSubmit(data);
              },
              (errors) => {
                toast.error("Please fix the form errors");
                console.log("Errors: ", errors);
              }
            )}
            className="space-y-6"
          >
            {step === 1 && (
              <>
                {/* Campaign Details */}
                <h3 className="font-semibold mb-2 underline text-center">
                  Campaign Details
                </h3>

                {/*  Marketing Type and Organization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomSelect
                    name="marketingType"
                    label="Marketing Type"
                    options={MARKETING_TYPE_OPTIONS}
                    control={form.control}
                  />
                  <CustomInput
                    type="text"
                    name="organization"
                    control={form.control}
                    label="Organization"
                    readOnly={false}
                    placeholder="Enter the organization for the campaign"
                    className="text-sm md:text-base"
                  />
                </div>

                {/*  Headline and Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    type="textarea"
                    name="headline"
                    control={form.control}
                    label="Headline"
                    readOnly={false}
                    placeholder="Enter the headline for the campaign"
                    className="text-sm md:text-base"
                  />
                  <CustomInput
                    type="textarea"
                    name="description"
                    control={form.control}
                    label="Campaign Content"
                    readOnly={false}
                    placeholder="Enter the content for the campaign"
                    className="text-sm md:text-base"
                  />
                </div>

                {/* Start and End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomDatePicker
                    name="startDate"
                    control={form.control}
                    label="Start Date(When to start the campaign)"
                    className="text-sm md:text-base"
                    enableFutureDates={true}
                  />
                  <CustomDatePicker
                    name="endDate"
                    control={form.control}
                    label="End Date(When it ends)"
                    className="text-sm md:text-base"
                    enableFutureDates={true}
                  />
                </div>

                {/* Media Upload */}
                <div className="grid grid-cols-1">
                  <Label className="mb-1">Campaign Media</Label>
                  <ImageDropZone
                    filePath={filePath}
                    text="Drop an image/video to go along with the campaign"
                    onFilesChange={(urls) => {
                      form.setValue("imageUrl", urls.filter(Boolean)[0]);
                      if (urls.filter(Boolean)[0]) {
                        setHasUploadedImage(true);
                      }
                    }}
                  />
                </div>

                {/* CTA & Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex col-span-2 justify-center w-full">
                    <CustomSelect
                      name="cta"
                      label="Call to Action"
                      control={form.control}
                      options={MARKETING_CTA_OPTIONS}
                      className="text-sm md:text-base"
                      formItemClassName="w-1/2"
                    />
                  </div>

                  {config && (
                    <>
                      {config.type === "single" ? (
                        <div className="flex col-span-2 justify-center w-full">
                          <CustomInput
                            type="text"
                            name="links.primary"
                            control={form.control}
                            label={config.label}
                            readOnly={false}
                            placeholder={config.placeholder}
                            className="text-sm md:text-base"
                            formItemClassName="w-1/2"
                          />
                        </div>
                      ) : (
                        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {config.fields.map((fieldLabel) => (
                            <CustomInput
                              key={fieldLabel}
                              type="text"
                              name={`links.${fieldLabel.toLowerCase()}`}
                              readOnly={false}
                              control={form.control}
                              label={fieldLabel}
                              placeholder={`Enter ${fieldLabel}`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    className="w-full bg-emerald-600"
                    onClick={handleContinue}
                  >
                    Continue to Preview
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={addMarketingDialog.close}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <section className="w-full space-y-6">
                <h3 className="font-semibold text-center text-lg">
                  Campaign Preview
                </h3>

                <Card className="w-full p-6 space-y-4 max-w-2xl mx-auto">
                  {/* Organization Badge */}
                  {formValues.organization && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                        {formValues.organization}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {formValues.marketingType}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-row-reverse gap-3 items-center">
                    {/* Image Preview */}
                    {/* Image Preview Area */}
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100 relative">
                      {isLoading ? (
                        // Shimmering Skeleton Loader
                        <div className="w-full h-full animate-pulse bg-gray-200 flex items-center justify-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                            <p className="text-xs text-muted-foreground font-medium">
                              Optimizing Media...
                            </p>
                          </div>
                        </div>
                      ) : data && data[0]?.url ? (
                        <img
                          src={data[0].url}
                          alt="Campaign media"
                          className="w-full h-full object-cover transition-opacity duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 border-2 border-dashed">
                          <p className="text-sm text-muted-foreground">
                            No media uploaded
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Headline */}
                    <div className="flex items-center flex-col gap-2">
                      {formValues.headline && (
                        <h2 className="text-2xl font-bold text-gray-900">
                          {formValues.headline}
                        </h2>
                      )}

                      {/* Description */}
                      {formValues.description && (
                        <p className="text-gray-700 leading-relaxed">
                          {formValues.description.slice(0, 100) + "..."}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Campaign Duration */}
                  {(formValues.startDate || formValues.endDate) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formValues.startDate &&
                          formatDate(formValues.startDate)}
                        {formValues.startDate && formValues.endDate && " - "}
                        {formValues.endDate && formatDate(formValues.endDate)}
                      </span>
                    </div>
                  )}

                  {/* CTA Button(s) */}
                  {selectedCta && (
                    <div className="pt-4 border-t">{renderCTAButton()}</div>
                  )}
                </Card>

                {/* Navigation Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-full"
                  >
                    Back to Edit
                  </Button>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full md:col-span-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isPending ? "Creating..." : "Create Campaign"}
                  </Button>
                </div>
              </section>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMarketingDialog;
