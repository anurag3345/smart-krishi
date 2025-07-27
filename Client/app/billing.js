import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BillingPaymentScreen = () => {
  const router = useRouter();
  
  // State management
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  
  // Form states for adding card
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  // Subscription plans
  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      monthlyPrice: 'NPR 1,200',
      yearlyPrice: 'NPR 12,000',
      yearlyDiscount: '17% OFF',
      features: [
        'Basic crop health monitoring',
        'Weather forecasts',
        'Community access',
        'Email support',
        '5 crop scans per month'
      ],
      popular: false,
      color: '#2196F3'
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      monthlyPrice: 'NPR 4,500',
      yearlyPrice: 'NPR 45,000',
      yearlyDiscount: '17% OFF',
      features: [
        'Everything in Premium',
        'Multi-farm management',
        'Advanced analytics',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'Team collaboration',
        'Export capabilities'
      ],
      popular: false,
      color: '#9C27B0'
    }
  ];

  // Payment methods - only Cash on Delivery
  const paymentMethods = [
    {
      id: 1,
      type: 'cod',
      brand: 'Cash on Delivery',
      description: 'Pay when your order arrives',
      isDefault: true
    }
  ];

  // Pending transactions
const [pendingTransactions, setPendingTransactions] = useState([
  {
    id: 1,
    type: 'crop-sale',
    description: 'Sold 100kg of Tomatoes to Local Market',
    amount: 'NPR 4,000',
    date: '2025-07-28',
    status: 'pending',
    method: 'Cash on Delivery'
  },
  {
    id: 2,
    type: 'machine-rent',
    description: 'Rented Tractor for Ploughing - 2 days',
    amount: 'NPR 2,000',
    date: '2025-07-27',
    status: 'pending',
    method: 'Cash on Delivery'
  }
]);



  // Transaction history
