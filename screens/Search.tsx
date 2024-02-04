/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Image, Pressable, ScrollView, Text, TextInput} from 'react-native';
import IconSearch from '../assets/icon_search.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import {mockData} from '../utils/mockData';

function Search() {
  const navigation = useNavigation();
  const [textInput, setTextInput] = useState('');
  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: 'white',
        width: '100%',
        alignItems: 'center',
      }}
    >
      <Group align="center" gap={11} style={{marginTop: 30}}>
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
            style={{width: 250}}
            value={textInput}
            onChangeText={(text) => {
              setTextInput(text);
            }}
          />
        </Group>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={{color: '#6F00F8'}}>취소</Text>
        </Pressable>
      </Group>
      <Stack
        style={{
          width: '100%',
          marginTop: 19,
          borderTopWidth: 0.5,
          borderTopColor: '#CBCBCB',
        }}
      >
        {mockData.results.map((item, idx) => {
          return textInput ? (
            <Pressable
              style={{
                flexDirection: 'row',
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 15,
                borderBottomWidth: 0.5,
                borderColor: '#e3e3e3',
              }}
            >
              <Image
                src={'https://image.tmdb.org/t/p/original' + item.poster_path}
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
                <Text
                  style={{
                    fontFamily: 'SUIT-Regular',
                    fontSize: 16,
                    color: 'black',
                  }}
                >
                  {item.title}
                </Text>
                <Text style={{fontFamily: 'SUIT-Regular', fontSize: 12}}>
                  2020.제임스
                </Text>
              </Stack>
            </Pressable>
          ) : (
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
              key={`autocomplete-${item.title}-${idx}`}
              onPress={() => {
                // setSearchItem(item.title);
              }}
            >
              <IconSearch />
              <Text style={{color: '#454545'}}>{item.title}</Text>
            </Pressable>
          );
        })}
      </Stack>
    </ScrollView>
  );
}

export default Search;
