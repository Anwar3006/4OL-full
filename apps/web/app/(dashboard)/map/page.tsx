"use client";
import SectionHeader from "@/components/SectionHeader";
import { Map } from "lucide-react";
import React from "react";
import MapContainer from "./_components/MapContainer";

const MapPage = () => {
  return (
    <section className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
      <SectionHeader
        title={"Map View"}
        Icon={Map}
        description="Track facilities and admins"
        hasButton={false}
      />

      <MapContainer />
    </section>
  );
};

export default MapPage;
