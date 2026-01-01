import { useState } from "react";

export const useGeolocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const getLocationCoordinates = () => {
    if (!("geolocation" in navigator)) {
      setError("Geoloaction is not supported in this browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError("Error getting data: " + err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 0,
      }
    );
  };

  return { getLocationCoordinates, error, loading, coordinates };
};
