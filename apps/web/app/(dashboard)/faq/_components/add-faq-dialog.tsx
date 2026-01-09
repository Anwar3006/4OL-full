import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddFAQDialog } from "@/stores/dialog-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@radix-ui/react-dialog";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TFAQInput, faqInputSchema } from "@4ol/db/schemas/faq.schema";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import CustomInput from "@/components/CustomInput";
import { useCreateFAQ, useUpdateFAQ } from "@/hooks/supabase-calls/useFAQ";

const AddFAQDialog = () => {
  const addFAQ = useAddFAQDialog();
  const createFAQ = useCreateFAQ();
  const updateFAQ = useUpdateFAQ();

  const form = useForm<TFAQInput>({
    resolver: zodResolver(faqInputSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  // Reset form when opening dialog
  useEffect(() => {
    if (addFAQ.isOpen && addFAQ.data) {
      // Edit mode - populate with existing data
      form.reset({
        question: addFAQ.data.question,
        answer: addFAQ.data.answer,
      });
    } else if (addFAQ.isOpen) {
      // Create mode - reset to empty
      form.reset({
        question: "",
        answer: "",
      });
    }
  }, [addFAQ.isOpen, addFAQ.data, form]);

  const handleClose = () => {
    form.reset();
    addFAQ.close();
  };

  const handleSubmit = async (data: TFAQInput) => {
    try {
      if (addFAQ.isEditMode && addFAQ.data?.id) {
        // Update existing FAQ
        await updateFAQ.mutateAsync({
          id: addFAQ.data.id,
          data,
        });
      } else {
        // Create new FAQ
        await createFAQ.mutateAsync(data);
      }
      handleClose();
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error("FAQ operation error:", error);
    }
  };

  const isSubmitting = createFAQ.isPending || updateFAQ.isPending;

  return (
    <Dialog open={addFAQ.isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto py-5 px-2 md:px-6">
        <DialogHeader>
          <DialogTitle>
            {addFAQ.isEditMode ? `Edit FAQ` : `Create New FAQ`}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4">
              <CustomInput
                type="text"
                name="question"
                control={form.control}
                label="Question"
                placeholder="Enter the frequently asked question"
                readOnly={false}
              />
              <CustomInput
                type="textarea"
                name="answer"
                control={form.control}
                label="Answer"
                placeholder="Enter the answer"
                readOnly={false}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    {addFAQ.isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : addFAQ.isEditMode ? (
                  "Update FAQ"
                ) : (
                  "Create FAQ"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFAQDialog;
