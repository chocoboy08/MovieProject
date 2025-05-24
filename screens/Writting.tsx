import {css} from '@emotion/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useMutation, useQuery} from '@tanstack/react-query';
import React, {useEffect, useRef, useState} from 'react';
import {Pressable, ScrollView, TextInput} from 'react-native';
import {instance} from '../apis/instance';
import IconBack from '../assets/icon_back.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import {MainStackParamList} from '../navigators/Main';

import {Fonts} from '../utils/fontStyle';
import {Movie, ReviewData} from '../utils/type';

type WrittingScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'Writting'
>;

const styles = {
  contentWrapper: css({
    height: '100%',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  }),
  title: css({
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e3e3e3',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
  }),
};
function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = date.getHours();
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours > 12 ? hours - 12 : hours;

  return `${year}.${month}.${day} ${ampm} ${formattedHours}:${minutes}`;
}

function Writting({navigation, route}: WrittingScreenProps) {
  const movieId = route.params.id;
  const date = formatDate(new Date());
  const inputRef = useRef<TextInput>(null);

  const movieQuery = useQuery<Movie>({
    queryKey: ['movieData', movieId],
    queryFn: async () => {
      try {
        const response = await instance.get(`/movie/detail?tmdbId=${movieId}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
  const reviewQuery = useQuery<ReviewData>({
    queryKey: ['reviewData'],
    queryFn: async () => {
      try {
        const response = await instance.get(
          `/record?userId=${3}&tmdbId=${movieId}`,
        );
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.log(error.response.data);
      }
    },
  });
  const [review, setReview] = useState(
    reviewQuery.data?.review !== null ? reviewQuery.data?.review : '',
  );
  const writtingMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await instance.post('/record', {
          tmdbId: movieId.toString(),
          userId: 3,
          ...reviewQuery.data,
          review: review,
        });
      } catch (error) {
        console.log(error.response.data);
      }
    },
    onSuccess: () => {
      navigation.goBack();
    },
  });
  useEffect(() => {
    setReview(
      reviewQuery.data?.review !== null ? reviewQuery.data?.review : '',
    );
  }, [reviewQuery.data]);
  return (
    <Stack style={{paddingTop: 51, backgroundColor: '#fff'}}>
      <Group position="apart" align="center">
        <Pressable
          style={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <IconBack />
        </Pressable>
        <Pressable
          style={{
            width: 72,
            height: 46,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            writtingMutation.mutate();
          }}
        >
          <Typography variant="Title1" color="#6f00f8">
            완료
          </Typography>
        </Pressable>
      </Group>
      <ScrollView style={styles.contentWrapper}>
        <Stack style={styles.title}>
          <Typography variant="Title1">{movieQuery.data?.title}</Typography>
          <Typography variant="Info" color="#a6a6a6">
            {movieQuery.data?.tagline}
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="Info">{date}</Typography>
          <Pressable
            onPress={() => {
              inputRef.current?.focus();
            }}
            style={{paddingBottom: 300, alignItems: 'flex-start'}}
          >
            <TextInput
              value={review}
              onChangeText={(text) => {
                setReview(text);
              }}
              multiline
              style={[
                Fonts.Body1,
                {color: '#2d3540', textAlignVertical: 'top'},
              ]}
              ref={inputRef}
            />
          </Pressable>
        </Stack>
      </ScrollView>
    </Stack>
  );
}

export default Writting;
