import { SafeAreaView, ScrollView } from 'react-native';
import FeatureGrid from '../../components/FeatureGrid';
import GreetingCard from '../../components/GreetingCard';
import HomeHeader from '../../components/HomeHeader';
import OfflineAlert from '../../components/OfflineAlert';
import TipCard from '../../components/TipCard';
import WeatherCard from '../../components/WeatherCard';
import {
  farmingTips,
  featureGridItems,
  greetingUser,
  weatherInfo,
} from '../../constants/data';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} showsVerticalScrollIndicator={false}>
      <HomeHeader />
      <GreetingCard user={greetingUser} />
      <OfflineAlert />
      <FeatureGrid items={featureGridItems} />
      <WeatherCard weather={weatherInfo} />
      <TipCard tips={farmingTips} />
    </ScrollView>
    </SafeAreaView>
  );
}
