import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

const AddressSearch = ({ navigation, route }) => {
  const { dark, colors } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addressType, editMode, existingAddress } = route.params || { addressType: 'Home' };

  const GOOGLE_MAPS_API_KEY = 'AIzaSyCG_D04L0qHBHmsa8LpcVmzKPxJKCnXxTk';

  // Search addresses using Google Places API
  const searchAddresses = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}&types=address&components=country:us`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        const formattedResults = data.predictions.map((prediction, index) => ({
          id: index.toString(),
          address: prediction.structured_formatting?.main_text || prediction.description,
          city: prediction.structured_formatting?.secondary_text || '',
          fullAddress: prediction.description,
          placeId: prediction.place_id
        }));
        setSearchResults(formattedResults);
      } else {
        console.log('Google Places API error:', data.status);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      // Fallback to mock data if API fails
      const mockAddresses = [
        { id: '1', address: '3140 Gracefield Road', city: 'Beltsville, MD', fullAddress: '3140 Gracefield Road, Beltsville, MD' },
        { id: '2', address: '3140 Wisconsin Avenue Northwest', city: 'Washington, DC', fullAddress: '3140 Wisconsin Avenue Northwest, Washington, DC' },
        { id: '3', address: '3140 Windsong Drive', city: 'Oakton, VA', fullAddress: '3140 Windsong Drive, Oakton, VA' },
        { id: '4', address: '3140 Bayswater Court', city: 'Fairfax, VA', fullAddress: '3140 Bayswater Court, Fairfax, VA' },
      ];
      const filtered = mockAddresses.filter(address => 
        address.address.toLowerCase().includes(query.toLowerCase()) ||
        address.city.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchAddresses(searchText);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const handleUseMyLocation = () => {
    // Navigate to address confirmation screen with current location
    navigation.navigate('AddressConfirm', {
      addressType,
      address: 'Your Current Location, Boone, NC',
      isCurrentLocation: true
    });
  };

  const handleSearchResult = (address) => {
    // Navigate to appropriate confirmation screen based on address type
    if (addressType === 'Custom') {
      navigation.navigate('CustomAddressConfirm', {
        address: address.fullAddress || `${address.address}, ${address.city}`,
        isCurrentLocation: false,
        placeId: address.placeId,
        editMode,
        existingAddress
      });
    } else {
      navigation.navigate('AddressConfirm', {
        addressType,
        address: address.fullAddress || `${address.address}, ${address.city}`,
        isCurrentLocation: false,
        placeId: address.placeId,
        editMode,
        existingAddress
      });
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchResults([]);
  };

  const renderAddressItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.addressItem}
      onPress={() => handleSearchResult(item)}
    >
      <View style={styles.addressIconContainer}>
        <Image 
          source={icons.location} 
          style={styles.addressIcon}
          resizeMode='contain'
        />
      </View>
      <View style={styles.addressContent}>
        <Text style={[styles.addressText, { 
          color: dark ? COLORS.white : COLORS.greyscale900
        }]}>
          {item.address}
        </Text>
        <Text style={[styles.cityText, { 
          color: dark ? COLORS.grayscale400 : COLORS.grayscale600
        }]}>
          {item.city}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
          
          <View style={[styles.searchInputContainer, { 
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            borderColor: dark ? COLORS.greyScale800 : COLORS.grayscale200
          }]}>
            <TextInput
              style={[styles.searchInput, { 
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}
              placeholder="Start typing address"
              placeholderTextColor={dark ? COLORS.grayscale400 : COLORS.grayscale500}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus={true}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Image 
                  source={icons.close} 
                  style={styles.clearIcon}
                  resizeMode='contain'
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Use My Location Option */}
        <TouchableOpacity 
          style={styles.locationOption}
          onPress={handleUseMyLocation}
        >
          <View style={styles.locationIconContainer}>
            <Image 
              source={icons.location} 
              style={styles.locationIcon}
              resizeMode='contain'
            />
          </View>
          <Text style={[styles.locationText, { 
            color: COLORS.primary 
          }]}>
            Use my location
          </Text>
        </TouchableOpacity>

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { 
              color: dark ? COLORS.grayscale400 : COLORS.grayscale500
            }]}>
              Searching addresses...
            </Text>
          </View>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && !isLoading && (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={renderAddressItem}
            style={styles.searchResultsList}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200
  },
  backButton: {
    marginRight: 16
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'medium',
    paddingVertical: 8
  },
  clearButton: {
    padding: 4
  },
  clearIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.grayscale500
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8
  },
  locationIconContainer: {
    marginRight: 16
  },
  locationIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.primary
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'medium',
    color: COLORS.grayscale500
  },
  searchResultsList: {
    flex: 1,
    marginTop: 8
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale100
  },
  addressIconContainer: {
    marginRight: 16
  },
  addressIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.grayscale500
  },
  addressContent: {
    flex: 1
  },
  addressText: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.greyscale900,
    marginBottom: 4
  },
  cityText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: COLORS.grayscale600
  }
});

export default AddressSearch;
