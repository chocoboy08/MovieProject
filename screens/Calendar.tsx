import {css} from '@emotion/native';
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
        marginBottom: -13,
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

const movies: CalendarMovie = {
  '2024-03-01': [
    {
      id: 9,
      original_language: 'en',
      original_title: 'Shark Bait',
      overview:
        '마지막 봄 방학을 기념하러 해변에서 파티를 벌이던 젊은이들은 우연히 주인 없이 방치된 제트스키 두 대를 발견하고 키를 훔친다. 그들은 제트스키가 처참한 결과를 몰고 올 재앙의 원인이 될지 모른 채 승선한다. 철없는 치킨게임을 하다 고장 난 제트스키는 바다 한 가운데 고립되고 거대한 백상어의 그림자가 서서히 그들 주위를 맴돈다. 상어의 희생자가 한 명씩 늘어가는 가운데 남은 사람들은 해변으로 돌아가기 위해 고군분투한다.',
      poster_path:
        'https://image.tmdb.org/t/p/original/pxsn8GtNHbN01iWkD2cV8CMuGzm.jpg',
      release_date: '2023-08-03',
      watch_date: '',
      title: '47시간: 샤크베이트',
      rating: 4,
    },
  ],
  '2024-03-02': undefined,
  '2024-03-03': undefined,
  '2024-03-04': undefined,
  '2024-03-05': undefined,
  '2024-03-06': [
    {
      id: 9,
      original_language: 'en',
      original_title: 'Shark Bait',
      overview:
        '마지막 봄 방학을 기념하러 해변에서 파티를 벌이던 젊은이들은 우연히 주인 없이 방치된 제트스키 두 대를 발견하고 키를 훔친다. 그들은 제트스키가 처참한 결과를 몰고 올 재앙의 원인이 될지 모른 채 승선한다. 철없는 치킨게임을 하다 고장 난 제트스키는 바다 한 가운데 고립되고 거대한 백상어의 그림자가 서서히 그들 주위를 맴돈다. 상어의 희생자가 한 명씩 늘어가는 가운데 남은 사람들은 해변으로 돌아가기 위해 고군분투한다.',
      poster_path:
        'https://image.tmdb.org/t/p/original/pxsn8GtNHbN01iWkD2cV8CMuGzm.jpg',
      release_date: '2023-08-03',
      watch_date: '',
      title: '47시간: 샤크베이트',
      rating: 3.5,
    },
  ],
  '2024-03-07': [
    {
      id: 9,
      original_language: 'en',
      original_title: 'Shark Bait',
      overview:
        '마지막 봄 방학을 기념하러 해변에서 파티를 벌이던 젊은이들은 우연히 주인 없이 방치된 제트스키 두 대를 발견하고 키를 훔친다. 그들은 제트스키가 처참한 결과를 몰고 올 재앙의 원인이 될지 모른 채 승선한다. 철없는 치킨게임을 하다 고장 난 제트스키는 바다 한 가운데 고립되고 거대한 백상어의 그림자가 서서히 그들 주위를 맴돈다. 상어의 희생자가 한 명씩 늘어가는 가운데 남은 사람들은 해변으로 돌아가기 위해 고군분투한다.',
      poster_path:
        'https://image.tmdb.org/t/p/original/pxsn8GtNHbN01iWkD2cV8CMuGzm.jpg',
      release_date: '2023-08-03',
      watch_date: '',
      title: '47시간: 샤크베이트',
      rating: 3.5,
    },
  ],
  '2024-03-08': [
    {
      id: 9,
      original_language: 'en',
      original_title: 'Shark Bait',
      overview:
        '마지막 봄 방학을 기념하러 해변에서 파티를 벌이던 젊은이들은 우연히 주인 없이 방치된 제트스키 두 대를 발견하고 키를 훔친다. 그들은 제트스키가 처참한 결과를 몰고 올 재앙의 원인이 될지 모른 채 승선한다. 철없는 치킨게임을 하다 고장 난 제트스키는 바다 한 가운데 고립되고 거대한 백상어의 그림자가 서서히 그들 주위를 맴돈다. 상어의 희생자가 한 명씩 늘어가는 가운데 남은 사람들은 해변으로 돌아가기 위해 고군분투한다.',
      poster_path:
        'https://image.tmdb.org/t/p/original/pxsn8GtNHbN01iWkD2cV8CMuGzm.jpg',
      release_date: '2023-08-03',
      watch_date: '',
      title: '47시간: 샤크베이트',
      rating: 3.5,
    },
    {
      id: 9,
      original_language: 'en',
      original_title: 'Shark Bait',
      overview:
        '마지막 봄 방학을 기념하러 해변에서 파티를 벌이던 젊은이들은 우연히 주인 없이 방치된 제트스키 두 대를 발견하고 키를 훔친다. 그들은 제트스키가 처참한 결과를 몰고 올 재앙의 원인이 될지 모른 채 승선한다. 철없는 치킨게임을 하다 고장 난 제트스키는 바다 한 가운데 고립되고 거대한 백상어의 그림자가 서서히 그들 주위를 맴돈다. 상어의 희생자가 한 명씩 늘어가는 가운데 남은 사람들은 해변으로 돌아가기 위해 고군분투한다.',
      poster_path:
        'https://image.tmdb.org/t/p/original/pxsn8GtNHbN01iWkD2cV8CMuGzm.jpg',
      release_date: '2023-08-03',
      watch_date: '',
      title: '47시간: 샤크베이트',
      rating: 3.5,
    },
  ],
  '2024-03-09': undefined,
  '2024-03-10': undefined,
  '2024-03-11': undefined,
  '2024-03-12': undefined,
  '2024-03-13': undefined,
  '2024-03-14': undefined,
  '2024-03-15': undefined,
  '2024-03-16': undefined,
  '2024-03-17': undefined,
  '2024-03-18': undefined,
  '2024-03-19': undefined,
  '2024-03-20': undefined,
  '2024-03-21': undefined,
  '2024-03-22': undefined,
  '2024-03-23': undefined,
  '2024-03-24': undefined,
  '2024-03-25': undefined,
  '2024-03-26': undefined,
  '2024-03-27': undefined,
  '2024-03-28': undefined,
  '2024-03-29': undefined,
  '2024-03-30': undefined,
  '2024-03-31': undefined,
};

