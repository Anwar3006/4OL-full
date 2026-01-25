import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

type PermissionState = "granted" | "prompt" | "denied";

export const useGeolocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [permissionState, setPermissionState] =
    useState<PermissionState>("prompt");

  const checkPermission = useCallback(async () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      setPermissionState(permission.state);
      permission.onchange = () => setPermissionState(permission.state);
    } catch (e) {
      // Browser might not support Permissions API
      console.warn("Permissions API not supported, proceeding with legacy check.");
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const getLocationCoordinates = () => {
    if (!window.isSecureContext) {
      setError("Geolocation is only available in secure contexts (HTTPS).");
      toast.error("Geolocation is only available in secure contexts (HTTPS).");
      return;
    }

    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported in this browser");
      return;
    }

    if (permissionState === "denied") {
      setError(
        "Location access has been denied. Please enable it in your browser settings.",
      );
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
        let errorMessage = "An unknown error occurred.";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable it in your browser settings.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  return {
    getLocationCoordinates,
    error,
    loading,
    coordinates,
    permissionState,
  };
};
