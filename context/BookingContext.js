import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingContext = createContext();

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  // Load bookings from storage on app start
  useEffect(() => {
    loadBookings();
  }, []);

  // Save bookings to storage whenever bookings change
  useEffect(() => {
    saveBookings();
  }, [bookings]);

  const loadBookings = async () => {
    try {
      const storedBookings = await AsyncStorage.getItem('bookings');
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const saveBookings = async () => {
    try {
      await AsyncStorage.setItem('bookings', JSON.stringify(bookings));
    } catch (error) {
      console.error('Error saving bookings:', error);
    }
  };

  const addBooking = (booking) => {
    const newBooking = {
      id: Date.now().toString(),
      ...booking,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  const updateBooking = (id, updates) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, ...updates } : booking
      )
    );
  };

  const deleteBooking = (id) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
  };

  const clearAllBookings = () => {
    setBookings([]);
  };

  const getUpcomingBookings = () => {
    return bookings.filter(booking => booking.status !== 'Cancelled');
  };

  const getCompletedBookings = () => {
    const now = new Date();
    return bookings.filter(booking => {
      try {
        // Parse the date string (format: YYYY/MM/DD)
        const [year, month, day] = booking.selectedDate.split('/').map(Number);
        const bookingDate = new Date(year, month - 1, day); // month is 0-indexed
        
        return bookingDate < now && booking.status !== 'Cancelled';
      } catch (error) {
        console.error('Error parsing booking date:', error);
        return false; // Don't show as completed if date parsing fails
      }
    });
  };

  const getCancelledBookings = () => {
    return bookings.filter(booking => booking.status === 'Cancelled');
  };

  const value = {
    bookings,
    addBooking,
    updateBooking,
    deleteBooking,
    clearAllBookings,
    getUpcomingBookings,
    getCompletedBookings,
    getCancelledBookings,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}; 