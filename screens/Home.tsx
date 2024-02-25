/* eslint-disable react-native/no-inline-styles */
import {css} from '@emotion/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import IconPlus from '../assets/icon_plus.svg';
import IconSearch from '../assets/icon_search.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import SeeMore from '../components/SeeMore';
import {HomeStackParamList} from '../navigators/HomeNav';
import {Fonts} from '../utils/fontStyle';
import {mockData} from '../utils/mockData';
const styles = {
  banner: {
    background: css({
      width: '100%',
      alignItems: 'center',
    }),
    posterImg: css({width: 108, height: 165, borderRadius: 5}),
    search: {
      box: css({
        position: 'relative',
        backgroundColor: '#F2F3F5',
        borderRadius: 16,
        width: '91.6%',
        maxWidth: 340,
        height: 32,
        marginTop: 59,
      }),
      input: css(Fonts.Body2, {
        color: '#747F8E',
        paddingLeft: 103,
        width: '100%',
      }),
    },
    movieRecordList: {
      wrapper: css({
        backgroundColor: 'transparent',
        marginTop: 28,
      }),
    },
    addRecordBtn: css({
      width: '80%',
      maxWidth: 320,
      height: 35,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: 'rgba(242,243,245,0.4)',
      marginTop: 15,
      marginBottom: 17,
      paddingTop: 11,
      paddingBottom: 9,
    }),
  },
  movieInfoList: {
    wrapper: css({
      gap: 8,
      padding: 10,
      paddingLeft: 15,
      paddingRight: 15,
      backgroundColor: '#EDEDED',
    }),
    poster: css({width: 125, height: 171, borderRadius: 10}),
  },
};
type HomeScreenProps = NativeStackNavigationProp<HomeStackParamList, 'Home'>;
function Home() {
  const navigation = useNavigation<HomeScreenProps>();
  return (
    <Stack align="center" style={{backgroundColor: '#fff'}}>
      <Stack style={styles.banner.background}>
        <ImageBackground
          source={{
            uri: 'https://image.tmdb.org/t/p/original/pxsn8GtNHbN01iWkD2cV8CMuGzm.jpg',
          }}
          style={styles.banner.background}
        >
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          />
          <Group
            style={styles.banner.search.box}
            align="center"
            position="center"
          >
            <IconSearch style={{position: 'absolute', left: 15}} />
            <Pressable
              style={{width: '100%', alignItems: 'center'}}
              onPress={() => {
                navigation.navigate('Search');
              }}
            >
              <Typography variant="Body2" color="#737f8e">
                기록할 영화를 검색하세요!
              </Typography>
            </Pressable>
          </Group>
          <Group
            position="center"
            style={styles.banner.movieRecordList.wrapper}
          >
            <ScrollView
              horizontal
              pagingEnabled
              contentContainerStyle={{gap: 10, marginLeft: 10}}
            >
              {mockData.results.map((item) => {
                return (
                  <Image
                    src={
                      'https://image.tmdb.org/t/p/original' + item.poster_path
                    }
                    style={{width: 108, height: 165, borderRadius: 5}}
                    key={`popular-list-${item.title}`}
                  />
                );
              })}
            </ScrollView>
          </Group>
          <Pressable
            onPress={() => {
              navigation.navigate('AddRecord');
            }}
            style={styles.banner.addRecordBtn}
          >
            <Group align="center" gap={4}>
              <Typography variant="Body2" color="#fff">
                새로운 기록 추가하기
              </Typography>
              <IconPlus fill={'#fff'} />
            </Group>
          </Pressable>
        </ImageBackground>
      </Stack>
      <Stack
        style={[
          {
            width: '100%',
            paddingTop: 25,
            paddingBottom: 8,
          },
        ]}
      >
        <Group
          position="apart"
          style={{
            marginBottom: 5,
            marginLeft: 15,
            marginRight: 16,
            alignItems: 'center',
          }}
        >
          <Typography variant="Title1" color="#2D3540">
            인기 한국 작품을 기록해 볼까요?
          </Typography>
          <SeeMore link="인기 작품" />
        </Group>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.movieInfoList.wrapper}
        >
          {mockData.results.map((item) => {
            return (
              <Pressable
                onPress={() => {
                  navigation.navigate('Detail');
                }}
              >
                <Image
                  src={'https://image.tmdb.org/t/p/original' + item.poster_path}
                  style={styles.movieInfoList.poster}
                  key={`popular-list-${item.title}`}
                />
                <Typography variant="Body2" color="#000">
                  {item.title}
                </Typography>
              </Pressable>
            );
          })}
        </ScrollView>
      </Stack>
    </Stack>
  );
}

export default Home;
