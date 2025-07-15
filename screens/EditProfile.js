import {
  View, Text, StyleSheet, ScrollView, Alert, Image,
  TouchableOpacity, Modal, TouchableWithoutFeedback,
  FlatList, TextInput
} from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, FONTS, icons, images } from '../constants';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Input from '../components/Input';
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePickerModal from '../components/DatePickerModal';
import Button from '../components/Button';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../theme/ThemeProvider';
import { launchImageLibrary } from 'react-native-image-picker';

const isTestMode = true;

const initialState = {
  inputValues: {
    fullName: isTestMode ? 'John Doe' : '',
    email: isTestMode ? 'example@gmail.com' : '',
    nickname: '',
    phoneNumber: ''
  },
  inputValidities: {
    fullName: false,
    email: false,
    nickname: false,
    phoneNumber: false,
  },
  formIsValid: false,
};

const EditProfile = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const { colors, dark } = useTheme();

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const today = new Date();
  const startDate = getFormatedDate(
    new Date(today.setDate(today.getDate() + 1)),
    "YYYY/MM/DD"
  );
  const [startedDate, setStartedDate] = useState("12/12/2023");

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue)
      dispatchFormState({ inputId, validationResult: result, inputValue })
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error);
    }
  }, [error]);

  // pick image using react-native-image-picker
  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const pickedImage = response.assets[0];
        setImage({ uri: pickedImage.uri });
      } else {
        Alert.alert('Could not pick the image', 'Please try again.');
      }
    });
  };

  // fetch country codes
  useEffect(() => {
    fetch("https://restcountries.com/v2/all")
      .then(response => response.json())
      .then(data => {
        let areaData = data.map(item => ({
          code: item.alpha2Code,
          item: item.name,
          callingCode: `+${item.callingCodes[0]}`,
          flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`
        }));
        setAreas(areaData);
        if (areaData.length > 0) {
          let defaultData = areaData.filter(a => a.code === "US");
          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0]);
          }
        }
      });
  }, []);

  // render modal for selecting country codes
  const RenderAreasCodesModal = () => (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <View style={{
            height: 400,
            width: SIZES.width * 0.8,
            backgroundColor: COLORS.primary,
            borderRadius: 12
          }}>
            <FlatList
              data={areas}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ padding: 10, flexDirection: "row" }}
                  onPress={() => { setSelectedArea(item); setModalVisible(false); }}>
                  <Image source={{ uri: item.flag }} style={{ height: 30, width: 30, marginRight: 10 }} />
                  <Text style={{ fontSize: 16, color: "#fff" }}>{item.item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.code}
              style={{ padding: 20, marginBottom: 20 }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
        <Header title="Edit Profile" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              <Image
                source={image === null ? images.user1 : image}
                resizeMode="cover"
                style={styles.avatar} />
              <TouchableOpacity onPress={pickImage} style={styles.pickImage}>
                <MaterialCommunityIcons name="pencil-outline" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
          <Input id="fullName" onInputChanged={inputChangedHandler} errorText={formState.inputValidities['fullName']} placeholder="Full Name" placeholderTextColor={dark ? COLORS.grayTie : COLORS.black} />
          <Input id="nickname" onInputChanged={inputChangedHandler} errorText={formState.inputValidities['nickname']} placeholder="Nickname" placeholderTextColor={dark ? COLORS.grayTie : COLORS.black} />
          <Input id="email" onInputChanged={inputChangedHandler} errorText={formState.inputValidities['email']} placeholder="Email" placeholderTextColor={dark ? COLORS.grayTie : COLORS.black} keyboardType="email-address" />

          <TouchableOpacity style={[styles.inputBtn, { backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500 }]} onPress={() => setOpenStartDatePicker(true)}>
            <Text style={{ ...FONTS.body4, color: COLORS.grayscale400 }}>{startedDate}</Text>
            <Feather name="calendar" size={24} color={COLORS.grayscale400} />
          </TouchableOpacity>

          <View style={[styles.inputContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500 }]}>
            <TouchableOpacity style={styles.selectFlagContainer} onPress={() => setModalVisible(true)}>
              <Image source={icons.down} style={styles.downIcon} />
              <Image source={{ uri: selectedArea?.flag }} style={styles.flagIcon} />
              <Text style={{ color: dark ? COLORS.white : "#111", fontSize: 12 }}>{selectedArea?.callingCode}</Text>
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Enter your phone number" placeholderTextColor={dark ? COLORS.grayTie : COLORS.black} keyboardType="numeric" />
          </View>

          <RNPickerSelect
            placeholder={{ label: 'Select', value: '' }}
            items={genderOptions}
            onValueChange={(value) => setSelectedGender(value)}
            value={selectedGender}
            style={{
              inputIOS: styles.selectInput,
              inputAndroid: styles.selectInput,
            }}
          />

          <Input id="occupation" onInputChanged={inputChangedHandler} errorText={formState.inputValidities['occupation']} placeholder="Occupation" placeholderTextColor={dark ? COLORS.grayTie : COLORS.black} />
        </ScrollView>
      </View>

      <DatePickerModal open={openStartDatePicker} startDate={startDate} selectedDate={startedDate} onClose={() => setOpenStartDatePicker(false)} onChangeStartDate={(date) => setStartedDate(date)} />
      {RenderAreasCodesModal()}

      <View style={styles.bottomContainer}>
        <Button title="Update" filled style={styles.continueButton} onPress={() => navigation.navigate("Profile")} />
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, padding: 16, backgroundColor: COLORS.white },
  avatarContainer: { alignItems: "center", width: 130, height: 130, borderRadius: 65 },
  avatar: { height: 130, width: 130, borderRadius: 65 },
  pickImage: { height: 42, width: 42, borderRadius: 21, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 0, right: 0 },
  inputContainer: { flexDirection: "row", borderRadius: 6, height: 52, width: SIZES.width - 32, alignItems: 'center', marginVertical: 16 },
  downIcon: { width: 10, height: 10, tintColor: "#111" },
  selectFlagContainer: { width: 90, height: 50, marginHorizontal: 5, flexDirection: "row" },
  flagIcon: { width: 30, height: 30 },
  input: { flex: 1, marginVertical: 10, height: 40, fontSize: 14, color: "#111" },
  inputBtn: { borderWidth: 1, borderRadius: 12, height: 50, paddingLeft: 8, justifyContent: "space-between", flexDirection: "row", alignItems: "center", paddingRight: 8, marginTop: 4 },
  bottomContainer: { position: "absolute", bottom: 32, left: 16, right: 16, alignItems: "center" },
  continueButton: { width: SIZES.width - 32, borderRadius: 32, backgroundColor: COLORS.primary },
  selectInput: { fontSize: 16, paddingHorizontal: 10, color: COLORS.greyscale600, height: 52, width: SIZES.width - 32, backgroundColor: COLORS.greyscale500, borderRadius: 16, marginVertical: 8 },
});

export default EditProfile;
