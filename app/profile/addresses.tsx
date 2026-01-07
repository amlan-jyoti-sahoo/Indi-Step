import { View, Text, StyleSheet, FlatList, Pressable, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONTS, SHADOWS } from '../../constants/theme';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { addAddress, removeAddress } from '../../store/authSlice';
import { ChevronLeft, Plus, Trash2, MapPin } from 'lucide-react-native';
import { useState } from 'react';

export default function AddressBook() {
  const router = useRouter();
  const dispatch = useDispatch();
  const addresses = useSelector((state: RootState) => state.auth.user?.addresses || []);
  
  const [modalVisible, setModalVisible] = useState(false);
  
  // New Address Form State
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddAddress = () => {
     if (!name || !street || !city || !zip || !phone) {
         Alert.alert('Missing Fields', 'Please fill all details');
         return;
     }

     const newAddress = {
         id: 'addr-' + Date.now(),
         name,
         street,
         city,
         zip,
         phone,
         isDefault: addresses.length === 0 // Make default if first address
     };

     dispatch(addAddress(newAddress));
     setModalVisible(false);
     
     // Reset form
     setName('');
     setStreet('');
     setCity('');
     setZip('');
     setPhone('');
  };

  const renderItem = ({ item }: { item: any }) => (
      <View style={styles.card}>
          <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                  <MapPin size={20} color={COLORS.primary} />
              </View>
              <View style={{flex: 1}}>
                  <Text style={styles.name}>{item.name} {item.isDefault && <Text style={styles.defaultBadge}>(Default)</Text>}</Text>
                  <Text style={styles.details}>{item.street}</Text>
                  <Text style={styles.details}>{item.city}, {item.zip}</Text>
                  <Text style={styles.details}>{item.phone}</Text>
              </View>
              <Pressable onPress={() => dispatch(removeAddress(item.id))} style={styles.deleteBtn}>
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
        <Text style={styles.headerTitle}>Address Book</Text>
        <Pressable onPress={() => setModalVisible(true)}>
            <Plus size={24} color={COLORS.primary} />
        </Pressable>
      </View>

      {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
              <MapPin size={60} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No addresses saved.</Text>
              <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
                  <Text style={styles.addButtonText}>Add New Address</Text>
              </Pressable>
          </View>
      ) : (
          <FlatList 
            data={addresses}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
      )}

      {/* Add Address Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Add New Address</Text>
                  
                  <ScrollView style={styles.formScript}>
                      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
                      <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                      <TextInput style={styles.input} placeholder="Street Address" value={street} onChangeText={setStreet} />
                      <View style={styles.row}>
                          <TextInput style={[styles.input, {flex: 1}]} placeholder="City" value={city} onChangeText={setCity} />
                          <TextInput style={[styles.input, {flex: 1}]} placeholder="ZIP Code" value={zip} onChangeText={setZip} keyboardType="numeric" />
                      </View>
                  </ScrollView>

                  <View style={styles.modalButtons}>
                      <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                          <Text style={styles.cancelText}>Cancel</Text>
                      </Pressable>
                      <Pressable style={styles.saveButton} onPress={handleAddAddress}>
                          <Text style={styles.saveText}>Save Address</Text>
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
  },
  iconContainer: {
      marginTop: 2,
  },
  name: {
      fontFamily: FONTS.bold,
      fontSize: 16,
      color: COLORS.text,
      marginBottom: 4,
  },
  defaultBadge: {
      color: COLORS.primary,
      fontSize: 12,
  },
  details: {
      fontFamily: FONTS.regular,
      color: COLORS.textLight,
      fontSize: 14,
      marginBottom: 2,
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
      justifyContent: 'flex-end',
  },
  modalContent: {
      backgroundColor: COLORS.background,
      borderTopLeftRadius: SPACING.l,
      borderTopRightRadius: SPACING.l,
      padding: SPACING.l,
      height: '80%',
  },
  modalTitle: {
      fontFamily: FONTS.bold,
      fontSize: 20,
      marginBottom: SPACING.l,
      textAlign: 'center',
  },
  formScript: {
      flex: 1,
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
      marginBottom: SPACING.xl, // Safe area
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
