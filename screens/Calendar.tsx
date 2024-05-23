import {css} from '@emotion/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  Modal,
  PanResponder,
  Pressable,
  View,
} from 'react-native';
import {LocaleConfig, Calendar as MovieCalendar} from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import IconArrowDown from '../assets/icon_arrow_down.svg';
import IconStar from '../assets/icon_fullstar.svg';
import IconPlus from '../assets/icon_plus.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import MoviePoster from '../components/MoviePoster';
import SeeMore from '../components/SeeMore';
import {CalendarStackParamList} from '../navigators/CalendarNav';

const styles = {
  wrapper: css({
    backgroundColor: '#fff',
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 50,
  }),
  calendar: {
    wrapper: css({
      marginLeft: '5%',
      marginRight: '5%',
      width: '90%',
      borderBottomColor: '#d1d1d1',
      borderBottomWidth: 0.5,
    }),
    date: {
      box: css({
        width: '100%',
        height: 58,
        alignItems: 'center',
        borderTopColor: '#d1d1d1',
        borderTopWidth: 0.5,
      }),
      poster: css({
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'absolute',
      }),
      blur: css({
        width: '100%',
        height: 58,
        borderRadius: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
      }),
      more: css({
        width: '100%',
        height: 12,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: 'rgba(0,0,0,0.4)',
        position: 'absolute',
        bottom: 0,
        alignItems: 'flex-end',
        paddingRight: 2,
      }),
    },
  },
  dateModal: {
    overlay: css({
      backgroundColor: 'rgba(0,0,0,0.5)',
      flex: 1,
    }),
    container: css({
      paddingTop: 37,
      borderTopRightRadius: 16,
      borderTopLeftRadius: 16,
      backgroundColor: '#fff',
      alignItems: 'center',
    }),
    bar: css({
      width: 62,
      height: 4,
      borderRadius: 60,
      backgroundColor: '#e4e7ee',
      alignSelf: 'center',
      position: 'absolute',
      top: 6,
    }),
    button: css({
      width: 130,
      paddingVertical: 10,
      borderRadius: 20,
      alignItems: 'center',
    }),
  },
  selectedDate: {
    box: css({
      flexDirection: 'row',
      gap: 10,
      paddingVertical: 10,
      borderTopColor: '#c2c2c2',
      borderTopWidth: 0.5,
    }),
    emptyImg: css({
      width: 63,
      height: 83,
      borderRadius: 5,
      borderColor: '#6f00f8',
      borderWidth: 1,
      backgroundColor: 'rgba(111,0,248,0.16)',
      justifyContent: 'center',
      alignItems: 'center',
    }),
  },
};
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
};
LocaleConfig.defaultLocale = 'ko';

interface Movie {
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  watch_date: string;
  title: string;
  rating: number;
}

interface CalendarMovie {
  [date: string]: Movie[] | undefined;
}

