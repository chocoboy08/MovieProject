import {css} from '@emotion/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useQuery} from '@tanstack/react-query';
import React from 'react';
import {Pressable, ScrollView} from 'react-native';
import {instance} from '../apis/instance';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import MoviePoster from '../components/MoviePoster';
import SeeMore from '../components/SeeMore';
import StorageBox from '../components/StorageBox';
import {MainStackParamList} from '../navigators/Main';
import {TabParamList} from '../navigators/TabNav';
import {GenreStorage, Movie, PlayList} from '../utils/type';

const styles = {
  section: css({
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  }),
};

type StorageScreenProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Storage'>,
  NativeStackNavigationProp<MainStackParamList>
>;
function Storage() {
  const navigation = useNavigation<StorageScreenProps>();
  const userId = 3;

  //장르 보관함 가져오기
  const genreStorageQuery = useQuery<GenreStorage[]>({
    queryKey: ['genre'],
    queryFn: async () => {
      try {
        const response = await instance.get(
          `/watched/genre/list?userId=${userId}`,
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });

  //플리 가져오기
  const playlistQuery = useQuery<PlayList[]>({
    queryKey: ['playlists', 3],
    queryFn: async () => {
      try {
        const response = await instance.get(`/playlist/${userId}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });

  //이번 주 기록 가져오기
  const weeklyReviewQuery = useQuery<Movie[]>({
    queryKey: ['weeklyReview', userId],
    queryFn: async () => {
      try {
        const response = await instance.get(`/record/week/${userId}`);
        return response.data;
      } catch (error) {
        console.log(error.response.data);
      }
    },
  });

  return (
    <ScrollView contentContainerStyle={{gap: 14, flexGrow: 1}}>
      <Stack style={[styles.section, {paddingTop: 30}]} spacing={5}>
        <Typography variant="Head1">보관함</Typography>
      </Stack>
      <Stack style={styles.section} spacing={5}>
        <Typography variant="Title2">장르별 보관함</Typography>
        <ScrollView
          horizontal
          contentContainerStyle={{gap: 10}}
          showsHorizontalScrollIndicator={false}
        >
          {genreStorageQuery.data &&
            genreStorageQuery.data.map((item) => (
              <StorageBox
                isEmpty={item.poster === null}
                width={92}
                height={82}
                img={{uri: item.poster}}
                onPress={() => {
                  navigation.navigate('StorageDetail', {
                    id: item.genre,
                    editable: false,
                  });
                }}
                key={`genre-storage-${item.genre}`}
              >
                <Typography
                  variant="Info"
                  color={item.poster === null ? '#a6a6a6' : '#ececec'}
                >
                  {item.genre}
                </Typography>
              </StorageBox>
            ))}
        </ScrollView>
      </Stack>
      {!playlistQuery.isLoading && (
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
            {playlistQuery.data?.map((item, idx) => (
              <StorageBox
                isEmpty={item.poster === null}
                img={
                  item.poster
                    ? {
                        uri: item.poster,
                      }
                    : undefined
                }
                width={182}
                height={125}
                onPress={() => {
                  item.playlistId &&
                    navigation.navigate('StorageDetail', {
                      id: item.playlistId,
                      editable: idx > 1,
                    });
                }}
              >
                <Typography
                  variant="Title1"
                  color={item.poster === null ? '#a6a6a6' : '#ececec'}
                >
                  {item.name}
                </Typography>
              </StorageBox>
            ))}
          </ScrollView>
        </Stack>
      )}
      <Stack style={[styles.section, {flex: 1}]} spacing={5}>
        <Typography variant="Title2">이번 주 나의 기록</Typography>
        <ScrollView
          horizontal
          contentContainerStyle={{gap: 10}}
          showsHorizontalScrollIndicator={false}
        >
          {weeklyReviewQuery.data?.map((item) => (
            <Pressable
              onPress={() => {
                navigation.navigate('Detail', {id: item.tmdbId});
              }}
              key={`weekly-review-movie-${item.tmdbId}`}
            >
              <MoviePoster
                width={115}
                height={162}
                radius={10}
                img={{
                  uri: item.poster,
                }}
              />
              <Typography
                variant="Info"
                color="#000"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{width: 115}}
              >
                {item.title}
              </Typography>
            </Pressable>
          ))}
        </ScrollView>
      </Stack>
    </ScrollView>
  );
}

export default Storage;
