import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import Input from './Input';

const COUNTRIES = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'AE', name: 'UAE', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵' },
];

const CountryCodePicker = ({ visible, onClose, onSelect, selectedCountry }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { colors, dark } = useTheme();

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery)
  );

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.countryItem, { 
        backgroundColor: colors.background,
        borderBottomColor: dark ? COLORS.dark3 : COLORS.grayscale200 
      }]}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <View style={styles.countryContent}>
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.countryInfo}>
          <Text style={[styles.countryName, { 
            color: dark ? COLORS.white : COLORS.black 
          }]}>
            {item.name}
          </Text>
          <Text style={[styles.countryCode, { 
            color: dark ? COLORS.gray : COLORS.gray2 
          }]}>
            {item.code}
          </Text>
        </View>
        <Text style={[styles.dialCode, { 
          color: dark ? COLORS.white : COLORS.black 
        }]}>
          {item.dialCode}
        </Text>
      </View>
      {selectedCountry?.code === item.code && (
        <Image 
          source={icons.check} 
          style={[styles.checkIcon, { tintColor: COLORS.primary }]} 
        />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Image 
              source={icons.arrowLeft} 
              style={[styles.closeIcon, { 
                tintColor: dark ? COLORS.white : COLORS.black 
              }]} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { 
            color: dark ? COLORS.white : COLORS.black 
          }]}>
            Select Country
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.searchContainer}>
          <Input
            id="search"
            onInputChanged={(id, value) => setSearchQuery(value)}
            placeholder="Search country"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.gray2}
            icon={icons.search}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.code}
          renderItem={renderCountryItem}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.black,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'bold',
    color: COLORS.black,
  },
  placeholder: {
    width: 36,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  list: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale200,
    backgroundColor: COLORS.white,
  },
  countryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.black,
    marginBottom: 2,
  },
  countryCode: {
    fontSize: 14,
    fontFamily: 'regular',
    color: COLORS.gray2,
  },
  dialCode: {
    fontSize: 16,
    fontFamily: 'medium',
    color: COLORS.black,
    marginRight: 8,
  },
  checkIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
  },
});

export default CountryCodePicker;
