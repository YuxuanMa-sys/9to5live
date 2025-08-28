import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';

const ForgotPassword = ({ navigation, route }) => {
  const { colors, dark } = useTheme();
  const { email } = route.params || { email: 'test@gmail.com' };

  const handleSendResetLink = () => {
    // Handle sending reset link functionality
    console.log('Sending reset link to:', email);
    // You can implement the actual reset link functionality here
    // For now, show success and go back
    Alert.alert('Success', 'Reset link sent to your email');
    navigation.goBack();
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
              Forgot password
            </Text>
            
            <Text style={[styles.description, { color: dark ? COLORS.grayTie : COLORS.gray }]}>
              Forgot your customer password? We'll send you a secure link to update your password to{' '}
              <Text style={[styles.emailText, { color: dark ? COLORS.white : COLORS.black }]}>
                {email}
              </Text>
            </Text>
            
            <Button
              title="Send reset link"
              filled
              onPress={handleSendResetLink}
              style={styles.sendButton}
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
    marginBottom: 24
  },
  description: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
    paddingHorizontal: 20
  },
  emailText: {
    fontFamily: "bold",
    color: COLORS.black
  },
  sendButton: {
    width: SIZES.width - 32,
    borderRadius: 30
  }
});

export default ForgotPassword;
