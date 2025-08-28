import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, TouchableWithoutFeedback, FlatList, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import CheckBox from '@react-native-community/checkbox';
import { useTheme } from '../theme/ThemeProvider';

const CreateAccount = ({ navigation, route }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+86');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { colors, dark } = useTheme();
  const { email } = route.params || { email: 'test@gmail.com' };

    // Fetch country codes from API
  useEffect(() => {
    // Try multiple API endpoints for better reliability
    const fetchCountries = async () => {
      try {
        // Try the newer v3.1 endpoint first
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        
        console.log('API Response:', data.length, 'countries received');
        let areaData = data.map(item => ({
          code: item.cca2,
          name: item.name.common,
          callingCode: item.idd.root + (item.idd.suffixes ? item.idd.suffixes[0] : ''),
          flag: item.flag
        })).filter(item => item.callingCode && item.callingCode !== 'undefined');
        console.log('Processed countries:', areaData.length);
        
        if (areaData.length > 0) {
          setAreas(areaData);
          // Set default to China (+86)
          let defaultData = areaData.filter(a => a.callingCode === "+86");
          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0]);
            setCountryCode(defaultData[0].callingCode);
          }
          return; // Success, exit early
        }
      } catch (error) {
        console.log('Error with v3.1 API:', error);
      }
      
      try {
        // Try the older v2 endpoint as fallback
        const response2 = await fetch("https://restcountries.com/v2/all");
        if (!response2.ok) {
          throw new Error(`HTTP error! status: ${response2.status}`);
        }
        const data2 = await response2.json();
        
        if (!data2 || !Array.isArray(data2)) {
          throw new Error('Invalid data format received from v2');
        }
        
        console.log('v2 API Response:', data2.length, 'countries received');
        let areaData2 = data2.map(item => ({
          code: item.alpha2Code,
          name: item.name,
          callingCode: `+${item.callingCodes[0]}`,
          flag: item.flag
        })).filter(item => item.callingCodes && item.callingCodes[0]);
        console.log('Processed countries from v2:', areaData2.length);
        
        if (areaData2.length > 0) {
          setAreas(areaData2);
          // Set default to China (+86)
          let defaultData = areaData2.filter(a => a.callingCode === "+86");
          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0]);
            setCountryCode(defaultData[0].callingCode);
          }
          return; // Success, exit early
        }
      } catch (error) {
        console.log('Error with v2 API:', error);
      }
      
      // If both APIs fail, use comprehensive fallback data
      console.log('Both APIs failed, using fallback data');
      const fallbackData = [
        { code: 'CN', name: 'China', callingCode: '+86', flag: '🇨🇳' },
        { code: 'US', name: 'United States', callingCode: '+1', flag: '🇺🇸' },
        { code: 'GB', name: 'United Kingdom', callingCode: '+44', flag: '🇬🇧' },
        { code: 'IN', name: 'India', callingCode: '+91', flag: '🇮🇳' },
        { code: 'JP', name: 'Japan', callingCode: '+81', flag: '🇯🇵' },
        { code: 'DE', name: 'Germany', callingCode: '+49', flag: '🇩🇪' },
        { code: 'FR', name: 'France', callingCode: '+33', flag: '🇫🇷' },
        { code: 'IT', name: 'Italy', callingCode: '+39', flag: '🇮🇹' },
        { code: 'ES', name: 'Spain', callingCode: '+34', flag: '🇪🇸' },
        { code: 'CA', name: 'Canada', callingCode: '+1', flag: '🇨🇦' },
        { code: 'AU', name: 'Australia', callingCode: '+61', flag: '🇦🇺' },
        { code: 'BR', name: 'Brazil', callingCode: '+55', flag: '🇧🇷' },
        { code: 'MX', name: 'Mexico', callingCode: '+52', flag: '🇲🇽' },
        { code: 'RU', name: 'Russia', callingCode: '+7', flag: '🇷🇺' },
        { code: 'KR', name: 'South Korea', callingCode: '+82', flag: '🇰🇷' },
        { code: 'SG', name: 'Singapore', callingCode: '+65', flag: '🇸🇬' },
        { code: 'MY', name: 'Malaysia', callingCode: '+60', flag: '🇲🇾' },
        { code: 'TH', name: 'Thailand', callingCode: '+66', flag: '🇹🇭' },
        { code: 'VN', name: 'Vietnam', callingCode: '+84', flag: '🇻🇳' },
        { code: 'PH', name: 'Philippines', callingCode: '+63', flag: '🇵🇭' },
        { code: 'ID', name: 'Indonesia', callingCode: '+62', flag: '🇮🇩' },
        { code: 'NZ', name: 'New Zealand', callingCode: '+64', flag: '🇳🇿' },
        { code: 'SE', name: 'Sweden', callingCode: '+46', flag: '🇸🇪' },
        { code: 'NO', name: 'Norway', callingCode: '+47', flag: '🇳🇴' },
        { code: 'DK', name: 'Denmark', callingCode: '+45', flag: '🇩🇰' },
        { code: 'FI', name: 'Finland', callingCode: '+358', flag: '🇫🇮' },
        { code: 'NL', name: 'Netherlands', callingCode: '+31', flag: '🇳🇱' },
        { code: 'BE', name: 'Belgium', callingCode: '+32', flag: '🇧🇪' },
        { code: 'CH', name: 'Switzerland', callingCode: '+41', flag: '🇨🇭' },
        { code: 'AT', name: 'Austria', callingCode: '+43', flag: '🇦🇹' },
        { code: 'PL', name: 'Poland', callingCode: '+48', flag: '🇵🇱' },
        { code: 'CZ', name: 'Czech Republic', callingCode: '+420', flag: '🇨🇿' },
        { code: 'HU', name: 'Hungary', callingCode: '+36', flag: '🇭🇺' },
        { code: 'RO', name: 'Romania', callingCode: '+40', flag: '🇷🇴' },
        { code: 'BG', name: 'Bulgaria', callingCode: '+359', flag: '🇧🇬' },
        { code: 'HR', name: 'Croatia', callingCode: '+385', flag: '🇭🇷' },
        { code: 'SI', name: 'Slovenia', callingCode: '+386', flag: '🇸🇮' },
        { code: 'SK', name: 'Slovakia', callingCode: '+421', flag: '🇸🇰' },
        { code: 'EE', name: 'Estonia', callingCode: '+372', flag: '🇪🇪' },
        { code: 'LV', name: 'Latvia', callingCode: '+371', flag: '🇱🇻' },
        { code: 'LT', name: 'Lithuania', callingCode: '+370', flag: '🇱🇹' },
        { code: 'IE', name: 'Ireland', callingCode: '+353', flag: '🇮🇪' },
        { code: 'PT', name: 'Portugal', callingCode: '+351', flag: '🇵🇹' },
        { code: 'GR', name: 'Greece', callingCode: '+30', flag: '🇬🇷' },
        { code: 'TR', name: 'Turkey', callingCode: '+90', flag: '🇹🇷' },
        { code: 'IL', name: 'Israel', callingCode: '+972', flag: '🇮🇱' },
        { code: 'SA', name: 'Saudi Arabia', callingCode: '+966', flag: '🇸🇦' },
        { code: 'AE', name: 'United Arab Emirates', callingCode: '+971', flag: '🇦🇪' },
        { code: 'EG', name: 'Egypt', callingCode: '+20', flag: '🇪🇬' },
        { code: 'ZA', name: 'South Africa', callingCode: '+27', flag: '🇿🇦' },
        { code: 'NG', name: 'Nigeria', callingCode: '+234', flag: '🇳🇬' },
        { code: 'KE', name: 'Kenya', callingCode: '+254', flag: '🇰🇪' },
        { code: 'GH', name: 'Ghana', callingCode: '+233', flag: '🇬🇭' },
        { code: 'UG', name: 'Uganda', callingCode: '+256', flag: '🇺🇬' },
        { code: 'TZ', name: 'Tanzania', callingCode: '+255', flag: '🇹🇿' },
        { code: 'ET', name: 'Ethiopia', callingCode: '+251', flag: '🇪🇹' },
        { code: 'DZ', name: 'Algeria', callingCode: '+213', flag: '🇩🇿' },
        { code: 'MA', name: 'Morocco', callingCode: '+212', flag: '🇲🇦' },
        { code: 'TN', name: 'Tunisia', callingCode: '+216', flag: '🇹🇳' },
        { code: 'LY', name: 'Libya', callingCode: '+218', flag: '🇱🇾' },
        { code: 'SD', name: 'Sudan', callingCode: '+249', flag: '🇸🇩' },
        { code: 'CM', name: 'Cameroon', callingCode: '+237', flag: '🇨🇲' },
        { code: 'CI', name: 'Ivory Coast', callingCode: '+225', flag: '🇨🇮' },
        { code: 'SN', name: 'Senegal', callingCode: '+221', flag: '🇸🇳' },
        { code: 'ML', name: 'Mali', callingCode: '+223', flag: '🇲🇱' },
        { code: 'BF', name: 'Burkina Faso', callingCode: '+226', flag: '🇧🇫' },
        { code: 'NE', name: 'Niger', callingCode: '+227', flag: '🇳🇪' },
        { code: 'TD', name: 'Chad', callingCode: '+235', flag: '🇹🇩' },
        { code: 'CF', name: 'Central African Republic', callingCode: '+236', flag: '🇨🇫' },
        { code: 'CG', name: 'Republic of the Congo', callingCode: '+242', flag: '🇨🇬' },
        { code: 'CD', name: 'Democratic Republic of the Congo', callingCode: '+243', flag: '🇨🇩' },
        { code: 'AO', name: 'Angola', callingCode: '+244', flag: '🇦🇴' },
        { code: 'ZM', name: 'Zambia', callingCode: '+260', flag: '🇿🇲' },
        { code: 'ZW', name: 'Zimbabwe', callingCode: '+263', flag: '🇿🇼' },
        { code: 'BW', name: 'Botswana', callingCode: '+267', flag: '🇧🇼' },
        { code: 'NA', name: 'Namibia', callingCode: '+264', flag: '🇳🇦' },
        { code: 'SZ', name: 'Eswatini', callingCode: '+268', flag: '🇸🇿' },
        { code: 'LS', name: 'Lesotho', callingCode: '+266', flag: '🇱🇸' },
        { code: 'MG', name: 'Madagascar', callingCode: '+261', flag: '🇲🇬' },
        { code: 'MU', name: 'Mauritius', callingCode: '+230', flag: '🇲🇺' },
        { code: 'SC', name: 'Seychelles', callingCode: '+248', flag: '🇸🇨' },
        { code: 'KM', name: 'Comoros', callingCode: '+269', flag: '🇰🇲' },
        { code: 'AR', name: 'Argentina', callingCode: '+54', flag: '🇦🇷' },
        { code: 'CL', name: 'Chile', callingCode: '+56', flag: '🇨🇱' },
        { code: 'PE', name: 'Peru', callingCode: '+51', flag: '🇵🇪' },
        { code: 'CO', name: 'Colombia', callingCode: '+57', flag: '🇨🇴' },
        { code: 'VE', name: 'Venezuela', callingCode: '+58', flag: '🇻🇪' },
        { code: 'EC', name: 'Ecuador', callingCode: '+593', flag: '🇪🇨' },
        { code: 'BO', name: 'Bolivia', callingCode: '+591', flag: '🇧🇴' },
        { code: 'PY', name: 'Paraguay', callingCode: '+595', flag: '🇵🇾' },
        { code: 'UY', name: 'Uruguay', callingCode: '+598', flag: '🇺🇾' },
        { code: 'GY', name: 'Guyana', callingCode: '+592', flag: '🇬🇾' },
        { code: 'SR', name: 'Suriname', callingCode: '+597', flag: '🇸🇷' },
        { code: 'FK', name: 'Falkland Islands', callingCode: '+500', flag: '🇫🇰' },
        { code: 'GF', name: 'French Guiana', callingCode: '+594', flag: '🇬🇫' },
        { code: 'HT', name: 'Haiti', callingCode: '+509', flag: '🇭🇹' },
        { code: 'DO', name: 'Dominican Republic', callingCode: '+1', flag: '🇩🇴' },
        { code: 'CU', name: 'Cuba', callingCode: '+53', flag: '🇨🇺' },
        { code: 'JM', name: 'Jamaica', callingCode: '+1', flag: '🇯🇲' },
        { code: 'BB', name: 'Barbados', callingCode: '+1', flag: '🇧🇧' },
        { code: 'TT', name: 'Trinidad and Tobago', callingCode: '+1', flag: '🇹🇹' },
        { code: 'GD', name: 'Grenada', callingCode: '+1', flag: '🇬🇩' },
        { code: 'LC', name: 'Saint Lucia', callingCode: '+1', flag: '🇱🇨' },
        { code: 'VC', name: 'Saint Vincent and the Grenadines', callingCode: '+1', flag: '🇻🇨' },
        { code: 'AG', name: 'Antigua and Barbuda', callingCode: '+1', flag: '🇦🇬' },
        { code: 'KN', name: 'Saint Kitts and Nevis', callingCode: '+1', flag: '🇰🇳' },
        { code: 'DM', name: 'Dominica', callingCode: '+1', flag: '🇩🇲' },
        { code: 'BZ', name: 'Belize', callingCode: '+501', flag: '🇧🇿' },
        { code: 'GT', name: 'Guatemala', callingCode: '+502', flag: '🇬🇹' },
        { code: 'SV', name: 'El Salvador', callingCode: '+503', flag: '🇸🇻' },
        { code: 'HN', name: 'Honduras', callingCode: '+504', flag: '🇭🇳' },
        { code: 'NI', name: 'Nicaragua', callingCode: '+505', flag: '🇳🇮' },
        { code: 'CR', name: 'Costa Rica', callingCode: '+506', flag: '🇨🇷' },
        { code: 'PA', name: 'Panama', callingCode: '+507', flag: '🇵🇦' },
        { code: 'BS', name: 'Bahamas', callingCode: '+1', flag: '🇧🇸' },
        { code: 'TC', name: 'Turks and Caicos Islands', callingCode: '+1', flag: '🇹🇨' },
        { code: 'KY', name: 'Cayman Islands', callingCode: '+1', flag: '🇰🇾' },
        { code: 'BM', name: 'Bermuda', callingCode: '+1', flag: '🇧🇲' },
        { code: 'AW', name: 'Aruba', callingCode: '+297', flag: '🇦🇼' },
        { code: 'CW', name: 'Curaçao', callingCode: '+599', flag: '🇨🇼' },
        { code: 'SX', name: 'Sint Maarten', callingCode: '+1', flag: '🇸🇽' },
        { code: 'PR', name: 'Puerto Rico', callingCode: '+1', flag: '🇵🇷' },
        { code: 'VI', name: 'U.S. Virgin Islands', callingCode: '+1', flag: '🇻🇮' },
        { code: 'GU', name: 'Guam', callingCode: '+1', flag: '🇬🇺' },
        { code: 'MP', name: 'Northern Mariana Islands', callingCode: '+1', flag: '🇲🇵' },
        { code: 'AS', name: 'American Samoa', callingCode: '+1', flag: '🇦🇸' },
        { code: 'CK', name: 'Cook Islands', callingCode: '+682', flag: '🇨🇰' },
        { code: 'TO', name: 'Tonga', callingCode: '+676', flag: '🇹🇴' },
        { code: 'FJ', name: 'Fiji', callingCode: '+679', flag: '🇫🇯' },
        { code: 'WS', name: 'Samoa', callingCode: '+685', flag: '🇼🇸' },
        { code: 'TV', name: 'Tuvalu', callingCode: '+688', flag: '🇹🇻' },
        { code: 'KI', name: 'Kiribati', callingCode: '+686', flag: '🇰🇮' },
        { code: 'NR', name: 'Nauru', callingCode: '+674', flag: '🇳🇷' },
        { code: 'PW', name: 'Palau', callingCode: '+680', flag: '🇵🇼' },
        { code: 'MH', name: 'Marshall Islands', callingCode: '+692', flag: '🇲🇭' },
        { code: 'FM', name: 'Micronesia', callingCode: '+691', flag: '🇫🇲' },
        { code: 'VU', name: 'Vanuatu', callingCode: '+678', flag: '🇻🇺' },
        { code: 'NC', name: 'New Caledonia', callingCode: '+687', flag: '🇳🇨' },
        { code: 'PF', name: 'French Polynesia', callingCode: '+689', flag: '🇵🇫' },
        { code: 'TK', name: 'Tokelau', callingCode: '+690', flag: '🇹🇰' },
        { code: 'NU', name: 'Niue', callingCode: '+683', flag: '🇳🇺' },
        { code: 'PN', name: 'Pitcairn', callingCode: '+64', flag: '🇵🇳' },
        { code: 'WF', name: 'Wallis and Futuna', callingCode: '+681', flag: '🇼🇫' },
        { code: 'SB', name: 'Solomon Islands', callingCode: '+677', flag: '🇸🇧' },
        { code: 'PG', name: 'Papua New Guinea', callingCode: '+675', flag: '🇵🇬' },
        { code: 'TL', name: 'Timor-Leste', callingCode: '+670', flag: '🇹🇱' },
        { code: 'BN', name: 'Brunei', callingCode: '+673', flag: '🇧🇳' },
        { code: 'KH', name: 'Cambodia', callingCode: '+855', flag: '🇰🇭' },
        { code: 'LA', name: 'Laos', callingCode: '+856', flag: '🇱🇦' },
        { code: 'MM', name: 'Myanmar', callingCode: '+95', flag: '🇲🇲' },
        { code: 'BD', name: 'Bangladesh', callingCode: '+880', flag: '🇧🇩' },
        { code: 'LK', name: 'Sri Lanka', callingCode: '+94', flag: '🇱🇰' },
        { code: 'NP', name: 'Nepal', callingCode: '+977', flag: '🇳🇵' },
        { code: 'BT', name: 'Bhutan', callingCode: '+975', flag: '🇧🇹' },
        { code: 'MV', name: 'Maldives', callingCode: '+960', flag: '🇲🇻' },
        { code: 'PK', name: 'Pakistan', callingCode: '+92', flag: '🇵🇰' },
        { code: 'AF', name: 'Afghanistan', callingCode: '+93', flag: '🇦🇫' },
        { code: 'IR', name: 'Iran', callingCode: '+98', flag: '🇮🇷' },
        { code: 'IQ', name: 'Iraq', callingCode: '+964', flag: '🇮🇶' },
        { code: 'SY', name: 'Syria', callingCode: '+963', flag: '🇸🇾' },
        { code: 'LB', name: 'Lebanon', callingCode: '+961', flag: '🇱🇧' },
        { code: 'JO', name: 'Jordan', callingCode: '+962', flag: '🇯🇴' },
        { code: 'PS', name: 'Palestine', callingCode: '+970', flag: '🇵🇸' },
        { code: 'KW', name: 'Kuwait', callingCode: '+965', flag: '🇰🇼' },
        { code: 'QA', name: 'Qatar', callingCode: '+974', flag: '🇶🇦' },
        { code: 'BH', name: 'Bahrain', callingCode: '+973', flag: '🇧🇭' },
        { code: 'OM', name: 'Oman', callingCode: '+968', flag: '🇴🇲' },
        { code: 'YE', name: 'Yemen', callingCode: '+967', flag: '🇾🇪' }
      ];
      setAreas(fallbackData);
      setSelectedArea(fallbackData[0]);
      setCountryCode(fallbackData[0].callingCode);
    };
    
    fetchCountries();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCountrySelect = (item) => {
    setSelectedArea(item);
    setCountryCode(item.callingCode);
    setModalVisible(false);
    setSearchQuery('');
  };

  const filteredAreas = areas.filter(area => 
    area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    area.callingCode.includes(searchQuery)
  );

  const handleContinue = async () => {
    if (!firstName.trim()) {
      Alert.alert('First Name Required', 'Please enter your first name');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Last Name Required', 'Please enter your last name');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Password Required', 'Please enter your password');
      return;
    }
    if (!mobileNumber.trim()) {
      Alert.alert('Mobile Number Required', 'Please enter your mobile number');
      return;
    }
    if (!privacyAccepted) {
      Alert.alert('Terms Required', 'Please accept the Privacy Policy, Terms of Use and Terms of Service');
      return;
    }

    try {
      // Check if user already exists
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const userExists = users.find(user => user.email === email);
      if (userExists) {
        Alert.alert('User Exists', 'An account with this email already exists. Please login instead.');
        return;
      }

      // Create new user
      const newUser = {
        email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password: password.trim(),
        mobileNumber: countryCode + mobileNumber,
        countryCode: countryCode,
        marketingAccepted,
        createdAt: new Date().toISOString()
      };

      // Add user to storage
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));

      // Store current user session
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
      await AsyncStorage.setItem('isLoggedIn', 'true');

      console.log('Account created successfully:', newUser);
      
      // Navigate to Profile tab
      navigation.navigate("Main", { screen: "Profile" });
    } catch (error) {
      console.error('Error creating account:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  // Render country selection modal
  const RenderCountrySelectionModal = () => (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: dark ? COLORS.white : COLORS.black }]}>
                Country/Region
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={[styles.closeButton, { color: dark ? COLORS.white : COLORS.black }]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: dark ? COLORS.dark1 : '#F9F9F9' }]}>
              <Image source={icons.search} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: dark ? COLORS.white : COLORS.black }]}
                placeholder="Search by country/Region"
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.gray}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            {/* Country List */}
            <FlatList
              data={filteredAreas}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => handleCountrySelect(item)}>
                  <View style={styles.countryItemContent}>
                    <Text style={styles.countryFlag}>{item.flag}</Text>
                    <Text style={[styles.countryName, { color: dark ? COLORS.white : COLORS.black }]}>
                      {item.name}
                    </Text>
                  </View>
                  <View style={[styles.radioButton, { borderColor: dark ? COLORS.grayTie : COLORS.gray }]} />
                </TouchableOpacity>
              )}
              keyExtractor={item => item.code}
              style={styles.countryList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <Image
                source={images.logo}
                resizeMode='contain'
                style={styles.logo}
              />
            </View>
            
            {/* Section 1: Create Account */}
            <Text style={[styles.sectionTitle, { color: dark ? COLORS.white : COLORS.black }]}>
              Create Account
            </Text>
            
            <Text style={[styles.description, { color: dark ? COLORS.grayTie : COLORS.gray }]}>
              You're almost there!{'\n'}
              Create your new account{'\n'}
              for{' '}
              <Text style={[styles.emailText, { color: dark ? COLORS.white : COLORS.black }]}>
                {email}
              </Text>
              {'\n'}by completing these{'\n'}details
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: dark ? COLORS.white : COLORS.black }]}>
                First name
              </Text>
              <Input
                placeholder="Enter your first name"
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.gray}
                value={firstName}
                onChangeText={setFirstName}
                style={styles.inputField}
              />
            </View>
            
            {/* Section 2: Sign up */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: dark ? COLORS.white : COLORS.black }]}>
                Last name
              </Text>
              <Input
                placeholder="Enter your last name"
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.gray}
                value={lastName}
                onChangeText={setLastName}
                style={styles.inputField}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: dark ? COLORS.white : COLORS.black }]}>
                Password
              </Text>
              <Input
                placeholder="Enter your password"
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.gray}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                rightIcon={showPassword ? icons.hide : icons.show}
                onRightIconPress={togglePasswordVisibility}
                style={styles.inputField}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: dark ? COLORS.white : COLORS.black }]}>
                Mobile number
              </Text>
              <View style={styles.mobileInputContainer}>
                <TouchableOpacity 
                  style={styles.countryCodeContainer}
                  onPress={() => setModalVisible(true)}>
                  <View style={styles.countryCodeDisplay}>
                    <Text style={[styles.countryCodeText, { color: dark ? COLORS.white : COLORS.black }]}>
                      {countryCode}
                    </Text>
                    <Image source={icons.arrowDown} style={styles.dropdownIconImage} />
                  </View>
                </TouchableOpacity>
                <Input
                  placeholder="Enter mobile number"
                  placeholderTextColor={dark ? COLORS.grayTie : COLORS.gray}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  keyboardType="phone-pad"
                  style={styles.mobileNumberInput}
                />
              </View>
            </View>
            
            {/* Section 3: Terms & Conditions */}
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxRow}>
                <CheckBox
                  value={privacyAccepted}
                  onValueChange={setPrivacyAccepted}
                  tintColors={{ true: COLORS.primary, false: dark ? COLORS.grayTie : COLORS.gray }}
                  style={styles.checkbox}
                />
                <Text style={[styles.checkboxText, { color: dark ? COLORS.white : COLORS.black }]}>
                  I agree to the{' '}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                  ,{' '}
                  <Text style={styles.linkText}>Terms of Use</Text>
                  {' '}and{' '}
                  <Text style={styles.linkText}>Terms of Service</Text>
                </Text>
              </View>
              
              <View style={styles.checkboxRow}>
                <CheckBox
                  value={marketingAccepted}
                  onValueChange={setMarketingAccepted}
                  tintColors={{ true: COLORS.primary, false: dark ? COLORS.grayTie : COLORS.gray }}
                  style={styles.checkbox}
                />
                <Text style={[styles.checkboxText, { color: dark ? COLORS.white : COLORS.black }]}>
                  I do not wish to receive marketing notifications with offers and news
                </Text>
              </View>
            </View>
            
            <Button
              title="Continue"
              filled
              onPress={handleContinue}
              style={styles.continueButton}
            />
          </View>
        </ScrollView>
      </View>
      
      {/* Country Selection Modal */}
      <RenderCountrySelectionModal />
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
    padding: 16,
    alignItems: 'center'
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32
  },
  logo: {
    width: 100,
    height: 100,
    tintColor: COLORS.primary
  },
  sectionTitle: {
    fontSize: 32,
    fontFamily: "bold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 24
  },
  description: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22
  },
  emailText: {
    fontFamily: "bold",
    color: COLORS.black
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24
  },
  inputLabel: {
    fontSize: 18,
    fontFamily: "bold",
    color: COLORS.black,
    marginBottom: 12
  },
  inputField: {
    borderColor: COLORS.gray,
    borderWidth: 1
  },
  mobileInputContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  countryCodeContainer: {
    width: 70,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white
  },
  countryCodeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  countryCodeText: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.black
  },
  dropdownIconImage: {
    width: 16,
    height: 16,
    tintColor: COLORS.gray
  },
  mobileNumberInput: {
    width: 250,
    borderColor: COLORS.gray,
    borderWidth: 1
  },
  checkboxContainer: {
    width: '100%',
    marginBottom: 32
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2
  },
  checkboxText: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.black,
    flex: 1,
    lineHeight: 20
  },
  linkText: {
    color: COLORS.primary,
    fontFamily: "medium"
  },
  continueButton: {
    width: SIZES.width - 32,
    borderRadius: 30
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: SIZES.width * 0.9,
    maxHeight: SIZES.height * 0.8,
    borderRadius: 12,
    padding: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "bold",
    color: COLORS.black
  },
  closeButton: {
    fontSize: 24,
    fontFamily: "bold"
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: COLORS.gray
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "regular"
  },
  countryList: {
    maxHeight: 400
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + '20'
  },
  countryItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 16
  },
  countryName: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.black
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray
  }
});

export default CreateAccount;
