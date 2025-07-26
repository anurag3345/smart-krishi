import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

export default function TipCard({ tips }) {
  const [selectedTip, setSelectedTip] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const language = useSelector((state) => state.language.value);

  const openModal = (tip) => {
    setSelectedTip(tip);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTip(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="bulb" size={20} color="#4CAF50" />
        </View>
        <Text style={styles.header}>
          {language === 'EN' ? 'Farming Tips & News' : 'कृषि सुझाव र समाचार'}
        </Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {tips.map((tip, index) => (
          <TouchableOpacity 
            key={tip.id} 
            style={[styles.card, { marginTop: index === 0 ? 0 : 12 }]}
            onPress={() => openModal(tip)}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <Text style={styles.title}>
                {language === 'EN' ? tip.title : tip.titleNP || tip.title}
              </Text>
              <Text style={styles.desc} numberOfLines={2}>
                {language === 'EN' ? tip.description : tip.descriptionNP || tip.description}
              </Text>
              <View style={styles.footer}>
                <Text style={styles.date}>
                  {language === 'EN' ? tip.date : tip.dateNP || tip.date}
                </Text>
                <View style={styles.readMore}>
                  <Text style={styles.readMoreText}>
                    {language === 'EN' ? 'Read more' : 'थप पढ्नुहोस्'}
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color="#4CAF50" />
                </View>
              </View>
            </View>
            <View style={styles.cardAccent} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderContent}>
                <View style={styles.modalIconContainer}>
                  <Ionicons name="leaf" size={22} color="#4CAF50" />
                </View>
                <Text style={styles.modalTitle}>
                  {language === 'EN' ? 'Farming Tip Details' : 'कृषि सुझाव विवरण'}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={closeModal}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <ScrollView 
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {selectedTip && (
                <>
                  <View style={styles.tipHeader}>
                    <Text style={styles.tipTitle}>
                      {language === 'EN' ? selectedTip.title : selectedTip.titleNP || selectedTip.title}
                    </Text>
                    <View style={styles.tipMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={16} color="#999999" />
                        <Text style={styles.metaText}>
                          {language === 'EN' ? selectedTip.date : selectedTip.dateNP || selectedTip.date}
                        </Text>
                      </View>
                      {selectedTip.category && (
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryText}>
                            {language === 'EN' ? selectedTip.category : selectedTip.categoryNP || selectedTip.category}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.descriptionContainer}>
                    <Text style={styles.fullDescription}>
                      {selectedTip.id === '1' ? 
                        (language === 'EN' ? 
                          "Tomato cultivation requires careful attention to soil preparation, watering schedules, and pest management. Start with well-draining soil rich in organic matter. Plant seedlings after the last frost date in your area. Tomatoes need consistent moisture but avoid overwatering which can lead to root rot and fungal diseases." :
                          "टमाटर खेतीमा माटो तयारी, पानी हाल्ने समयतालिका, र कीट व्यवस्थापनमा सावधान ध्यान दिनु पर्छ। जैविक पदार्थले भरपूर र राम्रो निकास भएको माटोबाट सुरु गर्नुहोस्। तपाईंको क्षेत्रमा अन्तिम हिउँ परेको मिति पछि बिरुवा रोप्नुहोस्। टमाटरलाई निरन्तर नमी चाहिन्छ तर धेरै पानी हाल्नु हुँदैन जसले जरा सड्न र फंगल संक्रमण हुन सक्छ।") :
                        selectedTip.id === '2' ?
                        (language === 'EN' ?
                          "Monsoon season brings both opportunities and challenges for farmers. Proper drainage systems are essential to prevent waterlogging. Strengthen plant supports before heavy rains arrive. Consider covered cultivation for sensitive crops and ensure proper ventilation to prevent fungal infections." :
                          "मनसुन मौसमले किसानहरूका लागि अवसर र चुनौती दुवै ल्याउँछ। पानी जम्ने समस्याबाट बच्न उचित निकास प्रणाली आवश्यक छ। भारी वर्षा आउनु अघि बिरुवाका सहारा बलियो बनाउनुहोस्। संवेदनशील बालीका लागि ढाकेर खेती गर्ने विचार गर्नुहोस् र फंगल संक्रमणबाट बच्न उचित हावा आवागमनको व्यवस्था गर्नुहोस्।") :
                        (language === 'EN' ? selectedTip.description : selectedTip.descriptionNP || selectedTip.description)
                      }
                    </Text>
                  </View>

                  {(selectedTip.id === '1' || selectedTip.id === '2') && (
                    <View style={styles.keyPointsContainer}>
                      <Text style={styles.sectionTitle}>
                        {language === 'EN' ? 'Key Points' : 'मुख्य बुँदाहरू'}
                      </Text>
                      {(selectedTip.id === '1' ? 
                        (language === 'EN' ? [
                          "Choose disease-resistant tomato varieties",
                          "Maintain soil pH between 6.0-6.8",
                          "Provide support structures early",
                          "Remove suckers for better fruit development"
                        ] : [
                          "रोग प्रतिरोधी टमाटर जातहरू छान्नुहोस्",
                          "माटोको pH ६.०-६.८ बीच राख्नुहोस्",
                          "चाँडै सहारा संरचना प्रदान गर्नुहोस्",
                          "राम्रो फल विकासका लागि अनावश्यक हाँगाहरू हटाउनुहोस्"
                        ]) :
                        (language === 'EN' ? [
                          "Install proper drainage channels",
                          "Use mulching to prevent soil erosion",
                          "Store fertilizers in dry places",
                          "Monitor weather forecasts regularly"
                        ] : [
                          "उचित निकास च्यानलहरू स्थापना गर्नुहोस्",
                          "माटोको क्षरण रोक्न मल्चिङ प्रयोग गर्नुहोस्",
                          "मलहरू सुख्खा ठाउँमा भण्डारण गर्नुहोस्",
                          "मौसम पूर्वानुमान नियमित निरीक्षण गर्नुहोस्"
                        ])
                      ).map((point, index) => (
                        <View key={index} style={styles.keyPointItem}>
                          <View style={styles.bulletPoint} />
                          <Text style={styles.keyPointText}>{point}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {(selectedTip.id === '1' || selectedTip.id === '2') && (
                    <View style={styles.tipsContainer}>
                      <Text style={styles.sectionTitle}>
                        {language === 'EN' ? 'Practical Tips' : 'व्यावहारिक सुझावहरू'}
                      </Text>
                      {(selectedTip.id === '1' ? 
                        (language === 'EN' ? [
                          "Water deeply but less frequently to encourage root growth",
                          "Apply organic compost every 2-3 weeks during growing season",
                          "Prune lower leaves touching the ground to prevent disease",
                          "Harvest tomatoes when they start turning color for best flavor"
                        ] : [
                          "जराको वृद्धिलाई प्रोत्साहन दिन गहिरो तर कम पटक पानी हाल्नुहोस्",
                          "बढ्दो मौसममा हरेक २-३ हप्तामा जैविक कम्पोस्ट प्रयोग गर्नुहोस्",
                          "रोग रोक्न भुइँमा छुने तल्लो पातहरू काट्नुहोस्",
                          "राम्रो स्वादका लागि टमाटर रंग बदल्न सुरु गरेपछि टिप्नुहोस्"
                        ]) :
                        (language === 'EN' ? [
                          "Create raised beds to improve drainage in monsoon",
                          "Apply neem-based organic pesticides before rainy season",
                          "Cover sensitive plants with plastic tunnels during heavy rain",
                          "Increase plant spacing to improve air circulation"
                        ] : [
                          "मनसुनमा निकास सुधार गर्न उठाइएको क्यारी बनाउनुहोस्",
                          "वर्षा ऋतु अघि नीममा आधारित जैविक कीटनाशक प्रयोग गर्नुहोस्",
                          "भारी वर्षामा संवेदनशील बिरुवाहरूलाई प्लास्टिक टनेलले ढाक्नुहोस्",
                          "हावा संचार सुधार गर्न बिरुवाको दूरी बढाउनुहोस्"
                        ])
                      ).map((tip, index) => (
                        <View key={index} style={styles.tipItem}>
                          <View style={styles.tipNumber}>
                            <Text style={styles.tipNumberText}>{index + 1}</Text>
                          </View>
                          <Text style={styles.tipText}>{tip}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={styles.sourceContainer}>
                    <Text style={styles.sourceLabel}>
                      {language === 'EN' ? 'Source: ' : 'स्रोत: '}
                    </Text>
                    <Text style={styles.sourceText}>
                      {selectedTip.id === '1' ? 
                        (language === 'EN' ? 'Horticultural Research Institute' : 'बागवानी अनुसन्धान संस्थान') : 
                        (language === 'EN' ? 'Monsoon Farming Guide 2024' : 'मनसुन कृषि गाइड २०२४')
                      }
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={closeModal}
                activeOpacity={0.8}
              >
                <Ionicons name="bookmark-outline" size={20} color="#4CAF50" />
                <Text style={styles.actionButtonText}>
                  {language === 'EN' ? 'Save Tip' : 'सुझाव सेभ गर्नुहोस्'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.shareButton]}
                onPress={closeModal}
                activeOpacity={0.8}
              >
                <Ionicons name="share-outline" size={20} color="#4CAF50" />
                <Text style={styles.actionButtonText}>
                  {language === 'EN' ? 'Share' : 'साझा गर्नुहोस्'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    color: '#4CAF50',
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
    padding: 16,
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
    fontSize: 14, 
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
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
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: height * 0.85,
    paddingTop: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tipHeader: {
    marginBottom: 24,
  },
  tipTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 32,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  tipMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#999999',
    marginLeft: 6,
    fontWeight: '500',
  },
  categoryBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  fullDescription: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  keyPointsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginTop: 8,
    marginRight: 12,
  },
  keyPointText: {
    flex: 1,
    fontSize: 15,
    color: '#555555',
    lineHeight: 22,
  },
  tipsContainer: {
    marginBottom: 24,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tipNumberText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#555555',
    lineHeight: 22,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginBottom: 20,
  },
  sourceLabel: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '600',
  },
  sourceText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  shareButton: {
    marginLeft: 6,
  },
  actionButtonText: {
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 8,
  },
});