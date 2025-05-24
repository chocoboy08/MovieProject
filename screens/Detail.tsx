import {css} from '@emotion/native';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import React, {useEffect, useId, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';
import {instance} from '../apis/instance';
import IconAddList from '../assets/icon_addlist.svg';
import {default as IconDown} from '../assets/icon_arrow_down.svg';
import IconLogo from '../assets/icon_empty_logo.svg';
import IconExit from '../assets/icon_exit.svg';
import IconHeart from '../assets/icon_heart_fill.svg';
import IconWatching from '../assets/icon_watching.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import Keywords from '../components/Keywords';
import MoviePoster from '../components/MoviePoster';
import SeeMore from '../components/SeeMore';
import StarRating from '../components/StartRating';
import {MainStackParamList} from '../navigators/Main';
import {
  Heart,
  Keyword,
  Movie,
  PlayList,
  ReviewData,
  Watched,
} from '../utils/type';

const styles = {
  banner: {
    background: css({
      width: '100%',
      alignItems: 'center',
    }),
    blur: css({
      width: '100%',
      height: '100%',
      position: 'absolute',
    }),
  },
  bottom: {
    wrapper: css({paddingHorizontal: 20, width: '100%', paddingBottom: 56}),
    divider: css({
      height: 1,
      backgroundColor: '#e3e3e3',
      marginVertical: 20,
    }),
    datePicker: css({
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 11,
      paddingHorizontal: 16,
      borderColor: '#e3e3e3',
      borderWidth: 1,
      borderRadius: 6,
    }),
    addBtn: css({
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 24,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#6f00f8',
    }),
    editBtn: css({
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: '#f2f3f5',
    }),
  },
  keywordModal: {
    wrapper: css({
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
    }),
    box: css({
      width: 320,
      height: 313,
      paddingHorizontal: 19,
      paddingVertical: 21,
      backgroundColor: '#fff',
      alignItems: 'center',
    }),
    keywords: css({
      width: 267,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      justifyContent: 'center',
      marginTop: 33,
      marginBottom: 44,
    }),
    submitBtn: css({
      paddingHorizontal: 111,
      paddingVertical: 12,
      backgroundColor: '#6f00f8',
      borderRadius: 12,
    }),
  },
  playlistModal: {
    overlay: css({
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
    }),
    container: css({
      marginTop: 80,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      backgroundColor: '#fff',
    }),
    divider: css({
      width: '91%',
      height: 1,
      backgroundColor: '#e9e9e9',
      marginTop: 15,
    }),

    item: {
      wrapper: css({
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
      }),
      selected: css({
        borderColor: '#8f00ff',
        borderWidth: 1,
        borderRadius: 5,
      }),
      img: {
        blur: css({
          backgroundColor: 'rgba(0,0,0,0.5)',
          width: '100%',
          height: '100%',
          borderRadius: 10,
          position: 'absolute',
          zIndex: 1,
        }),
        none: css({
          borderRadius: 10,
          width: 101,
          height: 101,
          borderColor: '#e6e6e6',
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }),
      },
    },
  },
};
type DetailScreenProps = NativeStackScreenProps<MainStackParamList, 'Detail'>;

const KEYWORDS = [
  {selected: false, content: '연출'},
  {selected: false, content: '스토리'},
  {selected: false, content: '몰입도'},
  {selected: false, content: '연기'},
  {selected: false, content: '음악'},
  {selected: false, content: 'CG'},
  {selected: false, content: '킬링타임'},
  {selected: false, content: '여운'},
];
function Detail({navigation, route}: DetailScreenProps) {
  const {width: deviceWidth, height: deviceHeight} = useWindowDimensions();

  const [dateOpen, setDateOpen] = useState(false);
  const [keywordOpen, setKeywordOpen] = useState(false);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [errorCode, setErrorCode] = useState(0);
  const [fullPlot, setFullPlot] = useState(4);
  //백엔드 통신
  const queryClient = useQueryClient();
  //영화 데이터 가져오기
  const movieId = route.params.id;

  const movieQuery = useQuery<Movie>({
    queryKey: ['movieData', movieId],
    queryFn: async () => {
      try {
        const response = await instance.get(`/movie/detail?tmdbId=${movieId}`);
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
        const response = await instance.get(`/playlist/${3}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
  const playlistMutation = useMutation({
    mutationFn: async (playlistId: number) => {
      try {
        const response = await instance.post('/movieInPlaylist', {
          playlistId: playlistId,
          tmdbId: movieId,
        });
      } catch (error) {
        console.log(error.response.data);
        setErrorCode(error.response.data.errorCode);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['playlists', 3]});
      handleDismiss();
    },
  });
  const userId = 3;
  //리뷰 데이터 가져오기

  const reviewQuery = useQuery<ReviewData>({
    queryKey: ['reviewData', userId, movieId],
    queryFn: async () => {
      try {
        const response = await instance.get(
          `/record?userId=${userId}&tmdbId=${movieId}`,
        );
        return response.data;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    enabled: !!movieQuery.data,
  });

  const [keywordList, setKeywordList] = useState<Keyword[]>(
    KEYWORDS.map((item) => {
      return reviewQuery.data
        ? {
            selected: reviewQuery.data.keywords.includes(item.content),
            content: item.content,
          }
        : {selected: false, content: item.content};
    }),
  );
  const [inputData, setInputData] = useState<ReviewData>(
    reviewQuery.data
      ? reviewQuery.data
      : {
          rating: null,
          review: null,
          date: null,
          keywords: [],
        },
  );
  const {rating, date, keywords, review} = reviewQuery.data
    ? reviewQuery.data
    : inputData;

  //리뷰 데이터 올리기

  const reviewMutation = useMutation({
    mutationFn: async (action: string) => {
      try {
        const response =
          action === 'post'
            ? await instance.post('/record', {
                tmdbId: movieId.toString(),
                userId: userId,
                ...inputData,
              })
            : await instance.delete(
                `/record?userId=${userId}&movieId=${movieId}`,
              );
      } catch (error) {
        console.log(error.response.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['reviewData']});
      queryClient.invalidateQueries({queryKey: ['watched', movieId, useId]});
    },
  });

  //봤어요 가져오기
  const watchedQuery = useQuery<Watched>({
    queryKey: ['watched', movieId, userId],
    queryFn: async () => {
      try {
        const response = await instance.get(
          `/watched/check?userId=${3}&tmdbId=${movieId}`,
        );
        return response.data;
      } catch (error) {
        console.log(error.response.data);
      }
    },
    enabled: !!movieQuery.data,
    refetchOnWindowFocus: true,
  });

  //봤어요 클릭
  const watchedMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await instance.post(
          `/watched?userId=${userId}&tmdbId=${movieId}`,
        );
      } catch (error) {
        console.log(error.response.data);
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({queryKey: ['watched', movieId, userId]}),
  });

  //보고싶어요 가져오기
  const heartQuery = useQuery<Heart>({
    queryKey: ['heart', movieId, userId],
    queryFn: async () => {
      try {
        const response = await instance.get(
          `/heart/check?userId=${userId}&tmdbId=${movieId}`,
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!movieQuery.data,
  });

  const heartMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await instance.post(
          `/heart?userId=${3}&tmdbId=${movieId}`,
        );
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['heart']}),
  });
  const handleHeartClick = () => {
    heartMutation.mutate();
  };

  const handleDateModalOpen = () => {
    setInputData({...inputData, date: changeDateFormat(new Date())});
    setDateOpen(true);
  };
  const handleKeywordModalOpen = () => {
    setKeywordOpen((prev) => !prev);
  };

  const changeDateFormat = (date: Date) => {
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1 < 10 ? '0' : '') +
      (date.getMonth() + 1) +
      '-' +
      (date.getDate() < 10 ? '0' : '') +
      date.getDate()
    );
  };

  const panY = useRef(
    new Animated.Value(Dimensions.get('screen').height),
  ).current;
  const top = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });
  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: false,
  });

  const closeAnim = Animated.timing(panY, {
    toValue: Dimensions.get('screen').height,
    duration: 200,
    useNativeDriver: false,
  });
  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([null, {dy: panY}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gs) => {
        if (gs.dy > 0 && gs.vy > 2) {
          return closeAnim.start(() => {
            setPlaylistModalOpen(false);
          });
        }
        return resetPositionAnim.start();
      },
    }),
  ).current;

  const handleDismiss = () => {
    closeAnim.start(() => setPlaylistModalOpen(false));
  };

  useEffect(() => {
    if (playlistModalOpen) resetPositionAnim.start();
  }, [playlistModalOpen]);

  useEffect(() => {
    setInputData({
      ...inputData,
      keywords: keywordList
        .map((item) => {
          if (item.selected) return item.content;
        })
        .filter((item) => item !== undefined),
    });
  }, [keywordList]);

  useEffect(() => {
    if (
      reviewQuery.data &&
      Object.entries(reviewQuery.data).toString() !==
        Object.entries(inputData).toString()
    ) {
      if (
        Object.entries(inputData).toString() ===
        Object.entries({
          rating: null,
          review: null,
          date: null,
          keywords: [],
        }).toString()
      ) {
        reviewMutation.mutate('delete');
      } else reviewMutation.mutate('post');
    }
  }, [inputData]);
  useFocusEffect(() => {
    reviewQuery.refetch();
  });
  useEffect(() => {
    if (errorCode === 1000) {
      Alert.alert('이미 존재하는 영화입니다.');
      setErrorCode(0);
    }
  }, [errorCode]);
  useEffect(() => {
    if (reviewQuery.isFetched === true && reviewQuery.data)
      setInputData(reviewQuery.data);
  }, [reviewQuery.data]);
  return movieQuery.isLoading ||
    reviewQuery.isLoading ||
    heartQuery.isLoading ||
    watchedQuery.isLoading ? (
    <ActivityIndicator size={'large'} style={{flex: 1}} />
  ) : (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <Modal
        animationType="fade"
        visible={playlistModalOpen}
        transparent
        onRequestClose={handleDismiss}
        statusBarTranslucent
      >
        <Stack style={styles.playlistModal.overlay}>
          <Animated.View
            style={[styles.playlistModal.container, {top}]}
            {...panResponders.panHandlers}
          >
            <Stack align="center">
              <Group style={{marginTop: 20, width: '91%'}} position="apart">
                <Stack>
                  <Typography variant="Head1">
                    플레이리스트에 영화 추가
                  </Typography>
                  <Typography variant="Info">
                    영화를 추가하고 싶은 플레이리스트를 모두 선택해주세요
                  </Typography>
                </Stack>
                <Pressable onPress={handleDismiss}>
                  <IconExit />
                </Pressable>
              </Group>
              <View style={styles.playlistModal.divider} />
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  width: deviceWidth,
                }}
              >
                {playlistQuery.data?.map(
                  (item, idx) =>
                    idx > 1 && (
                      <Pressable
                        style={[styles.playlistModal.item.wrapper]}
                        key={`playlist-${item.playlistId}-${item.name}`}
                        onPress={() => {
                          item.playlistId !== undefined &&
                            playlistMutation.mutate(item.playlistId);
                        }}
                      >
                        <Group gap={10}>
                          {item.poster ? (
                            <View>
                              <View
                                style={styles.playlistModal.item.img.blur}
                              />
                              <MoviePoster
                                width={101}
                                height={101}
                                img={{uri: item.poster}}
                                radius={10}
                              />
                            </View>
                          ) : (
                            <View style={styles.playlistModal.item.img.none}>
                              <IconLogo fill="#e6e6e6" />
                            </View>
                          )}
                          <Stack justify="space-between">
                            <Stack>
                              <Group align="center" gap={5}>
                                <Typography variant="Title1">
                                  {item.name}
                                </Typography>
                              </Group>
                              {item.total && (
                                <Typography variant="Info">{`${
                                  item.total + 1
                                }개 작품`}</Typography>
                              )}
                            </Stack>
                            <SeeMore routeFn={() => {}} />
                          </Stack>
                        </Group>
                      </Pressable>
                    ),
                )}
              </ScrollView>
            </Stack>
          </Animated.View>
        </Stack>
      </Modal>
      <Modal
        visible={keywordOpen}
        onRequestClose={handleKeywordModalOpen}
        transparent={true}
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.keywordModal.wrapper}
          activeOpacity={1}
          onPressOut={handleKeywordModalOpen}
        >
          <TouchableWithoutFeedback>
            <View style={styles.keywordModal.box}>
              <Typography variant="Title1" color="#303030">
                이 영화의 키워드를 선정해주세요!
              </Typography>
              <View style={styles.keywordModal.keywords}>
                {keywordList.map((item) => (
                  <Keywords
                    keywordItem={item}
                    handleKeywordPress={() => {
                      setKeywordList(
                        keywordList.map((newitem) => {
                          if (newitem.content === item.content)
                            return {
                              selected: !item.selected,
                              content: item.content,
                            };
                          else return newitem;
                        }),
                      );
                    }}
                    key={`keyword-${item.content}`}
                  />
                ))}
              </View>
              <TouchableOpacity>
                <Pressable
                  style={styles.keywordModal.submitBtn}
                  onPress={handleKeywordModalOpen}
                >
                  <Typography variant="Title2" color="#fff">
                    선택 완료
                  </Typography>
                </Pressable>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
      <ImageBackground
        style={styles.banner.background}
        source={{
          uri: movieQuery.data?.poster,
        }}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgb(255,255,255)']}
          start={{x: 0, y: 0.7}}
          end={{x: 0, y: 1}}
          style={styles.banner.blur}
        />
        <Stack style={{marginTop: 140, marginBottom: 35}} align="center">
          <Typography variant="Head1" color="#fff">
            {movieQuery.data?.title}
          </Typography>
          <Typography variant="Info" color="#a4a4a4">
            {`${movieQuery.data?.nation}·${movieQuery.data?.year}·${movieQuery.data?.director}`}
          </Typography>
        </Stack>
        <Typography
          variant="Body2"
          color="#fff"
          style={[
            {
              width: 320,
              textAlign: 'center',
              marginBottom: 10,
            },
          ]}
          numberOfLines={fullPlot}
          ellipsizeMode="clip"
        >
          {movieQuery.data?.plot}
        </Typography>
        <Pressable
          style={{marginBottom: 50, flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            if (fullPlot === 4) setFullPlot(0);
            else setFullPlot(4);
          }}
        >
          <Typography variant="Info" color="#bdbdbd">
            더보기
          </Typography>
        </Pressable>
      </ImageBackground>
      <Stack style={styles.bottom.wrapper}>
        <Group
          position="center"
          gap={36}
          style={{marginTop: 13, marginBottom: 7}}
        >
          <Pressable onPress={handleHeartClick}>
            <Stack align="center" style={{paddingHorizontal: 14}}>
              <IconHeart
                fill={heartQuery.data?.heart ? '#6f00f8' : '#acacac'}
              />
              <Typography
                variant="Info"
                color={heartQuery.data?.heart ? '#6f00f8' : '#acacac'}
              >
                보고싶어요
              </Typography>
            </Stack>
          </Pressable>

          <Pressable
            onPress={() => {
              if (watchedQuery.data?.watched) {
                setInputData({
                  rating: null,
                  date: null,
                  keywords: [],
                  review: null,
                });
              }
              watchedMutation.mutate();
            }}
          >
            <Stack align="center" style={{paddingHorizontal: 14}}>
              <IconWatching
                fill={watchedQuery.data?.watched ? '#6f00f8' : '#acacac'}
              />
              <Typography
                variant="Info"
                color={watchedQuery.data?.watched ? '#6f00f8' : '#acacac'}
              >
                봤어요
              </Typography>
            </Stack>
          </Pressable>

          <Pressable
            onPress={() => {
              setPlaylistModalOpen(true);
            }}
          >
            <Stack align="center" style={{paddingHorizontal: 14}}>
              <IconAddList fill="#acacac" />
              <Typography variant="Info" color="#acacac">
                내 플레이리스트
              </Typography>
            </Stack>
          </Pressable>
        </Group>
        <View style={styles.bottom.divider} />
        <Group style={{marginTop: 10, marginBottom: 15}}>
          <Stack align="flex-start" spacing={13}>
            <Group
              align="flex-end"
              position={date ? 'apart' : 'left'}
              gap={5}
              style={{width: '100%'}}
            >
              <Typography variant="Title1" color="#2d3540">
                감상한 날짜
              </Typography>
              {date ? (
                <Pressable
                  style={styles.bottom.editBtn}
                  onPress={() => {
                    setInputData({...inputData, date: null});
                  }}
                >
                  <Typography variant="Info" color="#ff0000">
                    삭제
                  </Typography>
                </Pressable>
              ) : (
                <Typography variant="Info" color="#c3c3c3">
                  아직 입력된 날짜가 없어요!
                </Typography>
              )}
            </Group>
            {date ? (
              <Pressable
                style={styles.bottom.datePicker}
                onPress={() => {
                  setDateOpen(true);
                }}
              >
                <Typography variant="Body1">{`${new Date(
                  date,
                ).getFullYear()}년 ${
                  new Date(date).getMonth() + 1
                }월 ${new Date(date).getDate()}일`}</Typography>
                <IconDown />
              </Pressable>
            ) : (
              <Pressable
                style={styles.bottom.addBtn}
                onPress={handleDateModalOpen}
              >
                <Typography variant="Body2" color="#6f00f8">
                  추가하기
                </Typography>
              </Pressable>
            )}
          </Stack>
          {date && (
            <DatePicker
              date={new Date(date)}
              modal
              open={dateOpen}
              onConfirm={(date) => {
                setInputData({...inputData, date: changeDateFormat(date)});
                setDateOpen(false);
              }}
              onCancel={() => {
                setDateOpen(false);
              }}
              locale="ko"
              mode="date"
            />
          )}
        </Group>
        <View style={styles.bottom.divider} />
        <Stack align="flex-start" spacing={13}>
          <Group
            align="flex-end"
            position={keywords && keywords.length !== 0 ? 'apart' : 'left'}
            gap={5}
            style={{width: '100%'}}
          >
            <Typography variant="Title1" color="#2d3540">
              키워드
            </Typography>
            {keywords && keywords.length !== 0 ? (
              <Pressable
                style={styles.bottom.editBtn}
                onPress={handleKeywordModalOpen}
              >
                <Typography variant="Info" color="#a8a8a8">
                  수정
                </Typography>
              </Pressable>
            ) : (
              <Typography variant="Info" color="#c3c3c3">
                키워드를 추가해보세요!
              </Typography>
            )}
          </Group>
          {keywords && keywords.length !== 0 ? (
            <Group gap={8} style={{width: 300, flexWrap: 'wrap'}}>
              {keywordList
                .filter((item) => item.selected)
                .map((item) => (
                  <Keywords
                    keywordItem={item}
                    key={`${item.content}-selected-${item.selected}`}
                  />
                ))}
            </Group>
          ) : (
            <Pressable
              style={styles.bottom.addBtn}
              onPress={handleKeywordModalOpen}
            >
              <Typography variant="Body2" color="#6f00f8">
                추가하기
              </Typography>
            </Pressable>
          )}
        </Stack>
        <View style={styles.bottom.divider} />
        <Stack spacing={13}>
          <Group
            align="flex-end"
            position={inputData.rating === null ? 'left' : 'apart'}
            gap={5}
          >
            <Typography variant="Title1" color="#2d3540">
              평점
            </Typography>
            {rating ? (
              <Pressable
                style={styles.bottom.editBtn}
                onPress={() => {
                  setInputData({...inputData, rating: null});
                }}
              >
                <Typography variant="Info" color="#ff0000">
                  삭제
                </Typography>
              </Pressable>
            ) : (
              <Typography variant={'Info'} color={'#c3c3c3'}>
                아직 내 평점이 없어요!
              </Typography>
            )}
          </Group>
          <Group>
            <StarRating
              rating={rating ? parseFloat(rating) : 0}
              setRating={(stars) => {
                setInputData({...inputData, rating: stars.toString()});
              }}
            />
          </Group>
        </Stack>
        <View style={styles.bottom.divider} />
        <Stack align="flex-start" spacing={13}>
          <Group
            align="flex-end"
            gap={5}
            position={review !== null ? 'apart' : 'left'}
            style={{width: '100%'}}
          >
            <Typography variant="Title1" color="#2d3540">
              내 후기
            </Typography>
            {review !== null ? (
              <Group gap={10}>
                <Pressable
                  style={styles.bottom.editBtn}
                  onPress={() => {
                    navigation.navigate('Writting', {id: movieId});
                  }}
                >
                  <Typography variant="Info" color="#a8a8a8">
                    수정
                  </Typography>
                </Pressable>
                <Pressable
                  style={styles.bottom.editBtn}
                  onPress={() => {
                    setInputData({...inputData, review: null});
                  }}
                >
                  <Typography variant="Info" color="#ff0000">
                    삭제
                  </Typography>
                </Pressable>
              </Group>
            ) : (
              <Typography variant={'Info'} color={'#c3c3c3'}>
                후기를 추가해보세요!
              </Typography>
            )}
          </Group>
          {review === null ? (
            <Pressable
              style={styles.bottom.addBtn}
              onPress={() => {
                navigation.navigate('Writting', {id: movieId});
              }}
            >
              <Typography variant="Body2" color="#6f00f8">
                후기쓰기
              </Typography>
            </Pressable>
          ) : (
            <Typography variant="Body2">{review}</Typography>
          )}
        </Stack>
      </Stack>
    </ScrollView>
  );
}

export default Detail;
