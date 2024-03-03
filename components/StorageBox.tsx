import {css} from '@emotion/native';
import React, {ReactNode} from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  View,
} from 'react-native';

export interface StorageBoxProps {
  width: number;
  height: number;
  img: ImageSourcePropType;
  children: ReactNode;
  onPress: () => void;
}

const styles = {
  backgroundImg: css({
    justifyContent: 'flex-end',
    paddingBottom: 10,
  }),
  backgroundBlur: css({
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    borderRadius: 10,
    top: 0,
    left: 0,
  }),
};

function StorageBox({width, height, img, children, onPress}: StorageBoxProps) {
  return (
    <Pressable onPress={onPress}>
      <ImageBackground
        source={img}
        style={[
          styles.backgroundImg,
          {
            width: width,
            height: height,
            paddingLeft: width * 0.08,
          },
        ]}
        imageStyle={{borderRadius: 10}}
      >
        <View style={[styles.backgroundBlur, {width: width, height: height}]} />
        {children}
      </ImageBackground>
    </Pressable>
  );
}

export default StorageBox;
