import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import * as AC from "@bacons/apple-colors";
import {
  useStravaAuth,
  exchangeCodeForToken,
  fetchStravaActivities,
  filterPeakActivities,
  StravaPeak
} from "@/services/strava";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ConnectStravaScreen() {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const { request, response, promptAsync, redirectUri } = useStravaAuth();

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      handleAuthSuccess(response.params.code);
    } else if (response?.type === 'error') {
      Alert.alert('Error', 'Failed to authenticate with Strava');
    }
  }, [response]);

  const checkConnection = async () => {
    const token = await AsyncStorage.getItem('strava_token');
    setConnected(!!token);
  };

  const handleAuthSuccess = async (code: string) => {
    try {
      setLoading(true);
      const token = await exchangeCodeForToken(code, redirectUri);
      await AsyncStorage.setItem('strava_token', token);

      // Fetch and store peaks
      const activities = await fetchStravaActivities(token);
      const peaks = filterPeakActivities(activities);
      await AsyncStorage.setItem('strava_peaks', JSON.stringify(peaks));

      setConnected(true);
      Alert.alert('Success', `Connected! Found ${peaks.length} peak activities.`);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch activities from Strava');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!request) return;
    setLoading(true);
    await promptAsync();
    setLoading(false);
  };

  const handleDisconnect = async () => {
    await AsyncStorage.removeItem('strava_token');
    await AsyncStorage.removeItem('strava_peaks');
    setConnected(false);
    Alert.alert('Disconnected', 'Strava account has been disconnected');
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('strava_token');
      if (!token) return;

      const activities = await fetchStravaActivities(token);
      const peaks = filterPeakActivities(activities);
      await AsyncStorage.setItem('strava_peaks', JSON.stringify(peaks));

      Alert.alert('Success', `Refreshed! Found ${peaks.length} peak activities.`);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh activities');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: AC.systemGroupedBackground }}>
      <Stack.Screen options={{ title: "Connect Strava", headerLargeTitle: false }} />

      <View style={{ padding: 20, gap: 20 }}>
        <View
          style={{
            backgroundColor: AC.secondarySystemGroupedBackground,
            padding: 20,
            borderRadius: 16,
            borderCurve: "continuous",
          }}
        >
          <Text style={{ fontSize: 17, color: AC.label, marginBottom: 12 }}>
            Connect your Strava account to automatically import your mountain peak activities.
          </Text>
          <Text style={{ fontSize: 15, color: AC.secondaryLabel }}>
            We'll fetch activities with elevation gain greater than 200m.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={AC.systemBlue} />
        ) : connected ? (
          <>
            <Pressable
              onPress={handleRefresh}
              style={({ pressed }) => ({
                backgroundColor: AC.systemBlue,
                padding: 16,
                borderRadius: 12,
                borderCurve: "continuous",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "600", textAlign: "center" }}>
                Refresh Activities
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDisconnect}
              style={({ pressed }) => ({
                backgroundColor: AC.systemRed,
                padding: 16,
                borderRadius: 12,
                borderCurve: "continuous",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "600", textAlign: "center" }}>
                Disconnect Strava
              </Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            onPress={handleConnect}
            disabled={!request}
            style={({ pressed }) => ({
              backgroundColor: AC.systemOrange,
              padding: 16,
              borderRadius: 12,
              borderCurve: "continuous",
              opacity: pressed || !request ? 0.7 : 1,
            })}
          >
            <Text style={{ color: "#fff", fontSize: 17, fontWeight: "600", textAlign: "center" }}>
              Connect with Strava
            </Text>
          </Pressable>
        )}

        <View
          style={{
            backgroundColor: AC.secondarySystemGroupedBackground,
            padding: 16,
            borderRadius: 12,
            borderCurve: "continuous",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "600", color: AC.label, marginBottom: 8 }}>
            Setup Instructions:
          </Text>
          <Text style={{ fontSize: 14, color: AC.secondaryLabel, marginBottom: 4 }}>
            1. Go to https://www.strava.com/settings/api
          </Text>
          <Text style={{ fontSize: 14, color: AC.secondaryLabel, marginBottom: 4 }}>
            2. Create a new application
          </Text>
          <Text style={{ fontSize: 14, color: AC.secondaryLabel, marginBottom: 4 }}>
            3. Add your Client ID and Secret to .env file
          </Text>
          <Text style={{ fontSize: 14, color: AC.secondaryLabel }}>
            4. Set Authorization Callback Domain to your app domain
          </Text>
        </View>
      </View>
    </View>
  );
}
