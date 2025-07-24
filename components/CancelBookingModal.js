import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { COLORS, FONTS } from '../constants';
import BookingCard from './BookingCard';

const CancelBookingModal = ({ visible, onDismiss, onReschedule, onCancel, booking }) => {
  const { dark } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onDismiss}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          <View style={[styles.modal, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}> 
            {/* Dismiss button */}
            <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
              <Text style={styles.dismissText}>Dismiss</Text>
            </TouchableOpacity>
            {/* Title */}
            <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Prefer to reschedule?</Text>
            {/* Message */}
            <Text style={[styles.message, { color: dark ? COLORS.greyscale900 : COLORS.greyscale900 }]}>We get it, plans change - but remember if you need to change the date or time you can simply reschedule your appointment to avoid missing out.</Text>
            <Text style={[styles.message, { color: dark ? COLORS.greyscale900 : COLORS.greyscale900, marginBottom: 18 }]}>Are you sure you want to cancel your appointment?</Text>
            {/* Booking Card */}
            <View style={styles.cardWrapper}>
              <BookingCard booking={booking} />
            </View>
            {/* Action Buttons */}
            <TouchableOpacity style={styles.rescheduleBtn} onPress={onReschedule}>
              <Text style={styles.rescheduleText}>Reschedule appointment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel appointment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '94%',
    borderRadius: 18,
    padding: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'stretch',
  },
  dismissBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 2,
  },
  dismissText: {
    ...FONTS.body3,
    color: COLORS.error,
    fontWeight: '600',
  },
  title: {
    ...FONTS.h2,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 12,
  },
  message: {
    ...FONTS.body3,
    marginBottom: 4,
  },
  cardWrapper: {
    marginVertical: 18,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    width: '100%',
  },
  rescheduleBtn: {
    backgroundColor: COLORS.info,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  rescheduleText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: '600',
  },
  cancelBtn: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.error,
  },
  cancelText: {
    ...FONTS.h4,
    color: COLORS.error,
    fontWeight: '600',
  },
});

export default CancelBookingModal; 