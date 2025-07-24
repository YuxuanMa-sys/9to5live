import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import React, { useState } from 'react';
import { COLORS, SIZES, FONTS, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import ReviewStars from '../components/ReviewStars';
import Button from '../components/Button';
import MapView, { Marker } from 'react-native-maps';

const TABS = ['SERVICES', 'REVIEWS', 'PORTFOLIO', 'DETAILS'];

const SERVICES = [
  {
    id: "1",
    name: "Haircut",
    price: "$30.00",
    duration: "45 minutes",
    description: "Any type of fade/shear work Cash Venmo"
  },
  {
    id: "2", 
    name: "Haircut + Beard",
    price: "$35.00",
    duration: "1 hour",
    description: "Any type of fade/shear work and beard trim"
  },
  {
    id: "3",
    name: "Haircut + design",
    price: "$30.00", 
    duration: "1 hour",
    description: "Any type of fade/shear work Cash Venmo"
  }
];

const REVIEWS = [
  {
    id: "1",
    name: "Zeid",
    rating: 5,
    date: "June 24, 2025, 7:59 PM",
    comment: "good cut",
    staffMember: "Vallen Thorpe",
    service: "Haircut"
  },
  {
    id: "2",
    name: "Ben", 
    rating: 5,
    date: "June 20, 2025, 7:45 PM",
    comment: "Good cut!",
    staffMember: "Vallen Thorpe",
    service: "Haircut"
  },
  {
    id: "3",
    name: "Josh",
    rating: 5,
    date: "June 17, 2025, 7:51 AM", 
    comment: "Great service!",
    staffMember: "Vallen Thorpe",
    service: "Haircut"
  }
];

const PORTFOLIO_IMAGES = [
  { id: "1", image: images.user1 },
  { id: "2", image: images.user2 },
  { id: "3", image: images.user3 }
];

const ProviderDetails = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('SERVICES');
  const { dark, colors } = useTheme();

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
          Urbana Barber
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Image
              source={icons.bell}
              resizeMode='contain'
              style={[styles.headerIcon, { 
                tintColor: dark ? COLORS.white : COLORS.greyscale900
              }]}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTabs = () => {
    return (
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabItem,
              activeTab === tab && styles.activeTabItem
            ]}
            onPress={() => setActiveTab(tab)}>
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderServicesTab = () => {
    const renderServiceItem = ({ item }) => (
      <View style={[styles.serviceCard, { 
        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300
      }]}>
        <View style={styles.serviceInfo}>
          <Text style={[styles.serviceName, { 
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>
            {item.name}
          </Text>
          <Text style={[styles.servicePrice, { 
            color: COLORS.primary
          }]}>
            {item.price}
          </Text>
          <Text style={[styles.serviceDuration, { 
            color: dark ? COLORS.grayscale400 : COLORS.greyscale600
          }]}>
            {item.duration}
          </Text>
          <Text style={[styles.serviceDescription, { 
            color: dark ? COLORS.grayscale400 : COLORS.greyscale600
          }]}>
            {item.description}
          </Text>
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book</Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <ScrollView style={styles.servicesContainer}>
        {/* Business Image Section */}
        <View style={styles.businessImageContainer}>
          <Image 
            source={images.service1} 
            style={styles.businessImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>4.9</Text>
              <Text style={styles.reviewsText}>22 reviews</Text>
            </View>
            <View style={styles.imageDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>

        {/* Business Info Section */}
        <View style={[styles.businessInfoContainer, { 
          backgroundColor: dark ? COLORS.dark2 : COLORS.white
        }]}>
          <View style={styles.recommendedBadge}>
            <Image source={icons.check} style={styles.thumbsUpIcon} />
            <Text style={styles.recommendedText}>BOOKSY RECOMMENDED</Text>
            <TouchableOpacity style={styles.infoButton}>
              <Text style={styles.infoText}>i</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.businessName, { 
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>
            Urbana Barber
          </Text>
          
          <Text style={[styles.businessAddress, { 
            color: dark ? COLORS.grayscale400 : COLORS.greyscale600
          }]}>
            2707 Milford Drive Urbana Illinois
          </Text>
          
          <Text style={[styles.businessAddressFull, { 
            color: dark ? COLORS.grayscale400 : COLORS.greyscale600
          }]}>
            2707 Milford Drive, Urbana, 61802
          </Text>
          
          <View style={styles.businessStatusRow}>
            <View style={styles.businessStatus}>
              <View style={styles.statusItem}>
                <Text style={[styles.statusText, { 
                  color: dark ? COLORS.white : COLORS.greyscale900
                }]}>
                  Promoted
                </Text>
                <TouchableOpacity style={styles.statusInfoButton}>
                  <Text style={styles.statusInfoText}>i</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.statusDivider, { 
                color: dark ? COLORS.grayscale400 : COLORS.greyscale600
              }]}>
                |
              </Text>
              <Text style={[styles.statusText, { 
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>
                Entrepreneur
              </Text>
            </View>
            
            <View style={styles.businessActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Image source={icons.share} style={styles.actionIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Image source={icons.heart} style={styles.actionIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tabs Section - Only for SERVICES tab */}
        <View style={styles.servicesTabContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.servicesTabItem,
                activeTab === tab && styles.activeServicesTabItem
              ]}
              onPress={() => setActiveTab(tab)}>
              <Text style={[
                styles.servicesTabText,
                activeTab === tab && styles.activeServicesTabText
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Services List */}
        <View style={styles.servicesListContainer}>
          {SERVICES.map((item) => (
            <View key={item.id} style={[styles.serviceCard, { 
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
              borderColor: dark ? COLORS.dark3 : COLORS.greyscale300
            }]}>
              <View style={styles.serviceInfo}>
                <Text style={[styles.serviceName, { 
                  color: dark ? COLORS.white : COLORS.greyscale900
                }]}>
                  {item.name}
                </Text>
                <Text style={[styles.servicePrice, { 
                  color: COLORS.primary
                }]}>
                  {item.price}
                </Text>
                <Text style={[styles.serviceDuration, { 
                  color: dark ? COLORS.grayscale400 : COLORS.greyscale600
                }]}>
                  {item.duration}
                </Text>
                <Text style={[styles.serviceDescription, { 
                  color: dark ? COLORS.grayscale400 : COLORS.greyscale600
                }]}>
                  {item.description}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.bookButton}
                onPress={() => navigation.navigate("BookAppointment", { 
                  service: item,
                  provider: {
                    name: "Urbana Barber",
                    address: "2707 Milford Drive, Urbana, 61802",
                    staff: "Vallen Thorpe"
                  }
                })}
              >
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderReviewsTab = () => {
    const renderReviewItem = ({ item }) => (
      <View style={[styles.reviewCard, { 
        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300
      }]}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewerInfo}>
            <Image source={images.avatar} style={styles.reviewerAvatar} />
            <Text style={[styles.reviewerName, { 
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>
              {item.name}
            </Text>
          </View>
          <View style={styles.reviewRating}>
            <ReviewStars review={item.rating} size={16} color={COLORS.warning} />
          </View>
        </View>
        <Text style={[styles.reviewDate, { 
          color: dark ? COLORS.grayscale400 : COLORS.greyscale600
        }]}>
          {item.date}
        </Text>
        <Text style={[styles.reviewComment, { 
          color: dark ? COLORS.white : COLORS.greyscale900
        }]}>
          {item.comment}
        </Text>
        <View style={styles.reviewMeta}>
          <Text style={[styles.reviewMetaText, { 
            color: dark ? COLORS.grayscale400 : COLORS.greyscale600
          }]}>
            Staff member: {item.staffMember}
          </Text>
          <Text style={[styles.reviewMetaText, { 
            color: dark ? COLORS.grayscale400 : COLORS.greyscale600
          }]}>
            Service: {item.service}
          </Text>
        </View>
      </View>
    );

    return (
      <ScrollView style={styles.reviewsContainer}>
        <View style={styles.ratingSummary}>
          <Text style={[styles.overallRating, { 
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>
            4.9/5
          </Text>
          <ReviewStars review={5} size={24} color={COLORS.warning} />
          <Text style={[styles.totalReviews, { 
            color: dark ? COLORS.grayscale400 : COLORS.greyscale600
          }]}>
            22 reviews
          </Text>
        </View>
        <FlatList
          data={REVIEWS}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </ScrollView>
    );
  };

  const renderPortfolioTab = () => {
    const renderPortfolioItem = ({ item }) => (
      <View style={[styles.portfolioCard, { 
        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
        borderColor: dark ? COLORS.dark3 : COLORS.greyscale300
      }]}>
        <Image source={item.image} style={styles.portfolioImage} />
        <View style={styles.portfolioActions}>
          <TouchableOpacity style={styles.portfolioAction}>
            <Image source={icons.share} style={styles.actionIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.portfolioAction}>
            <Image source={icons.chat} style={styles.actionIcon} />
            <Text style={styles.actionText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.portfolioAction}>
            <Image source={icons.heart} style={styles.actionIcon} />
            <Text style={styles.actionText}>0</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
      <FlatList
        data={PORTFOLIO_IMAGES}
        renderItem={renderPortfolioItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.portfolioList}
      />
    );
  };

  const renderDetailsTab = () => {
    return (
      <ScrollView style={styles.detailsContainer}>
        <View style={[styles.mapContainer, { 
          backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500
        }]}> 
          <MapView
            style={{ flex: 1, borderRadius: styles.mapContainer.borderRadius }}
            initialRegion={{
              latitude: 40.1106,
              longitude: -88.2073,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker
              coordinate={{ latitude: 40.1106, longitude: -88.2073 }}
              title={'Urbana Barber'}
              description={'2707 Milford Drive, Urbana, 61802'}
            />
          </MapView>
          <View style={[styles.locationCard, { 
            backgroundColor: dark ? COLORS.dark3 : COLORS.white
          }]}> 
            <Image source={images.avatar} style={styles.locationAvatar} />
            <View style={styles.locationInfo}>
              <Text style={[styles.locationName, { 
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>Urbana Barber</Text>
              <Text style={[styles.locationAddress, { 
                color: dark ? COLORS.grayscale400 : COLORS.greyscale600
              }]}>2707 Milford Drive Urbana Illinois</Text>
              <Text style={[styles.locationAddress, { 
                color: dark ? COLORS.grayscale400 : COLORS.greyscale600
              }]}>2707 Milford Drive, Urbana, 61802</Text>
            </View>
            <TouchableOpacity style={styles.navigationButton}>
              <Image source={icons.location} style={styles.navigationIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.aboutSection}>
          <Text style={[styles.sectionTitle, { 
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>
            ABOUT US
          </Text>
          <Text style={[styles.aboutText, { 
            color: dark ? COLORS.grayscale400 : COLORS.greyscale600
          }]}>
            At home barbershop in Urbana Illinois ran by Vallen Thorpe
          </Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={[styles.sectionTitle, { 
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>
            CONTACT & BUSINESS HOURS
          </Text>
          <View style={styles.hoursRow}>
            <Text style={[styles.hoursLabel, { 
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>
              Today
            </Text>
            <Text style={[styles.hoursTime, { 
              color: dark ? COLORS.grayscale400 : COLORS.greyscale600
            }]}>
              18:30 - 21:00
            </Text>
          </View>
          <TouchableOpacity style={styles.showMoreButton}>
            <Text style={[styles.showMoreText, { 
              color: COLORS.primary
            }]}>
              Show full week
            </Text>
            <Image source={icons.arrowDown} style={styles.showMoreIcon} />
          </TouchableOpacity>
          
          <View style={styles.phoneRow}>
            <Image source={icons.call} style={styles.phoneIcon} />
            <Text style={[styles.phoneNumber, { 
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>
              (309) 205-4407
            </Text>
            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.reportButton}>
          <Text style={[styles.reportText, { 
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>
            Report
          </Text>
          <Image source={icons.arrowRight} style={styles.reportIcon} />
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'SERVICES':
        return renderServicesTab();
      case 'REVIEWS':
        return renderReviewsTab();
      case 'PORTFOLIO':
        return renderPortfolioTab();
      case 'DETAILS':
        return renderDetailsTab();
      default:
        return renderServicesTab();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}
      {activeTab === 'SERVICES' ? (
        <View style={styles.content}>
          {renderTabContent()}
        </View>
      ) : (
        <>
          {renderTabs()}
          <View style={styles.content}>
            {renderTabContent()}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding3,
    paddingVertical: SIZES.padding2,
  },
  backButton: {
    padding: SIZES.padding,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    ...FONTS.h3,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    padding: SIZES.padding,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding3,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyscale300,
  },
  tabItem: {
    flex: 1,
    paddingVertical: SIZES.padding2,
    alignItems: 'center',
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.body4,
    color: COLORS.greyscale600,
  },
  activeTabText: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  servicesList: {
    padding: SIZES.padding3,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding3,
    marginBottom: SIZES.padding2,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    ...FONTS.h4,
    marginBottom: SIZES.padding,
  },
  servicePrice: {
    ...FONTS.h3,
    marginBottom: SIZES.padding,
  },
  serviceDuration: {
    ...FONTS.body4,
    marginBottom: SIZES.padding,
  },
  serviceDescription: {
    ...FONTS.body4,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding3,
    paddingVertical: SIZES.padding2,
    borderRadius: SIZES.radius,
  },
  bookButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '600',
  },
  reviewsContainer: {
    flex: 1,
    padding: SIZES.padding3,
  },
  ratingSummary: {
    alignItems: 'center',
    paddingVertical: SIZES.padding3,
    marginBottom: SIZES.padding3,
  },
  overallRating: {
    ...FONTS.h1,
    marginBottom: SIZES.padding,
  },
  totalReviews: {
    ...FONTS.body4,
    marginTop: SIZES.padding,
  },
  reviewCard: {
    padding: SIZES.padding3,
    marginBottom: SIZES.padding2,
    borderRadius: SIZES.radius,
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.padding,
  },
  reviewerName: {
    ...FONTS.body4,
    fontWeight: '600',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDate: {
    ...FONTS.body4,
    marginBottom: SIZES.padding,
  },
  reviewComment: {
    ...FONTS.body3,
    marginBottom: SIZES.padding,
  },
  reviewMeta: {
    marginTop: SIZES.padding,
  },
  reviewMetaText: {
    ...FONTS.body4,
    marginBottom: SIZES.padding / 2,
  },
  portfolioList: {
    padding: SIZES.padding3,
  },
  portfolioCard: {
    marginBottom: SIZES.padding2,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    overflow: 'hidden',
  },
  portfolioImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  portfolioActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SIZES.padding2,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  portfolioAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.greyscale600,
    marginRight: SIZES.padding,
  },
  actionText: {
    ...FONTS.body4,
    color: COLORS.greyscale600,
  },
  detailsContainer: {
    flex: 1,
  },
  mapContainer: {
    height: 200,
    margin: SIZES.padding3,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    ...FONTS.body3,
  },
  locationCard: {
    position: 'absolute',
    bottom: SIZES.padding2,
    left: SIZES.padding2,
    right: SIZES.padding2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding2,
    borderRadius: SIZES.radius,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.padding,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    ...FONTS.h4,
    marginBottom: SIZES.padding / 2,
  },
  locationAddress: {
    ...FONTS.body4,
    marginBottom: SIZES.padding / 2,
  },
  navigationButton: {
    padding: SIZES.padding,
  },
  navigationIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary,
  },
  aboutSection: {
    padding: SIZES.padding3,
  },
  sectionTitle: {
    ...FONTS.h3,
    marginBottom: SIZES.padding2,
  },
  aboutText: {
    ...FONTS.body3,
  },
  contactSection: {
    padding: SIZES.padding3,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  hoursLabel: {
    ...FONTS.body4,
    fontWeight: '600',
  },
  hoursTime: {
    ...FONTS.body4,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding3,
  },
  showMoreText: {
    ...FONTS.body4,
    marginRight: SIZES.padding,
  },
  showMoreIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.primary,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.greyscale600,
    marginRight: SIZES.padding,
  },
  phoneNumber: {
    ...FONTS.body4,
    flex: 1,
  },
  callButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding3,
    paddingVertical: SIZES.padding2,
    borderRadius: SIZES.radius,
  },
  callButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '600',
  },
  reportButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding3,
    marginTop: SIZES.padding3,
  },
  reportText: {
    ...FONTS.body4,
  },
  reportIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.greyscale600,
  },
  // New styles for business image and info sections
  servicesContainer: {
    flex: 1,
  },
  businessImageContainer: {
    height: 250,
    position: 'relative',
  },
  businessImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: SIZES.padding3,
  },
  ratingBadge: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  ratingText: {
    ...FONTS.h3,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  reviewsText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  imageDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginHorizontal: 2,
  },
  businessInfoContainer: {
    padding: SIZES.padding3,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyscale300,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greyscale500,
    paddingHorizontal: SIZES.padding2,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
    alignSelf: 'flex-start',
    marginBottom: SIZES.padding2,
  },
  thumbsUpIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.primary,
    marginRight: SIZES.padding,
  },
  recommendedText: {
    ...FONTS.body4,
    color: COLORS.greyscale900,
    fontWeight: '600',
  },
  infoButton: {
    marginLeft: SIZES.padding,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.greyscale600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontSize: 12,
  },
  businessName: {
    ...FONTS.h2,
    marginBottom: SIZES.padding,
  },
  businessAddress: {
    ...FONTS.body4,
    marginBottom: SIZES.padding / 2,
  },
  businessAddressFull: {
    ...FONTS.body4,
    marginBottom: SIZES.padding2,
  },
  businessStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding2,
  },
  businessStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    ...FONTS.body4,
    fontWeight: '600',
  },
  statusInfoButton: {
    marginLeft: SIZES.padding,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.greyscale600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusInfoText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontSize: 10,
  },
  statusDivider: {
    ...FONTS.body4,
    marginHorizontal: SIZES.padding,
  },
  businessActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: SIZES.padding,
    marginLeft: SIZES.padding,
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.greyscale600,
  },
  servicesListContainer: {
    padding: SIZES.padding3,
  },
  servicesTabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding3,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.greyscale300,
    backgroundColor: COLORS.white,
  },
  servicesTabItem: {
    flex: 1,
    paddingVertical: SIZES.padding2,
    alignItems: 'center',
  },
  activeServicesTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  servicesTabText: {
    ...FONTS.body4,
    color: COLORS.greyscale600,
  },
  activeServicesTabText: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default ProviderDetails; 