import {css} from '@emotion/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import {ActivityIndicator, Pressable, ScrollView} from 'react-native';
import IconBack from '../assets/icon_back.svg';
import IconStar from '../assets/icon_fullstar.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import MoviePoster from '../components/MoviePoster';
import {MainStackParamList} from '../navigators/Main';
import {TabParamList} from '../navigators/TabNav';
import {Movie} from '../utils/type';

const styles = {
  background: css({
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingTop: 50,
  }),
  movies: {
    wrapper: css({
      flexDirection: 'row',
      paddingVertical: 10,
      borderTopColor: '#c2c2c2',
      borderTopWidth: 0.5,
      gap: 10,
    }),
  },
};

type MonthlyMoviesScreenProp = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'MonthlyMovies'>,
  BottomTabScreenProps<TabParamList>
>;

function MonthlyMovies({navigation, route}: MonthlyMoviesScreenProp) {
  const {year, month} = route.params;

  const monthlyMoviesQuery = useQuery<Movie[][]>({
    queryKey: ['calenderMovies', year, month + 1],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://13.124.184.115/record/calendar?year=${year}&month=${
            month + 1 < 10 ? '0' + (month + 1) : month + 1
          }`,
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return monthlyMoviesQuery.isLoading ? (
    <ActivityIndicator size={'large'} />
  ) : (
    monthlyMoviesQuery.data && (
      <ScrollView contentContainerStyle={styles.background}>
        <Pressable
          style={{position: 'absolute', top: 50}}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <IconBack />
        </Pressable>
        <Group>
          <Typography variant="Head1">내가 본 영화들</Typography>
        </Group>
        {monthlyMoviesQuery.data &&
          monthlyMoviesQuery.data.map((item, idx) => {
            if (item !== null)
              return (
                <Stack
                  style={{
                    borderBottomColor: '#c2c2c2',
                    borderBottomWidth: 0.5,
                    marginTop: 20,
                  }}
                  key={`${year}-${month + 1}-${idx}-movies`}
                >
                  <Typography variant="Info" color="#6f00f8">
                    {month + 1}월 {idx}일
                  </Typography>
                  <Stack>
                    {item.map((movieItem) => (
                      <Pressable
                        style={styles.movies.wrapper}
                        onPress={() => {
                          navigation.navigate('Detail', {id: movieItem.tmdbId});
                        }}
                        key={`${year}-${month}-${movieItem.title}`}
                      >
                        <MoviePoster
                          width={63}
                          height={83}
                          radius={5}
                          img={{
                            uri: movieItem.poster,
                          }}
                        />
                        <Stack justify="space-between">
                          <Stack>
                            <Typography variant="Title2" color="#2d3540">
                              {movieItem.title}
                            </Typography>
                            <Typography variant="Info" color="#a4a4a4">
                              {movieItem.nation}·{movieItem.year}·
                              {movieItem.director}
                            </Typography>
                          </Stack>
                          <Stack>
                            <Group align="center" gap={2}>
                              <IconStar width={13} height={13} />
                              <Typography variant="Info" color="#6f00f8">
                                {movieItem.rating || '-'}
                              </Typography>
                            </Group>
                            <Typography variant="Info" color="#a4a4a4">
                              {movieItem.review}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Pressable>
                    ))}
                  </Stack>
                </Stack>
              );
          })}
      </ScrollView>
    )
  );
}

export default MonthlyMovies;
