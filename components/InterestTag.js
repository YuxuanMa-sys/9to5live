import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

const InterestTag = ({ title, isSelected, onPress, style }) => {
  const { colors, dark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isSelected 
            ? COLORS.primary 
            : (dark ? COLORS.dark3 : COLORS.greyscale500),
          borderColor: isSelected 
            ? COLORS.primary 
            : (dark ? COLORS.dark3 : COLORS.greyscale300),
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          {
            color: isSelected 
              ? COLORS.white 
              : (dark ? COLORS.white : COLORS.gray2),
          }
        ]}
        numberOfLines={2}
        adjustsFontSizeToFit={true}
        minimumFontScale={0.8}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100, // Increased minimum width
    minHeight: 48,  // Minimum height for consistency
    flex: 1,
  },
  text: {
    fontSize: 14,
    fontFamily: 'medium',
    textAlign: 'center',
    lineHeight: 18,
    numberOfLines: 2, // Allow up to 2 lines
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.8,
  },
});

export default InterestTag;
