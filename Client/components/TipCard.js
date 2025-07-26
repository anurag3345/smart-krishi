import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TipCard({ tips }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="bulb" size={20} color="#4CAF50" />
        </View>
        <Text style={styles.header}>Farming Tips & News</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {tips.map((tip, index) => (
          <View key={tip.id} style={[styles.card, { marginTop: index === 0 ? 0 : 12 }]}>
            <View style={styles.cardContent}>
              <Text style={styles.title}>{tip.title}</Text>
              <Text style={styles.desc}>{tip.description}</Text>
              <View style={styles.footer}>
                <Text style={styles.date}>{tip.date}</Text>
                <View style={styles.readMore}>
                  <Text style={styles.readMoreText}>Read more</Text>
                  <Ionicons name="chevron-forward" size={14} color="#4CAF50" />
                </View>
              </View>
            </View>
            <View style={styles.cardAccent} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 16, 
    paddingBottom: 30,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  header: { 
    fontSize: 20, 
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 20,
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#4CAF50',
  },
  title: { 
    fontWeight: '600', 
    fontSize: 17,
    color: '#1a1a1a',
    lineHeight: 24,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  desc: { 
    fontSize: 15, 
    color: '#666666',
    lineHeight: 22,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: { 
    fontSize: 13, 
    color: '#999999',
    fontWeight: '500',
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
    marginRight: 4,
  },
});