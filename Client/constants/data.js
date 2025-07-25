// constants/data.js

export const greetingUser = {
  name: 'Ram Bahadur',
  tip: 'Today is a good day for farming',
};

export const featureGridItems = [
  { id: '1', title: 'My Crops', icon: 'leaf-outline', bgColor: '#e8f5e9' },
  { id: '2', title: 'Crop Health', icon: 'medkit-outline', bgColor: '#fde0dc' },
  { id: '3', title: 'Sell Produce', icon: 'cart-outline', bgColor: '#fff3e0' },
  { id: '4', title: 'Rent Tools', icon: 'construct-outline', bgColor: '#e3f2fd' },
];

export const weatherInfo = {
  location: 'Kathmandu',
  temperature: '27°C',
  condition: 'Partly Cloudy',
  icon: 'partly-sunny-outline',
  forecast: [
    { time: 'Now', temp: '27°C', icon: 'sunny-outline' },
    { time: '12 PM', temp: '29°C', icon: 'sunny-outline' },
    { time: '3 PM', temp: '28°C', icon: 'cloud-outline' },
    { time: '6 PM', temp: '25°C', icon: 'rainy-outline' },
  ],
};

export const farmingTips = [
  {
    id: '1',
    title: 'Best practices for tomato cultivation',
    description: 'Learn how to maximize your tomato yield with these expert tips',
    date: '2 days ago',
  },
  {
    id: '2',
    title: 'Monsoon preparation for your crops',
    description: 'Protect your farm with these monsoon-ready techniques',
    date: '5 days ago',
  },
];

export const marketProducts = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    price: 'Rs. 120/kg',
    image: 'https://via.placeholder.com/80',
  },
  {
    id: '2',
    name: 'Organic Rice',
    price: 'Rs. 85/kg',
    image: 'https://via.placeholder.com/80',
  },
  {
    id: '3',
    name: 'Onions',
    price: 'Rs. 65/kg',
    image: 'https://via.placeholder.com/80',
  },
];

export const alertsList = [
  {
    id: '1',
    title: 'Pest Alert: Aphids in Tomatoes',
    time: '2h ago',
    color: '#ffcccb',
    icon: 'bug-outline',
  },
  {
    id: '2',
    title: 'Heavy Rain Warning',
    time: '6h ago',
    color: '#fff3cd',
    icon: 'rainy-outline',
  },
  {
    id: '3',
    title: 'Fertilizer Shortage Update',
    time: '1d ago',
    color: '#d1ecf1',
    icon: 'leaf-outline',
  },
];

export const profileInfo = {
  name: 'Ram Bahadur',
  avatar: 'https://via.placeholder.com/100',
};

export const profileOptions = [
  { id: '1', label: 'My Crops', icon: 'leaf' },
  { id: '2', label: 'My Orders', icon: 'cart' },
  { id: '3', label: 'Settings', icon: 'settings' },
  { id: '4', label: 'Logout', icon: 'log-out' },
];
