import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockPeaks, MountainPeak } from "@/data/peaks";
import PeakMap from "@/components/peak-map";
import * as AC from "@bacons/apple-colors";

export default function MapScreen() {
  const [peaks, setPeaks] = useState<MountainPeak[]>(mockPeaks);

  useEffect(() => {
    loadPeaks();
  }, []);

  const loadPeaks = async () => {
    try {
      const stravaPeaksStr = await AsyncStorage.getItem('strava_peaks');
      if (stravaPeaksStr) {
        const stravaPeaks = JSON.parse(stravaPeaksStr);
        const convertedPeaks: MountainPeak[] = stravaPeaks.map((p: any) => ({
          id: p.id,
          name: p.name,
          elevation: p.elevation,
          latitude: p.latitude,
          longitude: p.longitude,
          dateCollected: p.dateCollected,
          country: p.activityType,
          range: `${p.elevationGain.toFixed(0)}m gain, ${p.distance.toFixed(1)}km`
        }));
        setPeaks(convertedPeaks);
      }
    } catch (error) {
      console.error('Failed to load Strava peaks', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: AC.systemBackground }}>
      {process.env.EXPO_OS === "web" && (
        <View style={{ height: 64 }} />
      )}
      <PeakMap peaks={peaks} />
      <View
        style={{
          position: "absolute",
          top: process.env.EXPO_OS === "web" ? 80 : 120,
          right: 16,
          backgroundColor: AC.systemBackground,
          padding: 12,
          borderRadius: 12,
          borderCurve: "continuous",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: AC.label }}>
          {peaks.length} Peaks Collected
        </Text>
      </View>
    </View>
  );
}
