import { Animated, EasingFunction } from "react-native";

export interface UseAnimatedValueProps {
  // whether the aniimation runs. if false the animation will run in reverse
  active: boolean;
  // see animated interpolation for inputRange / outputRange
  inputRange?: number[];
  outputRange?: number[] | string[];
  // animation can run on entry and exit
  // possible to specify different speeds
  forwardAnimationDuration?: number;
  backwardAnimationDuration?: number;
  useNativeDriver?: boolean;
  // note useNativeDriver defaults to true so must be disabled
  // to allow for easing function
  easingFunction?: EasingFunction;
  // value for which the animation will be run on
  transformKey?: string;
  // run the animation on repeat
  infinite?: boolean;
  onAnimationComplete?: (animation: Animated.Value) => void;

  forwardValue?: number;
  backwardValue?: number;
  forwardDelay?: number;
  backwardDelay?: number;
}
