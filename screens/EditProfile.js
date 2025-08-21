import {
  View, Text, StyleSheet, ScrollView, Alert, Image,
  TouchableOpacity, Modal, TouchableWithoutFeedback,
  FlatList, TextInput
} from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, FONTS, icons, images } from '../constants';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Input from '../components/Input';
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePickerModal from '../components/DatePickerModal';
import Button from '../components/Button';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../theme/ThemeProvider';
import { useUser } from '../context/UserContext';
import InterestTag from '../components/InterestTag';
import { launchImageLibrary } from 'react-native-image-picker';

const isTestMode = true;

// Interest categories (same as ProfileSetup)
const interestCategories = [
  // Home Services
  { id: 1, title: 'Cleaning', category: 'home' },
  { id: 2, title: 'Plumbing', category: 'home' },
  { id: 3, title: 'Electrical', category: 'home' },
  { id: 4, title: 'Gardening', category: 'home' },
  { id: 5, title: 'Painting', category: 'home' },
  { id: 6, title: 'Appliance Repair', category: 'home' },
  
  // Personal Care
  { id: 7, title: 'Haircut', category: 'personal' },
  { id: 8, title: 'Massage', category: 'personal' },
  { id: 9, title: 'Manicure', category: 'personal' },
  { id: 10, title: 'Facial', category: 'personal' },
  { id: 11, title: 'Personal Training', category: 'personal' },
  { id: 12, title: 'Yoga', category: 'personal' },
  
  // Professional Services
  { id: 13, title: 'Tutoring', category: 'professional' },
  { id: 14, title: 'Photography', category: 'professional' },
  { id: 15, title: 'Consulting', category: 'professional' },
  { id: 16, title: 'Legal Services', category: 'professional' },
  { id: 17, title: 'Accounting', category: 'professional' },
  
  // Tech & Digital
  { id: 18, title: 'Computer Repair', category: 'tech' },
  { id: 19, title: 'Web Design', category: 'tech' },
  { id: 20, title: 'App Dev', category: 'tech' },
  { id: 21, title: 'IT Support', category: 'tech' },
  
  // Transportation
  { id: 22, title: 'Car Wash', category: 'transport' },
  { id: 23, title: 'Auto Repair', category: 'transport' },
  { id: 24, title: 'Moving Services', category: 'transport' },
];

const getInitialState = (user) => {
  // Extract local phone number (remove country code)
  let localPhoneNumber = '';
  if (user.phoneNumber && user.countryCode) {
    localPhoneNumber = user.phoneNumber.replace(user.countryCode, '').trim();
  } else {
    localPhoneNumber = user.phoneNumber || '';
  }
  
  return {
    inputValues: {
      fullName: user.fullName || '',
      email: user.email || '',
      nickname: user.nickname || '',
      phoneNumber: localPhoneNumber
    },
    inputValidities: {
      fullName: false,
      email: false,
      nickname: false,
      phoneNumber: false,
    },
    formIsValid: false,
  };
};

