import React from 'react';
import {StyleProp, Text, TextProps, TextStyle} from 'react-native';
import {Fonts} from '../../utils/fontStyle';

type TextType = keyof typeof Fonts;
interface TypographyProps extends TextProps {
  variant: TextType;
  color?: string;
  style?: StyleProp<TextStyle>;
}

function Typography({
  children,
  variant,
  color = '#2D3540',
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[Fonts[variant], {color: color}, style]} {...props}>
      {children}
    </Text>
  );
}

export default Typography;
