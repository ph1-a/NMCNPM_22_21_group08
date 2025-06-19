// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { COLORS } from '../utils/Constants'; // Nếu bạn có file COLORS

// const CardPaymentView = ({ navigation, route }) => {
//   const { total, onPaymentSuccess } = route.params;

//   const [cardNumber, setCardNumber] = useState('');
//   const [expiry, setExpiry] = useState('');
//   const [cvv, setCvv] = useState('');
//   const [name, setName] = useState('');

//   const handleSubmit = () => {
//     if (!cardNumber || !expiry || !cvv || !name) {
//       Alert.alert('Missing Information', 'Please fill out all fields.');
//       return;
//     }

//     // Giả lập thành công
//     Alert.alert('Payment Successful', `Paid $${total.toFixed(2)}`, [
//       {
//         text: 'OK',
//         onPress: () => {
//           onPaymentSuccess();
//         },
//       },
//     ]);
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.select({ ios: 'padding', android: undefined })}
//     >
//       <View style={styles.card}>
//         <Text style={styles.title}>Card Payment</Text>

//         <Text style={styles.label}>Cardholder Name</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Your Name"
//           value={name}
//           onChangeText={setName}
//         />

//         <Text style={styles.label}>Card Number</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="1234 5678 9012 3456"
//           value={cardNumber}
//           onChangeText={setCardNumber}
//           keyboardType="numeric"
//           maxLength={19}
//         />

//         <View style={styles.row}>
//           <View style={styles.halfInput}>
//             <Text style={styles.label}>Expiry</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="MM/YY"
//               value={expiry}
//               onChangeText={setExpiry}
//               keyboardType="numeric"
//             />
//           </View>

//           <View style={styles.halfInput}>
//             <Text style={styles.label}>CVV</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="123"
//               value={cvv}
//               onChangeText={setCvv}
//               keyboardType="numeric"
//               secureTextEntry
//               maxLength={4}
//             />
//           </View>
//         </View>

//         <TouchableOpacity style={styles.payButton} onPress={handleSubmit}>
//           <Icon name="card-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
//           <Text style={styles.payText}>Pay ${total.toFixed(2)}</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS?.lightGrey || '#f2f2f2',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   card: {
//     width: '100%',
//     maxWidth: 380,
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 16,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: COLORS?.primary || '#6C63FF',
//   },
//   label: {
//     fontSize: 14,
//     marginBottom: 4,
//     color: '#555',
//   },
//   input: {
//     backgroundColor: '#f7f7f7',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   halfInput: {
//     width: '48%',
//   },
//   payButton: {
//     flexDirection: 'row',
//     backgroundColor: COLORS?.primary || '#6C63FF',
//     borderRadius: 8,
//     padding: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   payText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default CardPaymentView;

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../utils/Constants'; // Nếu bạn có file COLORS

const CardPaymentView = ({ navigation, route }) => {
  const { total, onPaymentSuccess } = route.params;

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  // Format card number with spaces
  const formatCardNumber = (text) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D+/g, '');
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted;
  };

  // Format expiry date
  const formatExpiry = (text) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D+/g, '');
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (text) => {
    const formatted = formatCardNumber(text);
    if (formatted.length <= 19) { // 16 digits + 3 spaces
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (text) => {
    const formatted = formatExpiry(text);
    if (formatted.length <= 5) { // MM/YY format
      setExpiry(formatted);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter cardholder name.');
      return false;
    }
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Invalid Card', 'Please enter a valid card number.');
      return false;
    }
    if (!expiry.trim() || expiry.length < 5) {
      Alert.alert('Invalid Expiry', 'Please enter a valid expiry date (MM/YY).');
      return false;
    }
    if (!cvv.trim() || cvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a valid CVV.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Show payment successful alert
    Alert.alert(
      'Give information successully', 
      `Back to Checkout.`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Call the success callback to go back to checkout
            onPaymentSuccess();
          },
        },
      ]
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS?.textPrimary || '#333'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Card Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Enter Card Details</Text>
        <Text style={styles.subtitle}>Total: ${total.toFixed(2)}</Text>

        <Text style={styles.label}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          keyboardType="numeric"
        />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              value={expiry}
              onChangeText={handleExpiryChange}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.halfInput}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handleSubmit}>
          <Icon name="card-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.payText}>Pay ${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS?.lightGrey || '#f2f2f2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    backgroundColor: COLORS?.lightGrey || '#f0f0f0',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS?.textPrimary || '#333',
  },
  placeholder: {
    width: 40,
  },
  card: {
    flex: 1,
    margin: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS?.primary || '#6C63FF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS?.textSecondary || '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  payButton: {
    flexDirection: 'row',
    backgroundColor: COLORS?.primary || '#6C63FF',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  payText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CardPaymentView;