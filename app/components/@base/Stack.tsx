import {css} from '@emotion/native';
import React from 'react';
import {
  FlexAlignType,
  StyleProp,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

const styles = {
  default: css({flexDirection: 'column'}),
};
interface StackProps extends ViewProps {
  spacing?: number;
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  align?: FlexAlignType;
  style?: StyleProp<ViewStyle>;
}

function Stack({
  children,
  spacing,
  justify = 'center',
  align,
  style,
}: StackProps) {
  return (
    <View
      style={[
        styles.default,
        {gap: spacing, justifyContent: justify, alignItems: align},
        style,
      ]}
    >
      {children}
    </View>
  );
}

export default Stack;
