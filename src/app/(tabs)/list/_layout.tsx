import Stack from "expo-router/stack";
import * as AC from "@bacons/apple-colors";

export default function ListLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLargeTitle: true,
        headerTransparent: true,
        headerBlurEffect: "systemChromeMaterial",
        headerLargeTitleShadowVisible: false,
        headerTitleStyle: {
          color: AC.label as any,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "My Collection",
        }}
      />
    </Stack>
  );
}
