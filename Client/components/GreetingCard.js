import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

export default function GreetingCard() {
  const {user} = useContext(AuthContext)
  const [showQuestion, setShowQuestion] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowQuestion(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.card}>
      {/* Left: Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.hello}>नमस्ते (Namaste),</Text>
        <Text style={styles.name}>{user?.name}</Text>
        {user?.role === 'user' && <Text style={styles.tip}>Today is a good day for farming</Text>}
      </View>

      {/* Right: Animated Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={showQuestion ? 'help-circle' : 'alert-circle'}
            size={32}
            color="#fff"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#2da84d',
    padding: 20,
    borderRadius: 16,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  hello: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tip: {
    color: '#fff',
    marginTop: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  iconContainer: {
    marginLeft: 16,
  },
  iconCircle: {
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: '#fff',
    borderRadius: 40,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
