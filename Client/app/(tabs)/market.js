import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // install if you haven't already
import RentCrop from '../../components/RentCrop';
import RentMachine from '../../components/RentMachine';

export default function MarketScreen() {
  const [selected, setSelected] = useState('produce'); // default to produce/crop

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Internal Tab Header */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          onPress={() => setSelected('produce')}
          style={[
            styles.tabButton,
            selected === 'produce' ? styles.tabActive : styles.tabInactive,
            { marginRight: 6 },
          ]}
        >
          <Text style={[styles.tabText, selected === 'produce' && styles.tabTextActive]}>
            Produce
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelected('tools')}
          style={[
            styles.tabButton,
            selected === 'tools' ? styles.tabActiveTools : styles.tabInactive,
            { marginLeft: 6 },
          ]}
        >
          <Text style={[styles.tabText, selected === 'tools' && styles.tabTextActive]}>
            Tools
          </Text>
        </TouchableOpacity>
      </View>

      {/* Screens */}
      <View style={styles.content}>
        {selected === 'produce' ? <RentCrop /> : <RentMachine />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // or your background color
  },
  tabHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#4CAF50',
    borderBottomWidth: 3,
    borderBottomColor: '#388e3c',
  },
  tabActiveTools: {
    backgroundColor: '#1976D2',
    borderBottomWidth: 3,
    borderBottomColor: '#0d47a1',
  },
  tabInactive: {
    backgroundColor: '#e5e5e5',
    borderBottomWidth: 0,
  },
  tabText: {
    fontWeight: 'bold',
    color: '#333',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
});
