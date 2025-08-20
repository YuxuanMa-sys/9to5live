import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { COLORS, SIZES } from '../constants';
import { OtpInput } from "react-native-otp-entry";
import Button from "../components/Button";
import { useTheme } from '../theme/ThemeProvider';

const PhoneVerification = ({ navigation, route }) => {
  const [time, setTime] = useState(55);
  const [otpCode, setOtpCode] = useState('');
  const { colors, dark } = useTheme();
  
  // Get phone number from navigation params
  const phoneNumber = route.params?.phoneNumber || '+1 (555) 123-4567';
  
  // Hardcoded verification code for testing
  const VERIFICATION_CODE = '1234';

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleOtpFilled = (text) => {
    setOtpCode(text);
    if (text === VERIFICATION_CODE) {
      // Success - navigate to main app
      navigation.navigate("Main");
    } else {
      // Show error for wrong code
      Alert.alert('Invalid Code', 'Please enter the correct verification code');
    }
  };

  const handleResendCode = () => {
    if (time === 0) {
      setTime(55);
      Alert.alert('Code Sent', 'A new verification code has been sent to your phone');
    }
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Phone Verification" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Text style={[styles.title, {
              color: dark ? COLORS.white : COLORS.black
            }]}>Verify Your Phone Number</Text>
            
            <Text style={[styles.subtitle, {
              color: dark ? COLORS.gray : COLORS.gray2
            }]}>
              We've sent a verification code to your phone number
            </Text>
            
            <Text style={[styles.phoneNumber, {
              color: dark ? COLORS.white : COLORS.black
            }]}>
              {phoneNumber}
            </Text>

            <View style={styles.otpContainer}>
              <Text style={[styles.otpLabel, {
                color: dark ? COLORS.white : COLORS.black
              }]}>
                Enter 4-digit code
              </Text>
              
              <OtpInput
                numberOfDigits={4}
                onTextChange={(text) => setOtpCode(text)}
                focusColor={COLORS.primary}
                focusStickBlinkingDuration={500}
                onFilled={handleOtpFilled}
                theme={{
                  pinCodeContainerStyle: {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                    borderColor: dark ? COLORS.gray : COLORS.gray3,
                    borderWidth: 1,
                    borderRadius: 12,
                    height: 60,
                    width: 60,
                    marginHorizontal: 8,
                  },
                  pinCodeTextStyle: {
                    color: dark ? COLORS.white : COLORS.black,
                    fontSize: 20,
                    fontFamily: 'semiBold',
                  },
                  focusStickStyle: {
                    backgroundColor: COLORS.primary,
                  }
                }}
              />
            </View>

            <View style={styles.codeContainer}>
              <Text style={[styles.code, {
                color: dark ? COLORS.white : COLORS.gray2
              }]}>
                {time > 0 ? 'Resend code in' : 'Didn\'t receive the code?'}
              </Text>
              
              {time > 0 ? (
                <>
                  <Text style={styles.time}>{`  ${time}  `}</Text>
                  <Text style={[styles.code, {
                    color: dark ? COLORS.white : COLORS.gray2
                  }]}>s</Text>
                </>
              ) : (
                <TouchableOpacity onPress={handleResendCode}>
                  <Text style={[styles.resendText, {
                    color: COLORS.primary
                  }]}> Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.hintContainer}>
              <Text style={[styles.hintText, {
                color: dark ? COLORS.gray : COLORS.gray2
              }]}>
                💡 For testing, use code: {VERIFICATION_CODE}
              </Text>
            </View>
          </View>
        </ScrollView>
        
        <Button
          title="Verify & Continue"
          filled
          style={styles.button}
          onPress={() => {
            if (otpCode === VERIFICATION_CODE) {
              navigation.navigate("Main");
            } else {
              Alert.alert('Invalid Code', 'Please enter the correct verification code');
            }
          }}
        />
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
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: "bold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 16
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "regular",
    color: COLORS.gray2,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 22
  },
  phoneNumber: {
    fontSize: 20,
    fontFamily: "semiBold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  otpLabel: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.black,
    marginBottom: 20,
    textAlign: "center"
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    justifyContent: "center",
    flexWrap: 'wrap'
  },
  code: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.gray2,
    textAlign: "center"
  },
  time: {
    fontFamily: "semiBold",
    fontSize: 18,
    color: COLORS.primary
  },
  resendText: {
    fontFamily: "semiBold",
    fontSize: 16,
    color: COLORS.primary
  },
  hintContainer: {
    backgroundColor: COLORS.transparentTertiary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed'
  },
  hintText: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.gray2,
    textAlign: "center"
  },
  button: {
    borderRadius: 32,
    marginBottom: 20
  }
});

export default PhoneVerification;
