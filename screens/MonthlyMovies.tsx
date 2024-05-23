import {css} from '@emotion/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Pressable, ScrollView} from 'react-native';
import IconBack from '../assets/icon_back.svg';
import IconStar from '../assets/icon_fullstar.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import MoviePoster from '../components/MoviePoster';
import {CalendarStackParamList} from '../navigators/CalendarNav';
import {MonthlyMovieData} from './Calendar';

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

type MonthlyMoviesScreenProp = {
  navigation: NativeStackNavigationProp<
    CalendarStackParamList,
    'MonthlyMovies'
  >;
};
function MonthlyMovies({navigation}: MonthlyMoviesScreenProp) {
  const data = Object.entries(MonthlyMovieData);
  const month = 4;
  return (
    <ScrollView contentContainerStyle={styles.background}>
      <IconBack style={{position: 'absolute', top: 50}} />
      <Group>
        <Typography variant="Head1">내가 본 영화들</Typography>
      </Group>
      {data.map((item, idx) => {
        if (item[1] !== undefined)
          return (
            <Stack
              style={{
                borderBottomColor: '#c2c2c2',
                borderBottomWidth: 0.5,
                marginTop: 20,
              }}
            >
              <Typography variant="Info" color="#6f00f8">
                {month}월 {idx + 1}일
              </Typography>
              <Stack>
                {item[1].map((movieItem) => (
                  <Pressable
                    style={styles.movies.wrapper}
                    onPress={() => {
                      navigation.navigate('Detail');
                    }}
                  >
                    <MoviePoster
                      width={63}
                      height={83}
                      radius={5}
                      img={{
                        uri:
                          'https://image.tmdb.org/t/p/original' +
                          movieItem.poster_path,
                      }}
                    />
                    <Stack justify="space-between">
                      <Stack>
                        <Typography variant="Title2" color="#2d3540">
                          {movieItem.title}
                        </Typography>
                        <Typography variant="Info" color="#a4a4a4">
                          {movieItem.release_date.slice(0, 4)}
                        </Typography>
                      </Stack>
                      <Stack>
                        <Group align="center" gap={2}>
                          <IconStar width={13} height={13} />
                          <Typography variant="Info" color="#6f00f8">
                            {movieItem.rating}
                          </Typography>
                        </Group>
                        <Typography variant="Info" color="#a4a4a4">
                          -
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
  );
}

export default MonthlyMovies;
