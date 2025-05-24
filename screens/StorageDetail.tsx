import {css} from '@emotion/native';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {instance} from '../apis/instance';
import IconArrowDown from '../assets/icon_arrow_down.svg';
import IconCheck from '../assets/icon_check.svg';
import IconDeleteList from '../assets/icon_delete_list.svg';
import IconDropDown from '../assets/icon_dropdown.svg';
import IconFullStar from '../assets/icon_fullstar.svg';
import IconMenu from '../assets/icon_hamburger.svg';
import IconPlus from '../assets/icon_plus.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import MoviePoster from '../components/MoviePoster';
import {MainStackParamList} from '../navigators/Main';
import {GenreStorage, Movie, PlayList} from '../utils/type';

const SORTINGMENU = [
  {name: '최신순', type: 'latest'},
  {name: '오래된 순', type: 'earliest'},
];

const styles = {
  wrapper: css({
    width: '100%',
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  }),
  menu: {
    box: css({}),
    divider: css({
      width: 80,
      height: 0.5,
      backgroundColor: '#e2e2e2',
    }),
  },
  dropdown: {
    sortingMenu: css({
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: '#f2f3f5',
    }),
    wrapper: css({
      backgroundColor: '#fff',
      width: 154,
      borderRadius: 12,
      zIndex: 10,
    }),
    item: css({
      borderTopColor: '#f3f3f3',
      borderTopWidth: 1,
      paddingVertical: 14,
      paddingLeft: 18,
      paddingRight: 22,
    }),
  },
  modal: {
    overlay: css({
      backgroundColor: 'rgba(0,0,0,0.5)',
      flex: 1,
    }),
    container: css({
      marginTop: 40,
      paddingTop: 37,
      borderTopRightRadius: 16,
      borderTopLeftRadius: 16,
      backgroundColor: '#fff',
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
    item: css({
      padding: 20,
      paddingRight: 22,
    }),
  },
};

type StorageDetailScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'StorageDetail'
>;

function StorageDetail({navigation, route}: StorageDetailScreenProps) {
  const queryClient = useQueryClient();
  const params = route.params;
  const [selectedSorting, setSelectedSorting] = useState(SORTINGMENU[0]);

  const [playlistId, setPlaylistId] = useState(params.id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editable, setEditable] = useState(params.editable);

  const [deleteMenu, setDeleteMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteList, setDeleteList] = useState<number[]>([]);

  const isGenre = typeof playlistId === 'string';
  const userId = 3;

  //플리 목록 가져오기
  const playlistNameQuery = useQuery<PlayList[]>({
    queryKey: ['playlistNames', userId],
    queryFn: async () => {
      try {
        const response = await instance.get(`/playlist/${userId}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });

  //장르 가져오기
  const genreNameQuery = useQuery<GenreStorage[]>({
    queryKey: ['genre'],
    queryFn: async () => {
      try {
        const response = await instance.get(
          `/watched/genre/list?userId=${userId}`,
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
  //플리 영화 가져오기
  const playlistMovieQuery = useQuery<Movie[]>({
    queryKey: ['playlistMovies', userId, playlistId],
    queryFn: async () => {
      try {
        if (isGenre) {
          const response = await instance.get(
            `/watched/genre/movie?userId=${userId}&genre=${playlistId}`,
          );

          return response.data;
        } else {
          const response = await instance.get(
            `/movieInPlaylist/${selectedSorting.type}/${playlistId}`,
          );
          return response.data;
        }
      } catch (error) {
        console.log(error.response.data);
      }
    },
  });

  //플리 영화 삭제
  const deletingMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await instance.delete('/movieInPlaylist/delete', {
          data: {playlistId: playlistId, tmdbIdList: deleteList},
        });
      } catch (error) {
        console.log(error.response.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['playlistMovies']});
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
          return closeAnim.start(handleStorageModalOpen);
        }
        return resetPositionAnim.start();
      },
    }),
  ).current;
  const handleStorageChange = (item: string) => {
    setSelectedStorage(item);
    setModalOpen(false);
  };

  const handleSortMenuOpen = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleStorageModalOpen = () => {
    setModalOpen((prev) => !prev);
  };
  const handleDismiss = () => {
    closeAnim.start(handleStorageModalOpen);
  };

  useEffect(() => {
    if (modalOpen) {
      resetPositionAnim.start();
    }
  }, [modalOpen]);
  const [selectedStorage, setSelectedStorage] = useState('');
  useEffect(() => {
    setSelectedStorage(
      isGenre
        ? playlistId
        : (playlistNameQuery.data?.find(
            (item) => item.playlistId === playlistId,
          )?.name as string),
    );
  });
  useEffect(() => {
    playlistMovieQuery.refetch();
  }, [playlistId, selectedSorting]);

  const [isScreenFocused, setIsScreenFocused] = useState(false);
  useFocusEffect(() => {
    setIsScreenFocused(true); // when i focus the screen
    return () => setIsScreenFocused(false); // when i quit the screen
  });
  useEffect(() => {
    if (isScreenFocused) {
      playlistMovieQuery.refetch();
    }
  }, [isScreenFocused]);

  return (
    <Stack align="center" style={styles.wrapper}>
      <Modal
        animationType="fade"
        visible={modalOpen}
        transparent
        onRequestClose={() => {
          handleDismiss();
        }}
        statusBarTranslucent
      >
        <Stack style={styles.modal.overlay} justify="flex-end">
          <Animated.View
            style={[styles.modal.container, {top}]}
            {...panResponders.panHandlers}
          >
            <View style={styles.modal.bar} />
            {isGenre ? (
              <ScrollView>
                {genreNameQuery.data?.map((item, idx) => (
                  <Pressable
                    style={[
                      styles.modal.item,
                      item.genre === selectedStorage && {
                        backgroundColor: '#f2f3f5',
                      },
                    ]}
                    onPress={() => {
                      item.genre && setPlaylistId(item.genre);
                      handleStorageChange(item.genre);
                    }}
                    key={`storagelist-${item.genre}-${idx}`}
                  >
                    <Group position="apart" align="center">
                      <Typography variant="Title1">{item.genre}</Typography>
                      {item.genre === selectedStorage && (
                        <IconCheck fill="#6f00f8" />
                      )}
                    </Group>
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <ScrollView>
                {playlistNameQuery.data?.map((item, idx) => (
                  <Pressable
                    style={[
                      styles.modal.item,
                      item.name === selectedStorage && {
                        backgroundColor: '#f2f3f5',
                      },
                    ]}
                    onPress={() => {
                      item.playlistId && setPlaylistId(item.playlistId);
                      handleStorageChange(item.name);
                      if (idx > 1) setEditable(true);
                    }}
                    key={`storagemenu-${item.name}-${item.playlistId}`}
                  >
                    <Group position="apart" align="center">
                      <Typography variant="Title1">{item.name}</Typography>
                      {item.name === selectedStorage && (
                        <IconCheck fill="#6f00f8" />
                      )}
                    </Group>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </Animated.View>
        </Stack>
      </Modal>
      <Stack align="center" style={{width: 330}} spacing={25}>
        <Group style={{width: '100%'}} position="center" align="center">
          <Pressable onPress={handleStorageModalOpen}>
            <Group align="center" gap={10}>
              <Typography variant="Title1">{selectedStorage}</Typography>
              <IconArrowDown />
            </Group>
          </Pressable>
          <Pressable
            style={{
              position: 'absolute',
              right: 0,
              paddingHorizontal: 5,
              paddingVertical: 5,
            }}
            onPress={() => {
              setDeleteMenu((prev) => !prev);
            }}
          >
            <IconMenu />
          </Pressable>
          {deleteMenu && (
            <Pressable
              style={{
                position: 'absolute',
                right: 0,
                top: 25,
                zIndex: 1,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#cdcdcd',
                backgroundColor: '#fff',
                paddingVertical: 5,
                paddingHorizontal: 5,
              }}
              onPress={() => {
                setIsDeleting(true);
                setDeleteMenu(false);
              }}
            >
              <Typography variant="Info" color="#ff0000">
                영화 삭제하기
              </Typography>
            </Pressable>
          )}
        </Group>
      </Stack>
      <ScrollView
        contentContainerStyle={{width: 330, paddingTop: 25}}
        showsVerticalScrollIndicator={false}
      >
        <Group
          position={editable ? 'apart' : 'right'}
          align="center"
          style={{width: '100%', marginBottom: 24}}
        >
          {editable &&
            (isDeleting ? (
              <Pressable
                style={{
                  width: 72,
                  paddingVertical: 6,
                  borderRadius: 20,
                  borderColor: '#6f00f8',
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setIsDeleting(false);
                  setDeleteList([]);
                }}
              >
                <Typography variant="Info" color="#6f00f8">
                  삭제 취소
                </Typography>
              </Pressable>
            ) : (
              <Pressable
                style={{
                  flexDirection: 'row',
                  gap: 5,
                  width: 110,
                  paddingVertical: 6,
                  borderRadius: 20,
                  backgroundColor: '#6f00f8',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  navigation.navigate('AddMovies', {
                    playlistId: playlistId as number,
                  });
                }}
              >
                <Typography variant="Info" color="#fff">
                  작품 추가하기
                </Typography>
                <IconPlus fill="#fff" />
              </Pressable>
            ))}
          {!isGenre && (
            <View style={{position: 'relative'}}>
              <Pressable
                style={styles.dropdown.sortingMenu}
                onPress={handleSortMenuOpen}
              >
                <Group gap={2} align="center">
                  <Typography variant="Info">{selectedSorting.name}</Typography>
                  <IconDropDown />
                </Group>
              </Pressable>
              {dropdownOpen && (
                <Shadow
                  style={styles.dropdown.wrapper}
                  containerStyle={{position: 'absolute', top: 37, right: -2}}
                  offset={[0, 2]}
                  startColor="rgba(0,0,0,0.1)"
                >
                  <Stack>
                    {SORTINGMENU.map((item, idx) => (
                      <Pressable
                        onPress={() => {
                          setSelectedSorting(item);
                          setDropdownOpen(false);
                        }}
                        style={[
                          styles.dropdown.item,
                          idx === 0 && {borderTopWidth: 0},
                          item === selectedSorting && {
                            backgroundColor: '#f2f3f5',
                            borderTopRightRadius: idx === 0 ? 12 : 0,
                            borderTopLeftRadius: idx === 0 ? 12 : 0,
                            borderBottomRightRadius: idx === 3 ? 12 : 0,
                            borderBottomLeftRadius: idx === 3 ? 12 : 0,
                          },
                        ]}
                        key={`sortingmenu-${item}-${idx}`}
                      >
                        <Group position="apart">
                          <Typography variant="Info">{item.name}</Typography>
                          {item === selectedSorting && <IconCheck />}
                        </Group>
                      </Pressable>
                    ))}
                  </Stack>
                </Shadow>
              )}
            </View>
          )}
        </Group>

        <Group style={{flexWrap: 'wrap'}} gap={10} position="left">
          {playlistMovieQuery.isLoading ? (
            <ActivityIndicator
              size={'large'}
              style={{flex: 1, width: '100%'}}
            />
          ) : (
            playlistMovieQuery.data?.map((item, idx) => (
              <Pressable
                style={[
                  {
                    width: 103,
                    marginBottom: 20,
                    justifyContent: 'space-between',
                  },
                ]}
                onPress={() => {
                  item.tmdbId && isDeleting
                    ? deleteList.includes(item.tmdbId)
                      ? setDeleteList(
                          deleteList.filter(
                            (listItem) => listItem !== item.tmdbId,
                          ),
                        )
                      : setDeleteList([...deleteList, item.tmdbId])
                    : navigation.navigate('Detail', {id: item.tmdbId});
                }}
                key={`playlist-${playlistId}-${item.title}-${idx}`}
              >
                <View>
                  {isDeleting &&
                    item.tmdbId &&
                    !deleteList.includes(item.tmdbId) && (
                      <View
                        style={{
                          position: 'absolute',
                          backgroundColor: 'rgba(255,255,255,0.5)',
                          width: 103,
                          height: 142,
                          borderRadius: 5,
                          zIndex: 1,
                        }}
                      />
                    )}

                  <MoviePoster
                    width={103}
                    height={142}
                    radius={5}
                    img={{
                      uri: item.poster,
                    }}
                  />

                  <Typography variant="Info" numberOfLines={1}>
                    {item.title}
                  </Typography>
                </View>
                <Group align="center" gap={2}>
                  <IconFullStar width={13} height={13} />
                  <Typography variant="Info" color="#6F00F8">
                    {item.rating || '-'}
                  </Typography>
                </Group>
              </Pressable>
            ))
          )}
        </Group>
      </ScrollView>

      {isDeleting && (
        <Shadow
          style={{
            width: 125,
            height: 33,
            borderRadius: 16.5,
            backgroundColor: '#6f00f8',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          containerStyle={{position: 'absolute', right: 15, bottom: 30}}
          offset={[0, 2]}
        >
          <Pressable
            onPress={() => {
              deletingMutation.mutate();
              setIsDeleting(false);
              setDeleteList([]);
            }}
          >
            <Group position="center" align="center">
              <IconDeleteList width={15} />
              <Typography variant="Info" color="#fff">
                플리에서 제거하기
              </Typography>
            </Group>
          </Pressable>
        </Shadow>
      )}
    </Stack>
  );
}

export default StorageDetail;
