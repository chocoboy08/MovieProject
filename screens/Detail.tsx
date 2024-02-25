import {css} from '@emotion/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';

import IconAddList from '../assets/icon_addlist.svg';
import IconDown from '../assets/icon_arrow_down.svg';
import IconHeart from '../assets/icon_heart_fill.svg';
import IconWatching from '../assets/icon_watching.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import Keywords, {KeywordProps} from '../components/Keywords';
import StarRating from '../components/StartRating';
import {HomeStackParamList} from '../navigators/HomeNav';

const styles = {
  banner: {
    background: css({
      width: '100%',
      height: 322,
      alignItems: 'center',
    }),
    blur: css({
      width: '100%',
      height: 322,
      backgroundColor: 'rgba(0,0,0,0.6)',
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
};
type DetailScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Detail'>;
};

function Detail({navigation}: DetailScreenProps) {
  const [date, setDate] = useState(new Date());
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
  const [rating, setRating] = useState(0);
  const selectedKeywords = keywords.filter((item) => item.selected);
  const [review, setReview] = useState('');

  const handleKeywordModalOpen = () => {
    setKeywordOpen((prev) => !prev);
  };

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <Modal
        visible={keywordOpen}
        onRequestClose={handleKeywordModalOpen}
        transparent={true}
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
          uri: 'https://image.tmdb.org/t/p/original/pxsn8GtNHbN01iWkD2cV8CMuGzm.jpg',
        }}
      >
        <View style={styles.banner.blur} />
        <Stack style={{marginTop: 140}} align="center">
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
            },
          ]}
        >
          판도라 행성에서 ‘제이크 설리'와 ‘네이티리'가 이룬 가족이 겪게 되는
          무자비한 위협과 살아남기 위해 떠나야 하는 긴 여정과 전투, 그리고
          견뎌내야 할 상처에 대한 이야기.
        </Typography>
        <Pressable>
          <Text>더보기</Text>
        </Pressable>
      </ImageBackground>
      <Stack style={styles.bottom.wrapper}>
        <Group
          position="center"
          gap={36}
          style={{marginTop: 13, marginBottom: 7}}
        >
          <Stack align="center" style={{paddingHorizontal: 14}}>
            <IconHeart fill="#acacac" />
            <Typography variant="Info" color="#acacac">
              보고싶어요
            </Typography>
          </Stack>

          <Stack align="center" style={{paddingHorizontal: 14}}>
            <IconWatching fill="#acacac" />
            <Typography variant="Info" color="#acacac">
              보는 중
            </Typography>
          </Stack>

          <Stack align="center" style={{paddingHorizontal: 14}}>
            <IconAddList fill="#acacac" />
            <Typography variant="Info" color="#acacac">
              내 플레이리스트
            </Typography>
          </Stack>
        </Group>
        <View style={styles.bottom.divider} />
        <Group style={{marginTop: 10, marginBottom: 15}}>
          <Pressable
            style={styles.bottom.datePicker}
            onPress={() => {
              setDateOpen(true);
            }}
          >
            <Typography variant="Body1">{`${date.getFullYear()}년 ${date.getMonth()}월 ${date.getDate()}일`}</Typography>
            <IconDown />
          </Pressable>
          <DatePicker
            date={date}
            modal
            open={dateOpen}
            onConfirm={(date) => {
              setDate(date);
              setDateOpen(false);
            }}
            onCancel={() => {
              setDateOpen(false);
            }}
            locale="ko"
            mode="date"
          />
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
                <Keywords keywordItem={item} />
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
            <StarRating rating={rating} setRating={setRating} />
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
