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

// export const weatherInfo = {
//   location: 'Kathmandu',
//   temperature: '27°C',
//   condition: 'Partly Cloudy',
//   icon: 'partly-sunny-outline',
//   forecast: [
//     { time: 'Now', temp: '27°C', icon: 'sunny-outline' },
//     { time: '12 PM', temp: '29°C', icon: 'sunny-outline' },
//     { time: '3 PM', temp: '28°C', icon: 'cloud-outline' },
//     { time: '6 PM', temp: '25°C', icon: 'rainy-outline' },
//   ],
// };

export const farmingTips = [
  {
    id: '1',
    title: 'Best practices for tomato cultivation',
    titleNP: 'टमाटर खेतीका लागि उत्तम अभ्यासहरू',
    description: 'Learn how to maximize your tomato yield with these expert tips',
    descriptionNP: 'यी विशेषज्ञ सुझावहरूले तपाईंको टमाटरको उत्पादन कसरी बढाउने भन्ने कुरा सिक्नुहोस्',
    date: '2 days ago',
    dateNP: '२ दिन अघि',
    category: 'Vegetables',
    categoryNP: 'तरकारी',
  },
  {
    id: '2',
    title: 'Monsoon preparation for your crops',
    titleNP: 'तपाईंका बालीहरूका लागि मनसुन तयारी',
    description: 'Protect your farm with these monsoon-ready techniques',
    descriptionNP: 'यी मनसुन-तयार प्रविधिहरूले तपाईंको खेतलाई सुरक्षित राख्नुहोस्',
    date: '5 days ago',
    dateNP: '५ दिन अघि',
    category: 'Weather Management',
    categoryNP: 'मौसम व्यवस्थापन',
  },
];

export const faqData = [
  {
    question: {
      nepali: "स्मार्ट कृषि के हो?",
      english: "What is Smart Krishi?"
    },
    answer: {
      nepali: "स्मार्ट कृषि एक डिजिटल प्लेटफर्म हो जसले किसानहरूलाई आधुनिक खेती गर्न मद्दत गर्छ। यसमा मौसम जानकारी, बाली निगरानी, र कृषि सल्लाह समावेश छ।",
      english: "Smart Krishi is a digital platform that helps farmers with modern farming techniques, including weather information, crop monitoring, and agricultural advice."
    }
  },
  {
    question: {
      nepali: "बाली जीवन चक्र निगरानी कसरी काम गर्छ?",
      english: "How does crop lifecycle monitoring work?"
    },
    answer: {
      nepali: "हाम्रो एप्पले तपाईंको बालीको बीउ छर्ने देखि काट्ने सम्मको सम्पूर्ण यात्रा ट्र्याक गर्छ। यसले बाली बृद्धिको चरणहरू, आवश्यक हेरचाह, र सही समयमा कुन काम गर्ने भन्ने जानकारी दिन्छ।",
      english: "Our app tracks your crop's complete journey from sowing to harvesting, providing growth stage information, care requirements, and timely farming activities."
    }
  },
  {
    question: {
      nepali: "नेपाली भाषा सपोर्ट छ?",
      english: "Is Nepali language supported?"
    },
    answer: {
      nepali: "हो, हाम्रो एप्प पूर्ण रूपमा नेपाली भाषामा उपलब्ध छ। सबै फिचरहरू, निर्देशनहरू, र जानकारी नेपालीमा पाउन सकिन्छ। तपाईं सेटिङमा गएर भाषा परिवर्तन गर्न सक्नुहुन्छ।",
      english: "Yes, our app is fully available in Nepali language. All features, instructions, and information are available in Nepali. You can change the language in settings."
    }
  },
  {
    question: {
      nepali: "मौसम पूर्वानुमान कत्ति सही छ?",
      english: "How accurate is the weather forecast?"
    },
    answer: {
      nepali: "हामी विश्वसनीय मौसम डाटा प्रदायकहरूसँग काम गर्छौं र स्थानीय मौसम स्टेशनहरूबाट जानकारी लिन्छौं। सामान्यतया ३-५ दिनको पूर्वानुमान ८५-९०% सही हुन्छ।",
      english: "We work with reliable weather data providers and local weather stations. Generally, 3-5 day forecasts are 85-90% accurate."
    }
  },
  {
    question: {
      nepali: "अफलाइन मोडमा एप्प काम गर्छ?",
      english: "Does the app work in offline mode?"
    },
    answer: {
      nepali: "केही फिचरहरू अफलाइन उपलब्ध छन् जस्तै पहिले सेभ गरिएको डाटा, कृषि टिप्स, र बाली क्यालेन्डर। तर मौसम अपडेट र रियल-टाइम सल्लाहको लागि इन्टरनेट आवश्यक छ।",
      english: "Some features are available offline like previously saved data, farming tips, and crop calendar. However, internet is required for weather updates and real-time advice."
    }
  },
  {
    question: {
      nepali: "एप्प प्रयोग गर्न शुल्क लाग्छ?",
      english: "Is there a fee to use the app?"
    },
    answer: {
      nepali: "आधारभूत फिचरहरू नि:शुल्क छन्। प्रिमियम फिचरहरू जस्तै विस्तृत बाली विश्लेषण र व्यक्तिगत सल्लाहको लागि मासिक सदस्यता शुल्क छ।",
      english: "Basic features are free. Premium features like detailed crop analysis and personalized advice require a monthly subscription."
    }
  },
  {
    question: {
      nepali: "कुन कुन बालीहरूको जानकारी पाइन्छ?",
      english: "Which crops information is available?"
    },
    answer: {
      nepali: "धान, गहूं, मकै, आलु, तरकारी, फलफूल लगायत नेपालका मुख्य बालीहरूको विस्तृत जानकारी उपलब्ध छ। नयाँ बालीहरू नियमित रूपमा थपिंदैछन्।",
      english: "Information for major Nepali crops including rice, wheat, corn, potato, vegetables, and fruits is available. New crops are regularly being added."
    }
  },
  {
    question: {
      nepali: "डाटा सुरक्षित छ?",
      english: "Is my data secure?"
    },
    answer: {
      nepali: "हो, तपाईंको व्यक्तिगत जानकारी र खेती डाटा पूर्ण रूपमा सुरक्षित छ। हामी कडा डाटा सुरक्षा नीति पालना गर्छौं र तेस्रो पक्षसँग जानकारी साझा गर्दैनौं।",
      english: "Yes, your personal information and farming data is completely secure. We follow strict data security policies and don't share information with third parties."
    }
  },
  {
    question: {
      nepali: "स्मार्ट कृषिका मुख्य फिचरहरू के के छन्?",
      english: "What are the main features of Smart Krishi?"
    },
    answer: {
      nepali: "मुख्य फिचरहरूमा बाली निगरानी, मौसम पूर्वानुमान, कृषि सल्लाह, रोग पहिचान, बजार मूल्य जानकारी, र किसान समुदाय नेटवर्क समावेश छ।",
      english: "Main features include crop monitoring, weather forecast, agricultural advice, disease identification, market price information, and farmer community network."
    }
  },
  {
    question: {
      nepali: "नयाँ किसानहरूका लागि कस्तो सहायता छ?",
      english: "What support is available for new farmers?"
    },
    answer: {
      nepali: "नयाँ किसानहरूका लागि विशेष ट्यूटोरियल, चरणबद्ध गाइड, र विशेषज्ञ सल्लाह उपलब्ध छ। साथै २४/७ हेल्पलाइन सेवा पनि छ।",
      english: "Special tutorials, step-by-step guides, and expert advice are available for new farmers. Additionally, there's a 24/7 helpline service."
    }
  }
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
  }
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
