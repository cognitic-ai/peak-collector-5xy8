import { useMemo } from "react";
import Stack from "expo-router/stack";
import * as AC from "@bacons/apple-colors";

export const unstable_settings = {
  map: { anchor: "map" },
  list: { anchor: "list" }
};

export default function Layout({ segment }: { segment: string }) {
  const screen = segment.match(/\((.*)\)/)?.[1]!;

  const options = useMemo(() => {
    switch (screen) {
      case "map":
        return {
          title: "Mountain Peaks Map",
          headerLargeTitle: true
        };
      case "list":
        return {
          title: "My Collection",
          headerLargeTitle: true
        };
      default:
        return {};
    }
  }, [screen]);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerBlurEffect: "systemChromeMaterial",
        headerLargeTitleShadowVisible: false,
        headerTitleStyle: {
          color: AC.label as any,
        },
      }}
    >
      <Stack.Screen name={screen} options={options} />
    </Stack>
  );
}
