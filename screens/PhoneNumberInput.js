import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { COLORS, SIZES, icons } from '../constants';
import Input from '../components/Input';
import Button from '../components/Button';
import CountryCodePicker from '../components/CountryCodePicker';
import { useTheme } from '../theme/ThemeProvider';

const PhoneNumberInput = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ 
    code: 'US', 
    name: 'United States', 
    dialCode: '+1', 
    flag: '🇺🇸' 
  });
  const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);
  const { colors, dark } = useTheme();

  const validatePhoneNumber = (phone) => {
    // Remove all non-digits for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Different validation based on country
    let minLength = 10; // Default for US
    let maxLength = 15; // International standard
    
    // Adjust validation for specific countries
    switch (selectedCountry.code) {
      case 'GB':
        minLength = 10;
        maxLength = 11;
        break;
      case 'IN':
        minLength = 10;
        maxLength = 10;
        break;
      case 'CN':
        minLength = 11;
        maxLength = 11;
        break;
      case 'DE':
      case 'FR':
        minLength = 10;
        maxLength = 12;
        break;
      default:
        minLength = 10;
        maxLength = 15;
    }
    
    const isValid = digitsOnly.length >= minLength && digitsOnly.length <= maxLength;
    setIsValidPhone(isValid);
    return isValid;
  };

  const handlePhoneChange = (text) => {
    setPhoneNumber(text);
    validatePhoneNumber(text);
  };

  const handleSendCode = () => {
    if (!isValidPhone) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }

    if (phoneNumber.trim().length === 0) {
      Alert.alert('Phone Number Required', 'Please enter your phone number');
      return;
    }

    // Combine country code with phone number
    const fullPhoneNumber = `${selectedCountry.dialCode} ${phoneNumber.trim()}`;
    
    // Navigate to verification screen with the full phone number
    navigation.navigate('PhoneVerification', { 
      phoneNumber: fullPhoneNumber,
      countryCode: selectedCountry.dialCode,
      countryName: selectedCountry.name 
    });
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    // Re-validate phone number with new country
    if (phoneNumber) {
      validatePhoneNumber(phoneNumber);
    }
  };

  const formatPhoneNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Format based on country
    switch (selectedCountry.code) {
      case 'US':
      case 'CA':
        // Format as (XXX) XXX-XXXX for North American numbers
        if (cleaned.length <= 3) {
          return cleaned;
        } else if (cleaned.length <= 6) {
          return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        } else {
          return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
        }
      case 'GB':
        // Format as XXXXX XXXXXX for UK numbers
        if (cleaned.length <= 5) {
          return cleaned;
        } else {
          return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 11)}`;
        }
      case 'IN':
        // Format as XXXXX XXXXX for Indian numbers
        if (cleaned.length <= 5) {
          return cleaned;
        } else {
          return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`;
        }
      default:
        // Default formatting with spaces every 3-4 digits
        if (cleaned.length <= 4) {
          return cleaned;
        } else if (cleaned.length <= 8) {
          return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
        } else {
          return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
        }
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Phone Number" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Text style={[styles.title, {
              color: dark ? COLORS.white : COLORS.black
            }]}>Enter Your Phone Number</Text>
            
            <Text style={[styles.subtitle, {
              color: dark ? COLORS.gray : COLORS.gray2
            }]}>
              We'll send you a verification code to verify your phone number
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, {
                color: dark ? COLORS.white : COLORS.black
              }]}>
                Phone Number
              </Text>
              
              <View style={styles.phoneInputContainer}>
                <TouchableOpacity 
                  style={[styles.countrySelector, {
                    borderColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                    backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                  }]}
                  onPress={() => setIsCountryPickerVisible(true)}
                >
                  <Text style={styles.flagText}>{selectedCountry.flag}</Text>
                  <Text style={[styles.dialCodeText, {
                    color: dark ? COLORS.white : COLORS.black
                  }]}>
                    {selectedCountry.dialCode}
                  </Text>
                  <Image 
                    source={icons.arrowDown} 
                    style={[styles.dropdownIcon, {
                      tintColor: dark ? COLORS.gray : COLORS.gray2
                    }]} 
                  />
                </TouchableOpacity>
                
                <View style={styles.phoneInputWrapper}>
                  <Input
                    id="phoneNumber"
                    onInputChanged={(id, value) => handlePhoneChange(formatPhoneNumber(value))}
                    placeholder="Enter phone number"
                    placeholderTextColor={dark ? COLORS.grayTie : COLORS.gray2}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={(value) => handlePhoneChange(formatPhoneNumber(value))}
                    maxLength={20}
                  />
                </View>
              </View>
              
              {phoneNumber.length > 0 && !isValidPhone && (
                <Text style={styles.errorText}>
                  Please enter a valid phone number for {selectedCountry.name}
                </Text>
              )}
            </View>

            <View style={styles.infoContainer}>
              <Text style={[styles.infoText, {
                color: dark ? COLORS.gray : COLORS.gray2
              }]}>
                💡 This helps us verify your identity and keep your account secure
              </Text>
            </View>
          </View>
        </ScrollView>
        
        <Button
          title="Send Verification Code"
          filled
          style={[styles.button, {
            opacity: isValidPhone ? 1 : 0.6
          }]}
          onPress={handleSendCode}
          disabled={!isValidPhone}
        />

        <CountryCodePicker
          visible={isCountryPickerVisible}
          onClose={() => setIsCountryPickerVisible(false)}
          onSelect={handleCountrySelect}
          selectedCountry={selectedCountry}
        />
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
    padding: 16,
    backgroundColor: COLORS.white
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: "bold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 16
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.gray2,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 22
  },
  inputContainer: {
    width: '100%',
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.black,
    marginBottom: 12,
    textAlign: "left"
  },
  errorText: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.error,
    marginTop: 8,
    textAlign: "left"
  },
  infoContainer: {
    backgroundColor: COLORS.transparentTertiary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed'
  },
  infoText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.gray2,
    textAlign: "center"
  },
  button: {
    borderRadius: 32,
    marginBottom: 20
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.greyscale500,
    backgroundColor: COLORS.greyscale500,
    minWidth: 120,
  },
  flagText: {
    fontSize: 20,
    marginRight: 8,
  },
  dialCodeText: {
    fontSize: 14,
    fontFamily: 'medium',
    color: COLORS.black,
    flex: 1,
  },
  dropdownIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.gray2,
    marginLeft: 4,
  },
  phoneInputWrapper: {
    flex: 1,
  }
});

export default PhoneNumberInput;
