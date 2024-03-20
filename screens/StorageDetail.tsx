import {css} from '@emotion/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import IconArrowDown from '../assets/icon_arrow_down.svg';
import IconCheck from '../assets/icon_check.svg';
import IconDropDown from '../assets/icon_dropdown.svg';
import IconFullStar from '../assets/icon_fullstar.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import MoviePoster from '../components/MoviePoster';
import {mockData} from '../utils/mockData';

const SORTINGMENU = ['최신순', '오래된 순', '관람객 순', '별점 순'];

const styles = {
  wrapper: css({
    width: '100%',
    paddingTop: 50,
    backgroundColor: '#fff',
    paddingBottom: 20,
  }),
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

function StorageDetail() {
  const STORAGEMENU = ['나중에 볼 영화', '모든 영화', '액션', '2023 겨울 플리'];
  const [selectedSorting, setSelectedSorting] = useState('별점 순');
  const [selectedStorage, setSelectedStorage] = useState('모든 영화');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
  const handleSortChange = (item: string) => {
    setSelectedSorting(item);
    setDropdownOpen(false);
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
            <Stack style={{marginBottom: 40}}>
              {STORAGEMENU.map((item) => (
                <Pressable
                  style={[
                    styles.modal.item,
                    item === selectedStorage && {backgroundColor: '#f2f3f5'},
                  ]}
                  onPress={() => {
                    handleStorageChange(item);
                  }}
                >
                  <Group position="apart" align="center">
                    <Typography variant="Title1">{item}</Typography>
                    {item === selectedStorage && <IconCheck fill="#6f00f8" />}
                  </Group>
                </Pressable>
              ))}
            </Stack>
          </Animated.View>
        </Stack>
      </Modal>
      <View>
        <Pressable onPress={handleStorageModalOpen}>
          <Group align="center" gap={10}>
            <Typography variant="Title1">{selectedStorage}</Typography>
            <IconArrowDown />
          </Group>
        </Pressable>
      </View>
      <ScrollView
        style={{width: '100%'}}
        contentContainerStyle={{width: '100%', alignItems: 'center'}}
      >
        <Stack spacing={30} style={{width: 327}}>
          <Group position="apart" align="center">
            <Typography variant="Info">5점만 보기</Typography>
            <View style={{position: 'relative'}}>
              <Pressable
                style={styles.dropdown.sortingMenu}
                onPress={handleSortMenuOpen}
              >
                <Group gap={2} align="center">
                  <Typography variant="Info">{selectedSorting}</Typography>
                  <IconDropDown />
                </Group>
              </Pressable>
              {dropdownOpen && (
                <Shadow
                  style={styles.dropdown.wrapper}
                  containerStyle={{position: 'absolute', top: 43, right: -2}}
                  offset={[0, 2]}
                  startColor="rgba(0,0,0,0.1)"
                >
                  <Stack>
                    {SORTINGMENU.map((item, idx) => (
                      <Pressable
                        onPress={() => {
                          handleSortChange(item);
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
                      >
                        <Group position="apart">
                          <Typography variant="Info">{item}</Typography>
                          {item === selectedSorting && <IconCheck />}
                        </Group>
                      </Pressable>
                    ))}
                  </Stack>
                </Shadow>
              )}
            </View>
          </Group>
          <Group gap={10} style={{width: 329, flexWrap: 'wrap'}}>
            {mockData.results.map((item) => (
              <Stack>
                <MoviePoster
                  width={103}
                  height={142}
                  radius={5}
                  img={{
                    uri: item.poster_path,
                  }}
                />
                <Typography variant="Info">{}</Typography>
                <Group align="center" gap={2}>
                  <IconFullStar width={13} />
                  <Typography variant="Info" color="#6F00F8">
                    {item.vote_average}
                  </Typography>
                </Group>
              </Stack>
            ))}
          </Group>
        </Stack>
      </ScrollView>
    </Stack>
  );
}

export default StorageDetail;
