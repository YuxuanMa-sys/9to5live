import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { COLORS, FONTS, SIZES, icons } from '../constants';

const AppointmentConfirmed = ({ navigation, route }) => {
  const { dark } = useTheme();
  
  // Get data from previous screen
  const { service, provider, selectedDate, selectedTime } = route.params || {};
  
  // Debug: Log the received data
  console.log('AppointmentConfirmed - Received data:', { selectedDate, selectedTime, service, provider });
  
  const formatDate = (dateString) => {
    if (!dateString) {
      // Get tomorrow's date as fallback
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    // If it's already a formatted string, return it
    if (typeof dateString === 'string' && (dateString.includes('August') || dateString.includes('Friday') || dateString.includes('Monday') || dateString.includes('Tuesday') || dateString.includes('Wednesday') || dateString.includes('Thursday') || dateString.includes('Saturday') || dateString.includes('Sunday'))) {
      return dateString;
    }
    
    // Try to parse and format the date
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Get tomorrow's date as fallback
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      // Get tomorrow's date as fallback
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const handleTurnOnNotifications = () => {
    // Handle notification permission request
    console.log('Turn on notifications pressed');
  };

  const handleGotIt = () => {
    // Navigate back to home or bookings
    console.log('Ok, Got It pressed - navigating to Home');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Confirmation Header Section */}
        <View style={styles.confirmationSection}>
          {/* Success Icon */}
          <View style={styles.successIconContainer}>
            <View style={styles.successIcon}>
              <Image source={icons.check} style={styles.checkIcon} />
            </View>
          </View>
          
          {/* Confirmation Text */}
          <Text style={[styles.confirmationTitle, { color: COLORS.success }]}>
            APPOINTMENT CONFIRMED
          </Text>
          
          {/* Appointment Details */}
          <Text style={[styles.appointmentDateTime, { color: COLORS.success }]}>
            {formatDate(selectedDate)} • {selectedTime}
          </Text>
          
          {/* Add Reminder */}
          <TouchableOpacity style={styles.addReminderContainer}>
            <Image source={icons.calendar} style={styles.addReminderIcon} />
            <Text style={[styles.addReminderText, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>
              Add Reminder
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reminder Card */}
        <View style={[styles.reminderCard, { backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale25 }]}>
          <View style={styles.reminderHeader}>
            <Image source={icons.bell} style={styles.reminderIcon} />
            <Text style={[styles.reminderTitle, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
              Need an extra reminder?
            </Text>
          </View>
          <Text style={[styles.reminderDescription, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>
            Turn on notifications for a reminder when your appointment is close and any updates. We'll only send essential booking info — nothing more.
          </Text>
        </View>

        {/* Informational Text */}
        <View style={styles.infoSection}>
          <Text style={[styles.infoText, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>
            You don't need to do anything else! We will send you a text reminder before the appointment.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: COLORS.primary }]}
          onPress={handleTurnOnNotifications}
        >
          <Text style={[styles.primaryButtonText, { color: COLORS.white }]}>
            Turn on notifications
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.secondaryButton, { 
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            borderColor: COLORS.greyscale300
          }]}
          onPress={handleGotIt}
        >
          <Text style={[styles.secondaryButtonText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
            Ok, Got It
          </Text>
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
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding * 3,
    paddingBottom: SIZES.padding * 2,
  },
  confirmationSection: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 3,
  },
  successIconContainer: {
    marginBottom: SIZES.padding * 1.5,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.success,
  },
  checkIcon: {
    width: 40,
    height: 40,
    tintColor: COLORS.success,
  },
  confirmationTitle: {
    ...FONTS.h2,
    fontWeight: 'bold',
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  appointmentDateTime: {
    ...FONTS.h4,
    fontWeight: '600',
    marginBottom: SIZES.padding * 1.5,
    textAlign: 'center',
  },
  addReminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 0.5,
  },
  addReminderIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: COLORS.greyscale500,
  },
  addReminderText: {
    ...FONTS.body3,
    fontWeight: '500',
  },
  reminderCard: {
    marginBottom: SIZES.padding * 2,
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius * 1.2,
    borderWidth: 1,
    borderColor: COLORS.greyscale200,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  reminderIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: COLORS.primary,
  },
  reminderTitle: {
    ...FONTS.h4,
    fontWeight: '600',
    flex: 1,
  },
  reminderDescription: {
    ...FONTS.body3,
    lineHeight: 22,
  },
  infoSection: {
    marginBottom: SIZES.padding * 2,
  },
  infoText: {
    ...FONTS.body3,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  primaryButton: {
    paddingVertical: SIZES.padding * 1.2,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryButtonText: {
    ...FONTS.h4,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: SIZES.padding * 1.2,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonText: {
    ...FONTS.h4,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AppointmentConfirmed; 