function Calendar() {
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
            style={styles.calendar.date.box}
            onPress={() => {
              if (e.date?.month === date.month() + 1)
                setDate(moment(e.date?.dateString));
            }}
          >
            {movies[e.date?.dateString as string] !== undefined && (
              <ImageBackground
                source={{
                  uri: movies[e.date?.dateString!]![0].poster_path,
                }}
                imageStyle={{borderRadius: 5}}
                style={styles.calendar.date.poster}
              >
                <View style={styles.calendar.date.blur} />
                {movies[e.date?.dateString as string]!.length > 1 && (
                  <View style={styles.calendar.date.more}>
                    <Typography
                      variant="Info"
                      color="#d8d8d8"
                      style={{lineHeight: 12}}
                    >
                      +{movies[e.date?.dateString as string]!.length - 1}
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
                  color={movies[e.date?.dateString as string] ? '#fff' : '#000'}
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
          <SeeMore routeFn={() => {}} />
        </Group>
        <Stack
          style={{
            borderBottomColor: '#c2c2c2',
            borderBottomWidth: 0.5,
            marginTop: 20,
          }}
        >
          {movies[date.format('YYYY-MM-DD')] !== undefined ? (
            movies[date.format('YYYY-MM-DD')]?.map((item) => (
              <Pressable
                style={styles.selectedDate.box}
                key={`${item.id}-${item.title}-${item.watch_date}`}
              >
                <MoviePoster
                  width={63}
                  height={83}
                  radius={5}
                  img={{uri: item.poster_path}}
                />
                <Stack>
                  <Typography variant="Title2">{item.title}</Typography>
                  <Typography variant="Info" color="#a4a4a4">
                    {item.release_date}
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
            <Pressable style={styles.selectedDate.box}>
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
