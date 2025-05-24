import {css} from '@emotion/native';
import React from 'react';
import {ImageBackground, Pressable, View} from 'react-native';
import IconLogo from '../assets/icon_empty_logo.svg';
import {StorageBoxProps} from '../utils/type';
import Stack from './@base/Stack';

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

function StorageBox({
  width: boxWidth,
  height: boxHeight,
  isEmpty,
  img,
  children,
  onPress,
}: StorageBoxProps) {
  return (
    <Pressable onPress={onPress}>
      {isEmpty ? (
        <Stack
          justify="flex-end"
          spacing={7}
          style={{
            width: boxWidth,
            height: boxHeight,
            paddingBottom: 10,
            borderRadius: 10,
            borderColor: '#e6e6e6',
            borderWidth: 1,
          }}
        >
          <IconLogo
            width={boxWidth * 0.57}
            height={boxHeight * 0.46}
            fill="#e6e6e6"
            style={{alignSelf: 'center'}}
          />
          <View style={{paddingLeft: boxWidth * 0.08}}>{children}</View>
        </Stack>
      ) : (
        <ImageBackground
          source={img}
          style={[
            styles.backgroundImg,
            {
              width: boxWidth,
              height: boxHeight,
              paddingLeft: boxWidth * 0.08,
            },
          ]}
          imageStyle={{borderRadius: 10}}
        >
          <View
            style={[
              styles.backgroundBlur,
              {width: boxWidth, height: boxHeight},
            ]}
          />
          {children}
        </ImageBackground>
      )}
    </Pressable>
  );
}

export default StorageBox;
