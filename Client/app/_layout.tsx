// app/_layout.tsx
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext'; // adjust path if needed

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
          <Slot />
          <StatusBar style="dark" />
        </View>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
