"use client";
import "maplibre-gl/dist/maplibre-gl.css";
import Map, { Source, Layer, NavigationControl } from "@vis.gl/react-maplibre";
import FacilityPopup, { FacilityPopupProps } from "./FacilityPopup";
import { useMemo, useState, useCallback } from "react";

import FacilitiesLayer from "../_layers/FacilitiesLayer";
import RegistrarPathLayer from "../_layers/RegistrarPathLayer";
import { useGetFacilitiesMapData } from "@/hooks/supabase-calls/useFacilities";

const MapContainer = () => {
  const [hoverInfo, setHoverInfo] = useState<FacilityPopupProps | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -0.187,
    latitude: 5.6037,
    zoom: 11,
  });

  const [bounds, setBounds] = useState<[number, number, number, number] | null>(
    null
  );

  const { data: geojson, isLoading } = useGetFacilitiesMapData({
    // Safe access with fallbacks
    minLng: bounds?.[0] ?? 0,
    minLat: bounds?.[1] ?? 0,
    maxLng: bounds?.[2] ?? 0,
    maxLat: bounds?.[3] ?? 0,
    zoom: Math.round(viewState.zoom),
    enabled: !!bounds,
  });

  // Use useCallback to prevent unnecessary re-renders of the Map component
  const onMove = useCallback((evt: any) => {
    setViewState(evt.viewState);
  }, []);

  const onMoveEnd = useCallback((evt: any) => {
    const b = evt.target.getBounds();
    setBounds([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
  }, []);

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden rounded-xl border bg-slate-50 shadow-inner">
      <Map
        {...viewState}
        onMove={onMove}
        onMoveEnd={onMoveEnd}
        onLoad={onMoveEnd}
        interactiveLayerIds={["facility-circles"]}
        onMouseMove={(e) => {
          const feature = e.features && e.features[0];
          console.log("Hovered feature:", feature);
          if (feature) {
            setHoverInfo({
              longitude: e.lngLat.lng,
              latitude: e.lngLat.lat,
              name: feature.properties?.name,
              type: feature.properties?.type,
            });
          } else {
            setHoverInfo(null);
          }
        }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />

        <FacilitiesLayer data={geojson} isLoading={isLoading} />

        {hoverInfo && <FacilityPopup {...hoverInfo} />}

        {/* <RegistrarPathLayer /> TODO: Add this back*/}

        {/* Slimmer Fetching Indicator (Top Center) */}
        {isLoading && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full shadow-lg border border-emerald-100">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <span className="text-[12px] font-bold text-emerald-800 tracking-tight">
                SCANNING AREA...
              </span>
            </div>
          </div>
        )}
      </Map>
    </div>
  );
};

export default MapContainer;
