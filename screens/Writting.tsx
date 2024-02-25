import {css} from '@emotion/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useRef, useState} from 'react';
import {Pressable, ScrollView, Text, TextInput} from 'react-native';
import IconBack from '../assets/icon_back.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import {HomeStackParamList} from '../navigators/HomeNav';
import {Fonts} from '../utils/fontStyle';

type WrittingScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Writting'>;
};

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

function Writting({navigation}: WrittingScreenProps) {
  const date = formatDate(new Date());
  const inputRef = useRef<TextInput>(null);
  const [review, setReview] = useState('');
  const handleSubmit = () => {};
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
            navigation.navigate('Detail');
          }}
        >
          <Typography variant="Title1" color="#6f00f8">
            완료
          </Typography>
        </Pressable>
      </Group>
      <ScrollView style={styles.contentWrapper}>
        <Stack style={styles.title}>
          <Typography variant="Title1">서울의 봄</Typography>
          <Typography variant="Info">12:12 THE DAY</Typography>
        </Stack>
        <Stack>
          <Text>{date}</Text>
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
