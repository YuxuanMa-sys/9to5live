import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DatePicker from "react-native-modern-datepicker";
import { COLORS, SIZES } from '../constants';

const DatePickerView = ({
  startDate,
  selectedDate,
  onChangeStartDate,
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState(selectedDate);

  const handleDateChange = (date) => {
    setSelectedStartDate(date);
    onChangeStartDate(date);
  };

  return (
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <DatePicker
            mode="calendar"
            isGregorian={true}
            locale="en"
            minimumDate={startDate}
            style={{
              width: SIZES.width - 32,
              borderRadius: 12,
              paddingBottom: 0,
            }}
            selected={selectedStartDate}
            onDateChange={handleDateChange}
            onSelectedChange={(date) => setSelectedStartDate(date)}
            options={{
              backgroundColor: COLORS.primary,
              textHeaderColor: COLORS.white,
              textDefaultColor: '#FFFFFF',
              selectedTextColor: COLORS.primary,
              mainColor: COLORS.white,
              textSecondaryColor: '#FFFFFF',
              borderColor: COLORS.primary,
              defaultFont: 'System',
              headerFont: 'System',
              textFontSize: 16,
              textHeaderFontSize: 18,
              monthFormat: 'MMMM yyyy',
              dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
              monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            }}/>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center"
  },
});


export default DatePickerView;