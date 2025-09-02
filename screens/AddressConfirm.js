import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddressConfirm = ({ navigation, route }) => {
  const { dark, colors } = useTheme();
  const { addressType, address, isCurrentLocation, placeId, editMode, existingAddress } = route.params || {};
  const [selectedAddress, setSelectedAddress] = useState(address || '147 Ivy Drive Boone');
  const [coordinates, setCoordinates] = useState(null);

  const GOOGLE_MAPS_API_KEY = 'AIzaSyCG_D04L0qHBHmsa8LpcVmzKPxJKCnXxTk';

  // Get coordinates for the selected address
  useEffect(() => {
    if (placeId && !isCurrentLocation) {
      getAddressCoordinates(placeId);
    }
  }, [placeId]);

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

  const handleSaveAddress = async () => {
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
        id: editMode && existingAddress ? existingAddress.id : Date.now().toString(), // Keep existing ID if editing
        type: addressType,
        address: selectedAddress,
        coordinates: coordinates,
        createdAt: editMode && existingAddress ? existingAddress.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Get existing addresses or create new array
      const existingAddresses = await AsyncStorage.getItem(`addresses_${user.email}`) || '[]';
      const addresses = JSON.parse(existingAddresses);
      
      // Check if address type already exists, update it
      const existingIndex = addresses.findIndex(addr => addr.type === addressType);
      if (existingIndex !== -1) {
        addresses[existingIndex] = addressData;
      } else {
        addresses.push(addressData);
      }
      
      // Save updated addresses
      await AsyncStorage.setItem(`addresses_${user.email}`, JSON.stringify(addresses));
      
      console.log(`${editMode ? 'Updated' : 'Saved'} ${addressType} address:`, selectedAddress);
      
      // Navigate back to MyProfile
      navigation.navigate('MyProfile');
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleEditAddress = () => {
    // Navigate back to search screen
    navigation.navigate('AddressSearch', { addressType });
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
            {editMode ? `Edit ${addressType}` : addressType}
          </Text>
        </View>

        {/* Address Input Field */}
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
              {selectedAddress.split(',')[0] || '147 Ivy Drive'}
            </Text>
            <Text style={[styles.addressLine2, { 
              color: dark ? COLORS.grayscale400 : COLORS.grayscale600
            }]}>
              {selectedAddress.split(',').slice(1).join(',').trim() || 'Boone'}
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
            backgroundColor: dark ? COLORS.greyscale900 : COLORS.greyscale900
          }]}
          onPress={handleSaveAddress}
        >
          <Text style={styles.saveButtonText}>{editMode ? 'Update' : 'Save'}</Text>
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
  mapPlaceholder: {
    alignItems: 'center'
  },
  mapText: {
    fontSize: 18,
    fontFamily: 'medium',
    color: COLORS.grayscale500,
    marginBottom: 8
  },
  mapSubtext: {
    fontSize: 14,
    fontFamily: 'regular',
    color: COLORS.grayscale500
  },
  coordinatesText: {
    fontSize: 12,
    fontFamily: 'regular',
    color: COLORS.grayscale500,
    marginTop: 8
  },
  mapPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -24
  },
  pinIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.greyscale900
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
  addressLine2: {
    fontSize: 14,
    fontFamily: 'regular',
    color: COLORS.grayscale600
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

export default AddressConfirm;
