import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Image, Modal, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeProvider';
import Header from '../components/Header';
import Button from '../components/Button';

const EditProfile = ({ navigation }) => {
  const { dark, colors } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    dayOfBirth: '',
    monthOfBirth: '',
    yearOfBirth: '',
    gender: ''
  });
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const months = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' }
  ];

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ];

  // Load current user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('currentUser');
        if (userData) {
          const user = JSON.parse(userData);
          setCurrentUser(user);
          setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            mobileNumber: user.mobileNumber || '',
            email: user.email || '',
            dayOfBirth: user.dayOfBirth || '',
            monthOfBirth: user.monthOfBirth || '',
            yearOfBirth: user.yearOfBirth || '',
            gender: user.gender || ''
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    try {
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Update user data
      const updatedUser = {
        ...currentUser,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        dayOfBirth: formData.dayOfBirth,
        monthOfBirth: formData.monthOfBirth,
        yearOfBirth: formData.yearOfBirth,
        gender: formData.gender
      };

      // Update AsyncStorage
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update users array
      const users = await AsyncStorage.getItem('users');
      if (users) {
        const usersArray = JSON.parse(users);
        const updatedUsers = usersArray.map(user => 
          user.email === currentUser.email ? updatedUser : user
        );
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      }

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Render Form Field
   */
  const renderFormField = (label, value, field, placeholder, keyboardType = 'default') => {
    return (
      <View style={styles.formField}>
        <Text style={[styles.fieldLabel, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
          {label}
        </Text>
        <TextInput
          style={[
            styles.textInput,
            { 
              backgroundColor: dark ? COLORS.dark1 : COLORS.white,
              color: dark ? COLORS.white : COLORS.greyscale900,
              borderColor: dark ? COLORS.greyScale800 : COLORS.grayscale200
            }
          ]}
          value={value}
          onChangeText={(text) => updateFormData(field, text)}
          placeholder={placeholder}
          placeholderTextColor={dark ? COLORS.grayscale400 : COLORS.grayscale500}
          keyboardType={keyboardType}
        />
      </View>
    );
  };

  /**
   * Render Date of Birth Fields
   */
  const renderDateOfBirth = () => {
    const getMonthLabel = (value) => {
      const month = months.find(m => m.value === value);
      return month ? month.label : 'Month';
    };

    return (
      <View style={styles.formField}>
        <Text style={[styles.fieldLabel, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
          Date of birth
        </Text>
        <View style={styles.dateContainer}>
          <TextInput
            style={[
              styles.dateInput,
              { 
                backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                color: dark ? COLORS.white : COLORS.greyscale900,
                borderColor: dark ? COLORS.greyScale800 : COLORS.grayscale200
              }
            ]}
            value={formData.dayOfBirth}
            onChangeText={(text) => updateFormData('dayOfBirth', text)}
            placeholder="Day"
            placeholderTextColor={dark ? COLORS.grayscale400 : COLORS.grayscale500}
            keyboardType="numeric"
            maxLength={2}
          />
          <TouchableOpacity
            style={[
              styles.dateInput,
              styles.monthSelector,
              { 
                backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                borderColor: dark ? COLORS.greyScale800 : COLORS.grayscale200
              }
            ]}
            onPress={() => setMonthModalVisible(true)}
          >
            <Text style={[
              styles.monthText,
              { color: formData.monthOfBirth ? (dark ? COLORS.white : COLORS.greyscale900) : (dark ? COLORS.grayscale400 : COLORS.grayscale500) }
            ]}>
              {getMonthLabel(formData.monthOfBirth)}
            </Text>
            <Image 
              source={icons.arrowDown} 
              style={[
                styles.dropdownIcon,
                { tintColor: dark ? COLORS.grayscale400 : COLORS.grayscale500 }
              ]}
            />
          </TouchableOpacity>
          <TextInput
            style={[
              styles.dateInput,
              { 
                backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                color: dark ? COLORS.white : COLORS.greyscale900,
                borderColor: dark ? COLORS.greyScale800 : COLORS.grayscale200
              }
            ]}
            value={formData.yearOfBirth}
            onChangeText={(text) => updateFormData('yearOfBirth', text)}
            placeholder="Year"
            placeholderTextColor={dark ? COLORS.grayscale400 : COLORS.grayscale500}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>
      </View>
    );
  };

  /**
   * Render Gender Field
   */
  const renderGenderField = () => {
    const getGenderLabel = (value) => {
      const gender = genderOptions.find(g => g.value === value);
      return gender ? gender.label : 'Select Option';
    };

    return (
      <View style={styles.formField}>
        <Text style={[styles.fieldLabel, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
          Gender
        </Text>
        <TouchableOpacity 
          style={[
            styles.genderSelector,
            { 
              backgroundColor: dark ? COLORS.dark1 : COLORS.white,
              borderColor: dark ? COLORS.greyScale800 : COLORS.grayscale200
            }
          ]}
          onPress={() => setGenderModalVisible(true)}
        >
          <Text style={[
            styles.genderPlaceholder,
            { color: formData.gender ? (dark ? COLORS.white : COLORS.greyscale900) : (dark ? COLORS.grayscale400 : COLORS.grayscale500) }
          ]}>
            {getGenderLabel(formData.gender)}
          </Text>
          <Image 
            source={icons.arrowDown} 
            style={[
              styles.dropdownIcon,
              { tintColor: dark ? COLORS.grayscale400 : COLORS.grayscale500 }
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header 
          title="Edit profile details"
          showBackButton={false}
          rightComponent={
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
                ✕
              </Text>
            </TouchableOpacity>
          }
        />
        
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {renderFormField('First name', formData.firstName, 'firstName', 'First name')}
          {renderFormField('Last name', formData.lastName, 'lastName', 'Last name')}
          {renderFormField('Mobile number', formData.mobileNumber, 'mobileNumber', 'Mobile number', 'phone-pad')}
          {renderFormField('Email address', formData.email, 'email', 'Email address', 'email-address')}
          {renderDateOfBirth()}
          {renderGenderField()}
          
          <View style={styles.buttonContainer}>
            <Button
              title="Save"
              filled
              style={styles.saveButton}
              onPress={handleSave}
            />
          </View>
        </ScrollView>

        {/* Month Selection Modal */}
        <Modal
          visible={monthModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setMonthModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: dark ? COLORS.white : COLORS.black }]}>
                  Select Month
                </Text>
                <TouchableOpacity onPress={() => setMonthModalVisible(false)}>
                  <Text style={[styles.closeButton, { color: dark ? COLORS.white : COLORS.black }]}>✕</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={months}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      updateFormData('monthOfBirth', item.value);
                      setMonthModalVisible(false);
                    }}
                  >
                    <Text style={[styles.modalItemText, { color: dark ? COLORS.white : COLORS.black }]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Gender Selection Modal */}
        <Modal
          visible={genderModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setGenderModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: dark ? COLORS.white : COLORS.black }]}>
                  Select Gender
                </Text>
                <TouchableOpacity onPress={() => setGenderModalVisible(false)}>
                  <Text style={[styles.closeButton, { color: dark ? COLORS.white : COLORS.black }]}>✕</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={genderOptions}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      updateFormData('gender', item.value);
                      setGenderModalVisible(false);
                    }}
                  >
                    <Text style={[styles.modalItemText, { color: dark ? COLORS.white : COLORS.black }]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  scrollView: {
    flex: 1,
    padding: 16
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButtonText: {
    fontSize: 20,
    fontFamily: 'medium'
  },
  formField: {
    marginBottom: 20
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.greyscale900,
    marginBottom: 8
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'regular'
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12
  },
  dateInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'regular',
    textAlign: 'center'
  },
  genderSelector: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  genderPlaceholder: {
    fontSize: 16,
    fontFamily: 'regular'
  },
  dropdownIcon: {
    width: 16,
    height: 16
  },
  buttonContainer: {
    marginTop: 32,
    marginBottom: 20
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 32
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  monthText: {
    fontSize: 16,
    fontFamily: 'regular'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '80%',
    maxHeight: '70%',
    borderRadius: 16,
    padding: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'semiBold'
  },
  closeButton: {
    fontSize: 20,
    fontFamily: 'medium'
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale100
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: 'medium'
  }
});

export default EditProfile;
