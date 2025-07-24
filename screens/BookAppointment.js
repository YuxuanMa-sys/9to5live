import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../constants';
import Header from '../components/Header';
import DatePickerView from '../components/DatePickerView';
import { getFormatedDate } from "react-native-modern-datepicker";
import { hoursData } from '../data';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';

const BookAppointment = ({ navigation, route }) => {
  const [selectedDate, setSelectedDate] = useState("2025/08/02");
  const [selectedTime, setSelectedTime] = useState("09:30");
  const { colors, dark } = useTheme();
  
  // Get service and provider data from navigation params
  const { service, provider } = route.params || {};
  
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

  // Get current date for minimum date selection
  const today = new Date();
  const startDate = getFormatedDate(
    new Date(today.setDate(today.getDate() + 1)),
    "YYYY/MM/DD"
  );

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Calculate end time based on start time and duration
  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const durationMinutes = parseInt(duration) || 45; // Default to 45 minutes
    
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  // Render time slot item
  const renderTimeSlot = (time) => {
    const isSelected = selectedTime === time;
    return (
      <TouchableOpacity
        key={time}
        style={[
          styles.timeSlotButton,
          isSelected && styles.selectedTimeSlotButton,
          { backgroundColor: isSelected ? COLORS.primary : (dark ? COLORS.dark2 : COLORS.white) }
        ]}
        onPress={() => handleTimeSelect(time)}
      >
        <Text style={[
          styles.timeSlotText,
          { color: isSelected ? COLORS.white : (dark ? COLORS.white : COLORS.greyscale900) }
        ]}>
          {time}
        </Text>
      </TouchableOpacity>
    );
  };

  // Available time slots (matching the reference screenshot)
  const timeSlots = ["09:30", "09:45", "10:00", "10:15", "10:30", "10:45"];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Book an Appointment" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <Text style={[styles.monthYear, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
            August 2025
          </Text>
          <DatePickerView
            startDate={startDate}
            selectedDate={selectedDate}
            onChangeStartDate={handleDateChange}
          />
        </View>

        {/* Time Slots Section */}
        <View style={styles.timeSlotsSection}>
          <Text style={[styles.sectionTitle, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
            Available Times
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeSlotsContainer}
          >
            {timeSlots.map((time) => renderTimeSlot(time))}
          </ScrollView>
        </View>

        {/* Service Details Card */}
        <View style={[styles.serviceCard, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
          <View style={styles.serviceHeader}>
            <Text style={[styles.serviceName, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
              {serviceData.name}
            </Text>
            <Text style={[styles.servicePrice, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
              {serviceData.price}
            </Text>
          </View>
          
          <Text style={[styles.serviceDuration, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>
            {selectedTime} - {calculateEndTime(selectedTime, serviceData.duration)}
          </Text>
          
          <View style={styles.divider} />
          
          <View style={styles.staffSection}>
            <Text style={[styles.staffLabel, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>
              Staff:
            </Text>
            <View style={styles.staffInfo}>
              <Image source={icons.people} style={styles.staffIcon} />
              <Text style={[styles.staffName, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
                {providerData.staff}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons Outside Card */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.addServiceButton}>
            <Image source={icons.plus} style={styles.addIcon} />
            <Text style={[styles.addServiceText, { color: COLORS.primary }]}>
              Add another service
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.noteButton}>
            <Image source={icons.chat} style={styles.noteIcon} />
            <Text style={[styles.noteText, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>
              Leave a note (optional)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Appointment Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
          <View style={styles.summaryContent}>
            <Text style={[styles.summaryLabel, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>
              Appointment Summary
            </Text>
            <View style={styles.summaryDetails}>
              <Text style={[styles.summaryPrice, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
                $32.10
              </Text>
              <Text style={[styles.summaryDuration, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>
                45 minutes
              </Text>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.continueSection}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => navigation.navigate("ReviewConfirm", {
              service: serviceData,
              provider: providerData,
              selectedDate: selectedDate,
              selectedTime: selectedTime
            })}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacySection}>
          <Text style={[styles.privacyText, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>
            Your personal data will be processed by the partner with whom you are booking an appointment. 
            You can find more information{' '}
            <Text style={[styles.privacyLink, { color: COLORS.primary }]}>
              here
            </Text>
            .
          </Text>
        </View>
      </ScrollView>
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
  },
  calendarSection: {
    marginBottom: SIZES.padding * 2,
  },
  monthYear: {
    ...FONTS.h3,
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  serviceCard: {
    marginBottom: SIZES.padding * 2,
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 0.5,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  serviceName: {
    ...FONTS.h4,
    fontWeight: 'bold',
  },
  servicePrice: {
    ...FONTS.h3,
    fontWeight: 'bold',
  },
  serviceDuration: {
    ...FONTS.body4,
    marginBottom: SIZES.padding,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.greyscale300,
    marginVertical: SIZES.padding,
  },
  staffSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  staffLabel: {
    ...FONTS.body4,
    marginRight: 8,
  },
  staffInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staffIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
    tintColor: COLORS.grayscale400,
  },
  staffName: {
    ...FONTS.body4,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    marginBottom: SIZES.padding * 2,
    alignItems: 'center',
  },
  addServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  addIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: COLORS.primary,
  },
  addServiceText: {
    ...FONTS.body4,
    fontWeight: '500',
  },
  noteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: COLORS.grayscale400,
  },
  noteText: {
    ...FONTS.body4,
  },
  timeSlotsSection: {
    marginBottom: SIZES.padding * 2,
  },
  sectionTitle: {
    ...FONTS.h4,
    marginBottom: SIZES.padding,
  },
  timeSlotsContainer: {
    paddingHorizontal: SIZES.padding,
  },
  timeSlotButton: {
    paddingHorizontal: SIZES.padding * 1.5,
    paddingVertical: SIZES.padding,
    marginRight: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTimeSlotButton: {
    borderColor: COLORS.primary,
  },
  timeSlotText: {
    ...FONTS.body4,
    fontWeight: '500',
  },
  summaryCard: {
    marginBottom: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.greyscale300,
  },
  summaryContent: {
    alignItems: 'center',
  },
  summaryLabel: {
    ...FONTS.body4,
    marginBottom: SIZES.padding * 0.5,
    fontWeight: '500',
  },
  summaryDetails: {
    alignItems: 'center',
  },
  summaryPrice: {
    ...FONTS.h2,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryDuration: {
    ...FONTS.body4,
  },
  continueSection: {
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: '600',
  },
  privacySection: {
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  privacyText: {
    ...FONTS.body5,
    textAlign: 'center',
    lineHeight: 20,
  },
  privacyLink: {
    textDecorationLine: 'underline',
  },
});

export default BookAppointment; 