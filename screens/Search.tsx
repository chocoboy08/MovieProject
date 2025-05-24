/* eslint-disable react-native/no-inline-styles */
import {css} from '@emotion/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  TextInput,
  TextInputKeyPressEventData,
} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {instance} from '../apis/instance';
import IconAddList from '../assets/icon_addlist.svg';
import IconSearch from '../assets/icon_search.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import {MainStackParamList} from '../navigators/Main';
import {TabParamList} from '../navigators/TabNav';
import {Movie, SearchItem, SearchMovie} from '../utils/type';

type SearchScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'Search'>,
  BottomTabScreenProps<TabParamList>
>;

const styles = {
  movies: {
    default: css({
      flexDirection: 'row',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 15,
    }),
    selected: css({
      borderColor: '#6f00f8',
      borderWidth: 1,
      borderRadius: 5,
    }),
    unselected: css({
      borderColor: '#e3e3e3',
      borderBottomWidth: 0.5,
    }),
  },
};

function Search({navigation, route}: SearchScreenProps) {
  const queryClient = useQueryClient();
  const [textInput, setTextInput] = useState('');
  const [searchItem, setSearchItem] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie>();
  const playlistId = route.params.playlistId;

  const handleChangeText = (newText: string) => {
    setTextInput(newText);

    if (newText.length > 0) {
      const lastChar = newText[newText.length - 1];
      if (/[가-힣]/.test(lastChar)) {
        setIsComposing(true);
      } else {
        setIsComposing(false);
      }
    } else {
      setIsComposing(false);
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      setIsComposing(false);
    }
  };

  const searchQuery = useQuery<SearchItem[]>({
    queryKey: ['searchText'],
    queryFn: async () => {
      try {
        const response = await instance.get(
          `/movie/title/list?title=${textInput}`,
        );

        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
  const searchResultQuery = useQuery<SearchMovie[]>({
    queryKey: ['searchResult'],
    queryFn: async () => {
      try {
        const response = await instance.get(
          `/movie/title/result?title=${searchItem}`,
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    enabled: searchEnabled,
  });
  //플리 영화 추가하기
  const playlistMovieMutation = useMutation({
    mutationKey: ['searchAdd'],
    mutationFn: async () => {
      try {
        const response = await instance.post('/movieInPlaylist', {
          playlistId: playlistId,
          tmdbId: selectedMovie?.tmdbId?.toString(),
        });
      } catch (error) {
        console.log(error.response.data);
      }
    },
  });
  useEffect(() => {
    if (isComposing) searchQuery.refetch();
    if (textInput !== searchItem) {
      setSearchEnabled(false);
      setSearchItem('');
      queryClient.resetQueries({queryKey: ['searchResult']});
    }
  }, [textInput]);
  useEffect(() => {
    console.log(selectedMovie?.tmdbId?.toString());
  });
  return (
    <Stack
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}
    >
      <Group
        align="center"
        position="center"
        gap={11}
        style={{marginTop: 30, marginBottom: 19}}
      >
        <Group
          style={{
            width: 288,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#F2F3F5',
            paddingLeft: 14,
          }}
          gap={8}
          align="center"
        >
          <IconSearch />
          <TextInput
            style={{width: 250, padding: 0}}
            value={textInput}
            onChangeText={handleChangeText}
            onKeyPress={handleKeyPress}
            onSubmitEditing={() => {
              setSearchItem(textInput);
              setSearchEnabled(true);
            }}
            returnKeyType="search"
          />
        </Group>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Typography variant="Info" color="#6F00F8">
            취소
          </Typography>
        </Pressable>
      </Group>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Stack
          style={{
            width: '100%',
            borderTopWidth: 0.5,
            borderTopColor: '#CBCBCB',
            flex: 1,
            justifyContent: 'flex-start',
          }}
        >
          {searchQuery.data && searchItem.length === 0 ? (
            searchQuery.data.map((item, idx) => {
              return (
                <Pressable
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 11,
                    height: 45,
                    paddingLeft: 29,
                    borderBottomWidth: 0.5,
                    borderColor: '#CBCBCB',
                  }}
                  onPress={() => {
                    setSearchItem(item.title);
                    setTextInput(item.title);
                    setSearchEnabled(true);
                  }}
                  key={`autocomplete-${item.title}-${idx}`}
                >
                  <IconSearch />
                  <Typography variant="Body2" style={{color: '#454545'}}>
                    {item.title}
                  </Typography>
                </Pressable>
              );
            })
          ) : searchResultQuery.isLoading ? (
            <ActivityIndicator
              size={'large'}
              style={{flex: 1, alignItems: 'center'}}
            />
          ) : (
            searchResultQuery.data &&
            searchResultQuery.data.map((item) => (
              <Pressable
                style={[
                  styles.movies.default,
                  item === selectedMovie
                    ? styles.movies.selected
                    : styles.movies.unselected,
                ]}
                onPress={() => {
                  playlistId
                    ? setSelectedMovie(selectedMovie ? undefined : item)
                    : navigation.navigate('Detail', {id: item.tmdbId});
                }}
                key={`search-list-movie-${item.title}-${item.tmdbId}`}
              >
                <Image
                  src={item.poster}
                  style={{width: 65, height: 89, borderRadius: 5}}
                />
                <Stack
                  style={{
                    marginLeft: 11,
                    height: 89,
                    justifyContent: 'flex-start',
                  }}
                  spacing={3}
                >
                  <Typography variant="Title2" color="#000">
                    {item.title}
                  </Typography>
                  <Typography variant="Body2">{`${item.nation}·${item.year}·${item.director}`}</Typography>
                </Stack>
              </Pressable>
            ))
          )}
        </Stack>
      </ScrollView>
      {playlistId && selectedMovie && (
        <Shadow
          style={{
            width: 125,
            height: 33,
            borderRadius: 16.5,
            backgroundColor: '#6f00f8',
            justifyContent: 'center',
          }}
          containerStyle={{position: 'absolute', right: 15, bottom: 30}}
          offset={[0, 2]}
        >
          <Pressable
            onPress={() => {
              playlistMovieMutation.mutate();
              navigation.pop(2);
            }}
          >
            <Group position="center" align="center">
              <IconAddList fill="#fff" width={15} />
              <Typography variant="Info" color="#fff">
                플리에 추가하기
              </Typography>
            </Group>
          </Pressable>
        </Shadow>
      )}
    </Stack>
  );
}

export default Search;
