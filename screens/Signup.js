import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import CheckBox from '@react-native-community/checkbox';
import Button from '../components/Button';
import SocialButton from '../components/SocialButton';
import OrSeparator from '../components/OrSeparator';
import { useTheme } from '../theme/ThemeProvider';
import { useUser } from '../context/UserContext';

const isTestMode = true;

const initialState = {
  inputValues: {
    email: isTestMode ? 'example@gmail.com' : '',
    password: isTestMode ? '**********' : '',
  },
  inputValidities: {
    email: false,
    password: false
  },
  formIsValid: false,
}


const Signup = ({ navigation }) => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const [showPrivacyError, setShowPrivacyError] = useState(false);
  const { colors, dark } = useTheme();
  const { signupUser } = useUser();

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue)
      dispatchFormState({ inputId, validationResult: result, inputValue })
    },
    [dispatchFormState]
  )

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error)
    }
  }, [error])

  // implementing apple authentication
  const appleAuthHandler = () => {
    console.log("Apple Authentication")
  };

  // implementing facebook authentication
  const facebookAuthHandler = () => {
    console.log("Facebook Authentication")
  };

  // Implementing google authentication
  const googleAuthHandler = () => {
    console.log("Google Authentication")
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={images.logo}
              resizeMode='contain'
              style={styles.logo}
            />
          </View>
          <Text style={[styles.title, {
            color: dark ? COLORS.white : COLORS.black
          }]}>Create Your Account</Text>
          <Input
            id="email"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['email']}
            placeholder="Email"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
          />
          <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['password']}
            autoCapitalize="none"
            id="password"
            placeholder="Password"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
          />
          <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={(value) => {
                  setChecked(value);
                  if (value) {
                    setShowPrivacyError(false);
                  }
                }}
                tintColors={{ true: COLORS.primary, false: showPrivacyError ? COLORS.red : (dark ? COLORS.primary : "gray") }}
              />
              <Text style={[styles.privacy, { color: dark ? COLORS.white : COLORS.black, marginLeft: 8 }]}>By continuing you accept our Privacy Policy</Text>
            </View>
            {showPrivacyError && (
              <Text style={styles.errorText}>
                You must accept the Privacy Policy to continue
              </Text>
            )}
          </View>
          <Button
            title="Sign Up"
            filled
            onPress={() => {
              if (!isChecked) {
                setShowPrivacyError(true);
                Alert.alert('Privacy Policy Required', 'Please accept our Privacy Policy to continue');
                return;
              }
              if (formState.formIsValid) {
                // Store initial signup data
                signupUser(formState.inputValues.email);
                navigation.navigate("PhoneNumberInput");
              } else {
                Alert.alert('Invalid Input', 'Please check your email and password');
              }
            }}
            style={styles.button}
          />
          <View>
            <OrSeparator text="or continue with" />
            <View style={styles.socialBtnContainer}>
              <SocialButton
                icon={icons.appleLogo}
                onPress={appleAuthHandler}
                tintColor={dark ? COLORS.white : COLORS.black}
              />
              <SocialButton
                icon={icons.facebook}
                onPress={facebookAuthHandler}
              />
              <SocialButton
                icon={icons.google}
                onPress={googleAuthHandler}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <Text style={[styles.bottomLeft, {
            color: dark ? COLORS.white : COLORS.black
          }]}>Already have an account ?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}>
            <Text style={styles.bottomRight}>{" "}Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white
  },
  logo: {
    width: 100,
    height: 100,
    tintColor: COLORS.primary
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32
  },
  title: {
    fontSize: 28,
    fontFamily: "bold",
    color: COLORS.black,
    textAlign: "center"
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontFamily: "semiBold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 22
  },
  checkBoxContainer: {
    flexDirection: "column",
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 18,
    paddingLeft: 4,
  },
  checkbox: {
    marginRight: 8,
    height: 16,
    width: 16,
  },
  privacy: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.black,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.red,
    marginTop: 4,
    marginLeft: 24,
  },
  socialTitle: {
    fontSize: 19.25,
    fontFamily: "medium",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 26
  },
  socialBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
    position: "absolute",
    bottom: 12,
    right: 0,
    left: 0,
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: "regular",
    color: "black"
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.primary
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30
  }
})

export default Signup