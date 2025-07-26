import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from '../store/store'; // Import the Redux store
import LocationFetcher from '../components/LocationFetcher'; // Import the LocationFetcher component

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
          {/* Fetch location data when the app starts */}
          <LocationFetcher />
          {/* Render the current route */}
          <Slot />
          <StatusBar style="dark" />
        </View>
      </SafeAreaProvider>
    </Provider>
  );
}
