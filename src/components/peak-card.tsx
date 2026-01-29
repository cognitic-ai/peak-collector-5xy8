import { View, Text, Pressable } from "react-native";
import * as AC from "@bacons/apple-colors";
import { MountainPeak } from "@/data/peaks";

interface PeakCardProps {
  peak: MountainPeak;
}

export default function PeakCard({ peak }: PeakCardProps) {
  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: AC.secondarySystemGroupedBackground,
        borderRadius: 16,
        borderCurve: "continuous",
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: AC.label, flex: 1 }}>
          {peak.name}
        </Text>
        <View
          style={{
            backgroundColor: AC.systemBlue,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
            borderCurve: "continuous",
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>
            {peak.elevation}m
          </Text>
        </View>
      </View>

      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={{ fontSize: 15, color: AC.secondaryLabel }}>📍</Text>
          <Text style={{ fontSize: 15, color: AC.secondaryLabel }}>
            {peak.range}, {peak.country}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={{ fontSize: 15, color: AC.secondaryLabel }}>📅</Text>
          <Text style={{ fontSize: 15, color: AC.secondaryLabel }}>
            Collected: {new Date(peak.dateCollected).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
