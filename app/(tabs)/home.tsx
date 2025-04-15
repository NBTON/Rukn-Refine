// MarketScreen.tsx
import React, {
  FC,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
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
} from "react-native";
import SearchBar from "../../components/SearchBar";
import ImageSlider from "../../components/ImageSlider";
import MarketCard from "../../components/MarketCard";
import FixedHeaderOverlay from "../../components/FixedHeaderOverlay";
import FilterHeader from "../../components/FilterHeader";
import { MARKETPLACES, MarketplaceItem } from "../../components/types";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = 300; // Height reserved for the image slider
const CARD_TOP_OFFSET = HEADER_HEIGHT  ; // Card shows a little of the image slider
const FIXED_HEADER_THRESHOLD = 150; // When to show the fixed header overlay

const MarketScreen: FC = () => {
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const sliderRef = useRef<ScrollView>(null);
  // Prepare slider data (e.g., the top three items).
  const sliderData = useMemo<MarketplaceItem[]>(
    () => MARKETPLACES.slice(0, 3),
    []
  );

  const handleSlideChange = useCallback(
    (evt: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(evt.nativeEvent.contentOffset.x / width);
      setCurrentSlideIndex(index);
    },
    []
  );
  // Auto-update slider every 8 seconds.
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % sliderData.length;
        sliderRef.current?.scrollTo({ x: nextIndex * width, animated: true });
        return nextIndex;
      });
    }, 8000);
    return () => clearInterval(intervalId);
  }, [sliderData.length, width]);

  // Handle scrolling of the card.
  const handleScroll = useCallback(
    (evt: NativeSyntheticEvent<NativeScrollEvent>) => {
      const yOffset = evt.nativeEvent.contentOffset.y;
      if (yOffset -20  > FIXED_HEADER_THRESHOLD && !showFixedHeader) {
        setShowFixedHeader(true);
      } else if (yOffset -20 <= FIXED_HEADER_THRESHOLD && showFixedHeader) {
        setShowFixedHeader(false);
      }
    },
    [showFixedHeader]
  );

  return (
    <SafeAreaView style={styles.container} >
      
      

      {/* Fixed Search Bar */}
      <View style={styles.searchBarWrapper}>
        <SearchBar />
      </View>

      {/* Fixed Header Overlay (appears below search bar) */}
      {showFixedHeader && (
        <View style={styles.fixedHeaderOverlayWrapper}>
          <FixedHeaderOverlay />
        </View>
      )}

      {/* Card content in a ScrollView.
            The content container starts at CARD_TOP_OFFSET so that it appears as a card
            initially below the image slider. As the user scrolls, the card goes above the slider. */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Fixed Background Image Slider */}
      <View style={styles.imageSliderContainer}>
        <ImageSlider
          data={sliderData}
          currentIndex={currentSlideIndex}
          onSlideChange={handleSlideChange}
          sliderRef={sliderRef}
        />
      </View>
        <View style={styles.card}>
          <FilterHeader />
          <FlatList
            data={MARKETPLACES}
            renderItem={({ item }) => <MarketCard item={item} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // The outer ScrollView manages scrolling
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageSliderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 0, // Rendered in the background.
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
    top: 0, // Adjust this value so the FixedHeaderOverlay appears just below the search bar.
    left: 0,
    right: 0,
    zIndex: 15,
  },
  // The ScrollView covers the full screen.
  scrollView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  // Content starts at an offset to reveal the image slider underneath initially.
  scrollViewContent: {
    paddingTop: CARD_TOP_OFFSET,
    minHeight: height - CARD_TOP_OFFSET,
  },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 5,
    paddingBottom: 20,
    elevation: 10,
  },
});

export default MarketScreen;