import {css} from '@emotion/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useQuery} from '@tanstack/react-query';
import React from 'react';
import {Pressable, ScrollView, useWindowDimensions, View} from 'react-native';
import {instance} from '../apis/instance';
import IconAddList from '../assets/icon_addlist.svg';
import IconCongratulate from '../assets/icon_congratulate.svg';
import IconProfile from '../assets/icon_default_profile.svg';
import IconEdit from '../assets/icon_edit_profile.svg';
import IconHeart from '../assets/icon_heart_fill.svg';
import IconWatching from '../assets/icon_watching.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import Keywords from '../components/Keywords';
import SeeMore from '../components/SeeMore';
import StorageBox from '../components/StorageBox';
import {MainStackParamList} from '../navigators/Main';
import {TabParamList} from '../navigators/TabNav';
import {PlayList} from '../utils/type';

const styles = {
  wrapper: css({
    flexGrow: 1,
    backgroundColor: '#f2f3f5',
  }),
  box: css({
    backgroundColor: '#fff',
    paddingVertical: 20,
  }),
  profileEditBtn: css({
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  }),
  menuBtn: css({
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  }),
};

type MyPageScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'MyPage'>,
    NativeStackNavigationProp<MainStackParamList>
  >;
};
function MyPage({navigation}: MyPageScreenProps) {
  const {width: deviceWidth, height: deviceHeight} = useWindowDimensions();
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
  const monthTotalQuery = useQuery<{total: number}>({
    queryKey: ['monthTotal'],
    queryFn: async () => {
      try {
        const response = await instance.get(`/record/total/month/${3}`);
        return response.data;
      } catch (error) {
        console.log(error.response.data);
      }
    },
  });
  const yearTotalQuery = useQuery<{total: number}>({
    queryKey: ['yearTotal'],
    queryFn: async () => {
      try {
        const response = await instance.get(`/record/total/year/${3}`);
        return response.data;
      } catch (error) {
        console.log(error.response.data);
      }
    },
  });
  return (
    <ScrollView contentContainerStyle={[styles.wrapper, {gap: 22}]}>
      <Stack style={[styles.box, {paddingTop: 50}]} align="center">
        <Stack align="center" spacing={10} style={{marginBottom: 10}}>
          <View>
            <View
              style={{
                width: 85,
                height: 85,
                borderRadius: 42.5,
                backgroundColor: '#be9df6',
                justifyContent: 'flex-end',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <IconProfile width={60} height={65} />
            </View>
            <Pressable style={styles.profileEditBtn}>
              <IconEdit width={15} height={15} fill="#fff" />
            </Pressable>
          </View>
          <Stack align="center">
            <Typography variant="Head1">김준수</Typography>
            <SeeMore
              routeFn={() => {
                navigation.navigate('Profile');
              }}
            />
          </Stack>
        </Stack>
        <Group align="center">
          <Pressable
            style={[styles.menuBtn, {width: deviceWidth * 0.25}]}
            onPress={() => {
              playlistQuery.data &&
                navigation.navigate('StorageDetail', {
                  id: playlistQuery.data[0].playlistId,
                  editable: false,
                });
            }}
          >
            <IconHeart fill="#acacac" />
            <Typography variant="Info" color="#acacac">
              보고싶어요
            </Typography>
          </Pressable>
          <View style={{width: 0.5, height: 20, backgroundColor: '#d8d8d8'}} />
          <Pressable
            style={[styles.menuBtn, {width: deviceWidth * 0.25}]}
            onPress={() => {
              playlistQuery.data &&
                navigation.navigate('StorageDetail', {
                  id: playlistQuery.data[1].playlistId,
                  editable: false,
                });
            }}
          >
            <IconWatching fill="#acacac" />
            <Typography variant="Info" color="#acacac">
              봤어요
            </Typography>
          </Pressable>
          <View style={{width: 0.5, height: 20, backgroundColor: '#d8d8d8'}} />
          <Pressable
            style={[styles.menuBtn, {width: deviceWidth * 0.25}]}
            onPress={() => {
              navigation.navigate('PlayLists');
            }}
          >
            <IconAddList fill="#acacac" />
            <Typography variant="Info" color="#acacac">
              내 플레이리스트
            </Typography>
          </Pressable>
        </Group>
        <Group
          align="center"
          gap={8}
          style={{
            marginTop: 15,
            paddingVertical: 8,
            paddingHorizontal: 15,
            backgroundColor: 'rgba(111,0,248,0.1)',
            borderRadius: 15,
            borderColor: '#6f00f8',
            borderWidth: 1,
          }}
        >
          <IconCongratulate />
          <Stack>
            <Typography variant="Title1" color="#6f00f8">
              이번 달 영화 기록을
              {monthTotalQuery.data && monthTotalQuery.data.total}회 달성했어요!
            </Typography>
            <Typography variant="Info" color="#6f00f8">
              총 {yearTotalQuery.data && yearTotalQuery.data.total}편의 영화를
              기록했어요
            </Typography>
          </Stack>
        </Group>
      </Stack>
      <Stack style={styles.box} spacing={8}>
        <Group position="apart" style={{marginHorizontal: deviceWidth * 0.083}}>
          <Typography variant="Head1">나의 영화 플레이 리스트</Typography>
          <SeeMore
            routeFn={() => {
              navigation.navigate('PlayLists');
            }}
          />
        </Group>
        <ScrollView
          contentContainerStyle={{gap: 10, paddingLeft: deviceWidth * 0.083}}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {playlistQuery.data?.map((item, idx) => (
            <StorageBox
              img={{uri: item.poster}}
              isEmpty={item.poster === null}
              width={182}
              height={125}
              onPress={() => {
                navigation.navigate('StorageDetail', {
                  id: item.playlistId,
                  editable: idx > 1,
                });
              }}
              key={`mypage-playlist-${item.playlistId}`}
            >
              <Typography variant="Title1" color="#ececec">
                {item.name}
              </Typography>
            </StorageBox>
          ))}
        </ScrollView>
      </Stack>
      <Stack
        style={[styles.box, {paddingLeft: deviceWidth * 0.083}]}
        spacing={10}
      >
        <Typography variant="Head1">내가 뽑은 키워드</Typography>
        <Group gap={6}>
          <Keywords keywordItem={{selected: true, content: '스토리'}} />
          <Keywords keywordItem={{selected: true, content: '몰입도'}} />
          <Keywords keywordItem={{selected: true, content: '연기'}} />
        </Group>
      </Stack>
    </ScrollView>
  );
}

export default MyPage;
