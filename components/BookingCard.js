import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS, SIZES, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

const BookingCard = ({ booking, onPress }) => {
  const { dark } = useTheme();

  const getMonthAbbreviation = (dateString) => {
    if (!dateString) return '';
    try {
      let date;
      if (typeof dateString === 'string' && dateString.includes('/')) {
        const [year, month, day] = dateString.split('/').map(Number);
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(dateString);
      }
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleDateString('en-US', { month: 'short' });
    } catch (error) {
      return '';
    }
  };

  const getDay = (dateString) => {
    if (!dateString) return '';
    try {
      let date;
      if (typeof dateString === 'string' && dateString.includes('/')) {
        const [year, month, day] = dateString.split('/').map(Number);
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(dateString);
      }
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.getDate().toString();
    } catch (error) {
      return '';
    }
  };

  // Defensive log for provider
  console.log('BookingCard provider:', booking.provider);
  // Debug log for selectedDate
  console.log('BookingCard selectedDate:', booking.selectedDate);

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Left Section - Service and Provider Details */}
      <View style={styles.leftSection}>
        {/* Confirmation Status Badge */}
        <View style={styles.confirmedBadge}>
          <Text style={styles.confirmedText}>Confirmed</Text>
        </View>
        {/* Service Name */}
        <Text style={[styles.serviceName, { color: dark ? COLORS.white : COLORS.greyscale900 }]}> 
          {booking.service?.name || 'Haircut'}
        </Text>
        {/* Staff Name */}
        <Text style={[styles.staffName, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}> 
          with {booking.provider?.staff || 'Vallen Thorpe'}
        </Text>
        {/* Provider Information */}
        <View style={styles.providerContainer}>
          <Image 
            source={icons.people} 
            style={styles.providerIcon}
            resizeMode="contain"
          />
          <Text style={[styles.providerName, { color: dark ? COLORS.white : COLORS.greyscale900 }]}> 
            {(typeof booking.provider?.name === 'string' ? booking.provider.name : 'Urbana Barber')}
          </Text>
        </View>
      </View>
      {/* Date Section: Month, Day, Time */}
      <View style={styles.dateSection}>
        <Text style={styles.dateMonth}>
          {getMonthAbbreviation(booking.selectedDate).toUpperCase()}
        </Text>
        <Text style={styles.dateDay}>
          {getDay(booking.selectedDate)}
        </Text>
        <View style={styles.timePill}>
          <Text style={styles.timePillText}>{booking.selectedTime || '09:30'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius * 2,
    marginBottom: SIZES.padding * 1.2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.greyscale200,
    minHeight: 110,
  },
  leftSection: {
    flex: 1,
    paddingRight: SIZES.padding,
    justifyContent: 'center',
  },
  confirmedBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  confirmedText: {
    ...FONTS.body5,
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  serviceName: {
    ...FONTS.h3,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  staffName: {
    ...FONTS.body4,
    marginBottom: 10,
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  providerIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
    tintColor: COLORS.greyscale700,
    opacity: 0.85,
  },
  providerName: {
    ...FONTS.body3,
    fontWeight: '600',
  },
  dateSection: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    marginLeft: 8,
  },
  dateMonth: {
    ...FONTS.body4,
    color: COLORS.greyscale700,
    fontWeight: '600',
    marginBottom: 0,
    letterSpacing: 1,
  },
  dateDay: {
    ...FONTS.h1,
    color: COLORS.greyscale900,
    fontWeight: 'bold',
    marginBottom: 0,
    lineHeight: 44,
  },
  timePill: {
    backgroundColor: COLORS.primary + '22',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 4,
  },
  timePillText: {
    ...FONTS.body3,
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BookingCard; 