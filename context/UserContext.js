import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    nickname: '',
    phoneNumber: '',
    countryCode: '',
    countryName: '',
    dateOfBirth: '',
    profileImage: null,
    interests: [],
    location: null,
    isLoggedIn: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from AsyncStorage on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUser(parsedData);
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async (userData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.log('Error saving user data:', error);
    }
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    saveUserData(updatedUser);
  };

  const loginUser = (email, additionalData = {}) => {
    const userData = {
      ...user,
      email,
      isLoggedIn: true,
      ...additionalData,
    };
    setUser(userData);
    saveUserData(userData);
  };

  const signupUser = (email, additionalData = {}) => {
    const userData = {
      ...user,
      email,
      nickname: '', // Clear nickname since it's not part of signup flow
      dateOfBirth: '', // Clear date of birth since it's not part of signup flow
      isLoggedIn: true,
      ...additionalData,
    };
    setUser(userData);
    saveUserData(userData);
  };

  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUser({
        fullName: '',
        email: '',
        nickname: '',
        phoneNumber: '',
        countryCode: '',
        countryName: '',
        dateOfBirth: '',
        profileImage: null,
        interests: [],
        location: null,
        isLoggedIn: false,
      });
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  const updateProfileSetup = (profileData) => {
    const userData = {
      ...user,
      fullName: profileData.name || user.fullName,
      profileImage: profileData.profileImage || user.profileImage,
      interests: profileData.interests || user.interests,
    };
    setUser(userData);
    saveUserData(userData);
  };

  const updateLocation = (locationData) => {
    const userData = {
      ...user,
      location: locationData,
    };
    setUser(userData);
    saveUserData(userData);
  };

  const value = {
    user,
    isLoading,
    updateUser,
    loginUser,
    signupUser,
    logoutUser,
    updateProfileSetup,
    updateLocation,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
