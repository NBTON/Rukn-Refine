import { useEffect } from 'react';
import { Platform } from 'react-native';
import Animated from 'react-native-reanimated';

/**
 * Component that configures Reanimated to ignore reduced motion settings warnings
 * This component should be rendered at the top level of your app
 */
const ReanimatedConfig = () => {
  useEffect(() => {
    // This tells Reanimated to ignore the reduced motion setting
    // and continue with animations regardless of device settings
    // This will suppress the warning
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // Adding this configuration to ignore reduced motion setting warnings
      Animated.addWhitelistedNativeProps({reduceMotionMode: true});
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default ReanimatedConfig;
