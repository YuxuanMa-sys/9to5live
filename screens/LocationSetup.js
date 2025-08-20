import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Dimensions, Platform, PermissionsAndroid } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// Use built-in geolocation as fallback
let Geolocation;
try {
  Geolocation = require('react-native-geolocation-service').default;
} catch (error) {
  console.log('Using fallback geolocation');
  Geolocation = require('@react-native-community/geolocation').default;
}
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import { COLORS, SIZES, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

const { width, height } = Dimensions.get('window');

const LocationSetup = ({ navigation }) => {
  // Use a more neutral default location (center of US) until actual location is found
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 39.8283,
    longitude: -98.5795,
    latitudeDelta: 50.0,
    longitudeDelta: 50.0,
  });
  const [markerLocation, setMarkerLocation] = useState({
    latitude: 39.8283,
    longitude: -98.5795,
  });
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false);
  
  const { colors, dark } = useTheme();

  useEffect(() => {
    checkLocationPermission();
    // Optionally try to get current location on load
    // Uncomment the line below if you want automatic location detection
    // getCurrentLocation();
  }, []);

  const checkLocationPermission = async () => {
    try {
      let permission;
      
      if (Platform.OS === 'android') {
        permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      } else {
        permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      }
      
      const isGranted = permission === RESULTS.GRANTED;
      setHasLocationPermission(isGranted);
      
      console.log('Location permission status:', permission);
      
      if (!isGranted) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location access in your device settings to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => console.log('Should open settings') }
          ]
        );
      }
    } catch (error) {
      console.log('Permission error:', error);
      setHasLocationPermission(false);
    }
  };

  const getCurrentLocation = async () => {
    if (!hasLocationPermission) {
      Alert.alert(
        'Permission Required',
        'Location permission is required to get your current location. Please enable it in settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoadingLocation(true);
    
    try {
      // Use navigator.geolocation as primary method to avoid native module issues
      const position = await new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            { 
              enableHighAccuracy: true, 
              timeout: 20000, 
              maximumAge: 0 // Don't use cached location
            }
          );
        } else {
          // Fallback to React Native geolocation
          Geolocation.getCurrentPosition(
            resolve,
            reject,
            { 
              enableHighAccuracy: true, 
              timeout: 20000, 
              maximumAge: 0
            }
          );
        }
      });
      
      const { latitude, longitude } = position.coords;
      console.log('Got location:', { latitude, longitude, accuracy: position.coords.accuracy });
      
      const newLocation = {
        latitude,
        longitude,
        latitudeDelta: 0.005, // Zoom in closer to the actual location
        longitudeDelta: 0.005,
      };
      
      setCurrentLocation(newLocation);
      setMarkerLocation({ latitude, longitude });
      
      // Reverse geocode to get address
      await reverseGeocode(latitude, longitude);
      
      Alert.alert('Location Found', `Your current location has been detected!\nAccuracy: ${Math.round(position.coords.accuracy)}m`);
      
    } catch (error) {
      console.log('Location error:', error);
      
      // Handle different error types
      let errorMessage = 'Unable to get your current location.';
      switch (error.code) {
        case 1: // PERMISSION_DENIED
          errorMessage = 'Location permission was denied. Please enable location access in your device settings.';
          break;
        case 2: // POSITION_UNAVAILABLE
          errorMessage = 'Location information is unavailable. Please check your GPS and internet connection.';
          break;
        case 3: // TIMEOUT
          errorMessage = 'Location request timed out. Please try again in a moment.';
          break;
        default:
          errorMessage = `Location error: ${error.message || 'Unknown error'}`;
      }
      
      Alert.alert('Location Error', errorMessage, [
        { text: 'Try Again', onPress: getCurrentLocation },
        { text: 'Cancel' }
      ]);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      console.log('Reverse geocoding for:', { latitude, longitude });
      
      // Use multiple reverse geocoding APIs for better accuracy
      let addressData = null;
      
      // Try BigDataCloud first (free, no API key needed)
      try {
        const bigDataResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const bigData = await bigDataResponse.json();
        
        if (bigData && bigData.city) {
          addressData = {
            street: bigData.locality || 'Current Street',
            city: bigData.city || bigData.locality || 'Current City',
            zipCode: bigData.postcode || '00000',
            source: 'BigDataCloud'
          };
        }
      } catch (bigDataError) {
        console.log('BigDataCloud error:', bigDataError);
      }
      
      // If BigDataCloud fails, try Nominatim (OpenStreetMap)
      if (!addressData) {
        try {
          const nominatimResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': '9to5Life-App/1.0'
              }
            }
          );
          const nominatimData = await nominatimResponse.json();
          
          if (nominatimData && nominatimData.address) {
            const addr = nominatimData.address;
            addressData = {
              street: addr.road || addr.neighbourhood || 'Current Street',
              city: addr.city || addr.town || addr.village || addr.county || 'Current City',
              zipCode: addr.postcode || '00000',
              source: 'Nominatim'
            };
          }
        } catch (nominatimError) {
          console.log('Nominatim error:', nominatimError);
        }
      }
      
      if (addressData) {
        setStreet(addressData.street);
        setCity(addressData.city);
        setZipCode(addressData.zipCode);
        
        console.log('Address found via', addressData.source, ':', {
          street: addressData.street,
          city: addressData.city,
          zipCode: addressData.zipCode
        });
      } else {
        // Ultimate fallback
        setStreet('Current Location');
        setCity('Current City');
        setZipCode('00000');
        console.log('Using fallback address');
      }
    } catch (error) {
      console.log('Reverse geocoding error:', error);
      // Fallback address
      setStreet('Current Location');
      setCity('Current City');
      setZipCode('00000');
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerLocation({ latitude, longitude });
    reverseGeocode(latitude, longitude);
  };

  // Forward geocoding - convert address to coordinates
  const forwardGeocode = async (address) => {
    if (!address || address.trim().length < 3) {
      return null;
    }

    try {
      setIsGeocodingAddress(true);
      console.log('Forward geocoding address:', address);
      
      // Try Nominatim first (OpenStreetMap)
      try {
        const nominatimResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`,
          {
            headers: {
              'User-Agent': '9to5Life-App/1.0'
            }
          }
        );
        const nominatimData = await nominatimResponse.json();
        
        if (nominatimData && nominatimData.length > 0) {
          const result = nominatimData[0];
          return {
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            source: 'Nominatim'
          };
        }
      } catch (nominatimError) {
        console.log('Nominatim forward geocoding error:', nominatimError);
      }
      
      return null;
    } catch (error) {
      console.log('Forward geocoding error:', error);
      return null;
    } finally {
      setIsGeocodingAddress(false);
    }
  };

  // Debounced function to update map based on address input
  const updateMapFromAddress = async () => {
    const fullAddress = `${street}, ${city}, ${zipCode}`.trim().replace(/^,\s*|,\s*$/g, '');
    
    if (fullAddress.length < 5) {
      return; // Don't geocode very short addresses
    }

    const coordinates = await forwardGeocode(fullAddress);
    
    if (coordinates) {
      console.log('Found coordinates for address:', coordinates);
      
      const newLocation = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      setCurrentLocation(newLocation);
      setMarkerLocation({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      });
    }
  };

  // Debounced address change handler
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (street || city || zipCode) {
        updateMapFromAddress();
      }
    }, 1500); // Wait 1.5 seconds after user stops typing

    return () => clearTimeout(timeoutId);
  }, [street, city, zipCode]);

  const validateAndSave = () => {
    if (!street.trim() || !city.trim() || !zipCode.trim()) {
      Alert.alert('Incomplete Address', 'Please fill in all address fields');
      return;
    }

    // Save location data (you can integrate with your backend here)
    const locationData = {
      coordinates: markerLocation,
      address: {
        street: street.trim(),
        city: city.trim(),
        zipCode: zipCode.trim(),
      }
    };

    console.log('Saving location:', locationData);
    
    // Navigate to the next screen (probably Main app)
    navigation.navigate('Main');
  };

  const skipLocationSetup = () => {
    Alert.alert(
      'Skip Location Setup?',
      'You can set up your location later in settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: () => navigation.navigate('Main') }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header 
          title="Set Your Location" 
          onPress={() => navigation.goBack()}
        />
        
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.contentContainer}>
            <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}>
              Where are you located?
            </Text>
            
            <Text style={[styles.subtitle, { color: dark ? COLORS.gray : COLORS.gray2 }]}>
              Help us provide better service recommendations in your area
            </Text>

            {/* Map Section */}
            <View style={styles.mapSection}>
              <View style={[styles.mapContainer, { 
                borderColor: dark ? COLORS.dark3 : COLORS.grayscale200,
                backgroundColor: dark ? COLORS.dark2 : COLORS.grayscale200,
              }]}>
                <MapView
                  style={styles.map}
                  initialRegion={currentLocation}
                  region={currentLocation}
                  onPress={handleMapPress}
                  showsUserLocation={hasLocationPermission}
                  showsMyLocationButton={false}
                  mapType="standard"
                  onMapReady={() => console.log('Map is ready')}
                  onRegionChange={() => console.log('Region changed')}
                  loadingEnabled={true}
                  loadingIndicatorColor={COLORS.primary}
                  loadingBackgroundColor={dark ? COLORS.dark2 : COLORS.white}
                >
                  <Marker
                    coordinate={markerLocation}
                    draggable
                    onDragEnd={handleMapPress}
                  />
                </MapView>
              </View>

              <TouchableOpacity 
                style={[styles.locationButton, {
                  backgroundColor: COLORS.primary,
                  opacity: isLoadingLocation ? 0.7 : 1
                }]}
                onPress={getCurrentLocation}
                disabled={isLoadingLocation}
              >
                <Text style={styles.locationButtonText}>
                  {isLoadingLocation ? 'Getting Location...' : '📍 Use Current Location'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Address Input Section */}
            <View style={styles.addressSection}>
              <Text style={[styles.sectionTitle, { color: dark ? COLORS.white : COLORS.black }]}>
                Or Enter Address Manually
              </Text>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: dark ? COLORS.white : COLORS.black }]}>
                  Street Address
                </Text>
                <Input
                  id="street"
                  onInputChanged={(id, value) => setStreet(value)}
                  placeholder="123 Main Street"
                  placeholderTextColor={dark ? COLORS.grayTie : COLORS.gray2}
                  icon={icons.location}
                  value={street}
                  onChangeText={setStreet}
                />
                {isGeocodingAddress && (
                  <Text style={[styles.geocodingText, { color: COLORS.primary }]}>
                    🔍 Looking up address...
                  </Text>
                )}
              </View>

              <View style={styles.rowContainer}>
                <View style={styles.inputHalf}>
                  <Text style={[styles.inputLabel, { color: dark ? COLORS.white : COLORS.black }]}>
                    City
                  </Text>
                  <Input
                    id="city"
                    onInputChanged={(id, value) => setCity(value)}
                    placeholder="Your City"
                    placeholderTextColor={dark ? COLORS.grayTie : COLORS.gray2}
                    icon={icons.location2}
                    value={city}
                    onChangeText={setCity}
                  />
                </View>

                <View style={styles.inputHalf}>
                  <Text style={[styles.inputLabel, { color: dark ? COLORS.white : COLORS.black }]}>
                    ZIP Code
                  </Text>
                  <Input
                    id="zipCode"
                    onInputChanged={(id, value) => setZipCode(value)}
                    placeholder="12345"
                    placeholderTextColor={dark ? COLORS.grayTie : COLORS.gray2}
                    icon={icons.location3}
                    value={zipCode}
                    onChangeText={setZipCode}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Info Section */}
            <View style={styles.infoContainer}>
              <Text style={[styles.infoText, { color: dark ? COLORS.gray : COLORS.gray2 }]}>
                🔒 Your location information is kept secure and only used to improve your service experience
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Save Location"
            filled
            style={styles.saveButton}
            onPress={validateAndSave}
          />
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={skipLocationSetup}
          >
            <Text style={[styles.skipButtonText, { color: dark ? COLORS.gray : COLORS.gray2 }]}>
              Skip for now
            </Text>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: "bold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 12
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.gray2,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 22
  },
  mapSection: {
    marginBottom: 32,
  },
  mapContainer: {
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.grayscale200,
    marginBottom: 16,
    backgroundColor: COLORS.grayscale200,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapFallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grayscale200,
    borderRadius: 14,
  },
  mapFallbackText: {
    fontSize: 18,
    fontFamily: 'semiBold',
    color: COLORS.gray2,
    marginBottom: 8,
  },
  mapFallbackSubtext: {
    fontSize: 14,
    fontFamily: 'regular',
    color: COLORS.gray2,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  locationButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  locationButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'semiBold',
  },
  addressSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.black,
    marginBottom: 20,
    textAlign: "center"
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.black,
    marginBottom: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  inputHalf: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: COLORS.transparentTertiary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.gray2,
    textAlign: "center",
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  saveButton: {
    borderRadius: 32,
    marginBottom: 16,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.gray2,
  },
  geocodingText: {
    fontSize: 12,
    fontFamily: 'medium',
    color: COLORS.primary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default LocationSetup;
