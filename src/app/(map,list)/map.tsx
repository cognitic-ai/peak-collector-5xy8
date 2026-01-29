import { View, Text } from "react-native";
import { mockPeaks } from "@/data/peaks";
import PeakMap from "@/components/peak-map";
import * as AC from "@bacons/apple-colors";

export default function MapScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: AC.systemBackground }}>
      {process.env.EXPO_OS === "web" && (
        <View style={{ height: 64 }} />
      )}
      <PeakMap peaks={mockPeaks} />
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
          {mockPeaks.length} Peaks Collected
        </Text>
      </View>
    </View>
  );
}
