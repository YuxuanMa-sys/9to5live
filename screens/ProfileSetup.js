import React, { useState, useCallback, useReducer, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, FONTS, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import InterestTag from '../components/InterestTag';
import { launchImagePicker } from '../utils/ImagePickerHelper';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';

const isTestMode = true;

const initialState = {
  inputValues: {
    fullName: isTestMode ? 'John Doe' : '',
  },
  inputValidities: {
    fullName: false,
  },
  formIsValid: false,
};

// Interest categories with service types
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
  { id: 20, title: 'App Dev', category: 'tech' }, // Shortened to prevent wrapping
  { id: 21, title: 'IT Support', category: 'tech' },
  
  // Transportation
  { id: 22, title: 'Car Wash', category: 'transport' },
  { id: 23, title: 'Auto Repair', category: 'transport' },
  { id: 24, title: 'Moving Services', category: 'transport' },
];

const ProfileSetup = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { colors, dark } = useTheme();

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;
      setImage({ uri: tempUri });
    } catch (error) {
      console.log('Image picker error:', error);
    }
  };

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
  };

  const handleSaveAndContinue = async () => {
    const { fullName } = formState.inputValues;
    
    if (!fullName.trim()) {
      Alert.alert('Incomplete Profile', 'Please enter your name to continue.');
      return;
    }

    if (selectedInterests.length === 0) {
      Alert.alert('Select Interests', 'Please select at least one service interest to continue.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const profileData = {
        name: fullName.trim(),
        profileImage: image?.uri || null,
        interests: selectedInterests,
        selectedInterestTitles: interestCategories
          .filter(interest => selectedInterests.includes(interest.id))
          .map(interest => interest.title),
      };

      console.log('Profile setup data:', profileData);
      
      Alert.alert(
        'Profile Created!',
        `Welcome ${fullName}! You've selected ${selectedInterests.length} interests.`,
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('Main') // or next screen in your flow
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInterestTag = ({ item }) => (
    <InterestTag
      title={item.title}
      isSelected={selectedInterests.includes(item.id)}
      onPress={() => toggleInterest(item.id)}
      style={styles.interestTag}
    />
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header 
          title="Profile Setup" 
          onPress={() => navigation.goBack()}
        />
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Title Section */}
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}>
              Tell us about yourself
            </Text>
            <Text style={[styles.subtitle, { color: dark ? COLORS.gray : COLORS.gray2 }]}>
              Help us personalize your experience by setting up your profile
            </Text>
          </View>

          {/* Profile Picture Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={image === null ? icons.userDefault2 : image}
                resizeMode="cover"
                style={styles.avatar}
              />
              <TouchableOpacity
                onPress={pickImage}
                style={styles.pickImageButton}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={20}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.avatarLabel, { color: dark ? COLORS.gray : COLORS.gray2 }]}>
              Add Profile Picture (Optional)
            </Text>
          </View>

          {/* Name Input Section */}
          <View style={styles.inputSection}>
            <Text style={[styles.sectionLabel, { color: dark ? COLORS.white : COLORS.black }]}>
              What's your name?
            </Text>
            <Input
              id="fullName"
              onInputChanged={inputChangedHandler}
              errorText={formState.inputValidities['fullName']}
              placeholder="Enter your full name"
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.gray}
              value={formState.inputValues.fullName}
              icon={icons.profile}
            />
          </View>

          {/* Interests Section */}
          <View style={styles.interestsSection}>
            <Text style={[styles.sectionLabel, { color: dark ? COLORS.white : COLORS.black }]}>
              What services interest you?
            </Text>
            <Text style={[styles.sectionSubtitle, { color: dark ? COLORS.gray : COLORS.gray2 }]}>
              Select all that apply - you can always change these later
            </Text>
            
            <View style={styles.interestsContainer}>
              <FlatList
                data={interestCategories}
                renderItem={renderInterestTag}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2} // Changed from 3 to 2 columns for better text spacing
                columnWrapperStyle={styles.interestRow}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>

            {/* Selected count indicator */}
            {selectedInterests.length > 0 && (
              <View style={styles.selectionIndicator}>
                <Text style={[styles.selectionText, { color: COLORS.primary }]}>
                  ✨ {selectedInterests.length} interest{selectedInterests.length !== 1 ? 's' : ''} selected
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <View style={[styles.bottomContainer, { 
          backgroundColor: colors.background,
          borderTopColor: dark ? COLORS.dark3 : COLORS.grayscale200,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8, // Android shadow
        }]}>
          <Button
            title="Skip for now"
            style={[styles.skipButton, {
              backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
            }]}
            textColor={dark ? COLORS.white : COLORS.primary}
            onPress={() => navigation.navigate('Main')} // Skip to main app
          />
          <Button
            title="Save & Continue"
            filled
            style={styles.continueButton}
            onPress={handleSaveAndContinue}
            isLoading={isLoading}
          />
        </View>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 140, // Extra space for bottom buttons that now stick to bottom
  },
  headerSection: {
    marginTop: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'regular',
    color: COLORS.gray2,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.greyscale500,
  },
  pickImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  avatarLabel: {
    fontSize: 14,
    fontFamily: 'medium',
    color: COLORS.gray2,
  },
  inputSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 18,
    fontFamily: 'semiBold',
    color: COLORS.black,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'regular',
    color: COLORS.gray2,
    marginBottom: 16,
    lineHeight: 20,
  },
  interestsSection: {
    marginBottom: 40, // Extra margin to prevent overlap
  },
  interestsContainer: {
    marginTop: 8,
  },
  interestRow: {
    justifyContent: 'flex-start',
  },
  interestTag: {
    flex: 1,
    marginRight: 8,
    marginBottom: 12,
  },
  selectionIndicator: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.transparentTertiary,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectionText: {
    fontSize: 14,
    fontFamily: 'medium',
    color: COLORS.primary,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 34, // Safe area padding for iPhone bottom
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  skipButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 32,
  },
  continueButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});

export default ProfileSetup;
