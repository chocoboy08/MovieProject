/* eslint-disable react-native/no-inline-styles */
import {css} from '@emotion/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useQuery} from '@tanstack/react-query';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {instance} from '../apis/instance';
import IconLogo from '../assets/icon_empty_logo.svg';
import IconPlus from '../assets/icon_plus.svg';
import IconSearch from '../assets/icon_search.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import MoviePoster from '../components/MoviePoster';
import {MainStackParamList} from '../navigators/Main';
import {TabParamList} from '../navigators/TabNav';
import {Fonts} from '../utils/fontStyle';
import {Movie} from '../utils/type';
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
type HomeScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Home'>,
    NativeStackNavigationProp<MainStackParamList>
  >;
};
function Home({navigation}: HomeScreenProps) {
  const {width: deviceWidth, height: deviceHeight} = useWindowDimensions();

  const [selectedPoster, setSelectedPoster] = useState('');
  const isCarousel = React.useRef(null);
  const userId = 3;
  //최근 남긴 리뷰 가져오기
  const myRecentReviewQuery = useQuery<Movie[]>({
    queryKey: ['myRecent', userId],
    queryFn: async () => {
      try {
        const response = await instance.get(`/record/home/recent/${userId}`);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  //다른 유저가 최근 남긴 리뷰 가져오기
  const otherRecentReviewQuery = useQuery<Movie[]>({
    queryKey: ['otherRecent', 3],
    queryFn: async () => {
      try {
        const response = await instance.get(`/record/home/recent/exclusion/3`);

        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: false,
  });

  //최신 개봉작 가져오기
  const nowPlayingQuery = useQuery<Movie[]>({
    queryKey: ['nowPlaying'],
    queryFn: async () => {
      try {
        const response = await instance.get('/movie/now-playing');
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });
  useFocusEffect(
    React.useCallback(() => {
      otherRecentReviewQuery.refetch();
      myRecentReviewQuery.refetch();
      nowPlayingQuery.refetch();
    }, []),
  );

  return myRecentReviewQuery.isLoading ||
    otherRecentReviewQuery.isLoading ||
    nowPlayingQuery.isLoading ? (
    <ActivityIndicator size={'large'} />
  ) : (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: '#fff',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Stack style={[styles.banner.background, {height: 330}]}>
        {myRecentReviewQuery.data &&
          myRecentReviewQuery.data.length !== 0 &&
          selectedPoster && (
            <Image
              source={{
                uri: selectedPoster,
              }}
              width={deviceWidth}
              height={330}
              style={{position: 'absolute', borderRadius: 10}}
            />
          )}
        {myRecentReviewQuery.data && myRecentReviewQuery.data.length === 0 && (
          <IconLogo
            fill="#cecece"
            width={deviceWidth * 1.1}
            height={deviceHeight * 0.25}
            style={{position: 'absolute', top: 97}}
          />
        )}
        {myRecentReviewQuery.data && myRecentReviewQuery.data.length !== 0 && (
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
              navigation.navigate('Search', {playlistId: undefined});
            }}
          >
            <Typography variant="Body2" color="#737f8e">
              찾는 영화 제목을 검색해보세요!
            </Typography>
          </Pressable>
        </Group>
        {myRecentReviewQuery.data?.length === 0 ? (
          <Pressable
            onPress={() => {
              navigation.navigate('Search', {playlistId: undefined});
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
          myRecentReviewQuery.data && (
            <Carousel
              layout="default"
              ref={isCarousel}
              data={myRecentReviewQuery.data}
              renderItem={({item, index}) => {
                return (
                  <Pressable
                    key={index}
                    style={styles.banner.movieRecordList.posterContainer}
                    onPress={() => {
                      item.tmdbId &&
                        navigation.navigate('Detail', {id: item.tmdbId});
                    }}
                  >
                    <MoviePoster
                      img={{
                        uri: item.poster,
                      }}
                      width={128}
                      height={195}
                      radius={5}
                    />
                  </Pressable>
                );
              }}
              onSnapToItem={(idx) => {
                setSelectedPoster(myRecentReviewQuery.data[idx].poster);
              }}
              onLayout={() => {
                setSelectedPoster(
                  myRecentReviewQuery.data.length <= 2
                    ? myRecentReviewQuery.data[0].poster
                    : myRecentReviewQuery.data[1].poster,
                );
              }}
              sliderWidth={deviceWidth * 0.9}
              itemWidth={128}
              firstItem={myRecentReviewQuery.data.length <= 2 ? 0 : 1}
            />
          )
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
            다른 유저들도 기록했어요
          </Typography>
        </Group>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.movieInfoList.wrapper}
        >
          {otherRecentReviewQuery.data &&
            otherRecentReviewQuery.data.map((item) => {
              return (
                <Pressable
                  onPress={() => {
                    navigation.navigate('Detail', {
                      id: item.tmdbId as number,
                    });
                  }}
                  key={`home-popular-korea-movie-${item.tmdbId}`}
                >
                  <MoviePoster
                    img={{
                      uri: item.poster,
                    }}
                    width={125}
                    height={171}
                    radius={10}
                  />
                  <Typography
                    variant="Body2"
                    color="#000"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{width: '100%'}}
                  >
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
          {nowPlayingQuery.data &&
            nowPlayingQuery.data.map((item) => {
              return (
                <Pressable
                  onPress={() => {
                    navigation.navigate('Detail', {
                      id: item.tmdbId as number,
                    });
                  }}
                  key={`home-popular-korea-movie-${item.tmdbId}`}
                >
                  <MoviePoster
                    img={{
                      uri: item.poster,
                    }}
                    width={125}
                    height={171}
                    radius={10}
                  />
                  <Typography
                    variant="Body2"
                    color="#000"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{width: 125}}
                  >
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
