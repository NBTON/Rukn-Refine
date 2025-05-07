import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

const { width, height } = Dimensions.get("window");
const BOTTOM_OVERLAY_HEIGHT = height * 0.4;

// Define the shape of each onboarding item.
interface OnboardingItem {
  image: any;
  title: string;
  subtitle: string;
  height: number;
  bottom: number;
}

const onboardingData: OnboardingItem[] = [
  {
    image: require("../assets/images/logo.png"),
    title: "Unleash Your Creativity",
    subtitle: "Explore market places and create your own masterpiece.",
    height: 400,
    bottom: 280,
  },
  {
    image: require("../assets/images/CUi.png"),
    title: "Personalize Your Experience",
    subtitle: "Create your perfect market place.",
    height: 640,
    bottom: 150,
  },
  {
    image: require("../assets/images/UI.png"),
    title: "Get Started",
    subtitle: "Join Us In Rukn And Let Your Creativity Flow!",
    height: 640,
    bottom: 150,
  },
];

// Single Onboarding Slide Component
interface OnboardingSlideProps {
  item: OnboardingItem;
  index: number;
  scrollX: Animated.Value;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  item,
  index,
  scrollX,
}) => {
  // Calculate the scale factor for the image based on the scroll position.
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.8, 1, 0.8],
    extrapolate: "clamp",
  });

  return (
    <View style={[styles.page, { width }]}>
      <Animated.Image
        source={item.image}
        style={[
          styles.image,
          {
            height: item.height,
            bottom: item.bottom,
            transform: [{ scale }],
          },
        ]}
      />
    </View>
  );
};

const OnboardingScreen = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Animated value for fading text content when the page changes.
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Update current page index when scrolling stops and animate text fade transition.
  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const pageIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    // Animate text fading out and back in after page change.
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setCurrentPage(pageIndex);
  };

  // Navigation function when pressing the "Get Started" button.
  const handleGetStarted = () => {
    // Optionally, add tracking or validations before navigating.
    //router.push("/(tabs)/home");
    router.push("/sign-in");
  };

  // Memoize the indicator dots to avoid unnecessary re-renders.
  const renderIndicators = useMemo(() => {
    return onboardingData.map((_, i) => (
      <View
        key={i}
        style={[styles.indicator, i === currentPage && styles.activeIndicator]}
      />
    ));
  }, [currentPage]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {onboardingData.map((item, index) => (
          <OnboardingSlide
            key={index}
            item={item}
            index={index}
            scrollX={scrollX}
          />
        ))}
      </Animated.ScrollView>

      {/* White bottom overlay with touches passing through */}
      <View
        style={[styles.bottomOverlay, { height: BOTTOM_OVERLAY_HEIGHT }]}
        pointerEvents="none"
      />

      {/* Animated text content */}
      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>{onboardingData[currentPage].title}</Text>
        <Text style={styles.subtitle}>
          {onboardingData[currentPage].subtitle}
        </Text>
      </Animated.View>

      {/* "Get Started" button: only render on final onboarding page */}
      {currentPage === onboardingData.length - 1 && (
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      )}

      {/* Indicator dots */}
      <View style={styles.indicatorContainer}>{renderIndicators}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "90%",
    resizeMode: "contain",
    position: "absolute",
    left: 24,
    right: 24,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFFFFF",
    opacity: 0.97,
  },
  textContainer: {
    position: "absolute",
    bottom: 200,
    left: 24,
    right: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "grey",
    textAlign: "center",
    marginTop: 6,
  },
  button: {
    position: "absolute",
    bottom: 120,
    left: 24,
    right: 24,
    backgroundColor: "#F5A623",
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8, // Android shadow.
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeIndicator: {
    width: 24,
    backgroundColor: "#F5A623",
  },
});

const App = () => <OnboardingScreen />;

export default App;
