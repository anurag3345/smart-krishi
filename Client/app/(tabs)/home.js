import { SafeAreaView, ScrollView, View } from 'react-native';
import FeatureGrid from '../../components/FeatureGrid';
import GreetingCard from '../../components/GreetingCard';
import HomeHeader from '../../components/HomeHeader';
import OfflineAlert from '../../components/OfflineAlert';
import TipCard from '../../components/TipCard';
import WeatherCard from '../../components/WeatherCard';
import FAQSection from '../../components/FAQSection'; // New import
import {
  farmingTips,
  featureGridItems,
  greetingUser,
  weatherInfo,
  faqData, // New import
} from '../../constants/data';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>
        {/* Scrollable Content */}
        <ScrollView 
          style={{ flex: 1, backgroundColor: '#fff' }} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 90, paddingBottom: 20 }} 
        >
          <GreetingCard user={greetingUser} />
          <OfflineAlert />
          <FeatureGrid items={featureGridItems} />
          <WeatherCard weather={weatherInfo} />
          <TipCard tips={farmingTips} />
          <FAQSection faqData={faqData} /> {/* New component */}
        </ScrollView>
        
        {/* Absolutely Positioned Header */}
        <View style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          backgroundColor: '#fff'
        }}>
          <HomeHeader />
        </View>
      </View>
    </SafeAreaView>
  );
}