export const MonthlyMovieData: CalendarMovie = {
  '2024-04-01': [
    {
      id: 634492,
      original_language: 'en',
      original_title: 'Madame Web',
      overview:
        "우연한 사고로 미래를 볼 수 있게 된 구급대원 '캐시 웹'이 거미줄처럼 엮인 운명을 마주하며, 같은 예지 능력을 가진 적 '심스'에 맞서 세상을 구할 히어로 '마담 웹'으로 거듭나게 되는 과정을 그린 마블의 NEW 히어로 드라마",
      watch_date: '',
      poster_path: '/eqEzpQNusV9XSdnA9HAvlLMeuPs.jpg',
      release_date: '2024-02-14',
      title: '마담 웹',
      rating: 3.5,
    },
  ],
  '2024-04-02': undefined,
  '2024-04-03': undefined,
  '2024-04-04': undefined,
  '2024-04-05': undefined,
  '2024-04-06': [
    {
      id: 19,
      original_language: 'ko',
      original_title: '콘크리트 유토피아',
      overview:
        '대지진으로 하루아침에 폐허가 된 서울. 모든 것이 무너졌지만 단 한 곳, 황궁 아파트만은 그대로다. 소문을 들은 외부 생존자들이 황궁 아파트로 몰려들자 위협을 느끼기 시작하는 입주민들. 생존을 위해 하나가 된 그들은 새로운 주민 대표 영탁을 중심으로 외부인의 출입을 철저히 막아선 채 아파트 주민만을 위한 새로운 규칙을 만든다. 덕분에 지옥 같은 바깥 세상과 달리 주민들에겐 더 없이 안전하고 평화로운 유토피아 황궁 아파트. 하지만 끝이 없는 생존의 위기 속 그들 사이에서도 예상치 못한 갈등이 시작되는데...',
      poster_path: '/9dENCKupUckoT1WgOohHMZfVl61.jpg',
      release_date: '2023-08-04',
      watch_date: '',
      title: '콘크리트 유토피아',
      rating: 3.5,
    },
  ],
  '2024-04-07': [
    {
      id: 1011985,
      original_language: 'en',
      original_title: 'Kung Fu Panda 4',
      overview:
        '마침내 내면의 평화… 냉면의 평화…가 찾아왔다고 믿는 용의 전사 ‘포’ 이젠 평화의 계곡의 영적 지도자가 되고, 자신을 대신할 후계자를 찾아야만 한다. “이제 용의 전사는 그만둬야 해요?” 용의 전사로의 모습이 익숙해지고 새로운 성장을 하기보다 지금 이대로가 좋은 ‘포’ 하지만 모든 쿵푸 마스터들의 능력을 그대로 복제하는 강력한 빌런 ‘카멜레온’이 나타나고 그녀를 막기 위해 정체를 알 수 없는 쿵푸 고수 ‘젠’과 함께 모험을 떠나게 되는데… 포는 가장 강력한 빌런과 자기 자신마저 뛰어넘고 진정한 변화를 할 수 있을까?',
      watch_date: '',
      rating: 4.5,
      poster_path: '/1ZNOOMmILNUzVYbzG1j7GYb5bEV.jpg',
      release_date: '2024-03-02',
      title: '쿵푸팬더 4',
    },
  ],
  '2024-04-08': [
    {
      id: 2,
      original_language: 'en',
      original_title: 'Oppenheimer',
      overview:
        '세상을 구하기 위해 세상을 파괴할 지도 모르는 선택을 해야 하는 천재 과학자의 핵개발 프로젝트.',
      poster_path: '/4ZLnVUfiCe3wX8Ut9eyujndpyvA.jpg',
      release_date: '2023-08-15',
      title: '오펜하이머',
      watch_date: '',
      rating: 4.5,
    },
    {
      id: 748783,
      original_language: 'en',
      original_title: 'The Garfield Movie',
      overview:
        '세상귀찮 집냥이, 바쁘고 험난한 세상에 던져졌다! 집사 ‘존’과 반려견 ‘오디’를 기르며 평화로운 나날을 보내던 집냥이 ‘가필드’. 어느 날, 험악한 길냥이 무리에게 납치당해 냉혹한 거리로 던져진다. 돌봐주는 집사가 없는 집 밖 세상은 너무나도 정신없게 돌아가고 길에서 우연히 다시 만난 아빠 길냥이 ‘빅’은 오히려 ‘가필드’를 위기에 빠지게 하는데… 험난한 세상, 살아남아야 한다!',
      watch_date: '',
      rating: 4.5,
      poster_path: '/57g3pHYi3p0JNVO1LkcyYbeMDBf.jpg',
      release_date: '2024-04-30',
      title: '가필드 더 무비',
    },
  ],
  '2024-04-09': undefined,
  '2024-04-10': undefined,
  '2024-04-11': undefined,
  '2024-04-12': undefined,
  '2024-04-13': undefined,
  '2024-04-14': undefined,
  '2024-04-15': undefined,
  '2024-04-16': undefined,
  '2024-04-17': undefined,
  '2024-04-18': [
    {
      id: 693134,
      original_language: 'en',
      original_title: 'Dune: Part Two',
      overview:
        '황제의 모략으로 멸문한 가문의 유일한 후계자 폴. 어머니 레이디 제시카와 간신히 목숨만 부지한 채 사막으로 도망친다. 그곳에서 만난 반란군들과 숨어 지내다 그들과 함께 황제의 모든 것을 파괴할 전투를 준비한다. 한편 반란군들의 기세가 높아질수록 불안해진 황제와 귀족 가문은 잔혹한 암살자 페이드 로타를 보내 반란군을 몰살하려 하는데…',
      watch_date: '',
      rating: 4.5,
      poster_path: '/8uUU2pxm6IYZw8UgnKJyx7Dqwu9.jpg',
      release_date: '2024-02-27',
      title: '듄: 파트 2',
    },
  ],
  '2024-04-19': undefined,
  '2024-04-20': undefined,
  '2024-04-21': undefined,
  '2024-04-22': undefined,
  '2024-04-23': undefined,
  '2024-04-24': undefined,
  '2024-04-25': undefined,
  '2024-04-26': undefined,
  '2024-04-27': undefined,
  '2024-04-28': undefined,
  '2024-04-29': undefined,
  '2024-04-30': undefined,
};

