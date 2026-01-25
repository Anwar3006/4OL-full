import { useState } from "react";
import { toast } from "sonner";

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
      (error) => {
        // If it's the "Unknown/Unavailable" error, try one more time automatically
        if (error.code === error.POSITION_UNAVAILABLE) {
          console.warn("Location unknown, retrying...");
          // Recursive call or a slight delay before retrying
          // setTimeout(() => getLocationCoordinates(), 1000);
          return;
        }

        setLoading(false);
        setError(error.message);
        toast.error("Location Error: " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  return { getLocationCoordinates, error, loading, coordinates };
};
