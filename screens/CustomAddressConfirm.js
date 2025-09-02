import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mapDarkStyle, mapStandardStyle } from '../data/mapData';

const CustomAddressConfirm = ({ navigation, route }) => {
  const { dark, colors } = useTheme();
  const { address, isCurrentLocation, placeId, coordinates: passedCoordinates, editMode, existingAddress } = route.params || {};
  const [selectedAddress, setSelectedAddress] = useState(address || '');
  const [coordinates, setCoordinates] = useState(passedCoordinates || null);
  const [customName, setCustomName] = useState(editMode && existingAddress ? existingAddress.name : '');
  const [charCount, setCharCount] = useState(editMode && existingAddress ? existingAddress.name.length : 0);

  const GOOGLE_MAPS_API_KEY = 'AIzaSyCG_D04L0qHBHmsa8LpcVmzKPxJKCnXxTk';

  // Get coordinates for the selected address
  useEffect(() => {
    if (placeId && !isCurrentLocation) {
      getAddressCoordinates(placeId);
    } else if (isCurrentLocation && passedCoordinates) {
      setCoordinates(passedCoordinates);
    }
  }, [placeId, isCurrentLocation, passedCoordinates]);

  const getAddressCoordinates = async (placeId) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${GOOGLE_MAPS_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.result.geometry) {
        setCoordinates(data.result.geometry.location);
      }
    } catch (error) {
      console.error('Error getting coordinates:', error);
    }
  };

  const handleCustomNameChange = (text) => {
    setCustomName(text);
    setCharCount(text.length);
  };

  const handleSaveAddress = async () => {
    if (!customName.trim()) {
      // Show error for empty custom name
      return;
    }

    try {
      // Get current user
      const userData = await AsyncStorage.getItem('currentUser');
      if (!userData) {
        console.error('No user data found');
        return;
      }
      
      const user = JSON.parse(userData);
      
      // Create address object
      const addressData = {
        id: editMode && existingAddress ? existingAddress.id : Date.now().toString(),
        type: 'Custom',
        name: customName.trim(),
        address: selectedAddress,
        coordinates: coordinates,
        createdAt: editMode && existingAddress ? existingAddress.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Get existing addresses or create new array
      const existingAddresses = await AsyncStorage.getItem(`addresses_${user.email}`) || '[]';
      const addresses = JSON.parse(existingAddresses);
      
      if (editMode && existingAddress) {
        // Update existing custom address
        const existingIndex = addresses.findIndex(addr => addr.id === existingAddress.id);
        if (existingIndex !== -1) {
          addresses[existingIndex] = addressData;
        }
      } else {
        // Add new custom address
        addresses.push(addressData);
      }
      
      // Save updated addresses
      await AsyncStorage.setItem(`addresses_${user.email}`, JSON.stringify(addresses));
      
      console.log(`${editMode ? 'Updated' : 'Saved'} custom address:`, customName);
      
      // Navigate back to MyProfile
      navigation.navigate('MyProfile');
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleEditAddress = () => {
    // Navigate back to search screen
    navigation.navigate('AddressSearch', { addressType: 'Custom' });
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image
              source={icons.arrowBack}
              resizeMode='contain'
              style={[styles.backIcon, { 
                tintColor: dark ? COLORS.white : COLORS.greyscale900
              }]}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { 
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>
            {editMode ? 'Edit Custom' : 'Custom'}
          </Text>
        </View>

        {/* Address Name Input */}
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { 
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>
            Address name *
          </Text>
          <View style={[styles.nameInputContainer, { 
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            borderColor: dark ? COLORS.greyScale800 : COLORS.grayscale200
          }]}>
            <Image
              source={icons.user}
              resizeMode='contain'
              style={styles.nameIcon}
            />
            <TextInput
              style={[styles.nameInput, { 
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}
              placeholder="Custom name addr..."
              placeholderTextColor={dark ? COLORS.grayscale400 : COLORS.grayscale500}
              value={customName}
              onChangeText={handleCustomNameChange}
              maxLength={100}
            />
            <Text style={[styles.charCount, { 
              color: dark ? COLORS.grayscale400 : COLORS.grayscale500
            }]}>
              {charCount}/100
            </Text>
          </View>
        </View>

        {/* Address Display Field */}
        <View style={[styles.addressInputContainer, { 
          backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          borderColor: dark ? COLORS.greyScale800 : COLORS.grayscale200
        }]}>
          <Image
            source={icons.location}
            resizeMode='contain'
            style={styles.locationIcon}
          />
          <Text style={[styles.addressText, { 
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>
            {selectedAddress}
          </Text>
        </View>

        {/* Map View */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: coordinates?.lat || 36.2168,
              longitude: coordinates?.lng || -81.6746,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            onMapReady={() => console.log('Map is ready')}
            onError={(error) => console.log('Map error:', error)}
          >
            <Marker
              coordinate={{
                latitude: coordinates?.lat || 36.2168,
                longitude: coordinates?.lng || -81.6746,
              }}
              title={selectedAddress}
              description="Selected location"
            />
          </MapView>
        </View>

        {/* Confirmed Address Display */}
        <View style={styles.confirmedAddressContainer}>
          <View style={styles.addressDetails}>
            <Text style={[styles.addressLine1, { 
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>
              {selectedAddress.split(',')[0] || 'Address'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditAddress}
          >
            <Text style={[styles.editButtonText, { 
              color: COLORS.primary 
            }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, { 
            backgroundColor: customName.trim() ? COLORS.greyscale900 : COLORS.grayscale300
          }]}
          onPress={handleSaveAddress}
          disabled={!customName.trim()}
        >
          <Text style={[styles.saveButtonText, { 
            color: customName.trim() ? COLORS.white : COLORS.grayscale500
          }]}>
            {editMode ? 'Update' : 'Save'}
          </Text>
        </TouchableOpacity>
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
    backgroundColor: COLORS.white,
    padding: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  backButton: {
    marginRight: 16
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'bold',
    color: COLORS.greyscale900
  },
  inputSection: {
    marginBottom: 24
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.greyscale900,
    marginBottom: 8
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  nameIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: COLORS.grayscale500
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.greyscale900
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'regular',
    color: COLORS.grayscale500
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24
  },
  locationIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    tintColor: COLORS.grayscale500
  },
  addressText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.greyscale900
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: COLORS.grayscale100
  },
  map: {
    flex: 1,
    borderRadius: 12,
    minHeight: 300
  },
  confirmedAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 8
  },
  addressDetails: {
    flex: 1
  },
  addressLine1: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.greyscale900,
    marginBottom: 4
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.primary
  },
  saveButton: {
    backgroundColor: COLORS.greyscale900,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto'
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.white
  }
});

export default CustomAddressConfirm;
