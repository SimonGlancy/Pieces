import React, { useMemo, useCallback, useEffect, FC } from "react";
import { Animated, Easing } from "react-native";

import { UseAnimatedValueProps } from "./useAnimatedValue.types";

const DEFAULT_INPUT_RANGE = [0, 1];
const DEFAULT_OUTPUT_RANGE = [0.9, 1];
const DEFAULT_FORWARD_ANIMATION_DURATION = 500;
const DEFAULT_BACKWARD_ANIMATION_DURATION = 200;
const DEFAULT_TRANSFORM_KEY = "scale";

export const DEFAULT_EASING_FUNCTION = Easing.elastic(0.8);

const useAnimatedValue = (props: UseAnimatedValueProps) => {
  const {
    active,
    inputRange = DEFAULT_INPUT_RANGE,
    outputRange = DEFAULT_OUTPUT_RANGE,
    forwardAnimationDuration = DEFAULT_FORWARD_ANIMATION_DURATION,
    backwardAnimationDuration = DEFAULT_BACKWARD_ANIMATION_DURATION,
    useNativeDriver = true,
    easingFunction,
    transformKey = DEFAULT_TRANSFORM_KEY,
    infinite = false,
    onAnimationComplete,
    forwardValue = 1,
    backwardValue = 0,
    forwardDelay = 0,
    backwardDelay = 0,
  } = props;
  const animation = useMemo(() => new Animated.Value(0), []);

  const animate = useCallback(
    (animValue: Animated.Value, forward) => {
      Animated.timing(animValue, {
        toValue: forward ? forwardValue : backwardValue,
        duration: forward
          ? forwardAnimationDuration
          : backwardAnimationDuration,
        delay: forward ? forwardDelay : backwardDelay,
        easing: easingFunction ? easingFunction : undefined,
        useNativeDriver,
      }).start(() => {
        infinite && animate(animValue, forward);
        onAnimationComplete && onAnimationComplete(animValue);
      });
    },
    [
      forwardAnimationDuration,
      backwardAnimationDuration,
      useNativeDriver,
      infinite,
      onAnimationComplete,
      easingFunction,
      backwardValue,
      forwardValue,
      forwardDelay,
      backwardDelay,
      backwardValue,
    ]
  );

  useEffect(() => {
    animate(animation, active);
  }, [active, animate, animation]);

  const animatedTransform = useMemo(
    () =>
      animation.interpolate({
        inputRange,
        outputRange,
      }),
    [inputRange, outputRange]
  );

  const transformStyle: Animated.Animated = useMemo(() => {
    return transformKey === "opacity" ||
      transformKey === "width" ||
      transformKey === "height" ||
      transformKey === "paddingTop" ||
      transformKey === "marginTop" ||
      transformKey === "backgroundColor"
      ? {
          [transformKey]: animatedTransform,
        }
      : {
          transform: [
            {
              [transformKey]: animatedTransform,
            },
          ],
        };
  }, [transformKey, animatedTransform]);

  return {
    animate,
    animation,
    transformStyle,
    animatedTransform,
  };
};

export default useAnimatedValue;
