import { ScrollView, View, Text } from "react-native";
import { mockPeaks } from "@/data/peaks";
import PeakCard from "@/components/peak-card";
import * as AC from "@bacons/apple-colors";

export default function ListScreen() {
  const sortedPeaks = [...mockPeaks].sort((a, b) => b.elevation - a.elevation);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: AC.systemGroupedBackground }}
    >
      <View style={{ padding: 16, paddingTop: 8 }}>
        <View
          style={{
            backgroundColor: AC.secondarySystemGroupedBackground,
            padding: 16,
            borderRadius: 12,
            borderCurve: "continuous",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: AC.label, marginBottom: 4 }}>
            Total Peaks: {mockPeaks.length}
          </Text>
          <Text style={{ fontSize: 14, color: AC.secondaryLabel }}>
            Highest: {sortedPeaks[0].name} ({sortedPeaks[0].elevation}m)
          </Text>
        </View>

        {sortedPeaks.map((peak) => (
          <PeakCard key={peak.id} peak={peak} />
        ))}
      </View>
    </ScrollView>
  );
}
