#!/usr/bin/env bash
# Vorcelab — Setup script
# Run from inside the Vorcelab GitHub Codespace:
# bash <(curl -s https://raw.githubusercontent.com/tounydata/runner-data/main/scripts/setup-vorcelab.sh)

set -e
echo "🚀 Setting up Vorcelab..."

mkdir -p app/\(tabs\) app/activity lib constants assets/images assets/fonts

# ── package.json ────────────────────────────────────────────────────────────
cat > package.json << 'PKGJSON'
{
  "name": "vorcelab",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "dependencies": {
    "@expo/vector-icons": "^14.0.2",
    "@react-native-async-storage/async-storage": "2.1.2",
    "@supabase/supabase-js": "^2.45.4",
    "expo": "~53.0.0",
    "expo-auth-session": "~6.1.5",
    "expo-constants": "~17.1.6",
    "expo-crypto": "~14.1.5",
    "expo-font": "~13.3.1",
    "expo-haptics": "~14.1.4",
    "expo-linking": "~7.1.5",
    "expo-router": "~5.0.7",
    "expo-secure-store": "~14.2.3",
    "expo-splash-screen": "~0.30.8",
    "expo-status-bar": "~2.2.3",
    "expo-system-ui": "~4.1.7",
    "expo-web-browser": "~14.1.6",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-native": "0.79.3",
    "react-native-chart-kit": "^6.12.0",
    "react-native-gesture-handler": "~2.24.0",
    "react-native-maps": "1.20.1",
    "react-native-reanimated": "~3.17.4",
    "react-native-safe-area-context": "5.4.0",
    "react-native-screens": "~4.10.0",
    "react-native-svg": "15.11.2",
    "react-native-url-polyfill": "^2.0.0",
    "react-native-webview": "13.13.5"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~19.0.10",
    "typescript": "~5.8.3"
  }
}
PKGJSON

# ── app.json ─────────────────────────────────────────────────────────────────
cat > app.json << 'APPJSON'
{
  "expo": {
    "name": "Vorcelab",
    "slug": "vorcelab",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "vorcelab",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.tounydata.vorcelab"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#0a0f1e"
      },
      "package": "com.tounydata.vorcelab"
    },
    "web": { "bundler": "metro", "output": "static" },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      ["expo-splash-screen", {
        "backgroundColor": "#0a0f1e",
        "resizeMode": "contain"
      }]
    ],
    "experiments": { "typedRoutes": true },
    "extra": { "eas": { "projectId": "YOUR_EAS_PROJECT_ID" } }
  }
}
APPJSON

# ── eas.json ──────────────────────────────────────────────────────────────────
cat > eas.json << 'EASJSON'
{
  "cli": { "version": ">= 14.0.0", "appVersionSource": "local" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": { "EXPO_PUBLIC_APP_ENV": "development" }
    },
    "preview": {
      "distribution": "internal",
      "env": { "EXPO_PUBLIC_APP_ENV": "preview" }
    },
    "production": {
      "autoIncrement": true,
      "env": { "EXPO_PUBLIC_APP_ENV": "production" }
    }
  },
  "submit": { "production": {} }
}
EASJSON

