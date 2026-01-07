import { View, Text, StyleSheet, FlatList, Pressable, Modal, TextInput, Alert, Image as RNImage } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS, SHADOWS } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { addCard, removeCard } from '../../store/authSlice';
import { ChevronLeft, Plus, Trash2, CreditCard } from 'lucide-react-native';
import { useState } from 'react';

export default function PaymentMethods() {
  const router = useRouter();
  const dispatch = useDispatch();
  const savedCards = useSelector((state: RootState) => state.auth.user?.savedCards || []);
  
  const [modalVisible, setModalVisible] = useState(false);
  
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [holder, setHolder] = useState('');

  const handleAddCard = () => {
     if (number.length < 16 || !expiry || !holder) {
         Alert.alert('Invalid Details', 'Please enter valid card details');
         return;
     }

     const newCard = {
         id: 'card-' + Date.now(),
         number: number.slice(-4), // Store only last 4
         expiry,
         holderName: holder
     };

     dispatch(addCard(newCard));
     setModalVisible(false);
     
     setNumber('');
     setExpiry('');
     setHolder('');
  };

  const renderItem = ({ item }: { item: any }) => (
      <View style={styles.card}>
          <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                  <CreditCard size={20} color={COLORS.primary} />
              </View>
              <View style={{flex: 1}}>
                  <Text style={styles.number}>•••• •••• •••• {item.number}</Text>
                  <Text style={styles.details}>Exp: {item.expiry}</Text>
                  <Text style={styles.details}>{item.holderName}</Text>
              </View>
              <Pressable onPress={() => dispatch(removeCard(item.id))} style={styles.deleteBtn}>
                  <Trash2 size={20} color={COLORS.error} />
              </Pressable>
          </View>
      </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ChevronLeft size={24} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <Pressable onPress={() => setModalVisible(true)}>
            <Plus size={24} color={COLORS.primary} />
        </Pressable>
      </View>

      {savedCards.length === 0 ? (
          <View style={styles.emptyContainer}>
              <CreditCard size={60} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No cards saved.</Text>
              <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
                  <Text style={styles.addButtonText}>Add New Card</Text>
              </Pressable>
          </View>
      ) : (
          <FlatList 
            data={savedCards}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
      )}

      {/* Add Card Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Add New Card</Text>
                  
                  <View style={styles.formScript}>
                      <TextInput 
                          style={styles.input} 
                          placeholder="Card Number" 
                          value={number} 
                          onChangeText={setNumber} 
                          keyboardType="numeric" 
                          maxLength={16}
                      />
                      <View style={styles.row}>
                          <TextInput 
                              style={[styles.input, {flex: 1}]} 
                              placeholder="Expiry (MM/YY)" 
                              value={expiry} 
                              onChangeText={setExpiry} 
                              maxLength={5}
                          />
                          <TextInput 
                              style={[styles.input, {flex: 1}]} 
                              placeholder="CVV" 
                              keyboardType="numeric" 
                              maxLength={3}
                              secureTextEntry
                          />
                      </View>
                      <TextInput 
                          style={styles.input} 
                          placeholder="Cardholder Name" 
                          value={holder} 
                          onChangeText={setHolder} 
                      />
                  </View>

                  <View style={styles.modalButtons}>
                      <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                          <Text style={styles.cancelText}>Cancel</Text>
                      </Pressable>
                      <Pressable style={styles.saveButton} onPress={handleAddCard}>
                          <Text style={styles.saveText}>Save Card</Text>
                      </Pressable>
                  </View>
              </View>
          </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
      fontFamily: FONTS.bold,
      fontSize: 18,
      color: COLORS.text,
  },
  list: {
      padding: SPACING.m,
  },
  card: {
      backgroundColor: COLORS.surface,
      borderRadius: SPACING.m,
      padding: SPACING.m,
      marginBottom: SPACING.m,
      ...SHADOWS.light,
  },
  cardHeader: {
      flexDirection: 'row',
      gap: SPACING.m,
      alignItems: 'center',
  },
  iconContainer: {
      padding: 4,
  },
  number: {
      fontFamily: FONTS.bold,
      fontSize: 16,
      color: COLORS.text,
      marginBottom: 4,
      letterSpacing: 1,
  },
  details: {
      fontFamily: FONTS.regular,
      color: COLORS.textLight,
      fontSize: 12,
  },
  deleteBtn: {
      padding: 4,
  },
  emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  emptyText: {
      marginVertical: SPACING.m,
      fontFamily: FONTS.medium,
      color: COLORS.textLight,
  },
  addButton: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: SPACING.l,
      paddingVertical: SPACING.s,
      borderRadius: 20,
  },
  addButtonText: {
      fontFamily: FONTS.bold,
      color: COLORS.white,
  },
  modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: SPACING.m,
  },
  modalContent: {
      backgroundColor: COLORS.background,
      borderRadius: SPACING.l,
      padding: SPACING.l,
  },
  modalTitle: {
      fontFamily: FONTS.bold,
      fontSize: 20,
      marginBottom: SPACING.l,
      textAlign: 'center',
  },
  formScript: {
      gap: SPACING.s,
  },
  input: {
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: SPACING.s,
      padding: SPACING.m,
      marginBottom: SPACING.m,
      fontFamily: FONTS.medium,
  },
  row: {
      flexDirection: 'row',
      gap: SPACING.m,
  },
  modalButtons: {
      flexDirection: 'row',
      gap: SPACING.m,
      marginTop: SPACING.m,
  },
  cancelButton: {
      flex: 1,
      padding: SPACING.m,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLORS.textLight,
      borderRadius: SPACING.s,
  },
  cancelText: {
      fontFamily: FONTS.bold,
      color: COLORS.textLight,
  },
  saveButton: {
      flex: 1,
      backgroundColor: COLORS.primary,
      padding: SPACING.m,
      alignItems: 'center',
      borderRadius: SPACING.s,
  },
  saveText: {
      fontFamily: FONTS.bold,
      color: COLORS.white,
  },
});
