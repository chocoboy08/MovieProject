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
  default: css({flexDirection: 'row'}),
  position: {
    left: css({justifyContent: 'flex-start'}),
    right: css({justifyContent: 'flex-end'}),
    center: css({justifyContent: 'center'}),
    apart: css({justifyContent: 'space-between'}),
  },
};
interface GroupProps extends ViewProps {
  gap?: number;
  align?: FlexAlignType;
  position?: 'left' | 'right' | 'center' | 'apart';
  style?: StyleProp<ViewStyle>;
}

function Group({
  children,
  gap,
  align,
  position = 'left',
  style,
  ...props
}: GroupProps) {
  return (
    <View
      style={[
        styles.default,
        styles.position[position],
        {gap: gap, alignItems: align},
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export default Group;
