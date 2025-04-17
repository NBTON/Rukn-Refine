import React, {
  FC,
  useState,
  useMemo,
  useCallback,
  useRef,

} from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import SearchBar from "../../components/SearchBar";
import ImageSlider from "../../components/ImageSlider";
import MarketCard from "../../components/MarketCard";

import IdeaHeader from "../../components/ideaHeader";
import { MARKETPLACES, MarketplaceItem, images } from "../../components/types";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = 300; // Height reserved for the image slider
const CARD_TOP_OFFSET = HEADER_HEIGHT; // Card shows a little of the image slider


const favorite: FC = () => {

  return (
    <SafeAreaView style={styles.container} >



      {/* Fixed Search Bar */}
      <View style={styles.searchBarWrapper}>
        <SearchBar />
      </View>



      {/* Card content in a ScrollView.
            The content container starts at CARD_TOP_OFFSET so that it appears as a card
            initially below the image slider. As the user scrolls, the card goes above the slider. */}

      {/* Fixed Background Image Slider */}
      <View style={styles.imageSliderContainer}>
        <Image source={images["../assets/images/dummy1.png"]} style={styles.backgroundImage} />
      </View>
      <View style={styles.fixedHeaderOverlayWrapper}>
          <IdeaHeader />
        </View>
      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >

        
        <FlatList
          data={MARKETPLACES}
          renderItem={({ item }) => <MarketCard item={item} />}
          keyExtractor={(item) => item.id}
          scrollEnabled={false} // The outer ScrollView manages scrolling
        />
      </ScrollView>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom:50,
  },
  imageSliderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 0, // Rendered in the background.
  },
  backgroundImage: {
    width: "100%", height: "108%", resizeMode: "cover"
  },
  searchBarWrapper: {
    position: "absolute",
    top: 70,
    left: 16,
    right: 16,
    zIndex: 20, // Renders above the slider.
  },
  fixedHeaderOverlayWrapper: {
    position: "absolute",
    top: 85, // Adjust this value so the FixedHeaderOverlay appears just below the search bar.
    left: 0,
    right: 0,
    zIndex: 15,
  },
  // The ScrollView covers the full screen.

  // Content starts at an offset to reveal the image slider underneath initially.
  scrollViewContent: {
    paddingTop:0,
    minHeight: height - CARD_TOP_OFFSET,
    paddingBottom:40,

  },
  card: {
    top: 100,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 5,
    elevation: 10,
    paddingVertical:40,
  },
});

export default favorite;