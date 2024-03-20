import {css} from '@emotion/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Dimensions, Image, Pressable, ScrollView, View} from 'react-native';
import IconSearch from '../assets/icon_search.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import SeeMore from '../components/SeeMore';
import {HomeStackParamList} from '../navigators/HomeNav';
import {mockData} from '../utils/mockData';

const styles = {
  pageTop: {
    wrapper: css({
      backgroundColor: '#fff',
      paddingTop: 56,
      paddingBottom: 12,
    }),
    search: {
      box: css({
        position: 'relative',
        backgroundColor: '#F2F3F5',
        borderRadius: 16,
        width: 300,
        height: 32,
        marginTop: 11,
        paddingLeft: 35,
      }),
      input: css({
        color: '#747F8E',
        padding: 0,
        fontSize: 12,
      }),
    },
  },
  pageBottom: {
    wrapper: {backgroundColor: '#fff'},
    recentMovie: css({width: 85, height: 116, borderRadius: 5}),
  },
};
type AddRecordScreenProps = NativeStackNavigationProp<
  HomeStackParamList,
  'AddRecord'
>;
function AddRecord() {
  const navigation = useNavigation<AddRecordScreenProps>();
  return (
    <ScrollView style={{gap: 14}}>
      <Stack style={styles.pageTop.wrapper} align="center" justify="flex-end">
        <Stack>
          <Typography variant="Head1" color="#2d3540">
            새로운 기록 추가하기
          </Typography>
          <Typography variant="Body2" color="#2d3540">
            어떤 영화를 기록해 볼까요?
          </Typography>
          <Group style={styles.pageTop.search.box} align="center">
            <IconSearch style={{position: 'absolute', left: 15}} />
            <Pressable
              style={styles.pageTop.search.input}
              onPress={() => {
                navigation.navigate('Search');
              }}
            >
              <Typography variant="Body2" color="#747f8e">
                영화 및 인물을 검색해보세요
              </Typography>
            </Pressable>
          </Group>
        </Stack>
      </Stack>
      <Stack style={styles.pageBottom.wrapper}>
        <Stack spacing={10} style={{marginTop: 13}} align="center">
          <Group gap={140}>
            <Typography variant="Title1">최근 검색한 영화</Typography>
            <SeeMore />
          </Group>
          <View style={{height: 116}}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 10,
                paddingLeft: (Dimensions.get('window').width - 300) / 2,
              }}
            >
              {mockData.results.map((item) => {
                return (
                  <Pressable
                    onPress={() => {
                      navigation.navigate('Detail');
                    }}
                    key={`recent-search-movie-${item.id}`}
                  >
                    <Image
                      src={item.poster_path}
                      style={styles.pageBottom.recentMovie}
                      key={`recent-list-${item.title}`}
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
          <Stack>
            <Group position="apart" style={{width: 300}}>
              <Typography variant="Title1">인기 영화</Typography>
              <SeeMore />
            </Group>
            <Stack>
              {mockData.results.map((item) => {
                return (
                  <View key={`add-popular-movie-${item.id}`}>
                    <Group
                      align="flex-start"
                      gap={10}
                      style={{marginTop: 10, marginBottom: 10}}
                    >
                      <Image
                        src={item.poster_path}
                        style={{width: 65, height: 89, borderRadius: 5}}
                        key={`recent-list-${item.title}`}
                      />
                      <Stack>
                        <Typography variant="Title2">{item.title}</Typography>
                        <Typography variant="Body2" color="#a4a4a4">
                          한국 · 2023 · 김성수
                        </Typography>
                      </Stack>
                    </Group>
                    <View style={{borderColor: '#e3e3e3', borderWidth: 0.25}} />
                  </View>
                );
              })}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </ScrollView>
  );
}

export default AddRecord;
