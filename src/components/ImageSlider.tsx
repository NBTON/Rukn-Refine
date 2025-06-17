// ImageSlider.tsx
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { MARKETPLACES, MarketplaceItem, images } from "./types";

// Define image keys type to avoid TypeScript errors
type ImageKeyType = keyof typeof images;

const { width } = Dimensions.get("window");

interface ImageSliderProps {
  data: MarketplaceItem[];
  currentIndex: number;
  onSlideChange: (evt: NativeSyntheticEvent<NativeScrollEvent>) => void;
  sliderRef: React.RefObject<ScrollView>;
  showTitleOverlay?: boolean;
}

const ImageSlider: FC<ImageSliderProps> = ({
  data,
  currentIndex,
  onSlideChange,
  sliderRef,
  showTitleOverlay = false,
}) => {
  // Keep track of the current slide index
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Use memoized slider data (e.g., only the top three items)
  const sliderData = useMemo<MarketplaceItem[]>(
    () => MARKETPLACES.slice(0, 3),
    []
  );

  // Auto-update the slider every 8 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % sliderData.length;
        sliderRef.current?.scrollTo({ x: nextIndex * width, animated: true });
        return nextIndex;
      });
    }, 8000);

    return () => clearInterval(intervalId);
  }, [sliderData.length, width, sliderRef]);

  // Update index on manual scrolling and call parent's callback.
  const handleSlideChange = useCallback(
    (evt: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(evt.nativeEvent.contentOffset.x / width);
      setCurrentSlideIndex(index);
      onSlideChange(evt);
    },
    [onSlideChange]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleSlideChange}
        ref={sliderRef}
      >
        {data.map((item) => (
          <View key={item.id} style={{ width }}>
            <Image
              source={images[item.image as ImageKeyType]}
              style={styles.image}
              resizeMode="stretch"
            />
            {showTitleOverlay && (
              <View style={styles.overlay}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentSlideIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "110%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "center",
  },
  overlay: {
    position: "absolute",
    bottom: 60,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  title: {
    color: "#fff",
    fontSize: 16,
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 40,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#333",
  },
});

export default ImageSlider;