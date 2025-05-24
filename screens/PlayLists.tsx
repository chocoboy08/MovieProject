import {css} from '@emotion/native';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import React, {useState} from 'react';
import {Modal, Pressable, ScrollView, TextInput, View} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {instance} from '../apis/instance';
import IconDelete from '../assets/icon_delete.svg';
import IconEdit from '../assets/icon_edit.svg';
import IconLogo from '../assets/icon_empty_logo.svg';
import IconPlus from '../assets/icon_plus.svg';
import IconWarning from '../assets/icon_warning.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import MoviePoster from '../components/MoviePoster';
import SeeMore from '../components/SeeMore';
import {MainStackParamList} from '../navigators/Main';
import {PlayList} from '../utils/type';

const styles = {
  img: {
    blur: css({
      backgroundColor: 'rgba(0,0,0,0.5)',
      width: '100%',
      height: '100%',
      borderRadius: 10,
      position: 'absolute',
      zIndex: 1,
    }),
  },
  create: {
    wrapper: css({
      backgroundColor: 'rgba(0,0,0,0.5)',
      flex: 1,
    }),
    box: css({
      backgroundColor: '#fff',
      width: '73%',
      borderRadius: 10,
      paddingHorizontal: '5%',
      paddingVertical: 20,
    }),
    input: css({
      width: '100%',
      borderBottomColor: '#c0c0c0',
      borderBottomWidth: 0.5,
      padding: 0,
      color: '#000',
      marginTop: '4%',
      marginBottom: '20%',
    }),
  },
  delete: {
    wrapper: css({
      backgroundColor: 'rgba(0,0,0,0.5)',
      flex: 1,
    }),
    box: css({
      backgroundColor: '#fff',
      width: 330,
      borderRadius: 5,
      paddingHorizontal: 15,
      paddingBottom: 15,
      paddingTop: 25,
    }),
    btn: css({
      width: 62,
      height: 25,
      borderRadius: 12.5,
      justifyContent: 'center',
      alignItems: 'center',
    }),
    text: css({
      width: 245,
      marginTop: 10,
      marginBottom: 14,
    }),
  },
};

type PlayListsScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'PlayLists'>;
};
function PlayLists({navigation}: PlayListsScreenProps) {
  const queryClient = useQueryClient();
  const [editPlayList, setEditPlayList] = useState(false);
  const [changeIdx, setChangeIdx] = useState<number>(-1);
  const [createState, setCreateState] = useState('');
  const [inputText, setInputText] = useState('');

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

  //플리 추가하기
  const playlistMutation = useMutation({
    mutationFn: async (action: string) => {
      try {
        switch (action) {
          case 'post': {
            const response = await instance.post('/playlist', {
              name: inputText,
              userId: 3,
            });
            break;
          }
          case 'put': {
            const response = await instance.put('/playlist/update', {
              name: inputText,
              playlistId: changeIdx,
            });
            break;
          }
          case 'delete': {
            const response = await instance.delete(
              `/playlist/delete/${changeIdx}`,
            );
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw error;
        } else throw new Error('different error than axios');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['playlists']});
    },
  });
  useFocusEffect(() => {
    playlistQuery.refetch();
  });
  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexGrow: 1,
      }}
      style={{
        backgroundColor: '#ffffff',
      }}
    >
      <Modal
        visible={!(createState === '' || createState === 'delete')}
        transparent
        statusBarTranslucent
      >
        <Stack align="center" justify="center" style={styles.create.wrapper}>
          <Stack style={styles.create.box}>
            <Typography variant="Head1">
              {createState === 'create'
                ? '새로운 플레이리스트 생성'
                : createState}
            </Typography>
            <TextInput
              style={styles.create.input}
              placeholder={
                createState === 'create'
                  ? '제목을 입력해주세요'
                  : '새로운 제목을 입력해주세요'
              }
              value={inputText}
              onChangeText={(text) => {
                setInputText(text);
              }}
            />
            <Group gap={6} position="right">
              <Pressable
                style={[styles.delete.btn, {backgroundColor: '#d9d9d9'}]}
                onPress={() => {
                  setInputText('');
                  setCreateState('');
                }}
              >
                <Typography variant="Body2" color="#fff">
                  취소
                </Typography>
              </Pressable>
              <Pressable
                style={[styles.delete.btn, {backgroundColor: '#6f00f8'}]}
                onPress={() => {
                  if (createState === 'create') playlistMutation.mutate('post');
                  else playlistMutation.mutate('put');
                  setInputText('');
                  setCreateState('');
                }}
              >
                <Typography variant="Body2" color="#fff">
                  저장
                </Typography>
              </Pressable>
            </Group>
          </Stack>
        </Stack>
      </Modal>
      <Modal
        visible={createState === 'delete'}
        transparent
        statusBarTranslucent
      >
        <Stack align="center" justify="center" style={styles.delete.wrapper}>
          <Stack style={styles.delete.box}>
            <Group align="center">
              <IconWarning />
              <Typography variant="Title1" color="#6f00f8">
                경고
              </Typography>
            </Group>
            <Typography variant="Body1" style={styles.delete.text}>
              플레이리스트 삭제 시 복구할 수 없습니다. 계속 하시겠습니까?
            </Typography>
            <Group gap={6} position="right">
              <Pressable
                style={[styles.delete.btn, {backgroundColor: '#d9d9d9'}]}
                onPress={() => {
                  setCreateState('');
                  setChangeIdx(-1);
                }}
              >
                <Typography variant="Body2" color="#fff">
                  취소
                </Typography>
              </Pressable>
              <Pressable
                style={[styles.delete.btn, {backgroundColor: '#6f00f8'}]}
                onPress={() => {
                  playlistMutation.mutate('delete');
                  setCreateState('');
                }}
              >
                <Typography variant="Body2" color="#fff">
                  확인
                </Typography>
              </Pressable>
            </Group>
          </Stack>
        </Stack>
      </Modal>
      <Group align="center">
        <Typography variant="Title1" style={{marginTop: 50}}>
          모든 플레이리스트
        </Typography>

        <Pressable
          style={{position: 'absolute', right: -96}}
          onPress={() => {
            setEditPlayList((prev) => !prev);
          }}
        >
          <Typography variant="Info">
            {editPlayList ? '완료' : '편집'}
          </Typography>
        </Pressable>
      </Group>
      <Stack
        align="flex-start"
        spacing={25}
        style={{width: '100%', padding: 15}}
      >
        {playlistQuery.data?.map((item, idx) => (
          <Pressable
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            key={`playlist-${item.playlistId}-${item.name}`}
            onPress={() => {
              !editPlayList &&
                navigation.navigate('StorageDetail', {
                  id: item.playlistId,
                  editable: true,
                });
            }}
          >
            <Group gap={10}>
              {item.poster ? (
                <View>
                  <View style={styles.img.blur} />
                  <MoviePoster
                    width={101}
                    height={101}
                    img={{uri: item.poster}}
                    radius={10}
                  />
                </View>
              ) : (
                <View
                  style={{
                    borderRadius: 10,
                    width: 101,
                    height: 101,
                    borderColor: '#e6e6e6',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <IconLogo fill="#e6e6e6" />
                </View>
              )}
              <Stack justify="space-between">
                <Stack>
                  <Group align="center" gap={5}>
                    <Typography variant="Title1">{item.name}</Typography>
                    {editPlayList && idx > 1 && (
                      <Pressable
                        onPress={() => {
                          setCreateState(item.name);
                          item.playlistId && setChangeIdx(item.playlistId);
                        }}
                      >
                        <IconEdit width={11} fill="#000" />
                      </Pressable>
                    )}
                  </Group>
                  {item.title && (
                    <Typography variant="Info">{`${item.title} 외 ${item.total}개 작품`}</Typography>
                  )}
                </Stack>
                <SeeMore routeFn={() => {}} />
              </Stack>
            </Group>
            {editPlayList && idx > 1 && (
              <Pressable
                onPress={() => {
                  item.playlistId && setChangeIdx(item.playlistId);
                  setCreateState('delete');
                }}
              >
                <IconDelete style={{alignSelf: 'center'}} />
              </Pressable>
            )}
          </Pressable>
        ))}
      </Stack>
      {!editPlayList && (
        <Shadow
          startColor="rgba(0,0,0,0.1)"
          offset={[0, 2]}
          containerStyle={{position: 'absolute', bottom: 32, right: 16}}
        >
          <Pressable
            style={{
              paddingHorizontal: 16,
              height: 31,
              borderRadius: 15.5,
              backgroundColor: '#6f00f8',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 3,
            }}
            onPress={() => {
              setCreateState('create');
            }}
          >
            <Typography variant="Body2" color="#fff">
              새로 만들기
            </Typography>
            <IconPlus fill="#fff" />
          </Pressable>
        </Shadow>
      )}
    </ScrollView>
  );
}

export default PlayLists;
