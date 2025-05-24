import {css} from '@emotion/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, useWindowDimensions} from 'react-native';

import IconKakao from '../assets/icon_kakao.svg';
import LogoWhite from '../assets/mookive_logo_white.svg';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import {MainStackParamList} from '../navigators/Main';
import TabNav, {TabParamList} from '../navigators/TabNav';

const styles = {
  background: css({
    flex: 1,
    backgroundColor: '#6328ee',
  }),
  kakao: css({
    backgroundColor: '#f7e314',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  }),
};
type LoginScreenProps = {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<MainStackParamList, 'Login'>,
    BottomTabNavigationProp<TabParamList>
  >;
};
function Login({navigation}: LoginScreenProps) {
  const {width: deviceWidth, height: deviceHeight} = useWindowDimensions();
  return (
    <Stack style={styles.background} align="center" spacing={30}>
      <Stack align="center" spacing={-10}>
        <Typography variant="Title2" color="#fff">
          내 영화 기록들을 한눈에
        </Typography>
        <LogoWhite width={deviceWidth * 0.74} height={deviceHeight * 0.08} />
      </Stack>
      <Pressable
        style={[styles.kakao, {width: deviceWidth * 0.83, paddingVertical: 10}]}
        onPress={() => {
          navigation.navigate(TabNav, 'Home');
        }}
      >
        <IconKakao style={{position: 'absolute', left: deviceWidth * 0.058}} />
        <Typography variant="Info">카카오톡으로 빠르게 시작하기</Typography>
      </Pressable>
    </Stack>
  );
}

export default Login;
