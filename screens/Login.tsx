import {css} from '@emotion/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Image, Pressable, useWindowDimensions} from 'react-native';

import IconKakao from '../assets/icon_kakao.svg';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import {HomeStackParamList} from '../navigators/HomeNav';

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
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Home'>;
};
function Login({navigation}: LoginScreenProps) {
  const {width: deviceWidth, height: deviceHeight} = useWindowDimensions();
  return (
    <Stack style={styles.background} align="center" spacing={30}>
      <Typography variant="Title2" color="#fff">
        내 영화 기록들을 한눈에
      </Typography>
      <Image source={require('../assets/mookive_logo.png')} />
      <Pressable
        style={[styles.kakao, {width: deviceWidth * 0.83, paddingVertical: 10}]}
        onPress={() => {
          navigation.navigate('Home');
        }}
      >
        <IconKakao style={{position: 'absolute', left: deviceWidth * 0.058}} />
        <Typography variant="Info">카카오톡으로 빠르게 시작하기</Typography>
      </Pressable>
    </Stack>
  );
}

export default Login;
