import { useEffect, useRef } from "react";
import { View } from "react-native";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MountainPeak } from "@/data/peaks";

// Adjust options for Metro
L.Icon.Default.mergeOptions({
  imagePath: typeof window !== "undefined" ? window.location.origin : "",
  iconUrl: require("leaflet/dist/images/marker-icon.png").uri,
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").uri,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").uri,
});

interface PeakMapProps {
  peaks: MountainPeak[];
}

export default function PeakMap({ peaks }: PeakMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Calculate center from all peaks
    const avgLat = peaks.reduce((sum, p) => sum + p.latitude, 0) / peaks.length;
    const avgLng = peaks.reduce((sum, p) => sum + p.longitude, 0) / peaks.length;

    const map = L.map(mapRef.current).setView([avgLat, avgLng], 2);
    mapInstanceRef.current = map;

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add markers for each peak
    peaks.forEach((peak) => {
      L.marker([peak.latitude, peak.longitude])
        .addTo(map)
        .bindPopup(
          `<strong>${peak.name}</strong><br/>` +
          `${peak.elevation}m<br/>` +
          `${peak.range}, ${peak.country}<br/>` +
          `Collected: ${new Date(peak.dateCollected).toLocaleDateString()}`
        );
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [peaks]);

  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%", zIndex: 0 }} />
    </View>
  );
}
