import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Add this import

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ChevronDown = ({ isExpanded }) => (
  <View style={[styles.chevronContainer, isExpanded && styles.chevronRotated]}>
    <Icon 
      name="keyboard-arrow-down" 
      size={24} 
      color="#4CAF50" 
      style={styles.chevronIcon}
    />
  </View>
);

const FAQItem = ({ question, answer, isExpanded, onToggle, currentLanguage }) => {
  return (
    <View style={styles.faqItem}>
      <TouchableOpacity 
        style={styles.questionContainer} 
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Text style={styles.questionText}>
          {currentLanguage === 'NP' ? question.nepali : question.english}
        </Text>
        <ChevronDown isExpanded={isExpanded} />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>
            {currentLanguage === 'NP' ? answer.nepali : answer.english}
          </Text>
        </View>
      )}
    </View>
  );
};

export default function FAQSection({ faqData, initialVisibleCount = 3 }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [showAll, setShowAll] = useState(false);
  const currentLanguage = useSelector((state) => state.language.value);

  const visibleFAQs = showAll ? faqData : faqData.slice(0, initialVisibleCount);
  const hasMoreItems = faqData.length > initialVisibleCount;

  const toggleExpanded = (index) => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleShowAll = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    setShowAll(!showAll);
    // Reset expanded items when toggling view
    if (!showAll) {
      setExpandedItems({});
    }
  };

  const getFAQTitle = () => {
    return currentLanguage === 'NP' 
      ? 'बारम्बार सोधिने प्रश्नहरू' 
      : 'Frequently Asked Questions';
  };

  const getFAQSubtitle = () => {
    return currentLanguage === 'NP' 
      ? 'स्मार्ट कृषि सम्बन्धी प्रश्नहरू' 
      : 'Get answers to common questions';
  };

  const getViewMoreText = () => {
    if (showAll) {
      return currentLanguage === 'NP' ? 'कम देखाउनुहोस्' : 'Show Less';
    }
    return currentLanguage === 'NP' 
      ? `थप हेर्नुहोस् (${faqData.length - initialVisibleCount}+)` 
      : `View More (${faqData.length - initialVisibleCount}+)`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Icon name="help-outline" size={24} color="#4CAF50" style={styles.headerIcon} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{getFAQTitle()}</Text>
          <Text style={styles.subtitle}>{getFAQSubtitle()}</Text>
        </View>
      </View>
      
      <View style={styles.faqList}>
        {visibleFAQs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isExpanded={expandedItems[index]}
            onToggle={() => toggleExpanded(index)}
            currentLanguage={currentLanguage}
          />
        ))}
      </View>

      {hasMoreItems && (
        <TouchableOpacity 
          style={styles.viewMoreButton} 
          onPress={toggleShowAll}
          activeOpacity={0.8}
        >
          <Text style={styles.viewMoreText}>{getViewMoreText()}</Text>
          <Icon 
            name="keyboard-arrow-right" 
            size={20} 
            color="#4CAF50" 
            style={styles.readMoreArrow}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  faqList: {
    gap: 1,
  },
  faqItem: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    minHeight: 56,
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginRight: 12,
    lineHeight: 20,
  },
  chevronContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  chevronIcon: {
    // No additional styles needed, handled by the Icon component
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fafbfc',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
    fontWeight: '400',
  },
  viewMoreButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  viewMoreText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4CAF50',
    marginRight: 6,
  },
  readMoreArrow: {
    // No additional styles needed, handled by the Icon component
  },
});