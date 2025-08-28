import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import Button from '../components/Button';
import SocialButton from '../components/SocialButton';
import OrSeparator from '../components/OrSeparator';
import { useTheme } from '../theme/ThemeProvider';

const isTestMode = true;

const initialState = {
  inputValues: {
    email: isTestMode ? 'example@gmail.com' : '',
  },
  inputValidities: {
    email: false,
  },
  formIsValid: false,
}

const Login = ({ navigation }) => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState(null);
  const { colors, dark } = useTheme();

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue)
      dispatchFormState({ inputId, validationResult: result, inputValue })
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error)
    }
  }, [error]);

  const appleAuthHandler = () => {
    console.log("Apple Authentication")
  };

  const facebookAuthHandler = () => {
    console.log("Facebook Authentication")
  };

  const googleAuthHandler = () => {
    console.log("Google Authentication")
  };

  const continueHandler = async () => {
    const email = formState.inputValues.email;
    
    if (email && email.includes('@')) {
      try {
        // Check if user exists in storage
        const existingUsers = await AsyncStorage.getItem('users');
        const users = existingUsers ? JSON.parse(existingUsers) : [];
        
        const userExists = users.find(user => user.email === email);
        
        if (userExists) {
          // User exists - navigate to password entry
          navigation.navigate("PasswordEntry", { email: email });
        } else {
          // User doesn't exist - navigate to create account
          navigation.navigate("CreateAccount", { email: email });
        }
      } catch (error) {
        console.error('Error checking user:', error);
        // Fallback to create account if there's an error
        navigation.navigate("CreateAccount", { email: email });
      }
    } else {
      // Show error for invalid email
      Alert.alert('Invalid Email', 'Please enter a valid email address');
    }
  };

  return (
    <SafeAreaView style={[styles.area, {
      backgroundColor: colors.background
    }]}>
      <View style={[styles.container, {
        backgroundColor: colors.background
      }]}>
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
          }]}>Log in or Sign up</Text>
          
          <Text style={[styles.subtitle, {
            color: dark ? COLORS.grayTie : COLORS.gray
          }]}>Create an account or log in to book and manage your appointments</Text>
          
          <View style={styles.socialSection}>
            <Text style={[styles.socialTitle, {
              color: dark ? COLORS.white : COLORS.black
            }]}>Continue with</Text>
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
          
          <OrSeparator text="OR" />
          
          <Input
            id="email"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['email']}
            placeholder="Email"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
          />
          
          <Button
            title="Continue"
            filled
            onPress={continueHandler}
            style={styles.button}
          />
        </ScrollView>
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
    textAlign: "center",
    marginBottom: 12
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 22
  },
  socialSection: {
    marginBottom: 24
  },
  socialTitle: {
    fontSize: 18,
    fontFamily: "medium",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 20
  },
  socialBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16
  },
  button: {
    marginVertical: 24,
    width: SIZES.width - 32,
    borderRadius: 30
  }
})

export default Login
