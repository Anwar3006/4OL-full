"use client";
import SectionHeader from "@/components/SectionHeader";
import { Map } from "lucide-react";
import React, { useState } from "react";
import MapContainer from "./_components/MapContainer";
import GoogleMapContainer from "./_components/GoogleMapContainer";
import MapToggleButton from "./_components/MapToggleButton";

const MapPage = () => {
  const [mapType, setMapType] = useState("maplibre");

  return (
    <section className="container mx-auto lg:px-4 py-4 sm:py-6 lg:pb-10 lg:pt-2 max-w-7xl">
      <div className="flex justify-between items-center">
        <SectionHeader
          title={"Map View"}
          Icon={Map}
          description="Track facilities and admins"
          hasButton={false}
        />
        <div className="flex space-x-2">
          <MapToggleButton
            label="MapLibre"
            isActive={mapType === "maplibre"}
            onClick={() => setMapType("maplibre")}
          />
          <MapToggleButton
            label="Google Maps"
            isActive={mapType === "google"}
            onClick={() => setMapType("google")}
          />
        </div>
      </div>

      {mapType === "maplibre" ? <MapContainer /> : <GoogleMapContainer />}
    </section>
  );
};

export default MapPage;
