"use client";

import SectionHeader from "@/components/SectionHeader";
import { PlusCircleIcon } from "lucide-react";
import React from "react";

const MedicationReminderPage = () => {
  return (
    <section className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
      <SectionHeader
        title={"Medication Reminders"}
        Icon={PlusCircleIcon}
        description="Track medication reminders for your users"
        hasButton
        buttonLabel="Add Symptom"
        // onButtonClick={() => addSymptom.open()}
      />
    </section>
  );
};

export default MedicationReminderPage;
