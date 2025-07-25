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
    color: '#ff6b6b', // stronger color for alert
    icon: 'bug-outline',
  },
  {
    id: '2',
    title: 'Heavy Rain Warning',
    time: '6h ago',
    color: '#f1c40f',
    icon: 'rainy-outline',
  },
  {
    id: '3',
    title: 'Fertilizer Shortage Update',
    time: '1d ago',
    color: '#1abc9c',
    icon: 'leaf-outline',
  },
  {
    id: '4',
    title: 'Soil Moisture Level Low',
    time: '3h ago',
    color: '#3498db',
    icon: 'water-outline',
  },
  {
    id: '5',
    title: 'Harvest Season Starting Soon',
    time: '5d ago',
    color: '#e67e22',
    icon: 'calendar-outline',
  },
  {
    id: '6',
    title: 'Strong Winds Expected Tomorrow',
    time: '8h ago',
    color: '#95a5a6',
    icon: 'cloudy-outline',
  },
  {
    id: '7',
    title: 'New Crop Disease Detected',
    time: '30m ago',
    color: '#c0392b',
    icon: 'medkit-outline',
  },
  {
    id: '8',
    title: 'Irrigation System Maintenance',
    time: '1d ago',
    color: '#16a085',
    icon: 'construct-outline',
  },
  {
    id: '9',
    title: 'Market Prices Updated',
    time: '12h ago',
    color: '#27ae60',
    icon: 'bar-chart-outline',
  },
  {
    id: '10',
    title: 'Equipment Rental Offers Available',
    time: '3d ago',
    color: '#8e44ad',
    icon: 'pricetag-outline',
  },
];



export const profileInfo = {
  name: 'Kriti Sanon',
  avatar: require('../assets/images/profile.jpg'),
};

export const profileOptions = [
  { id: '1', label: 'My Crops', icon: 'leaf' },
  { id: '2', label: 'My Orders', icon: 'cart' },
  { id: '3', label: 'Notifications', icon: 'notifications' },
  { id: '4', label: 'Billing & Payments', icon: 'card' },
  { id: '5', label: 'Settings', icon: 'settings' },
  { id: '6', label: 'Help & Support', icon: 'help-circle' },
  { id: '7', label: 'Logout', icon: 'log-out' },
];


// constants/data.js

export const cropList = [
  {
    id: '1',
    name: 'Rice',
    image: require('../assets/crops/rice.jpg'),
  },
  {
    id: '2',
    name: 'Wheat',
    image: require('../assets/crops/wheat.jpg'),
  },
  {
    id: '3',
    name: 'Maize',
    image: require('../assets/crops/maize.jpg'),
  },
  {
    id: '4',
    name: 'Potato',
    image: require('../assets/crops/potato.jpg'),
  },
  {
    id: '5',
    name: 'Onion',
    image: require('../assets/crops/onion.jpg'),
  },
];
