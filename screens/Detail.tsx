import {css} from '@emotion/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';
import {
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
import {Shadow} from 'react-native-shadow-2';
import IconAddList from '../assets/icon_addlist.svg';
import {default as IconDown} from '../assets/icon_arrow_down.svg';
import IconLogo from '../assets/icon_empty_logo.svg';
import IconExit from '../assets/icon_exit.svg';
import IconHeart from '../assets/icon_heart_fill.svg';
import IconWatching from '../assets/icon_watching.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import Keywords, {KeywordProps} from '../components/Keywords';
import MoviePoster from '../components/MoviePoster';
import SeeMore from '../components/SeeMore';
import StarRating from '../components/StartRating';
import {HomeStackParamList} from '../navigators/HomeNav';
import {mockPlaylist} from './PlayLists';

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
type DetailScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Detail'>;
};
interface ReviewDataProps {
  rating: number;
  date: Date | undefined;
  selectedKeywords: KeywordProps[];
  review: string;
}
function Detail({navigation}: DetailScreenProps) {
  const {width: deviceWidth, height: deviceHeight} = useWindowDimensions();
  const [watched, setWatched] = useState(false);
  const [hearted, setHearted] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [keywordOpen, setKeywordOpen] = useState(false);
  const [keywords, setKeywords] = useState<KeywordProps[]>([
    {selected: false, content: '판타지'},
    {selected: false, content: '로맨스'},
    {selected: false, content: '감동'},
    {selected: false, content: '코미디'},
    {selected: false, content: '가족'},
    {selected: false, content: '명작'},
    {selected: false, content: '호러'},
    {selected: false, content: '눈물나는'},
    {selected: false, content: '팝콘각'},
  ]);
  const [reviewData, setReviewData] = useState<ReviewDataProps>({
    rating: 0,
    date: undefined,
    selectedKeywords: [],
    review: '',
  });
  const {rating, date, selectedKeywords, review} = reviewData;

  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [addList, setAddList] = useState<number[]>([]);

  const handleWatchedClick = () => {
    //봤어요 클릭
    if (watched) {
      setReviewData({
        rating: 0,
        date: undefined,
        selectedKeywords: [],
        review: '',
      });
      setWatched(false);
    } else setWatched(true);
  };
  const handleHeartClick = () => {
    //보고싶어요 클릭
    setHearted((prev) => !prev);
  };
  const handleDateModalOpen = () => {
    setReviewData({...reviewData, date: new Date()});
    setDateOpen(true);
  };
  const handleKeywordModalOpen = () => {
    setKeywordOpen((prev) => !prev);
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
    setReviewData({
      ...reviewData,
      selectedKeywords: keywords.filter((item) => item.selected),
    });
  }, [keywords]);
  return (
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
                {mockPlaylist.map((item) => (
                  <Pressable
                    style={[
                      styles.playlistModal.item.wrapper,
                      addList.includes(item.id) &&
                        styles.playlistModal.item.selected,
                    ]}
                    key={`playlist-${item.id}-${item.title}`}
                    onPress={() => {
                      if (addList.includes(item.id))
                        setAddList(
                          addList.filter((listItem) => listItem !== item.id),
                        );
                      else setAddList([...addList, item.id]);
                    }}
                  >
                    <Group gap={10}>
                      {item.img ? (
                        <View>
                          <View style={styles.playlistModal.item.img.blur} />
                          <MoviePoster
                            width={101}
                            height={101}
                            img={item.img}
                            radius={10}
                          />
                        </View>
                      ) : (
                        <View style={styles.playlistModal.item.img.none}>
                          <IconLogo />
                        </View>
                      )}
                      <Stack justify="space-between">
                        <Stack>
                          <Group align="center" gap={5}>
                            <Typography variant="Title1">
                              {item.title}
                            </Typography>
                          </Group>
                          <Typography variant="Info">{`1개 작품`}</Typography>
                        </Stack>
                        <SeeMore routeFn={() => {}} />
                      </Stack>
                    </Group>
                  </Pressable>
                ))}
              </ScrollView>
              {addList.length !== 0 && (
                <Shadow
                  containerStyle={{
                    position: 'absolute',
                    right: 15,
                    bottom: 95,
                  }}
                >
                  <Pressable
                    style={{
                      width: deviceWidth * 0.36,
                      height: deviceHeight * 0.05,
                      borderRadius: deviceHeight * 0.025,
                      backgroundColor: '#7a01f2',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      handleDismiss();
                    }}
                  >
                    <Typography variant="Body2" color="#fff">
                      완료
                    </Typography>
                  </Pressable>
                </Shadow>
              )}
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
                {keywords.map((item) => (
                  <Keywords
                    keywordItem={item}
                    handleKeywordPress={() => {
                      setKeywords(
                        keywords.map((newitem) => {
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
        source={require('../assets/posters/avatar.jpeg')}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgb(255,255,255)']}
          start={{x: 0, y: 0.7}}
          end={{x: 0, y: 1}}
          style={styles.banner.blur}
        />
        <Stack style={{marginTop: 140, marginBottom: 35}} align="center">
          <Typography variant="Head1" color="#fff">
            아바타: 물의 길
          </Typography>
          <Typography variant="Info" color="#a4a4a4">
            미국 . 2022. 제임스 카메론
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
        >
          판도라 행성에서 ‘제이크 설리'와 ‘네이티리'가 이룬 가족이 겪게 되는
          무자비한 위협과 살아남기 위해 떠나야 하는 긴 여정과 전투, 그리고
          견뎌내야 할 상처에 대한 이야기.
        </Typography>
        <Pressable
          style={{marginBottom: 50, flexDirection: 'row', alignItems: 'center'}}
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
              <IconHeart fill={hearted ? '#6f00f8' : '#acacac'} />
              <Typography
                variant="Info"
                color={hearted ? '#6f00f8' : '#acacac'}
              >
                보고싶어요
              </Typography>
            </Stack>
          </Pressable>

          <Pressable onPress={handleWatchedClick}>
            <Stack align="center" style={{paddingHorizontal: 14}}>
              <IconWatching fill={watched ? '#6f00f8' : '#acacac'} />
              <Typography
                variant="Info"
                color={watched ? '#6f00f8' : '#acacac'}
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
                    setReviewData({...reviewData, date: undefined});
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
                <Typography variant="Body1">{`${date.getFullYear()}년 ${
                  date.getMonth() + 1
                }월 ${date.getDate()}일`}</Typography>
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
              date={date}
              modal
              open={dateOpen}
              onConfirm={(date) => {
                setReviewData({...reviewData, date: date});
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
            position={selectedKeywords.length !== 0 ? 'apart' : 'left'}
            gap={5}
            style={{width: '100%'}}
          >
            <Typography variant="Title1" color="#2d3540">
              키워드
            </Typography>
            {selectedKeywords.length !== 0 ? (
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
          {selectedKeywords.length !== 0 ? (
            <Group gap={8} style={{width: 300, flexWrap: 'wrap'}}>
              {selectedKeywords.map((item) => (
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
          <Group align="flex-end" gap={5}>
            <Typography variant="Title1" color="#2d3540">
              평점
            </Typography>
            {rating ? null : (
              <Typography variant={'Info'} color={'#c3c3c3'}>
                아직 내 평점이 없어요!
              </Typography>
            )}
          </Group>
          <Group>
            <StarRating
              rating={rating}
              setRating={(stars) => {
                setReviewData({...reviewData, rating: stars});
              }}
            />
          </Group>
        </Stack>
        <View style={styles.bottom.divider} />
        <Stack align="flex-start" spacing={13}>
          <Group align="flex-end" gap={5}>
            <Typography variant="Title1" color="#2d3540">
              내 후기
            </Typography>
            <Typography variant={'Info'} color={'#c3c3c3'}>
              후기를 추가해보세요!
            </Typography>
          </Group>
          {review === '' ? (
            <Pressable
              style={styles.bottom.addBtn}
              onPress={() => {
                navigation.navigate('Writting');
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
