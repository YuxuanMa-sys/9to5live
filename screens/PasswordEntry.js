import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';

const PasswordEntry = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { colors, dark } = useTheme();
  const { email } = route.params || { email: 'test@gmail.com' };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleContinue = async () => {
    if (!password.trim()) {
      Alert.alert('Password Required', 'Please enter your password');
      return;
    }

    try {
      // Get stored users and find the current user
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const currentUser = users.find(user => user.email === email);
      
      if (!currentUser) {
        Alert.alert('User Not Found', 'User account not found. Please create an account first.');
        return;
      }

      // Verify password
      if (currentUser.password !== password.trim()) {
        Alert.alert('Invalid Password', 'The password you entered is incorrect. Please try again.');
        return;
      }

      // Password is correct - store session and navigate
      await AsyncStorage.setItem('currentUser', JSON.stringify(currentUser));
      await AsyncStorage.setItem('isLoggedIn', 'true');

      console.log('Login successful:', currentUser.email);
      
      // Navigate to Main app and go directly to Profile tab
      navigation.navigate("Main", { screen: "Profile" });
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Failed to login. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    navigation.navigate("ForgotPassword", { email: email });
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={images.logo}
                resizeMode='contain'
                style={styles.logo}
              />
            </View>
            
            <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}>
              Welcome back
            </Text>
            
            <Text style={[styles.instructionText, { color: dark ? COLORS.grayTie : COLORS.gray }]}>
              Enter your password to log in as{' '}
              <Text style={[styles.emailText, { color: dark ? COLORS.white : COLORS.black }]}>
                {email}
              </Text>
            </Text>
            
            <Text style={[styles.resetText, { color: dark ? COLORS.grayTie : COLORS.gray }]}>
              If you forgot your password, we can{' '}
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.resetLink}>send you an email to reset it</Text>
              </TouchableOpacity>
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: dark ? COLORS.white : COLORS.black }]}>
                Password
              </Text>
              <Input
                placeholder="Password"
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.gray}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                rightIcon={showPassword ? icons.hide : icons.show}
                onRightIconPress={togglePasswordVisibility}
                style={styles.passwordInput}
              />
            </View>
            
            <Button
              title="Continue"
              filled
              onPress={handleContinue}
              style={styles.continueButton}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
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

  contentContainer: {
    padding: 16,
    alignItems: 'center'
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32
  },
  logo: {
    width: 100,
    height: 100,
    tintColor: COLORS.primary
  },
  title: {
    fontSize: 32,
    fontFamily: "bold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 16
  },
  instructionText: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22
  },
  emailText: {
    fontFamily: "bold",
    color: COLORS.black
  },
  resetText: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22
  },
  resetLink: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
    fontFamily: "medium"
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.black,
    marginBottom: 8
  },
  passwordInput: {
    borderColor: COLORS.primary,
    borderWidth: 1
  },
  continueButton: {
    width: SIZES.width - 32,
    borderRadius: 30
  }
});

export default PasswordEntry;
