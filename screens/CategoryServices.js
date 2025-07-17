import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { images, COLORS, SIZES, icons } from "../constants";
import { categories, mostPopularServices } from '../data';
import ServiceCard from '../components/ServiceCard';
import { useTheme } from '../theme/ThemeProvider';

const CategoryServices = ({ navigation, route }) => {
  const { categoryName, categoryId } = route.params || {};
  const { dark, colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "1");

  // Filter services based on selected category
  const filteredServices = mostPopularServices.filter(service => 
    selectedCategory === "1" || service.categoryId === selectedCategory
  );

  // Get category data for dynamic title
  const categoryData = categories.find(cat => cat.id === selectedCategory);
  const dynamicTitle = categoryData ? categoryData.name : (categoryName || 'Services');

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={icons.arrowLeft}
            resizeMode='contain'
            style={[styles.backIcon, { 
              tintColor: dark ? COLORS.white : COLORS.greyscale900
            }]}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { 
          color: dark ? COLORS.white : COLORS.greyscale900
        }]}>
          {dynamicTitle}
        </Text>
        <View style={styles.placeholder} />
      </View>
    );
  };

  const renderCategoryFilter = () => {
    return (
      <View style={styles.categoryFilterContainer}>
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: selectedCategory === item.id ? COLORS.primary : "transparent",
                padding: 10,
                marginVertical: 5,
                borderColor: COLORS.primary,
                borderWidth: 1.3,
                borderRadius: 24,
                marginRight: 12,
              }}
              onPress={() => setSelectedCategory(item.id)}>
              <Text style={{
                color: selectedCategory === item.id ? COLORS.white : COLORS.primary
              }}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  const renderServiceItem = ({ item }) => (
    <ServiceCard
      name={item.name}
      image={item.image}
      providerName={item.providerName}
      price={item.price}
      isOnDiscount={item.isOnDiscount}
      oldPrice={item.oldPrice}
      rating={item.rating}
      numReviews={item.numReviews}
      onPress={() => navigation.navigate("ServiceDetails", { service: item })}
      categoryId={item.categoryId}
    />
  );

  const renderServices = () => {
    if (filteredServices.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Image
            source={images.empty}
            resizeMode='contain'
            style={styles.emptyImage}
          />
          <Text style={[styles.emptyText, { 
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>
            No services found for this category
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesList}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        {renderCategoryFilter()}
        {renderServices()}
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
    backgroundColor: COLORS.white,
    padding: 16
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "semiBold",
    color: COLORS.greyscale900,
  },
  placeholder: {
    width: 40,
  },
  categoryFilterContainer: {
    marginBottom: 20,
  },
  servicesList: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "medium",
    color: COLORS.greyscale500,
  },
});

export default CategoryServices; 