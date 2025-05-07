import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { MARKETPLACES, MarketplaceItem, images } from '../components/types';
import ImageSlider from '../components/ImageSlider';
import { icons } from '@/constants';

const { width } = Dimensions.get('window');

export default function PlaceDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const sliderRef = React.useRef<ScrollView>(null);
  
  // Find the place details from MARKETPLACES data
  const place = MARKETPLACES.find((item) => item.id === id);

  if (!place) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen 
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }} 
      />
      
      <ScrollView style={styles.scrollView} bounces={false}>
        {/* Image Slider */}
        <View style={styles.imageContainer}>
          <ImageSlider 
            data={[place]} 
            currentIndex={0}
            onSlideChange={() => {}}
            sliderRef={sliderRef as React.RefObject<ScrollView>}
          />
          <View style={styles.imageIndicators}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Title and Favorite */}
          <View style={styles.titleRow}>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.iconButton}>
                <Image source={icons.heart2} style={styles.actionIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Image source={icons.share} style={styles.actionIcon} />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>محل رقم {place.id}</Text>
          </View>

          {/* Price and Match */}
          <Text style={styles.matchText}>{place.title}</Text>
          <Text style={styles.price}>{place.price}</Text>

          {/* Location and Size */}
          <Text style={styles.location}>{place.location}</Text>
          <Text style={styles.size}>المساحة {place.size}</Text>

          {/* Contact Number */}
          <Text style={styles.phone}>050 123 4567</Text>

          {/* Similar Properties Section */}
          <View style={styles.similarSection}>
            <Text style={styles.similarTitle}>عقارات اخرى مشابهة</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.similarScrollView}
            >
              {MARKETPLACES.map((item) => (
                <View key={item.id} style={styles.similarItem}>
                  <Image source={images[item.image]} style={styles.similarImage} />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
        activeOpacity={0.8}
      >
        <Image 
          source={icons.arrowLeft} 
          style={styles.backIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 400,
    width: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff80',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  contentCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#626262',
  },
  matchText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    textAlign: 'right',
  },
  size: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'right',
  },
  phone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'right',
  },
  similarSection: {
    marginTop: 20,
  },
  similarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'right',
  },
  similarScrollView: {
    marginBottom: 20,
  },
  similarItem: {
    width: 200,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  similarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
}); 