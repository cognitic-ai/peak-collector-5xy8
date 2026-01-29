import { View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { MountainPeak } from "@/data/peaks";

interface PeakMapProps {
  peaks: MountainPeak[];
}

export default function PeakMap({ peaks }: PeakMapProps) {
  // Calculate center from all peaks
  const avgLat = peaks.reduce((sum, p) => sum + p.latitude, 0) / peaks.length;
  const avgLng = peaks.reduce((sum, p) => sum + p.longitude, 0) / peaks.length;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: avgLat,
          longitude: avgLng,
          latitudeDelta: 60,
          longitudeDelta: 60,
        }}
      >
        {peaks.map((peak) => (
          <Marker
            key={peak.id}
            coordinate={{
              latitude: peak.latitude,
              longitude: peak.longitude,
            }}
            title={peak.name}
            description={`${peak.elevation}m - ${peak.range}, ${peak.country}`}
          />
        ))}
      </MapView>
    </View>
  );
}