type CalendarScreenProp = {
  navigation: NativeStackNavigationProp<CalendarStackParamList, 'Calendar'>;
};
function Calendar({navigation}: CalendarScreenProp) {
  const [date, setDate] = useState(moment());
  const [dateModalOpen, setDateModalOpen] = useState(false);

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
    duration: 500,
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
          return closeAnim.start(handleDateModal);
        }
        return resetPositionAnim.start();
      },
    }),
  ).current;

  const handleDateModal = () => {
    setDateModalOpen((prev) => !prev);
  };
  const handleDismiss = () => {
    closeAnim.start(handleDateModal);
  };
  useEffect(() => {
    if (dateModalOpen) {
      resetPositionAnim.start();
    }
  }, [dateModalOpen]);
  return (
    <Stack style={styles.wrapper}>
      <Modal
        animationType="fade"
        visible={dateModalOpen}
        transparent
        onRequestClose={() => {
          handleDismiss();
        }}
        statusBarTranslucent
      >
        <Stack style={styles.dateModal.overlay} justify="flex-end">
          <Animated.View
            style={[styles.dateModal.container, {top}]}
            {...panResponders.panHandlers}
          >
            <View style={styles.dateModal.bar} />
            <DatePicker
              date={date.toDate()}
              onDateChange={(date) => {
                setDate(moment(date));
              }}
              mode="date"
              locale="ko"
            />
            <Group gap={51} style={{marginVertical: 24}}>
              <Pressable
                style={[styles.dateModal.button, {backgroundColor: '#f3f3f3'}]}
                onPress={() => {
                  setDate(moment());
                }}
              >
                <Typography variant="Body2">오늘</Typography>
              </Pressable>
              <Pressable
                style={[styles.dateModal.button, {backgroundColor: '#7A01F2'}]}
                onPress={handleDismiss}
              >
                <Typography variant="Body2" color="#ffffff">
                  완료
                </Typography>
              </Pressable>
            </Group>
          </Animated.View>
        </Stack>
      </Modal>
      <MovieCalendar
        style={styles.calendar.wrapper}
        theme={{weekVerticalMargin: 0}}
        hideArrows
        current={date.format('YYYY-MM-DD')}
        key={date.format('YYYY-MM-DD')}
        renderHeader={() => (
          <Pressable onPress={handleDateModal}>
            <Group align="center" gap={12}>
              <Typography variant="Title1">
                {date.format('YYYY년 MM월')}
              </Typography>
              <IconArrowDown />
            </Group>
          </Pressable>
        )}
        dayComponent={(e) => (
          <Pressable
            style={[
              styles.calendar.date.box,
              date.format('YYYY-MM-DD') === e.date?.dateString && {
                borderWidth: 1,
                borderRadius: 5,
                borderColor: '#6f00f8',
              },
            ]}
            onPress={() => {
              if (e.date?.month === date.month() + 1)
                setDate(moment(e.date?.dateString));
            }}
          >
            {MonthlyMovieData[e.date?.dateString as string] !== undefined && (
              <ImageBackground
                source={{
                  uri:
                    'https://image.tmdb.org/t/p/original' +
                    MonthlyMovieData[e.date?.dateString!]![0].poster_path,
                }}
                imageStyle={{borderRadius: 5}}
                style={styles.calendar.date.poster}
              >
                <View style={styles.calendar.date.blur} />
                {MonthlyMovieData[e.date?.dateString as string]!.length > 1 && (
                  <View style={styles.calendar.date.more}>
                    <Typography
                      variant="Info"
                      color="#d8d8d8"
                      style={{lineHeight: 12}}
                    >
                      +
                      {MonthlyMovieData[e.date?.dateString as string]!.length -
                        1}
                    </Typography>
                  </View>
                )}
              </ImageBackground>
            )}
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 18,
                backgroundColor:
                  e.date?.dateString === moment().format('YYYY-MM-DD')
                    ? '#6f00f8'
                    : 'transparents',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {e.date?.month === date.month() + 1 && (
                <Typography
                  variant="Info"
                  color={
                    MonthlyMovieData[e.date?.dateString as string] ||
                    e.date?.dateString === moment().format('YYYY-MM-DD')
                      ? '#fff'
                      : '#000'
                  }
                >
                  {e.date?.day}
                </Typography>
              )}
            </View>
          </Pressable>
        )}
      />
      <Stack style={{paddingHorizontal: '8%', marginTop: 35}}>
        <Group position="apart">
          <Typography variant="Title1">
            {date.format('YYYY년 M월 D일')}
          </Typography>
          <SeeMore
            routeFn={() => {
              navigation.navigate('MonthlyMovies');
            }}
          />
        </Group>
        <Stack
          style={{
            borderBottomColor: '#c2c2c2',
            borderBottomWidth: 0.5,
            marginTop: 20,
          }}
        >
          {MonthlyMovieData[date.format('YYYY-MM-DD')] !== undefined ? (
            MonthlyMovieData[date.format('YYYY-MM-DD')]?.map((item) => (
              <Pressable
                style={styles.selectedDate.box}
                onPress={() => {
                  navigation.navigate('Detail');
                }}
                key={`${item.id}-${item.title}-${item.watch_date}`}
              >
                <MoviePoster
                  width={63}
                  height={83}
                  radius={5}
                  img={{
                    uri:
                      'https://image.tmdb.org/t/p/original' + item.poster_path,
                  }}
                />
                <Stack>
                  <Typography variant="Title2">{item.title}</Typography>
                  <Typography variant="Info" color="#a4a4a4">
                    {item.release_date.slice(0, 4)}
                  </Typography>
                  <Group align="center" gap={2}>
                    <IconStar width={13} />
                    <Typography variant="Info" color="#6f00f8">
                      {item.rating}
                    </Typography>
                  </Group>
                </Stack>
              </Pressable>
            ))
          ) : (
            <Pressable
              style={styles.selectedDate.box}
              onPress={() => {
                navigation.navigate('Search');
              }}
            >
              <View style={styles.selectedDate.emptyImg}>
                <IconPlus fill="#6f00f8" />
              </View>
              <Stack>
                <Typography variant="Info" color="#a4a4a4">
                  기록된 영화가 없어요!
                </Typography>
                <Typography variant="Title2">
                  새로운 영화 기록하러 가기
                </Typography>
              </Stack>
            </Pressable>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Calendar;
