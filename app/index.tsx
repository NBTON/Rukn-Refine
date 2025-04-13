import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Array of onboarding pages.
const onboardingData = [
  {
    image: require('../assets/images/logo.png'),
    title: 'Unleash Your Creativity',
    subtitle:
      'Explore market places and create your own masterpiece.',
    height: 400,
    bottom: 310,
  },
  {
    image: require('../assets/images/CUi.png'),
    title: 'Personalize Your Experience',
    subtitle: 'Create Your perfect market place.',
    height: 700,
    bottom: 160,
  },
  {
    image: require('../assets/images/UI.png'),
    title: 'Get Started',
    subtitle: 'Join Us In Rukn And Let Your Creativity Flow!',
    height: 700,
    bottom: 160,
  },
];

const OnboardingScreen = () => {
  // Animated value for horizontal scroll.
  const scrollX = useRef(new Animated.Value(0)).current;
  // Local state to track the current page index.
  const [currentPage, setCurrentPage] = useState(0);

  // Handler to update current page index when scrolling stops.
  const handleMomentumScrollEnd = (e: { nativeEvent: { contentOffset: { x: number; }; }; }) => {
    const pageIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentPage(pageIndex);
  };

  // Handler for "Get Started" button tap.
  const handleGetStarted = () => {
    // TODO: Navigate to your main/home screen.
    router.push("/one")
  };

  return (
    <View style={styles.container}>
      {/* Animated horizontal scroll view */}
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
        {onboardingData.map((item, index) => {
          // Create an interpolation for the image scale based on scrollX.
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
          });

          return (
            <View key={index} style={[styles.page, { width }]}>
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
        })}
      </Animated.ScrollView>

      {/* White bottom overlay (similar to Flutter's positioned white container) */}
      <View style={styles.bottomOverlay} />

      {/* Text content displayed above the bottom overlay */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{onboardingData[currentPage].title}</Text>
        <Text style={styles.subtitle}>{onboardingData[currentPage].subtitle}</Text>
      </View>

      {/* "Get Started" button (only visible on the final page) */}
      {currentPage === onboardingData.length - 1 && (
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      )}

      {/* Indicator dots */}
      <View style={styles.indicatorContainer}>
        {onboardingData.map((_, i) => (
          <View
            key={i}
            style={[
              styles.indicator,
              i === currentPage && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%', // Adjust as needed; in Flutter there is horizontal padding.
    resizeMode: 'contain',
    position: 'absolute',
    left: 24,
    right: 24,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    height: height * 0.4,
    width: '100%',
    backgroundColor: '#FFFFFF',
    opacity: 0.97,
  },
  textContainer: {
    position: 'absolute',
    bottom: 200,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    marginTop: 6,
  },
  button: {
    position: 'absolute',
    bottom: 120,
    left: 24,
    right: 24,
    backgroundColor: '#F5A623',
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // For Android shadow (elevation) and iOS shadow properties.
    elevation: 8,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeIndicator: {
    width: 24,
    backgroundColor: '#F5A623',
  },
});

const App = () => {
  return <OnboardingScreen />;
};

export default App;
