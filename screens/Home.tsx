/* eslint-disable react-native/no-inline-styles */
import {css} from '@emotion/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import IconLogo from '../assets/icon_empty_logo.svg';
import IconPlus from '../assets/icon_plus.svg';
import IconSearch from '../assets/icon_search.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import MoviePoster from '../components/MoviePoster';
import {HomeStackParamList} from '../navigators/HomeNav';
import {Fonts} from '../utils/fontStyle';
import {mockData} from '../utils/mockData';
const styles = {
  banner: {
    background: css({
      width: '100%',
      alignItems: 'center',
      backgroundColor: '#c0c0c0',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
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
        marginBottom: 20,
      }),
      input: css(Fonts.Body2, {
        color: '#747F8E',
        paddingLeft: 103,
        width: '100%',
      }),
    },
    movieRecordList: {
      posterContainer: css({
        justifyContent: 'center',
        alignItems: 'center',
      }),
    },
  },
  movieInfoList: {
    wrapper: css({
      gap: 8,
      padding: 10,
      paddingLeft: 15,
      paddingRight: 15,
      backgroundColor: '#EDEDED',
    }),
    poster: css({
      width: 125,
      height: 171,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    }),
  },
};
type HomeScreenProps = NativeStackNavigationProp<HomeStackParamList, 'Home'>;
function Home() {
  const navigation = useNavigation<HomeScreenProps>();
  const {width: deviceWidth, height: deviceHeight} = useWindowDimensions();
  const watchedMovies = mockData[0].results.filter(
    (item, idx) => idx < 3 && item,
  );
  const [selectedPoster, setSelectedPoster] = useState('');
  const isCarousel = React.useRef(null);
  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: '#fff',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Stack style={[styles.banner.background, {height: deviceHeight * 0.4}]}>
        {watchedMovies.length !== 0 && (
          <Image
            source={{
              uri: 'https://image.tmdb.org/t/p/original' + selectedPoster,
            }}
            width={deviceWidth}
            height={deviceHeight * 0.4}
            style={{position: 'absolute', borderRadius: 10}}
          />
        )}
        {watchedMovies.length === 0 && (
          <IconLogo
            fill="#cecece"
            width={deviceWidth * 1.1}
            height={deviceHeight * 0.25}
            style={{position: 'absolute', top: 97}}
          />
        )}
        {watchedMovies.length !== 0 && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              backgroundColor: 'rgba(0,0,0,0.7)',
            }}
          />
        )}
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
              찾는 영화 제목을 검색해보세요!
            </Typography>
          </Pressable>
        </Group>
        {watchedMovies.length === 0 ? (
          <Pressable
            onPress={() => {
              navigation.navigate('Search');
            }}
          >
            <Stack
              style={{
                width: 128,
                height: 195,
                backgroundColor: 'rgba(255,255,255,0.5)',
                borderRadius: 5,
                borderColor: '#fff',
                borderWidth: 3,
              }}
              align="center"
              justify="center"
              spacing={22}
            >
              <IconPlus fill="#727272" width={43} height={43} />
              <Typography
                variant="Title1"
                color="#727272"
                style={{textAlign: 'center'}}
              >
                첫 영화 감상을 기록하세요!
              </Typography>
            </Stack>
          </Pressable>
        ) : (
          <Carousel
            layout="default"
            ref={isCarousel}
            data={watchedMovies}
            renderItem={({item, index}) => {
              return (
                <Pressable
                  key={index}
                  style={styles.banner.movieRecordList.posterContainer}
                >
                  <MoviePoster
                    img={{
                      uri:
                        'https://image.tmdb.org/t/p/original' +
                        item.poster_path,
                    }}
                    width={128}
                    height={195}
                    radius={5}
                  />
                </Pressable>
              );
            }}
            onSnapToItem={(idx) => {
              setSelectedPoster(watchedMovies[idx].poster_path);
            }}
            onLayout={() => {
              setSelectedPoster(
                watchedMovies.length === 1
                  ? watchedMovies[0].poster_path
                  : watchedMovies[1].poster_path,
              );
            }}
            sliderWidth={deviceWidth * 0.9}
            itemWidth={128}
            firstItem={1}
          />
        )}
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
            인기 작품을 기록해 볼까요?
          </Typography>
        </Group>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.movieInfoList.wrapper}
        >
          {mockData[0].results.map((item) => {
            return (
              <Pressable
                onPress={() => {
                  navigation.navigate('Detail');
                }}
                key={`home-popular-korea-movie-${item.id}`}
              >
                <MoviePoster
                  img={{
                    uri:
                      'https://image.tmdb.org/t/p/original' + item.poster_path,
                  }}
                  width={125}
                  height={171}
                  radius={10}
                />
                <Typography variant="Body2" color="#000">
                  {item.title}
                </Typography>
              </Pressable>
            );
          })}
        </ScrollView>
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
            최신 개봉작을 감상해요
          </Typography>
        </Group>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.movieInfoList.wrapper}
        >
          {mockData[1].results.map((item) => {
            return (
              <Pressable
                onPress={() => {
                  navigation.navigate('Detail');
                }}
                key={`home-popular-korea-movie-${item.id}`}
              >
                <MoviePoster
                  img={{
                    uri:
                      'https://image.tmdb.org/t/p/original' + item.poster_path,
                  }}
                  width={125}
                  height={171}
                  radius={10}
                />
                <Typography variant="Body2" color="#000">
                  {item.title}
                </Typography>
              </Pressable>
            );
          })}
        </ScrollView>
      </Stack>
    </ScrollView>
  );
}

export default Home;
