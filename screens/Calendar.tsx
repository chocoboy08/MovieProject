import {css} from '@emotion/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useQuery} from '@tanstack/react-query';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import {LocaleConfig, Calendar as MovieCalendar} from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import {instance} from '../apis/instance';
import IconArrowDown from '../assets/icon_arrow_down.svg';
import IconStar from '../assets/icon_fullstar.svg';
import IconPlus from '../assets/icon_plus.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import MoviePoster from '../components/MoviePoster';
import SeeMore from '../components/SeeMore';
import {MainStackParamList} from '../navigators/Main';
import {TabParamList} from '../navigators/TabNav';
import {Movie} from '../utils/type';

const styles = {
  wrapper: css({
    backgroundColor: '#fff',
    width: '100%',
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 25,
    paddingBottom: 20,
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

type CalendarScreenProp = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Calendar'>,
    NativeStackNavigationProp<MainStackParamList>
  >;
};
function Calendar({navigation}: CalendarScreenProp) {
  const [date, setDate] = useState(moment());
  const [dateModalOpen, setDateModalOpen] = useState(false);

  //월별 영화 데이터 가져오기

  const monthlyMoviesQuery = useQuery<Movie[][]>({
    queryKey: ['calenderMovies', date.year(), date.month() + 1],
    queryFn: async () => {
      try {
        const response = await instance.get(
          `/record/calendar?userId=${3}&year=${date.year()}&month=${
            date.month() + 1 < 10 ? '0' + (date.month() + 1) : date.month() + 1
          }`,
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

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
    <ScrollView contentContainerStyle={styles.wrapper}>
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
          <Pressable onPress={handleDateModal} style={{marginBottom: 10}}>
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
            {monthlyMoviesQuery.data &&
              monthlyMoviesQuery.data[e.date?.day as number] !== null &&
              (e.date && e.date.month === date.month() + 1 ? (
                <ImageBackground
                  source={{
                    uri: monthlyMoviesQuery.data[e.date?.day as number][0]
                      .poster,
                  }}
                  imageStyle={{borderRadius: 5}}
                  style={styles.calendar.date.poster}
                >
                  {e.date && e.date.month === date.month() + 1 && (
                    <View style={styles.calendar.date.blur} />
                  )}
                  {e.date &&
                    e.date.month === date.month() + 1 &&
                    monthlyMoviesQuery.data[e.date?.day as number].length >
                      1 && (
                      <View style={styles.calendar.date.more}>
                        <Typography
                          variant="Info"
                          color="#d8d8d8"
                          style={{lineHeight: 12}}
                        >
                          +
                          {monthlyMoviesQuery.data[e.date?.day as number]
                            .length - 1}
                        </Typography>
                      </View>
                    )}
                </ImageBackground>
              ) : undefined)}
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
                    (monthlyMoviesQuery.data &&
                      monthlyMoviesQuery.data[e.date?.day as number]) ||
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
              navigation.navigate('MonthlyMovies', {
                year: date.year(),
                month: date.month(),
              });
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
          {monthlyMoviesQuery.data &&
          monthlyMoviesQuery.data[date.date()] !== null ? (
            monthlyMoviesQuery.data[date.date()].map((item) => (
              <Pressable
                style={styles.selectedDate.box}
                onPress={() => {
                  navigation.navigate('Detail', {id: item.tmdbId});
                }}
                key={`${date.format('YYYY-MM-DD')}-${item.title}`}
              >
                <MoviePoster
                  width={63}
                  height={83}
                  radius={5}
                  img={{
                    uri: item.poster,
                  }}
                />
                <Stack>
                  <Typography variant="Title2">{item.title}</Typography>
                  <Typography variant="Info" color="#a4a4a4">
                    {`${item.nation}·${item.year}·${item.director}`}
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
              onPress={() =>
                navigation.navigate('Search', {playlistId: undefined})
              }
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
    </ScrollView>
  );
}

export default Calendar;
