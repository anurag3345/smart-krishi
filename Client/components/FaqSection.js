import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { smartKrishiFAQs } from '../constants/data';



export default function FAQScreen() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleCollapse = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10, padding:10 }}>
        📋 FAQ
      </Text>
      {smartKrishiFAQs.map((faq, index) => {
        const isActive = activeIndex === index;

        return (
          <Card
            key={index}
            style={{
              marginBottom: 12,
              borderRadius: 12,
              backgroundColor: '#f9f9f9',
              elevation: 2,
            }}
          >
            <TouchableOpacity
              onPress={() => toggleCollapse(index)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', flex: 1 }}>{faq.question}</Text>
              <MaterialIcons
                name={isActive ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={24}
                color="#555"
              />
            </TouchableOpacity>

            {isActive && (
              <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                <Text style={{ color: '#555', lineHeight: 20 }}>{faq.answer}</Text>
              </View>
            )}
          </Card>
        );
      })}
    </ScrollView>
  );
}
