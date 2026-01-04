// Displays the info card when a facility is clicked
import React from "react";
import { Popup } from "react-map-gl/maplibre";
export type FacilityPopupProps = {
  name: string;
  type: string;
  latitude: number;
  longitude: number;
};
const FacilityPopup = ({
  name,
  type,
  latitude,
  longitude,
}: FacilityPopupProps) => {
  return (
    <Popup
      latitude={latitude}
      longitude={longitude}
      offset={15}
      closeButton={false}
      className="pointer-events-none"
    >
      <div className="p-1  flex flex-col items-center">
        <p className="text-xs font-semibold">{name}</p>
        <p className="text-[0.5rem] italic">{type}</p>
      </div>
    </Popup>
  );
};

export default FacilityPopup;
