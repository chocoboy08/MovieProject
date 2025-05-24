import {css} from '@emotion/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {useMutation, useQuery} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {Image, Pressable, ScrollView} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {instance} from '../apis/instance';
import IconAddList from '../assets/icon_addlist.svg';
import IconSearch from '../assets/icon_search.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import {MainStackParamList} from '../navigators/Main';
import {TabParamList} from '../navigators/TabNav';
import {Movie} from '../utils/type';

const styles = {
  pageTop: {
    wrapper: css({
      backgroundColor: '#fff',
      paddingTop: 56,
      paddingBottom: 12,
      marginBottom: 14,
    }),
    search: {
      box: css({
        position: 'relative',
        backgroundColor: '#F2F3F5',
        borderRadius: 16,
        width: 300,
        height: 32,
        marginTop: 11,
        paddingLeft: 35,
      }),
      input: css({
        width: '100%',
        color: '#747F8E',
        padding: 0,
        fontSize: 12,
      }),
    },
  },
  pageBottom: {
    wrapper: css({backgroundColor: '#fff', flex: 1}),
    movies: {
      border: {
        selected: css({
          borderColor: '#6f00f8',
          borderWidth: 1,
          borderRadius: 5,
        }),
        unselected: css({
          borderColor: '#e3e3e3',
          borderBottomWidth: 0.5,
        }),
      },
    },
  },
};
type AddMoviesScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'AddMovies'>,
  BottomTabScreenProps<TabParamList>
>;

function AddMovies({navigation, route}: AddMoviesScreenProps) {
  const [selectedMovie, setSelectedMovie] = useState<Movie>();
  const userId = 3;
  const {playlistId} = route.params;
  //본 영화 목록 가져오기
  const watchedMovieQuery = useQuery<Movie[]>({
    queryKey: ['watched', 'addToPlaylist'],
    queryFn: async () => {
      try {
        const response = await instance.get(
          `/watched/playlist/addition?userId=${userId}`,
        );
        return response.data;
      } catch (error) {
        console.log(error.response.data);
      }
    },
  });
  //영화 추가하기
  const playlistMovieMutation = useMutation({
    mutationKey: ['watchedAdd'],
    mutationFn: async () => {
      try {
        const response = await instance.post('/movieInPlaylist', {
          playlistId: playlistId,
          tmdbId: selectedMovie?.tmdbId?.toString(),
        });
      } catch (error) {
        console.log(error.response.data);
      }
    },
    onSuccess: () => {
      navigation.goBack();
    },
  });
  useEffect(() => {
    console.log(selectedMovie?.tmdbId?.toString());
  });
  return (
    <Stack style={{flex: 1}}>
      <ScrollView style={{gap: 14}} contentContainerStyle={{flexGrow: 1}}>
        <Stack style={styles.pageTop.wrapper} align="center" justify="flex-end">
          <Stack>
            <Typography variant="Head1" color="#2d3540">
              플레이리스트에 영화 추가하기
            </Typography>
            <Typography variant="Body2" color="#2d3540">
              어떤 영화를 플레이리스트에 추가할까요?
            </Typography>
            <Group style={styles.pageTop.search.box} align="center">
              <IconSearch style={{position: 'absolute', left: 15}} />
              <Pressable
                style={styles.pageTop.search.input}
                onPress={() => {
                  navigation.navigate('Search', {
                    playlistId: playlistId,
                  });
                }}
              >
                <Typography variant="Body2" color="#747f8e">
                  영화 제목을 검색해보세요
                </Typography>
              </Pressable>
            </Group>
          </Stack>
        </Stack>
        <Stack
          style={[styles.pageBottom.wrapper, {width: '100%'}]}
          justify="flex-start"
        >
          <Stack spacing={10} style={{marginTop: 13}} align="center">
            <Group style={{width: 300}}>
              <Typography variant="Title1">내가 본 영화들</Typography>
            </Group>
            <Stack style={{width: '100%'}}>
              {watchedMovieQuery.data?.map((item, idx) => {
                return (
                  <Pressable
                    onPress={() => {
                      setSelectedMovie(selectedMovie ? undefined : item);
                    }}
                    style={[
                      selectedMovie === item
                        ? styles.pageBottom.movies.border.selected
                        : styles.pageBottom.movies.border.unselected,
                      {alignItems: 'center'},
                    ]}
                    key={`add-popular-movie-${item.tmdbId}-${idx}`}
                  >
                    <Group
                      align="flex-start"
                      gap={10}
                      style={{marginTop: 10, marginBottom: 10, width: 300}}
                    >
                      <Image
                        source={{uri: item.poster}}
                        style={{width: 65, height: 89, borderRadius: 5}}
                      />
                      <Stack>
                        <Typography variant="Title2">{item.title}</Typography>
                        <Typography variant="Info" color="#a4a4a4">
                          {`${item.nation}·${item.year}·${item.director}`}
                        </Typography>
                      </Stack>
                    </Group>
                  </Pressable>
                );
              })}
            </Stack>
          </Stack>
        </Stack>
      </ScrollView>
      {selectedMovie && (
        <Shadow
          style={{
            width: 125,
            height: 33,
            borderRadius: 16.5,
            backgroundColor: '#6f00f8',
            justifyContent: 'center',
          }}
          containerStyle={{position: 'absolute', right: 15, bottom: 30}}
          offset={[0, 2]}
        >
          <Pressable
            onPress={() => {
              playlistMovieMutation.mutate();
            }}
          >
            <Group position="center" align="center">
              <IconAddList fill="#fff" width={15} />
              <Typography variant="Info" color="#fff">
                플리에 추가하기
              </Typography>
            </Group>
          </Pressable>
        </Shadow>
      )}
    </Stack>
  );
}

export default AddMovies;