# ── tsconfig.json ─────────────────────────────────────────────────────────────
cat > tsconfig.json << 'TSCJSON'
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": { "strict": true, "paths": { "@/*": ["./*"] } }
}
TSCJSON

# ── babel.config.js ───────────────────────────────────────────────────────────
cat > babel.config.js << 'BABELJS'
module.exports = function (api) {
  api.cache(true);
  return { presets: ['babel-preset-expo'] };
};
BABELJS

# ── .gitignore ────────────────────────────────────────────────────────────────
cat > .gitignore << 'GITIGNORE'
node_modules/
.expo/
dist/
web-build/
*.jks
*.p8
*.p12
*.key
*.mobileprovision
.DS_Store
*.pem
.env
.env.local
android/
ios/
GITIGNORE

# ── .env.example ──────────────────────────────────────────────────────────────
cat > .env.example << 'ENVEX'
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
EXPO_PUBLIC_STRAVA_CLIENT_ID=YOUR_STRAVA_CLIENT_ID
ENVEX

# ── constants/Colors.ts ───────────────────────────────────────────────────────
cat > constants/Colors.ts << 'COLORS'
export const Colors = {
  bg: '#0a0f1e',
  card: '#111827',
  cardBorder: '#1e2d4a',
  cyan: '#00d4ff',
  accent: '#3b82f6',
  orange: '#ff6b35',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#f59e0b',
  text: '#e2e8f0',
  text2: '#94a3b8',
  text3: '#4b5563',
  bodyBlue: '#1e3b6e',
  mono: 'SpaceMono',
};
COLORS

# ── lib/types.ts ──────────────────────────────────────────────────────────────
cat > lib/types.ts << 'TYPES'
export interface Activity {
  id: number;
  strava_id: number;
  name: string;
  type: string;
  sport_type: string;
  start_date: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  suffer_score?: number;
  map_polyline?: string;
  gpx_data?: string;
  calories?: number;
  kudos_count?: number;
  average_cadence?: number;
  user_id: string;
}

export interface UserProfile {
  id: string;
  strava_id: number;
  firstname: string;
  lastname: string;
  profile_medium?: string;
  city?: string;
  country?: string;
  sex?: string;
  birthdate?: string;
  fc_max?: number;
  fc_repos?: number;
  poids?: number;
  taille?: number;
  vo2max?: number;
  pr_5k?: number;
  pr_10k?: number;
  pr_15k?: number;
  pr_semi?: number;
  pr_marathon?: number;
  pr_ultra?: number;
  objectif_hebdo_km?: number;
  objectif_course?: string;
  objectif_date?: string;
  onboarding_done?: boolean;
}

export interface RenfoEntry {
  id: string;
  user_id: string;
  date: string;
  zone: string;
  description: string;
  douleur: number;
  note?: string;
}

export interface WeekStats {
  km: number;
  sessions: number;
  time: number;
  elev: number;
}
TYPES

# ── lib/supabase.ts ───────────────────────────────────────────────────────────
cat > lib/supabase.ts << 'SUPA'
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
SUPA

# ── lib/strava.ts ─────────────────────────────────────────────────────────────
cat > lib/strava.ts << 'STRAVA'
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

export function formatPace(metersPerSec: number): string {
  if (!metersPerSec || metersPerSec <= 0) return '--:--';
  const secPerKm = 1000 / metersPerSec;
  const min = Math.floor(secPerKm / 60);
  const sec = Math.round(secPerKm % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h${m.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function isRun(type: string): boolean {
  return ['Run', 'TrailRun', 'VirtualRun'].includes(type);
}
STRAVA

# ── app/_layout.tsx ───────────────────────────────────────────────────────────
cat > app/_layout.tsx << 'LAYOUT'
import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/Colors';
import type { Session } from '@supabase/supabase-js';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const router = useRouter();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loaded || session === undefined) return;
    SplashScreen.hideAsync();
    if (session) router.replace('/(tabs)');
    else router.replace('/auth');
  }, [loaded, session]);

  if (!loaded || session === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Colors.cyan} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="activity/[id]" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
LAYOUT

# ── app/auth.tsx ──────────────────────────────────────────────────────────────
cat > app/auth.tsx << 'AUTH'
import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/Colors';

WebBrowser.maybeCompleteAuthSession();

const STRAVA_CLIENT_ID = process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID!;
const discovery = {
  authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
  tokenEndpoint: 'https://www.strava.com/oauth/token',
};

export default function AuthScreen() {
  const router = useRouter();
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'vorcelab', path: 'auth' });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    { clientId: STRAVA_CLIENT_ID, scopes: ['read', 'activity:read_all', 'profile:read_all'], redirectUri, responseType: AuthSession.ResponseType.Code },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success' && response.params.code) handleCode(response.params.code);
  }, [response]);

  async function handleCode(code: string) {
    const { data, error } = await supabase.functions.invoke('strava-auth', { body: { code } });
    if (error || !data?.access_token) return;
    const { error: e } = await supabase.auth.signInWithPassword({ email: data.email, password: data.supabase_password });
    if (!e) router.replace('/(tabs)');
  }

  return (
    <View style={s.container}>
      <View style={s.logo}>
        <Text style={s.title}>VORCELAB</Text>
        <Text style={s.subtitle}>Running & Renforcement</Text>
      </View>
      <TouchableOpacity style={[s.btn, !request && s.disabled]} onPress={() => promptAsync()} disabled={!request}>
        <Text style={s.btnText}>Connexion avec Strava</Text>
      </TouchableOpacity>
      <Text style={s.legal}>Vorcelab utilise Strava pour importer tes activités.{'\n'}Aucune donnée n'est partagée avec des tiers.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 32 },
  logo: { alignItems: 'center', gap: 8 },
  title: { fontFamily: Colors.mono, fontSize: 36, fontWeight: '700', color: Colors.cyan, letterSpacing: 6 },
  subtitle: { fontFamily: Colors.mono, fontSize: 12, color: Colors.text2, letterSpacing: 2 },
  btn: { backgroundColor: '#fc4c02', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, width: '100%', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  disabled: { opacity: 0.5 },
  legal: { color: Colors.text3, fontSize: 11, textAlign: 'center', lineHeight: 18 },
});
AUTH

# ── app/+not-found.tsx ────────────────────────────────────────────────────────
cat > 'app/+not-found.tsx' << 'NOTFOUND'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <View style={{ flex:1, backgroundColor: Colors.bg, justifyContent:'center', alignItems:'center', gap:16 }}>
      <Text style={{ color: Colors.text, fontSize: 18 }}>Page introuvable</Text>
      <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
        <Text style={{ color: Colors.cyan, fontSize: 15 }}>Retour au Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}
NOTFOUND

# ── app/(tabs)/_layout.tsx ────────────────────────────────────────────────────
cat > 'app/(tabs)/_layout.tsx' << 'TABLAYOUT'
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#0d1526', borderTopColor: Colors.cardBorder, borderTopWidth: 1, height: Platform.OS === 'ios' ? 88 : 64, paddingBottom: Platform.OS === 'ios' ? 24 : 8, paddingTop: 8 },
      tabBarActiveTintColor: Colors.cyan,
      tabBarInactiveTintColor: Colors.text3,
      tabBarLabelStyle: { fontFamily: Colors.mono, fontSize: 10, letterSpacing: 0.5 },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <Ionicons name="pulse-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendrier', tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="renfo" options={{ title: 'Renfo', tabBarIcon: ({ color, size }) => <Ionicons name="body-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}
TABLAYOUT

# ── app/(tabs)/index.tsx (Dashboard) ─────────────────────────────────────────
curl -s "https://raw.githubusercontent.com/tounydata/runner-data/main/scripts/tabs/index.tsx" -o "app/(tabs)/index.tsx" 2>/dev/null || echo "⚠️  index.tsx: download manually"

# ── app/(tabs)/calendar.tsx ───────────────────────────────────────────────────
curl -s "https://raw.githubusercontent.com/tounydata/runner-data/main/scripts/tabs/calendar.tsx" -o "app/(tabs)/calendar.tsx" 2>/dev/null || echo "⚠️  calendar.tsx: download manually"

# ── app/(tabs)/renfo.tsx ──────────────────────────────────────────────────────
curl -s "https://raw.githubusercontent.com/tounydata/runner-data/main/scripts/tabs/renfo.tsx" -o "app/(tabs)/renfo.tsx" 2>/dev/null || echo "⚠️  renfo.tsx: download manually"

# ── app/(tabs)/profile.tsx ────────────────────────────────────────────────────
curl -s "https://raw.githubusercontent.com/tounydata/runner-data/main/scripts/tabs/profile.tsx" -o "app/(tabs)/profile.tsx" 2>/dev/null || echo "⚠️  profile.tsx: download manually"

# ── app/activity/[id].tsx ─────────────────────────────────────────────────────
curl -s "https://raw.githubusercontent.com/tounydata/runner-data/main/scripts/tabs/activity-id.tsx" -o "app/activity/[id].tsx" 2>/dev/null || echo "⚠️  activity/[id].tsx: download manually"

# ── Placeholder font ──────────────────────────────────────────────────────────
echo "⚠️  Download SpaceMono-Regular.ttf from fonts.google.com and place in assets/fonts/"
touch assets/fonts/.gitkeep

echo ""
echo "✅ Files created! Now:"
echo "   1. npm install"
echo "   2. cp .env.example .env  (fill in your Supabase + Strava values)"
echo "   3. npx expo start --tunnel"
echo "   4. Scan QR with Expo Go on iPhone"
