import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import CancelBookingModal from '../components/CancelBookingModal';

const BookingDetails = () => {
  const { dark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { booking } = route.params || {};

  const [showCancelModal, setShowCancelModal] = React.useState(false);

  // Fake coordinates for Urbana, IL
  const latitude = booking.provider?.latitude || 40.1106;
  const longitude = booking.provider?.longitude || -88.2073;

  const handleReschedule = () => {
    setShowCancelModal(false);
    navigation.navigate('EditAppointment', { booking });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}> 
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={icons.arrowLeft} style={[styles.headerIcon, { tintColor: dark ? COLORS.white : COLORS.greyscale900 }]} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: dark ? COLORS.white : COLORS.greyscale900 }]}> 
            {booking.selectedTime}  B7 {booking.selectedDate}
          </Text>
          <TouchableOpacity>
            <Image source={icons.calendar} style={[styles.headerIcon, { tintColor: dark ? COLORS.white : COLORS.greyscale900 }]} />
          </TouchableOpacity>
        </View>
        {/* Status Badge */}
        <View style={styles.statusBadge}><Text style={styles.statusText}>Confirmed</Text></View>
        {/* Map Section */}
        <View style={styles.mapSection}>
          <MapView
            style={styles.mapImage}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker
              coordinate={{ latitude, longitude }}
              title={booking.provider?.name || 'Urbana Barber'}
              description={booking.provider?.address || ''}
            />
          </MapView>
          <View style={[styles.providerCard, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}> 
            <Image source={booking.provider?.image || images.avatar} style={styles.providerAvatar} />
            <View style={styles.providerInfo}>
              <Text style={[styles.providerName, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>{booking.provider?.name || 'Urbana Barber'}</Text>
              <Text style={[styles.providerAddress, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>{booking.provider?.address || '2707 Milford Drive, Urbana, 61802'}</Text>
            </View>
            <TouchableOpacity style={styles.mapNavBtn}>
              <Image source={icons.location} style={styles.mapNavIcon} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Service Info */}
        <View style={styles.serviceSection}>
          <View style={styles.serviceRow}>
            <Text style={[styles.serviceName, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>{booking.service?.name || 'Haircut'}</Text>
            <Text style={[styles.servicePrice, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>{booking.service?.price || '$30.00'}</Text>
          </View>
          <View style={styles.staffRow}>
            <Image source={icons.people} style={styles.staffIcon} />
            <Text style={[styles.staffName, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}>{booking.provider?.staff || 'Vallen Thorpe'}</Text>
          </View>
          <Text style={[styles.serviceTime, { color: dark ? COLORS.grayscale400 : COLORS.greyscale600 }]}> 
            {booking.selectedTime} - {/* End time calculation */}
            {(() => {
              if (!booking.selectedTime || !booking.service?.duration) return '';
              const [h, m] = booking.selectedTime.split(':').map(Number);
              const mins = parseInt(booking.service.duration) || 45;
              const end = new Date(2000, 0, 1, h, m + mins);
              return `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
            })()}
          </Text>
        </View>
      </ScrollView>
      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.cancelBtn, { borderColor: COLORS.error }]} onPress={() => setShowCancelModal(true)}>
          <Text style={[styles.cancelBtnText, { color: COLORS.error }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.changeBtn} onPress={() => navigation.navigate('EditAppointment', { booking })}>
          <Text style={[styles.changeBtnText, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Change</Text>
        </TouchableOpacity>
      </View>
      <CancelBookingModal
        visible={showCancelModal}
        onDismiss={() => setShowCancelModal(false)}
        onReschedule={handleReschedule}
        onCancel={() => setShowCancelModal(false)}
        booking={booking}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    marginBottom: 8,
  },
  headerIcon: { width: 28, height: 28 },
  headerTitle: { ...FONTS.h3, fontWeight: '600' },
  statusBadge: {
    alignSelf: 'center',
    backgroundColor: COLORS.success + '20',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 4,
    marginBottom: 10,
  },
  statusText: { ...FONTS.body3, color: COLORS.success, fontWeight: '700' },
  mapSection: { marginHorizontal: 0, marginBottom: 18 },
  mapImage: { width: '100%', height: 120, borderRadius: 12 },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 18,
    right: 18,
    top: 80,
    borderRadius: 16,
    padding: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  providerAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  providerInfo: { flex: 1 },
  providerName: { ...FONTS.h4, fontWeight: '700' },
  providerAddress: { ...FONTS.body4, marginTop: 2 },
  mapNavBtn: { padding: 8 },
  mapNavIcon: { width: 22, height: 22, tintColor: COLORS.primary },
  serviceSection: { marginTop: 32, paddingHorizontal: 18 },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  serviceName: { ...FONTS.h4, fontWeight: '700' },
  servicePrice: { ...FONTS.h4, fontWeight: '700' },
  staffRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  staffIcon: { width: 18, height: 18, marginRight: 6, tintColor: COLORS.grayscale500 },
  staffName: { ...FONTS.body4 },
  serviceTime: { ...FONTS.body4, marginTop: 2 },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  cancelBtnText: { ...FONTS.h4, fontWeight: '600' },
  changeBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    marginLeft: 10,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.greyscale200,
  },
  changeBtnText: { ...FONTS.h4, fontWeight: '600' },
});

export default BookingDetails;