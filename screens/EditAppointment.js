import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { COLORS, SIZES, FONTS, icons } from '../constants';
import Header from '../components/Header';
import DatePickerView from '../components/DatePickerView';
import { getFormatedDate } from "react-native-modern-datepicker";
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditAppointment = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { booking } = route.params || {};

  // Pre-fill with booking info
  const serviceData = booking?.service || { name: "Haircut", price: "$30.00", duration: "45 minutes" };
  const providerData = booking?.provider || { name: "Urbana Barber", address: "2707 Milford Drive, Urbana, 61802", staff: "Vallen Thorpe" };
  const [selectedDate, setSelectedDate] = useState(booking?.selectedDate || getFormatedDate(new Date(), "YYYY/MM/DD"));
  const [selectedTime, setSelectedTime] = useState(booking?.selectedTime || "09:30");

  // Set minimum selectable date to today
  const today = new Date();
  const minDate = getFormatedDate(today, "YYYY/MM/DD");

  // Handle date change
  const handleDateChange = (date) => {
    const [year, month, day] = date.split('/').map(Number);
    const formattedDate = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    setSelectedDate(formattedDate);
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Calculate end time based on start time and duration
  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const durationMinutes = parseInt(duration) || 45;
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  // Available time slots
  const timeSlots = ["09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00"];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <Header title="Edit appointment" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <DatePickerView
            startDate={minDate}
            selectedDate={selectedDate}
            onChangeStartDate={handleDateChange}
          />
        </View>
        {/* Time Slots Section */}
        <View style={styles.timeSlotsSection}>
          <Text style={[styles.sectionTitle, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Available Times</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeSlotsContainer}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[styles.timeSlotButton, selectedTime === time && styles.selectedTimeSlotButton, { backgroundColor: selectedTime === time ? COLORS.primary : (dark ? COLORS.dark2 : COLORS.white) }]}
                onPress={() => handleTimeSelect(time)}
              >
                <Text style={[styles.timeSlotText, { color: selectedTime === time ? COLORS.white : (dark ? COLORS.white : COLORS.greyscale900) }]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* Service Details Card */}
        <View style={[styles.serviceCard, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}> 
          <View style={styles.serviceHeader}>
            <Text style={[styles.serviceName, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>{serviceData.name}</Text>
            <Text style={[styles.servicePrice, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>{serviceData.price}</Text>
          </View>
          <Text style={[styles.serviceDuration, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>{selectedTime} - {calculateEndTime(selectedTime, serviceData.duration)}</Text>
          <View style={styles.divider} />
          <View style={styles.staffSection}>
            <Text style={[styles.staffLabel, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>Staff:</Text>
            <View style={styles.staffInfo}>
              <Image source={icons.people} style={styles.staffIcon} />
              <Text style={[styles.staffName, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>{providerData.staff}</Text>
            </View>
          </View>
        </View>
        {/* Save Changes Button */}
        <View style={styles.continueSection}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => navigation.navigate('EditReviewConfirm', {
              booking,
              updatedService: serviceData,
              updatedProvider: providerData,
              updatedDate: selectedDate,
              updatedTime: selectedTime
            })}
          >
            <Text style={styles.continueButtonText}>Save changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, paddingHorizontal: SIZES.padding },
  calendarSection: { marginBottom: SIZES.padding * 2 },
  timeSlotsSection: { marginBottom: SIZES.padding * 2 },
  sectionTitle: { ...FONTS.h4, fontWeight: 'bold', marginBottom: SIZES.padding },
  timeSlotsContainer: { flexDirection: 'row', alignItems: 'center' },
  timeSlotButton: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 16, marginRight: 12, borderWidth: 1, borderColor: COLORS.greyscale300 },
  selectedTimeSlotButton: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeSlotText: { ...FONTS.body3, fontWeight: '600' },
  serviceCard: { marginBottom: SIZES.padding * 2, padding: SIZES.padding, borderRadius: SIZES.radius, borderWidth: 1, borderColor: COLORS.greyscale300 },
  serviceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  serviceName: { ...FONTS.h4, fontWeight: 'bold' },
  servicePrice: { ...FONTS.h3, fontWeight: 'bold' },
  serviceDuration: { ...FONTS.body4, marginBottom: SIZES.padding },
  divider: { height: 1, backgroundColor: COLORS.greyscale300, marginVertical: SIZES.padding },
  staffSection: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.padding },
  staffLabel: { ...FONTS.body4, marginRight: 8 },
  staffInfo: { flexDirection: 'row', alignItems: 'center' },
  staffIcon: { width: 16, height: 16, marginRight: 4, tintColor: COLORS.grayscale400 },
  staffName: { ...FONTS.body3 },
  continueSection: { marginBottom: SIZES.padding * 2 },
  continueButton: { backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  continueButtonText: { ...FONTS.h4, color: COLORS.white, fontWeight: 'bold' },
});

export default EditAppointment; 