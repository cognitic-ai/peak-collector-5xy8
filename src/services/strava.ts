import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const STRAVA_CLIENT_ID = process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID || '';
const STRAVA_CLIENT_SECRET = process.env.EXPO_PUBLIC_STRAVA_CLIENT_SECRET || '';

const discovery = {
  authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
  tokenEndpoint: 'https://www.strava.com/oauth/token',
};

export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  start_date: string;
  distance: number;
  total_elevation_gain: number;
  start_latlng: [number, number] | null;
  end_latlng: [number, number] | null;
  elev_high: number | null;
  elev_low: number | null;
}

export interface StravaPeak {
  id: string;
  name: string;
  elevation: number;
  latitude: number;
  longitude: number;
  dateCollected: string;
  elevationGain: number;
  distance: number;
  activityType: string;
}

export function useStravaAuth() {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'myapp',
    path: 'redirect'
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: STRAVA_CLIENT_ID,
      scopes: ['activity:read_all'],
      redirectUri,
    },
    discovery
  );

  return { request, response, promptAsync, redirectUri };
}

export async function exchangeCodeForToken(code: string, redirectUri: string): Promise<string> {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to exchange code for token');
  }

  return data.access_token;
}

export async function fetchStravaActivities(accessToken: string): Promise<StravaActivity[]> {
  const response = await fetch(
    'https://www.strava.com/api/v3/athlete/activities?per_page=200',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch activities');
  }

  return response.json();
}

export function filterPeakActivities(activities: StravaActivity[]): StravaPeak[] {
  return activities
    .filter((activity) => {
      // Filter by elevation gain > 200m
      if (activity.total_elevation_gain < 200) return false;

      // Filter for hiking/climbing activities
      const peakActivityTypes = ['Hike', 'Walk', 'Rock Climbing', 'Alpine Ski', 'Backcountry Ski'];
      if (!peakActivityTypes.includes(activity.type)) return false;

      // Must have location data
      if (!activity.start_latlng || activity.start_latlng.length !== 2) return false;

      return true;
    })
    .map((activity) => {
      // Use end location if available (likely closer to peak), otherwise start
      const [lat, lng] = activity.end_latlng || activity.start_latlng!;

      return {
        id: activity.id.toString(),
        name: activity.name,
        elevation: activity.elev_high || Math.round(activity.total_elevation_gain),
        latitude: lat,
        longitude: lng,
        dateCollected: activity.start_date,
        elevationGain: activity.total_elevation_gain,
        distance: activity.distance / 1000, // Convert to km
        activityType: activity.type,
      };
    });
}
