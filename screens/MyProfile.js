import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeProvider';
import Header from '../components/Header';
import { launchImagePicker } from '../utils/ImagePickerHelper';

const MyProfile = ({ navigation }) => {
  const { dark, colors } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  // Load current user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('currentUser');
        if (userData) {
          const user = JSON.parse(userData);
          setCurrentUser(user);
          if (user.profileImage) {
            setProfileImage({ uri: user.profileImage });
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
    
    // Listen for navigation focus to reload data
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
    });

    return unsubscribe;
  }, [navigation]);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleProfileImageUpload = async () => {
    try {
      const imageUri = await launchImagePicker();
      if (imageUri) {
        setProfileImage({ uri: imageUri });
        
        // Update user data with new profile image
        const updatedUser = {
          ...currentUser,
          profileImage: imageUri
        };
        
        await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        
        // Update users array
        const users = await AsyncStorage.getItem('users');
        if (users) {
          const usersArray = JSON.parse(users);
          const updatedUsers = usersArray.map(user => 
            user.email === currentUser.email ? updatedUser : user
          );
          await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
        }
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      Alert.alert('Error', 'Failed to upload profile image. Please try again.');
    }
  };

  const handleAddAddress = () => {
    // Navigate to add address page
    console.log('Add address pressed');
  };

  const handleHomeAddress = () => {
    // Navigate to home address page
    console.log('Home address pressed');
  };

  const handleWorkAddress = () => {
    // Navigate to work address page
    console.log('Work address pressed');
  };

  /**
   * Render Profile Details Card
   */
  const renderProfileDetails = () => {
    return (
      <View style={[
        styles.profileCard, 
        { backgroundColor: dark ? COLORS.dark2 : COLORS.white }
      ]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
            Profile details
          </Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image 
                source={profileImage} 
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {currentUser ? `${currentUser.firstName?.charAt(0)}${currentUser.lastName?.charAt(0)}` : 'MY'}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.editAvatarButton}
              onPress={handleProfileImageUpload}
            >
              <Image 
                source={icons.editPencil} 
                style={styles.editAvatarIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.userName, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
            {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Ma Yuxuan'}
          </Text>
        </View>

        <View style={styles.profileFields}>
          <View style={styles.fieldRow}>
            <Text style={[styles.fieldLabel, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
              First name
            </Text>
            <Text style={[styles.fieldValue, { color: dark ? COLORS.grayscale400 : COLORS.grayscale600 }]}>
              {currentUser?.firstName || 'Ma'}
            </Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={[styles.fieldLabel, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
              Last name
            </Text>
            <Text style={[styles.fieldValue, { color: dark ? COLORS.grayscale400 : COLORS.grayscale600 }]}>
              {currentUser?.lastName || 'Yuxuan'}
            </Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={[styles.fieldLabel, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
              Mobile Number
            </Text>
            <Text style={[styles.fieldValue, { color: dark ? COLORS.grayscale400 : COLORS.grayscale600 }]}>
              {currentUser?.mobileNumber || '+1 217-904-6134'}
            </Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={[styles.fieldLabel, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
              Email
            </Text>
            <Text style={[styles.fieldValue, { color: dark ? COLORS.grayscale400 : COLORS.grayscale600 }]}>
              {currentUser?.email || 'testgsga@gmail.com'}
            </Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={[styles.fieldLabel, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
              Date of birth
            </Text>
            <Text style={[styles.fieldValue, { color: dark ? COLORS.grayscale400 : COLORS.grayscale600 }]}>
              {currentUser?.dayOfBirth && currentUser?.monthOfBirth && currentUser?.yearOfBirth 
                ? `${currentUser.dayOfBirth}/${currentUser.monthOfBirth}/${currentUser.yearOfBirth}` 
                : '-'}
            </Text>
          </View>

          <View style={styles.fieldRow}>
            <Text style={[styles.fieldLabel, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
              Gender
            </Text>
            <Text style={[styles.fieldValue, { color: dark ? COLORS.grayscale400 : COLORS.grayscale600 }]}>
              {currentUser?.gender ? currentUser.gender.charAt(0).toUpperCase() + currentUser.gender.slice(1) : '-'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Render Addresses Section
   */
  const renderAddresses = () => {
    return (
      <View style={styles.addressesSection}>
        <Text style={[styles.sectionTitle, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
          My addresses
        </Text>

        <TouchableOpacity 
          style={[
            styles.addressCard, 
            { backgroundColor: dark ? COLORS.dark1 : COLORS.grayscale100 }
          ]}
          onPress={handleHomeAddress}
        >
          <View style={styles.addressIconContainer}>
            <Image source={icons.home} style={styles.addressIcon} />
          </View>
          <View style={styles.addressContent}>
            <Text style={[styles.addressType, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
              Home
            </Text>
            <Text style={[styles.addressSubtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale600 }]}>
              Add a home address
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.addressCard, 
            { backgroundColor: dark ? COLORS.dark1 : COLORS.grayscale100 }
          ]}
          onPress={handleWorkAddress}
        >
          <View style={styles.addressIconContainer}>
            <Image source={icons.bag} style={styles.addressIcon} />
          </View>
          <View style={styles.addressContent}>
            <Text style={[styles.addressType, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
              Work
            </Text>
            <Text style={[styles.addressSubtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale600 }]}>
              Add a work address
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.addButton, 
            { backgroundColor: dark ? COLORS.dark1 : COLORS.grayscale100 }
          ]}
          onPress={handleAddAddress}
        >
          <View style={styles.addIconContainer}>
            <Image source={icons.plus} style={styles.addIcon} />
          </View>
          <Text style={[styles.addButtonText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
            Add
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header 
          title="My profile"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {renderProfileDetails()}
          {renderAddresses()}
        </ScrollView>
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
  profileCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'semiBold',
    color: COLORS.greyscale900
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'medium'
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB'
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#E5E7EB'
  },
  avatarText: {
    fontSize: 24,
    fontFamily: 'bold',
    color: '#8B5CF6'
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  editAvatarIcon: {
    width: 12,
    height: 12,
    tintColor: COLORS.white
  },
  userName: {
    fontSize: 20,
    fontFamily: 'bold',
    color: COLORS.greyscale900
  },
  profileFields: {
    gap: 16
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.greyscale900
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.grayscale600
  },
  addressesSection: {
    gap: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'bold',
    color: COLORS.greyscale900,
    marginBottom: 8
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.grayscale300,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addressIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.grayscale600
  },
  addressContent: {
    flex: 1
  },
  addressType: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.greyscale900,
    marginBottom: 4
  },
  addressSubtitle: {
    fontSize: 14,
    fontFamily: 'regular',
    color: COLORS.grayscale600
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16
  },
  addIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.grayscale300,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.grayscale600
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.greyscale900
  }
});

export default MyProfile;
