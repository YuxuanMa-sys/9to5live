import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../constants';
import Header from '../components/Header';
import { useTheme } from '../theme/ThemeProvider';

const ReviewConfirm = ({ navigation, route }) => {
  const { colors, dark } = useTheme();
  
  // Get data from navigation params
  const { service, provider, selectedDate, selectedTime } = route.params || {};
  
  // Default values if no data is passed
  const serviceData = service || {
    name: "Haircut",
    price: "$30.00",
    duration: "45 minutes"
  };
  
  const providerData = provider || {
    name: "Urbana Barber",
    address: "2707 Milford Drive, Urbana, 61802",
    staff: "Vallen Thorpe"
  };

  // Get current date for consistent defaults
  const today = new Date();
  const defaultDate = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0].replace(/-/g, '/');
  
  const appointmentDate = selectedDate || defaultDate;
  const appointmentTime = selectedTime || "09:30";

  // Format date for display
  const formatDate = (dateString) => {
    // Parse the date string properly to avoid timezone issues
    const [year, month, day] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Calculate end time
  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const durationMinutes = parseInt(duration) || 45;
    
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Review and confirm" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Summary */}
        <View style={[styles.headerSummary, { backgroundColor: dark ? COLORS.dark2 : COLORS.primary + '10' }]}>
          <View style={styles.dateTimeContainer}>
            <Image source={icons.calendar} style={styles.headerIcon} />
            <View style={styles.dateTimeInfo}>
              <Text style={[styles.dateTimeText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
                {formatDate(appointmentDate)}
              </Text>
              <Text style={[styles.timeText, { color: COLORS.primary }]}>
                {appointmentTime}
              </Text>
            </View>
          </View>
          <View style={styles.providerContainer}>
            <Image source={icons.location} style={styles.headerIcon} />
            <View style={styles.providerInfo}>
              <Text style={[styles.providerName, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
                {providerData.name}
              </Text>
              <Text style={[styles.providerAddress, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>
                {providerData.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Service Details Card */}
        <View style={[styles.serviceCard, { backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale25 }]}>
          <View style={styles.serviceMainInfo}>
            <View style={styles.serviceLeft}>
              <Text style={[styles.serviceName, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
                {serviceData.name}
              </Text>
              <View style={styles.staffContainer}>
                <Image source={icons.people} style={styles.staffIcon} />
                <Text style={[styles.staffInfo, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>
                  {providerData.staff}
                </Text>
              </View>
            </View>
            <View style={styles.serviceRight}>
              <Text style={[styles.servicePrice, { color: COLORS.primary }]}>
                {serviceData.price}
              </Text>
              <View style={styles.timeContainer}>
                <Image source={icons.timeCircle} style={styles.timeIcon} />
                <Text style={[styles.serviceDuration, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>
                  {appointmentTime} - {calculateEndTime(appointmentTime, serviceData.duration)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment & Total Section */}
        <View style={styles.paymentSection}>
          {/* Total Summary */}
          <View style={[styles.totalCard, { backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale50 }]}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
                Service Cost
              </Text>
              <Text style={[styles.totalValue, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
                {serviceData.price}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
                Booking Fee
              </Text>
              <Text style={[styles.totalValue, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
                $2.10
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={[styles.finalTotalLabel, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
                Total
              </Text>
              <Text style={[styles.finalTotalAmount, { color: COLORS.primary }]}>
                $32.10
              </Text>
            </View>
          </View>

          {/* Payment Info */}
          <View style={[styles.paymentCard, { backgroundColor: dark ? COLORS.dark2 : COLORS.primary + '08' }]}>
            <View style={styles.paymentHeader}>
              <Image source={icons.shield} style={styles.paymentIcon} />
              <View style={styles.paymentTextContainer}>
                <Text style={[styles.paymentTitle, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
                  Secure your spot now, pay later
                </Text>
                <Text style={[styles.paymentDescription, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>
                  Confirm your booking now and pay once your service is completed.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirm & Book Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => navigation.navigate("AppointmentConfirmed", {
            service: serviceData,
            provider: providerData,
            selectedDate: formatDate(appointmentDate),
            selectedTime: appointmentTime
          })}
        >
          <Text style={styles.confirmButtonText}>Confirm & Book</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  headerSummary: {
    marginBottom: SIZES.padding * 2,
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius * 1.2,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding * 1.5,
  },
  headerIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: COLORS.primary,
  },
  dateTimeInfo: {
    flex: 1,
  },
  dateTimeText: {
    ...FONTS.h3,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeText: {
    ...FONTS.h4,
    fontWeight: '600',
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    ...FONTS.h4,
    fontWeight: '600',
    marginBottom: 4,
  },
  providerAddress: {
    ...FONTS.body3,
  },
  serviceCard: {
    marginBottom: SIZES.padding * 2,
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius * 1.2,
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  serviceMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceLeft: {
    flex: 1,
  },
  serviceRight: {
    alignItems: 'flex-end',
  },
  serviceName: {
    ...FONTS.h3,
    fontWeight: 'bold',
    marginBottom: SIZES.padding * 0.8,
  },
  staffContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: COLORS.grayscale500,
  },
  staffInfo: {
    ...FONTS.body3,
  },
  servicePrice: {
    ...FONTS.h3,
    fontWeight: 'bold',
    marginBottom: SIZES.padding * 0.8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: COLORS.grayscale500,
  },
  serviceDuration: {
    ...FONTS.body3,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.greyscale200,
    marginVertical: SIZES.padding * 1.2,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentSection: {
    marginBottom: SIZES.padding * 2,
  },
  totalCard: {
    marginBottom: SIZES.padding,
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius * 1.2,
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding * 0.8,
  },
  totalLabel: {
    ...FONTS.body3,
    fontWeight: '500',
  },
  totalValue: {
    ...FONTS.body3,
    fontWeight: '600',
  },
  finalTotalLabel: {
    ...FONTS.h4,
    fontWeight: '600',
  },
  finalTotalAmount: {
    ...FONTS.h4,
    fontWeight: 'bold',
  },
  paymentCard: {
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius * 1.2,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  paymentIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    marginTop: 2,
    tintColor: COLORS.primary,
  },
  paymentTextContainer: {
    flex: 1,
  },
  paymentTitle: {
    ...FONTS.h4,
    fontWeight: '600',
    marginBottom: SIZES.padding * 0.5,
  },
  paymentDescription: {
    ...FONTS.body3,
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding * 1.4,
    borderRadius: SIZES.radius * 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  confirmButtonText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default ReviewConfirm; 