const EditProfile = ({ navigation }) => {
  const { colors, dark } = useTheme();
  const { user, updateUser } = useUser();
  
  const [image, setImage] = useState(user.profileImage ? { uri: user.profileImage } : null);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, getInitialState(user));
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedInterests, setSelectedInterests] = useState(user.interests || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
    // Clear search when adding an interest
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const removeInterest = (interestId) => {
    setSelectedInterests(prev => prev.filter(id => id !== interestId));
  };

  // Filter interests based on search query
  const getFilteredInterests = () => {
    if (!searchQuery.trim()) return [];
    
    return interestCategories.filter(interest => 
      interest.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedInterests.includes(interest.id)
    );
  };

  // Get selected interest objects
  const getSelectedInterestObjects = () => {
    return interestCategories.filter(interest => 
      selectedInterests.includes(interest.id)
    );
  };

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const today = new Date();
  const startDate = getFormatedDate(
    new Date(today.getFullYear() - 80, today.getMonth(), today.getDate()),
    "YYYY/MM/DD"
  );
  const [startedDate, setStartedDate] = useState(user.dateOfBirth || "Date of Birth");

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue)
      dispatchFormState({ inputId, validationResult: result, inputValue })
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error);
    }
  }, [error]);

  // pick image using react-native-image-picker
  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const pickedImage = response.assets[0];
        setImage({ uri: pickedImage.uri });
        // Update user context immediately when image is picked
        updateUser({ profileImage: pickedImage.uri });
      } else {
        Alert.alert('Could not pick the image', 'Please try again.');
      }
    });
  };

  // fetch country codes
  useEffect(() => {
    fetch("https://restcountries.com/v2/all")
      .then(response => response.json())
      .then(data => {
        let areaData = data.map(item => ({
          code: item.alpha2Code,
          item: item.name,
          callingCode: `+${item.callingCodes[0]}`,
          flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`
        }));
        setAreas(areaData);
        if (areaData.length > 0) {
          // Use user's country if available, otherwise default to US
          let countryCode = "US";
          if (user.countryCode) {
            // Extract country code from dial code (e.g., "+1" -> "US")
            const countryMapping = {
              "+1": "US",
              "+44": "GB", 
              "+91": "IN",
              "+86": "CN",
              "+49": "DE",
              "+33": "FR",
              // Add more mappings as needed
            };
            countryCode = countryMapping[user.countryCode] || "US";
          }
          
          let defaultData = areaData.filter(a => a.code === countryCode);
          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0]);
          }
        }
      });
  }, [user.countryCode]);

  // render modal for selecting country codes
  const RenderAreasCodesModal = () => (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <View style={{
            height: 400,
            width: SIZES.width * 0.8,
            backgroundColor: COLORS.primary,
            borderRadius: 12
          }}>
            <FlatList
              data={areas}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ padding: 10, flexDirection: "row" }}
                  onPress={() => { setSelectedArea(item); setModalVisible(false); }}>
                  <Image source={{ uri: item.flag }} style={{ height: 30, width: 30, marginRight: 10 }} />
                  <Text style={{ fontSize: 16, color: "#fff" }}>{item.item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.code}
              style={{ padding: 20, marginBottom: 20 }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
        <Header title="Edit Profile" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              <Image
                source={image === null ? images.user1 : image}
                resizeMode="cover"
                style={styles.avatar} />
              <TouchableOpacity onPress={pickImage} style={styles.pickImage}>
                <MaterialCommunityIcons name="pencil-outline" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
          <Input 
            id="fullName" 
            onInputChanged={inputChangedHandler} 
            errorText={formState.inputValidities['fullName']} 
            placeholder="Full Name" 
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black} 
            value={formState.inputValues.fullName}
          />
          <Input 
            id="nickname" 
            onInputChanged={inputChangedHandler} 
            errorText={formState.inputValidities['nickname']} 
            placeholder="Nickname" 
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black} 
            value={formState.inputValues.nickname}
          />
          <Input 
            id="email" 
            onInputChanged={inputChangedHandler} 
            errorText={formState.inputValidities['email']} 
            placeholder="Email" 
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black} 
            keyboardType="email-address" 
            value={formState.inputValues.email}
          />

          <TouchableOpacity style={[styles.inputBtn, { backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500 }]} onPress={() => setOpenStartDatePicker(true)}>
            <Text style={{ ...FONTS.body4, color: COLORS.grayscale400 }}>{startedDate}</Text>
            <Feather name="calendar" size={24} color={COLORS.grayscale400} />
          </TouchableOpacity>

          <View style={[styles.inputContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500 }]}>
            <TouchableOpacity style={styles.selectFlagContainer} onPress={() => setModalVisible(true)}>
              <Image source={icons.down} style={styles.downIcon} />
              <Image source={{ uri: selectedArea?.flag }} style={styles.flagIcon} />
              <Text style={{ color: dark ? COLORS.white : "#111", fontSize: 12 }}>{selectedArea?.callingCode}</Text>
            </TouchableOpacity>
            <TextInput 
              style={styles.input} 
              placeholder="Enter your phone number" 
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black} 
              keyboardType="numeric" 
              value={formState.inputValues.phoneNumber}
              onChangeText={(text) => inputChangedHandler('phoneNumber', text)}
            />
          </View>

          {/* Interests Section */}
          <View style={styles.interestsSection}>
            <Text style={[styles.sectionLabel, { color: dark ? COLORS.white : COLORS.black }]}>
              Your Service Interests
            </Text>
            <Text style={[styles.sectionSubtitle, { color: dark ? COLORS.gray : COLORS.gray2 }]}>
              Manage your service preferences
            </Text>
            
            {/* Selected Interests */}
            {selectedInterests.length > 0 && (
              <View style={styles.selectedInterestsContainer}>
                <Text style={[styles.selectedInterestsLabel, { color: dark ? COLORS.white : COLORS.black }]}>
                  Selected ({selectedInterests.length})
                </Text>
                <View style={styles.selectedInterestsGrid}>
                  {getSelectedInterestObjects().map((interest) => (
                    <View key={interest.id} style={styles.selectedInterestTag}>
                      <InterestTag
                        title={interest.title}
                        isSelected={true}
                        onPress={() => removeInterest(interest.id)}
                        style={styles.interestTag}
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Input
                id="interestSearch"
                placeholder="Search for interests to add..."
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                value={searchQuery}
                onInputChanged={(id, text) => {
                  setSearchQuery(text);
                  setShowSearchResults(text.trim().length > 0);
                }}
                onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
                onBlur={() => {
                  // Small delay to allow tap on search results
                  setTimeout(() => setShowSearchResults(false), 150);
                }}
                style={styles.searchInput}
              />
            </View>

            {/* Search Results */}
            {showSearchResults && getFilteredInterests().length > 0 && (
              <View style={styles.searchResultsContainer}>
                <Text style={[styles.searchResultsLabel, { color: dark ? COLORS.gray : COLORS.gray2 }]}>
                  Tap to add:
                </Text>
                <View style={styles.searchResultsGrid}>
                  {getFilteredInterests().map((interest) => (
                    <InterestTag
                      key={interest.id}
                      title={interest.title}
                      isSelected={false}
                      onPress={() => toggleInterest(interest.id)}
                      style={styles.interestTag}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* No search results message */}
            {showSearchResults && searchQuery.trim().length > 0 && getFilteredInterests().length === 0 && (
              <View style={styles.noResultsContainer}>
                <Text style={[styles.noResultsText, { color: dark ? COLORS.gray : COLORS.gray2 }]}>
                  No new interests found for "{searchQuery}"
                </Text>
              </View>
            )}

            {/* Empty state when no interests selected */}
            {selectedInterests.length === 0 && (
              <View style={styles.emptyStateContainer}>
                <Text style={[styles.emptyStateText, { color: dark ? COLORS.gray : COLORS.gray2 }]}>
                  Search and add your service interests above
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <DatePickerModal open={openStartDatePicker} startDate={startDate} selectedDate={startedDate} onClose={() => setOpenStartDatePicker(false)} onChangeStartDate={(date) => setStartedDate(date)} />
      {RenderAreasCodesModal()}

      <View style={styles.bottomContainer}>
        <Button 
          title="Update" 
          filled 
          style={styles.continueButton} 
          onPress={() => {
            // Combine country code with phone number for storage
            const fullPhoneNumber = selectedArea?.callingCode 
              ? `${selectedArea.callingCode} ${formState.inputValues.phoneNumber.trim()}`
              : formState.inputValues.phoneNumber;
            
            // Update user context with new data
            updateUser({
              fullName: formState.inputValues.fullName,
              email: formState.inputValues.email,
              nickname: formState.inputValues.nickname,
              phoneNumber: fullPhoneNumber,
              countryCode: selectedArea?.callingCode || user.countryCode,
              countryName: selectedArea?.item || user.countryName,
              dateOfBirth: startedDate !== 'Date of Birth' ? startedDate : user.dateOfBirth,
              interests: selectedInterests,
              profileImage: image?.uri || user.profileImage,
            });
            
            Alert.alert(
              'Profile Updated!',
              'Your profile has been successfully updated.',
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          }} 
        />
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, padding: 16, backgroundColor: COLORS.white },
  avatarContainer: { alignItems: "center", width: 130, height: 130, borderRadius: 65 },
  avatar: { height: 130, width: 130, borderRadius: 65 },
  pickImage: { height: 42, width: 42, borderRadius: 21, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 0, right: 0 },
  inputContainer: { flexDirection: "row", borderRadius: 6, height: 52, width: SIZES.width - 32, alignItems: 'center', marginVertical: 16 },
  downIcon: { width: 10, height: 10, tintColor: "#111" },
  selectFlagContainer: { width: 90, height: 50, marginHorizontal: 5, flexDirection: "row" },
  flagIcon: { width: 30, height: 30 },
  input: { flex: 1, marginVertical: 10, height: 40, fontSize: 14, color: "#111" },
  inputBtn: { borderWidth: 1, borderRadius: 12, height: 50, paddingLeft: 8, justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingRight: 8, marginTop: 4 },
  bottomContainer: { position: "absolute", bottom: 32, left: 16, right: 16, alignItems: "center" },
  continueButton: { width: SIZES.width - 32, borderRadius: 32, backgroundColor: COLORS.primary },
  selectInput: { fontSize: 16, paddingHorizontal: 10, color: COLORS.greyscale600, height: 52, width: SIZES.width - 32, backgroundColor: COLORS.greyscale500, borderRadius: 16, marginVertical: 8 },
  interestsSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.black,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "regular",
    color: COLORS.gray2,
    marginBottom: 16,
    lineHeight: 20,
  },
  selectedInterestsContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  selectedInterestsLabel: {
    fontSize: 16,
    fontFamily: "medium",
    marginBottom: 12,
  },
  selectedInterestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  selectedInterestTag: {
    marginRight: 8,
    marginBottom: 12,
  },
  searchContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 0,
  },
  searchResultsContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: COLORS.transparentTertiary,
    borderRadius: 12,
  },
  searchResultsLabel: {
    fontSize: 14,
    fontFamily: "medium",
    marginBottom: 12,
  },
  searchResultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  noResultsContainer: {
    marginTop: 12,
    padding: 16,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: "regular",
    textAlign: 'center',
  },
  emptyStateContainer: {
    marginTop: 20,
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: "regular",
    textAlign: 'center',
  },
  interestTag: {
    marginRight: 8,
    marginBottom: 12,
    minWidth: '45%',
  },
});

export default EditProfile;
