"use client";
import { GoogleMap, useJsApiLoader, Data } from "@react-google-maps/api";
import React, { useState, useCallback, useEffect } from "react";
import { useGetFacilitiesMapData } from "@/hooks/supabase-calls/useFacilities";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 5.6037,
  lng: -0.187,
};

const GoogleMapContainer = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState(null);
  const [bounds, setBounds] = useState<[number, number, number, number] | null>(
    null
  );
  const [zoom, setZoom] = useState(11);

  const { data: geojson, isLoading } = useGetFacilitiesMapData({
    // Safe access with fallbacks
    minLng: bounds?.[0] ?? 0,
    minLat: bounds?.[1] ?? 0,
    maxLng: bounds?.[2] ?? 0,
    maxLat: bounds?.[3] ?? 0,
    zoom: Math.round(zoom),
    enabled: !!bounds,
  });

  const onLoad = useCallback(function callback(map: any) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const onBoundsChanged = () => {
    if (map) {
      const newBounds = (map as any).getBounds();
      const ne = newBounds.getNorthEast();
      const sw = newBounds.getSouthWest();
      setBounds([sw.lng(), sw.lat(), ne.lng(), ne.lat()]);
      setZoom((map as any).getZoom());
    }
  };

  const mapOptions = {
    styles: [
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  const [data, setData] = useState<google.maps.Data | null>(null);

  useEffect(() => {
    if (data && geojson) {
      data.forEach((feature) => {
        data.remove(feature);
      });
      data.addGeoJson(geojson);
    }
  }, [data, geojson]);

  return isLoaded ? (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden rounded-xl border bg-slate-50 shadow-inner">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={11}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onBoundsChanged={onBoundsChanged}
        options={mapOptions}
      >
        <Data
          onLoad={(data) => {
            setData(data);
            data.setStyle({
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                fillColor: "blue",
                fillOpacity: 0.8,
                strokeWeight: 0,
              },
            });
          }}
        />
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
      </GoogleMap>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
    </div>
  );
};

export default React.memo(GoogleMapContainer);
