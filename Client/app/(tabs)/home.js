import { SafeAreaView, ScrollView } from 'react-native';
import FeatureGrid from '../../components/FeatureGrid';
import GreetingCard from '../../components/GreetingCard';
import HomeHeader from '../../components/HomeHeader';
import OfflineAlert from '../../components/OfflineAlert';
import TipCard from '../../components/TipCard';
import WeatherCard from '../../components/WeatherCard';
import FaqSection from '../../components/FaqSection';
import {
  farmingTips,
  featureGridItems,
  greetingUser,
  weatherInfo,
} from '../../constants/data';
import {AuthContext} from '../../context/AuthContext';
import { useContext } from 'react';
import FavoriteFarmers from '../../components/FavoriteFarmers';
import RecentlyBrought from '../../components/RecentlyBrought';


export default function HomeScreen() {
  const {user} = useContext(AuthContext);
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} showsVerticalScrollIndicator={false}>
      <HomeHeader />
      <GreetingCard  />
      <OfflineAlert />
      <FeatureGrid items={featureGridItems} />
      {user?.role === 'user' &&       <RecentlyBrought/>}
      {user?.role === 'user' &&       <FavoriteFarmers/>}
      <WeatherCard weather={weatherInfo} />
      <FaqSection/>
      {user?.role === 'farmer' &&       <TipCard tips={farmingTips} />}
    </ScrollView>
    </SafeAreaView>
  );
}
