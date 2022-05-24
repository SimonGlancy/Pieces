import { StyleProp, ViewStyle } from "react-native";
import { UseAnimatedValueProps } from "../../hooks";

export type AnimatedContainerProps = UseAnimatedValueProps & {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};