const transactionHistory = [
  {
    id: 1,
    type: 'crop-purchase',
    description: 'Purchased 50kg of Rice Seeds',
    amount: 'NPR 3,000',
    date: '2025-07-20',
    status: 'paid',
    method: 'Cash on Delivery'
  },
  {
    id: 2,
    type: 'machine-rent',
    description: 'Rented Harvester - 1 day',
    amount: 'NPR 1,500',
    date: '2025-07-18',
    status: 'paid',
    method: 'Cash on Delivery'
  },
  {
    id: 3,
    type: 'crop-sale',
    description: 'Sold 200kg of Wheat to Agri Co-op',
    amount: 'NPR 8,000',
    date: '2025-07-10',
    status: 'paid',
    method: 'Cash on Delivery'
  }
];


  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
    setShowPlanModal(false);
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    setShowPaymentModal(false);
    Alert.alert(
      'Payment Successful',
      `Your ${selectedPlan?.name} subscription has been activated successfully!`,
      [{ text: 'OK' }]
    );
  };

  const handleAddCard = () => {
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      Alert.alert('Error', 'Please fill all card details');
      return;
    }
    setShowAddCardModal(false);
    Alert.alert('Success', 'Payment method added successfully!');
    // Reset form
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardholderName('');
  };

  const formatCardNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    
    return cleaned;
  };

  const PlanCard = ({ plan }) => (
    <TouchableOpacity
      style={[
        styles.planCard,
        plan.popular && styles.popularPlanCard,
        { borderColor: plan.color }
      ]}
      onPress={() => handlePlanSelection(plan)}
    >
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
        </View>
      )}
      
      <View style={styles.planHeader}>
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={styles.planPricing}>
          <Text style={styles.planPrice}>
            {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
          </Text>
          <Text style={styles.planCycle}>
            /{billingCycle === 'monthly' ? 'month' : 'year'}
          </Text>
          {billingCycle === 'yearly' && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{plan.yearlyDiscount}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.planFeatures}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={16} color={plan.color} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={[styles.selectPlanButton, { backgroundColor: plan.color }]}
        onPress={() => handlePlanSelection(plan)}
      >

      </TouchableOpacity>
    </TouchableOpacity>
  );

  const PaymentMethodCard = ({ method }) => (
    <View style={styles.paymentMethodCard}>
      <View style={styles.paymentMethodLeft}>
        <View style={styles.cardIcon}>
          <Ionicons 
            name="cash" 
            size={24} 
            color="#4CAF50" 
          />
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.cardBrand}>{method.brand}</Text>
          <Text style={styles.cardNumber}>{method.description}</Text>
        </View>
      </View>
      <View style={styles.paymentMethodRight}>
        {method.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Default</Text>
          </View>
        )}
        <TouchableOpacity style={styles.cardActionButton}>
          <Ionicons name="ellipsis-vertical" size={16} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const TransactionItem = ({ transaction }) => {
    const getTransactionIcon = (type) => {
  switch (type) {
    case 'crop-sale':
      return 'leaf'; // or 'trending-up'
    case 'crop-purchase':
      return 'cart';
    case 'machine-rent':
      return 'cog'; // or 'construct'
    case 'refund':
      return 'arrow-back-circle';
    default:
      return 'card';
  }
};


    const getTransactionColor = (status) => {
      switch (status) {
        case 'paid':
          return '#4CAF50';
        case 'refunded':
          return '#2196F3';
        case 'pending':
          return '#FF9800';
        case 'failed':
          return '#F44336';
        default:
          return '#666';
      }
    };

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <View style={[
            styles.transactionIcon,
            { backgroundColor: getTransactionColor(transaction.status) + '20' }
          ]}>
            <Ionicons 
              name={getTransactionIcon(transaction.type)} 
              size={20} 
              color={getTransactionColor(transaction.status)} 
            />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionDescription}>
              {transaction.description}
            </Text>
            <Text style={styles.transactionMethod}>{transaction.method}</Text>
            <Text style={styles.transactionDate}>{transaction.date}</Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={[
            styles.transactionAmount,
            { 
              color: transaction.amount.includes('+') 
                ? '#4CAF50' 
                : '#333' 
            }
          ]}>
            {transaction.amount}
          </Text>
          <View style={[
            styles.transactionStatus,
            { backgroundColor: getTransactionColor(transaction.status) + '20' }
          ]}>
            <Text style={[
              styles.transactionStatusText,
              { color: getTransactionColor(transaction.status) }
            ]}>
              {transaction.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Billing & Payment</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="receipt" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Payment Methods */}
        <View style={styles.paymentMethodsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddCardModal(true)}
            >
              <Ionicons name="add" size={20} color="#4CAF50" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          
          {paymentMethods.map((method) => (
            <PaymentMethodCard key={method.id} method={method} />
          ))}
        </View>

        {/* Pending Transactions */}
        <View style={styles.pendingTransactionSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Transactions</Text>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>{pendingTransactions.length} Pending</Text>
            </View>
          </View>
          
          {pendingTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </View>

        {/* Transaction History */}
        <View style={styles.transactionSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transaction History</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {transactionHistory.slice(0, 5).map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Plan Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPlanModal}
        onRequestClose={() => setShowPlanModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.planModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Your Plan</Text>
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setShowPlanModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Billing Cycle Toggle */}
            <View style={styles.billingToggleContainer}>
              <TouchableOpacity
                style={[
                  styles.billingToggleButton,
                  billingCycle === 'monthly' && styles.activeBillingToggle
                ]}
                onPress={() => setBillingCycle('monthly')}
              >
                <Text style={[
                  styles.billingToggleText,
                  billingCycle === 'monthly' && styles.activeBillingToggleText
                ]}>
                  Monthly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.billingToggleButton,
                  billingCycle === 'yearly' && styles.activeBillingToggle
                ]}
                onPress={() => setBillingCycle('yearly')}
              >
                <Text style={[
                  styles.billingToggleText,
                  billingCycle === 'yearly' && styles.activeBillingToggleText
                ]}>
                  Yearly
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {subscriptionPlans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Payment Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPaymentModal}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.paymentModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Payment</Text>
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setShowPaymentModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedPlan && (
              <View style={styles.paymentSummary}>
                <Text style={styles.paymentSummaryTitle}>Payment Summary</Text>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Plan:</Text>
                  <Text style={styles.summaryValue}>{selectedPlan.name}</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Billing Cycle:</Text>
                  <Text style={styles.summaryValue}>
                    {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount:</Text>
                  <Text style={styles.summaryValue}>
                    {billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice}
                  </Text>
                </View>
                
                {billingCycle === 'yearly' && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Discount:</Text>
                    <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                      {selectedPlan.yearlyDiscount}
                    </Text>
                  </View>
                )}

                <View style={styles.summaryDivider} />
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotalLabel}>Total:</Text>
                  <Text style={styles.summaryTotalValue}>
                    {billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.confirmPaymentButton}
                  onPress={handlePayment}
                >
                  <Ionicons name="lock-closed" size={20} color="white" />
                  <Text style={styles.confirmPaymentText}>Confirm Payment</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Card Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddCardModal}
        onRequestClose={() => setShowAddCardModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.addCardModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Payment Method</Text>
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setShowAddCardModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.addCardForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter cardholder name"
                  value={cardholderName}
                  onChangeText={setCardholderName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Card Number</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroupHalf}>
                  <Text style={styles.formLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>

                <View style={styles.formGroupHalf}>
                  <Text style={styles.formLabel}>CVV</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="123"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry={true}
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={styles.addCardButton}
                onPress={handleAddCard}
              >
                <Text style={styles.addCardButtonText}>Add Payment Method</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BillingPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 22,
  },
  header: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  headerButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  // Sections
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
  },
  viewAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  paymentMethodsSection: {
    marginBottom: 24,
  },
  pendingTransactionSection: {
    marginBottom: 24,
  },
  transactionSection: {
    marginBottom: 24,
  },
  // Pending Badge
  pendingBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadgeText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
  },
  // Payment Method Card
  paymentMethodCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  cardExpiry: {
    fontSize: 12,
    color: '#999',
  },
  paymentMethodRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  defaultBadgeText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
  cardActionButton: {
    padding: 4,
  },
  // Transaction Item
  transactionItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  transactionMethod: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 10,
    color: '#999',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  transactionStatus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  transactionStatusText: {
    fontSize: 8,
    fontWeight: '600',
  },
  // Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  planModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  paymentModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  addCardModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalClose: {
    padding: 4,
  },
  // Billing Toggle
  billingToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  billingToggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeBillingToggle: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  billingToggleText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeBillingToggleText: {
    color: '#333',
    fontWeight: '600',
  },
  // Plan Card
  planCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  popularPlanCard: {
    borderWidth: 2,
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  popularBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planHeader: {
    marginBottom: 20,
    marginTop: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  planCycle: {
    fontSize: 16,
    color: '#666',
    marginLeft: 2,
  },
  discountBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planFeatures: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  selectPlanButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectPlanText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Payment Summary
  paymentSummary: {
    padding: 20,
  },
  paymentSummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  confirmPaymentButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  confirmPaymentText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Add Card Form
  addCardForm: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formGroupHalf: {
    flex: 1,
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  addCardButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  addCardButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});