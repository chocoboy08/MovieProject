/* eslint-disable react-native/no-inline-styles */
import {css} from '@emotion/native';
import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import IconPlus from '../../assets/icon_plus.svg';
import IconSearch from '../../assets/icon_search.svg';
import Group from '../../components/@base/Group';
import Stack from '../../components/@base/Stack';
import SeeMore from '../../components/SeeMore';
import {mockData} from '../../utils/mockData';
import Search from '../search/Search';
const styles = {
  background: css({
    width: '100%',
    alignItems: 'center',
  }),
  posterImg: css({width: 108, height: 165, borderRadius: 5}),
  search: {
    box: css({
      position: 'relative',
      backgroundColor: '#F2F3F5',
      justifyContent: 'center',
      borderRadius: 16,
      width: '91.6%',
      height: 32,
      marginTop: 59,
    }),
    input: css({
      color: '#747F8E',
      padding: 0,
      fontSize: 12,
    }),
  },
  movieRecordList: {
    wrapper: css({
      backgroundColor: 'transparent',
      marginTop: 28,
    }),
  },
};
// type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
function Home() {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchPress = () => {
    setIsSearching(!isSearching);
  };

  return isSearching ? (
    <Search handleSearch={handleSearchPress} />
  ) : (
    <Stack align="center">
      <Stack style={styles.background}>
        <ImageBackground
          source={{
            uri: 'https://image.tmdb.org/t/p/original/pxsn8GtNHbN01iWkD2cV8CMuGzm.jpg',
          }}
          style={styles.background}
        >
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          />
          <Group style={styles.search.box} align="center">
            <IconSearch style={{position: 'absolute', left: 15}} />
            <Pressable style={styles.search.input} onPress={handleSearchPress}>
              <Text style={{color: '#747F8E', fontSize: 12, lineHeight: 16}}>
                기록할 영화를 검색하세요!
              </Text>
            </Pressable>
          </Group>
          <Group position="center" style={styles.movieRecordList.wrapper}>
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
            onPress={() => {}}
            style={[
              {
                width: '80%',
                height: 35,
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: 'rgba(242,243,245,0.4)',
                marginTop: 15,
                marginBottom: 17,
                paddingTop: 11,
                paddingBottom: 9,
              },
            ]}
          >
            <Group align="center" gap={4}>
              <Text
                style={{
                  fontSize: 12,
                  fontStyle: 'normal',
                  padding: 0,
                  lineHeight: 15,
                  color: 'white',
                }}
              >
                새로운 기록 추가하기
              </Text>
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
          <Text
            style={{
              color: '#2D3540',
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            인기 한국 작품을 기록해 볼까요?
          </Text>
          <SeeMore link="인기 작품" type="small" />
        </Group>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={125}
          contentContainerStyle={{
            gap: 8,
            padding: 10,
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: '#EDEDED',
          }}
        >
          {mockData.results.map((item) => {
            return (
              <View>
                <Image
                  src={'https://image.tmdb.org/t/p/original' + item.poster_path}
                  style={{width: 125, height: 171, borderRadius: 10}}
                  key={`popular-list-${item.title}`}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    width: 125,
                    marginTop: 8,
                  }}
                >
                  {item.title}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </Stack>
    </Stack>
  );
}

export default Home;
