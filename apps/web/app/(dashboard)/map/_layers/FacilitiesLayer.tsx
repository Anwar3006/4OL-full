import { Source, Layer } from "react-map-gl/maplibre";

interface FacilitiesLayerProps {
  data: any;
  isLoading: boolean;
}
const EMPTY_GEOJSON: any = {
  type: "FeatureCollection",
  features: [],
};

const FacilitiesLayer = ({ data, isLoading }: FacilitiesLayerProps) => {
  // Defensive check: If data is missing or ill-formatted, use the empty fallback
  const geojsonData = data?.type === "FeatureCollection" ? data : EMPTY_GEOJSON;
  if (!data && isLoading) return null;

  return (
    <Source id="facilities-source" type="geojson" data={geojsonData}>
      <Layer
        id="facility-circles"
        type="circle"
        paint={{
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 4, 15, 10],
          "circle-color": "#059669",
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": isLoading ? 0.3 : 1,
        }}
      />
    </Source>
  );
};

export default FacilitiesLayer;
