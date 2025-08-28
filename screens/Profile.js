import { View, Text, StyleSheet, TouchableOpacity, Image, Switch } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-virtualized-view';
import { launchImagePicker } from '../utils/ImagePickerHelper';
import SettingsItem from '../components/SettingsItem';
import { useTheme } from '../theme/ThemeProvider';
import RBSheet from "react-native-raw-bottom-sheet";
import Button from '../components/Button';


const Profile = ({ navigation }) => {
  const refRBSheet = useRef();
  const { dark, colors, setScheme } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);

  // Load current user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('currentUser');
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear user session
      await AsyncStorage.removeItem('currentUser');
      await AsyncStorage.removeItem('isLoggedIn');
      
      // Close the logout confirmation modal
      refRBSheet.current.close();
      
      // Navigate back to Login page
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still navigate to login even if there's an error
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  // Get currency based on country code
  const getCurrency = () => {
    if (!currentUser?.countryCode) return 'CN¥';
    
    const countryCode = currentUser.countryCode;
    if (countryCode === '+86') return 'CN¥';
    if (countryCode === '+1') return '$';
    if (countryCode === '+44') return '£';
    if (countryCode === '+49') return '€';
    if (countryCode === '+81') return '¥';
    if (countryCode === '+91') return '₹';
    if (countryCode === '+61') return 'A$';
    if (countryCode === '+33') return '€';
    if (countryCode === '+39') return '€';
    if (countryCode === '+34') return '€';
    
    return 'CN¥'; // Default to Chinese Yuan
  };



  /**
   * Render User Profile
   */
  const renderProfile = () => {
    const [image, setImage] = useState(images.user1)

    const pickImage = async () => {
      try {
        const tempUri = await launchImagePicker()

        if (!tempUri) return

        // set the image
        setImage({ uri: tempUri })
      } catch (error) { }
    };

    return (
      <View style={styles.profileContainer}>
        <View style={styles.nameContainer}>
          <Text style={[styles.userName, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
            {currentUser ? `${currentUser.lastName} ${currentUser.firstName}` : 'Ma Yuxuan'}
          </Text>
          <Text style={[styles.profileSubtitle, { color: dark ? COLORS.grayscale400 : COLORS.grayscale600 }]}>
            Personal profile
          </Text>
        </View>
        <TouchableOpacity
          onPress={pickImage}
          style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUser ? `${currentUser.firstName?.charAt(0)}${currentUser.lastName?.charAt(0)}` : 'MY'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  /**
   * Render Wallet Balance Card
   */
  const renderWalletCard = () => {
    return (
      <View style={styles.walletCardContainer}>
        <View style={styles.walletGradient}>
          <Text style={styles.walletTitle}>Wallet balance</Text>
          <Text style={styles.walletAmount}>{getCurrency()}0.00</Text>
          <TouchableOpacity style={styles.viewWalletButton}>
            <Text style={styles.viewWalletText}>View wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  /**
   * Render Menu Items
   */
  const renderMenuItems = () => {
    return (
      <View style={styles.menuCardsContainer}>
        {/* First Card - Top 6 items */}
        <View style={[
          styles.menuCard, 
          { backgroundColor: dark ? COLORS.dark2 : COLORS.white }
        ]}>
          <TouchableOpacity 
            style={[
              styles.menuItem, 
              { borderBottomColor: dark ? COLORS.greyScale800 : COLORS.grayscale200 }
            ]}
            onPress={() => navigation.navigate('MyProfile')}
          >
            <Image source={icons.user} style={[
              styles.menuIcon, 
              { tintColor: dark ? COLORS.white : COLORS.greyscale900 }
            ]} />
            <Text style={[styles.menuText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[
            styles.menuItem, 
            { borderBottomColor: dark ? COLORS.greyScale800 : COLORS.grayscale200 }
          ]}>
            <Image source={icons.heartOutline} style={[
              styles.menuIcon, 
              { tintColor: dark ? COLORS.white : COLORS.greyscale900 }
            ]} />
            <Text style={[styles.menuText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Favourites</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[
            styles.menuItem, 
            { borderBottomColor: dark ? COLORS.greyScale800 : COLORS.grayscale200 }
          ]}>
            <Image source={icons.bag} style={[
              styles.menuIcon, 
              { tintColor: dark ? COLORS.white : COLORS.greyscale900 }
            ]} />
            <Text style={[styles.menuText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Send a gift card</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[
            styles.menuItem, 
            { borderBottomColor: dark ? COLORS.greyScale800 : COLORS.grayscale200 }
          ]}>
            <Image source={icons.document} style={[
              styles.menuIcon, 
              { tintColor: dark ? COLORS.white : COLORS.greyscale900 }
            ]} />
            <Text style={[styles.menuText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Forms</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[
            styles.menuItem, 
            { borderBottomColor: dark ? COLORS.greyScale800 : COLORS.grayscale200 }
          ]}>
            <Image source={icons.bag} style={[
              styles.menuIcon, 
              { tintColor: dark ? COLORS.white : COLORS.greyscale900 }
            ]} />
            <Text style={[styles.menuText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Product orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[
            styles.menuItem, 
            { borderBottomColor: 'transparent' }
          ]}>
            <Image source={icons.settings} style={[
              styles.menuIcon, 
              { tintColor: dark ? COLORS.white : COLORS.greyscale900 }
            ]} />
            <Text style={[styles.menuText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Second Card - Support and English */}
        <View style={[
          styles.menuCard, 
          { backgroundColor: dark ? COLORS.dark2 : COLORS.white }
        ]}>
          <TouchableOpacity style={[
            styles.menuItem, 
            { borderBottomColor: dark ? COLORS.greyScale800 : COLORS.grayscale200 }
          ]}>
            <Image source={icons.headset} style={[
              styles.menuIcon, 
              { tintColor: dark ? COLORS.white : COLORS.greyscale900 }
            ]} />
            <Text style={[styles.menuText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[
            styles.menuItem, 
            { borderBottomColor: 'transparent' }
          ]}>
            <View style={styles.flagContainer}>
              <Text style={styles.flagText}>🇬🇧</Text>
            </View>
            <Text style={[styles.menuText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>English</Text>
          </TouchableOpacity>
        </View>

        {/* Third Card - Logout */}
        <View style={[
          styles.menuCard, 
          { backgroundColor: dark ? COLORS.dark2 : COLORS.white }
        ]}>
          <TouchableOpacity 
            style={[
              styles.menuItem, 
              { borderBottomColor: 'transparent' }
            ]}
            onPress={() => refRBSheet.current.open()}
          >
            <Image source={icons.logout} style={[styles.menuIcon, { tintColor: '#EF4444' }]} />
            <Text style={[styles.menuText, { color: '#EF4444' }]}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderProfile()}
          {renderWalletCard()}
          {renderMenuItems()}
        </ScrollView>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={SIZES.height * .8}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: dark ? COLORS.gray2 : COLORS.grayscale200,
            height: 4
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 260,
            backgroundColor: dark ? COLORS.dark2 : COLORS.white
          }
        }}
      >
        <Text style={styles.bottomTitle}>Logout</Text>
        <View style={[styles.separateLine, {
          backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
        }]} />
        <Text style={[styles.bottomSubtitle, {
          color: dark ? COLORS.white : COLORS.black
        }]}>Are you sure you want to log out?</Text>
        <View style={styles.bottomContainer}>
          <Button
            title="Cancel"
            style={{
              width: (SIZES.width - 32) / 2 - 8,
              backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              borderRadius: 32,
              borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
            }}
            textColor={dark ? COLORS.white : COLORS.primary}
            onPress={() => refRBSheet.current.close()}
          />
          <Button
            title="Yes, Logout"
            filled
            style={styles.logoutButton}
            onPress={handleLogout}
          />
        </View>
      </RBSheet>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 32
  },

  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24
  },
  nameContainer: {
    flex: 1
  },
  userName: {
    fontSize: 28,
    fontFamily: "bold",
    color: COLORS.greyscale900,
    marginBottom: 4
  },
  profileSubtitle: {
    fontSize: 16,
    color: COLORS.grayscale600,
    fontFamily: "medium"
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: '#E5E7EB'
  },
  avatarText: {
    fontSize: 20,
    fontFamily: "bold",
    color: '#8B5CF6'
  },
  walletCardContainer: {
    marginBottom: 24
  },
  walletGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: "flex-start",
    backgroundColor: '#8B5CF6'
  },
  walletTitle: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.white,
    marginBottom: 8
  },
  walletAmount: {
    fontSize: 32,
    fontFamily: "bold",
    color: COLORS.white,
    marginBottom: 16
  },
  viewWalletButton: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  viewWalletText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.white
  },
  menuCardsContainer: {
    gap: 16,
  },
  menuCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.greyscale900,
    flex: 1
  },
  flagContainer: {
    width: 24,
    height: 24,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  flagText: {
    fontSize: 20
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16
  },
  logoutButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "semiBold",
    color: "red",
    textAlign: "center",
    marginTop: 12
  },
  bottomSubtitle: {
    fontSize: 20,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 28
  },
  separateLine: {
    width: SIZES.width,
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginTop: 12
  }
})

export default Profile