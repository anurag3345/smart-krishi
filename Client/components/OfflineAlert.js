import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function OfflineAlert() {
  const [showQuestion, setShowQuestion] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowQuestion(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const lang = useSelector((state) => state.language.value);

  return (
    <View style={styles.alert}>
      {/* Left: Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={showQuestion ? 'help-circle' : 'alert-circle'}
            size={28}
            color="#d32f2f"
          />
        </View>
      </View>

      {/* Right: Text */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          
        {lang === 'EN'
          ? 'You are offline. Some features may not be available.'
          : 'तपाईं अफलाइन हुनुहुन्छ। केही सुविधाहरू उपलब्ध नहुन सक्छन्।'}
      </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    flexDirection: 'row',
    backgroundColor: '#ffebee',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  iconCircle: {
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: '#d32f2f',
    borderRadius: 30,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'left',
    fontWeight: '500',
  },
});
