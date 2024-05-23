import {css} from '@emotion/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, ScrollView} from 'react-native';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import MoviePoster from '../components/MoviePoster';
import SeeMore from '../components/SeeMore';
import StorageBox from '../components/StorageBox';
import {StorageStackParamList} from '../navigators/StorageNav';
import {mockData} from '../utils/mockData';

const styles = {
  section: css({
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 20,
  }),
};
type StorageScreenProps = NativeStackNavigationProp<
  StorageStackParamList,
  'Storage'
>;
function Storage() {
  const navigation = useNavigation<StorageScreenProps>();
  const handleStoragePress = () => {
    navigation.navigate('StorageDetail');
  };
  return (
    <Stack spacing={14}>
      <Stack style={[styles.section, {paddingTop: 58}]} spacing={5}>
        <Typography variant="Head1">보관함</Typography>
      </Stack>
      <Stack style={styles.section} spacing={5}>
        <Typography variant="Title2">장르별 보관함</Typography>
        <ScrollView
          horizontal
          contentContainerStyle={{gap: 10}}
          showsHorizontalScrollIndicator={false}
        >
          <StorageBox
            img={{
              uri:
                'https://image.tmdb.org/t/p/original' +
                mockData[0].results[0].poster_path,
            }}
            width={92}
            height={82}
            onPress={handleStoragePress}
          >
            <Typography variant="Info" color="#ececec">
              액션
            </Typography>
          </StorageBox>
          <StorageBox
            img={{
              uri:
                'https://image.tmdb.org/t/p/original' +
                mockData[1].results[12].poster_path,
            }}
            width={92}
            height={82}
            onPress={handleStoragePress}
          >
            <Typography variant="Info" color="#ececec">
              로맨스
            </Typography>
          </StorageBox>
          <StorageBox
            isEmpty
            width={92}
            height={82}
            onPress={handleStoragePress}
          >
            <Typography variant="Info" color="#a0a0a0">
              드라마
            </Typography>
          </StorageBox>
        </ScrollView>
      </Stack>
      <Stack style={styles.section} spacing={5}>
        <Group position="apart">
          <Typography variant="Title2">나의 영화 플레이리스트</Typography>
          <SeeMore
            routeFn={() => {
              navigation.navigate('PlayLists');
            }}
          />
        </Group>
        <ScrollView
          horizontal
          contentContainerStyle={{gap: 10}}
          showsHorizontalScrollIndicator={false}
        >
          <StorageBox
            img={require('../assets/posters/avatar.jpeg')}
            isEmpty
            width={182}
            height={125}
            onPress={handleStoragePress}
          >
            <Typography variant="Title1" color="#a6a6a6">
              나중에 볼 영화
            </Typography>
          </StorageBox>
          <StorageBox
            img={{
              uri:
                'https://image.tmdb.org/t/p/original' +
                mockData[0].results[2].poster_path,
            }}
            width={182}
            height={125}
            onPress={handleStoragePress}
          >
            <Typography variant="Title1" color="#ececec">
              내가 본 영화들
            </Typography>
          </StorageBox>
          <StorageBox
            img={require('../assets/posters/avatar.jpeg')}
            width={182}
            height={125}
            onPress={handleStoragePress}
          >
            <Typography variant="Title1" color="#ececec">
              2024 가장 재밌게 본
            </Typography>
          </StorageBox>
          <StorageBox
            img={require('../assets/posters/aladdin.png')}
            isEmpty
            width={182}
            height={125}
            onPress={handleStoragePress}
          >
            <Typography variant="Title1" color="#a6a6a6">
              겨울에 보고싶은 영화
            </Typography>
          </StorageBox>
          <StorageBox
            img={require('../assets/posters/aladdin.png')}
            width={182}
            height={125}
            onPress={handleStoragePress}
          >
            <Typography variant="Title1" color="#ececec">
              드라마
            </Typography>
          </StorageBox>
        </ScrollView>
      </Stack>
      <Stack style={styles.section} spacing={5}>
        <Typography variant="Title2">이번 주 나의 기록</Typography>
        <ScrollView
          horizontal
          contentContainerStyle={{gap: 10}}
          showsHorizontalScrollIndicator={false}
        >
          <Pressable>
            <MoviePoster
              width={115}
              height={162}
              radius={10}
              img={{
                uri:
                  'https://image.tmdb.org/t/p/original' +
                  mockData[1].results[0].poster_path,
              }}
            />
            <Typography variant="Info" color="#000">
              {mockData[1].results[0].title}
            </Typography>
          </Pressable>
          <Pressable>
            <MoviePoster
              width={115}
              height={162}
              radius={10}
              img={{
                uri:
                  'https://image.tmdb.org/t/p/original' +
                  mockData[1].results[1].poster_path,
              }}
            />
            <Typography variant="Info" color="#000">
              {mockData[1].results[1].title}
            </Typography>
          </Pressable>
        </ScrollView>
      </Stack>
    </Stack>
  );
}

export default Storage;
