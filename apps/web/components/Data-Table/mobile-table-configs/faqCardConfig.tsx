import { TFAQOutput } from "@4ol/db/schemas/faq.schema";
import { MobileCardConfig } from "../mobile-card-types";
import { format } from "date-fns";

export const faqCardConfig: MobileCardConfig<TFAQOutput> = {
  getTitle: (faq) => faq.question,
  getSubtitle: (faq) => faq.answer,
  fields: [
    {
      label: "Created",
      getValue: (faq) => format(new Date(faq.createdAt), "MMM dd, yyyy"),
    },
  ],
};
