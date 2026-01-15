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
        featureType: "landscape",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#e9ddc8",
          },
        ],
      },
      {
        featureType: "poi.attraction",
        elementType: "labels.icon",
        stylers: [
          {
            color: "#0b0b09",
          },
        ],
      },
      {
        featureType: "poi.attraction",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#0b0b09",
          },
        ],
      },
      {
        featureType: "poi.business",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "poi.government",
        elementType: "labels.icon",
        stylers: [
          {
            color: "#0b0b09",
          },
        ],
      },
      {
        featureType: "poi.government",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#0b0b09",
          },
        ],
      },
      {
        featureType: "poi.medical",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "labels.icon",
        stylers: [
          {
            color: "#0b0b09",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#0b0b09",
          },
        ],
      },
      {
        featureType: "poi.place_of_worship",
        elementType: "labels.icon",
        stylers: [
          {
            color: "#0b0b09",
          },
        ],
      },
      {
        featureType: "poi.place_of_worship",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#0b0b09",
          },
        ],
      },
      {
        featureType: "poi.school",
        elementType: "labels.icon",
        stylers: [
          {
            color: "#0b0b09",
          },
        ],
      },
      {
        featureType: "poi.school",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#0b0b09",
          },
        ],
      },
      {
        featureType: "poi.sports_complex",
        elementType: "labels.icon",
        stylers: [
          {
            color: "#0b0b09",
          },
        ],
      },
      {
        featureType: "poi.sports_complex",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#0b0b09",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#d49640",
          },
        ],
      },
      {
        featureType: "transit.station",
        elementType: "labels.icon",
        stylers: [
          {
            color: "#0b0b09",
          },
        ],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#0b0b09",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#66bef4",
          },
        ],
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
            data.setStyle((feature) => {
              return {
                icon: {
                  // Classic Google Pin SVG Path
                  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                  fillColor: "#10b981", // Your emerald green
                  fillOpacity: 1,
                  strokeWeight: 1.5,
                  strokeColor: "#ffffff",
                  scale: 1.5, // Adjust size
                  anchor: new google.maps.Point(12, 22), // Anchors the tip of the pin to the coordinate
                  labelOrigin: new google.maps.Point(12, 9), // Positions text in the center circle if needed
                },
              };
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
