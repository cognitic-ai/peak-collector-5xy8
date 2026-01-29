import { ScrollView, View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockPeaks, MountainPeak } from "@/data/peaks";
import PeakCard from "@/components/peak-card";
import * as AC from "@bacons/apple-colors";

export default function ListScreen() {
  const [peaks, setPeaks] = useState<MountainPeak[]>(mockPeaks);
  const [isStrava, setIsStrava] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPeaks();
  }, []);

  const loadPeaks = async () => {
    try {
      const stravaPeaksStr = await AsyncStorage.getItem('strava_peaks');
      if (stravaPeaksStr) {
        const stravaPeaks = JSON.parse(stravaPeaksStr);
        // Convert Strava peaks to match MountainPeak interface
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
        setIsStrava(true);
      }
    } catch (error) {
      console.error('Failed to load Strava peaks', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedPeaks = [...peaks].sort((a, b) => b.elevation - a.elevation);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: AC.systemGroupedBackground }}
    >
      <View style={{ padding: 16, paddingTop: 8 }}>
        {!isStrava && (
          <Link href="/(tabs)/list/connect-strava" asChild>
            <Pressable
              style={({ pressed }) => ({
                backgroundColor: AC.systemOrange,
                padding: 16,
                borderRadius: 12,
                borderCurve: "continuous",
                marginBottom: 16,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "600", textAlign: "center" }}>
                Connect Strava to Import Peaks
              </Text>
            </Pressable>
          </Link>
        )}

        <View
          style={{
            backgroundColor: AC.secondarySystemGroupedBackground,
            padding: 16,
            borderRadius: 12,
            borderCurve: "continuous",
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: AC.label, marginBottom: 4 }}>
                Total Peaks: {peaks.length}
              </Text>
              <Text style={{ fontSize: 14, color: AC.secondaryLabel }}>
                Highest: {sortedPeaks[0].name} ({sortedPeaks[0].elevation}m)
              </Text>
            </View>
            {isStrava && (
              <Link href="/(tabs)/list/connect-strava" asChild>
                <Pressable
                  style={({ pressed }) => ({
                    backgroundColor: AC.systemBlue,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    borderCurve: "continuous",
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
                    Manage
                  </Text>
                </Pressable>
              </Link>
            )}
          </View>
          {isStrava && (
            <Text style={{ fontSize: 13, color: AC.tertiaryLabel, marginTop: 8 }}>
              Data from Strava
            </Text>
          )}
        </View>

        {sortedPeaks.map((peak) => (
          <PeakCard key={peak.id} peak={peak} />
        ))}
      </View>
    </ScrollView>
  );
}
