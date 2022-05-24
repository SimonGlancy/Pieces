import React from "react";
import { Animated } from "react-native";
import { useAnimatedValue } from "../../hooks";
import { AnimatedContainerProps } from "./AnimatedContainer.types";

const AnimatedContainer = (props: AnimatedContainerProps) => {
  const { children, style, ...useAnimatedValueProps } = props;
  const { transformStyle } = useAnimatedValue(useAnimatedValueProps);

  return (
    <Animated.View style={[transformStyle, style]}>{children}</Animated.View>
  );
};

export default AnimatedContainer;
