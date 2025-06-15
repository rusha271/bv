"use client";
import { useEffect, useState } from "react";

export interface DeviceType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  device: "mobile" | "tablet" | "desktop";
}

export function useDeviceType(): DeviceType {
  const [device, setDevice] = useState<DeviceType['device']>("desktop");

  useEffect(() => {
    function updateDevice() {
      if (window.innerWidth < 640) setDevice("mobile");
      else if (window.innerWidth < 1024) setDevice("tablet");
      else setDevice("desktop");
    }
    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  return {
    isMobile: device === "mobile",
    isTablet: device === "tablet",
    isDesktop: device === "desktop",
    device,
  };
} 