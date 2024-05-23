import {css} from '@emotion/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Pressable, TextInput, useWindowDimensions, View} from 'react-native';
import IconBack from '../assets/icon_back.svg';
import IconProfile from '../assets/icon_default_profile.svg';
import IconEdit from '../assets/icon_edit_profile.svg';
import Group from '../components/@base/Group';
import Stack from '../components/@base/Stack';
import Typography from '../components/@base/Typography';
import {MyPageStackParamList} from '../navigators/MyPageNav';
import {Fonts} from '../utils/fontStyle';

const styles = {
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
};

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<MyPageStackParamList, 'Profile'>;
};
function Profile({navigation}: ProfileScreenProps) {
  const [name, setName] = useState('이예림');
  const [email, setEmail] = useState('chocoboy0508@gmail.com');
  const [isEditing, setIsEditing] = useState(false);
  const {width: deviceWidth, height: deviceHeight} = useWindowDimensions();
  return (
    <Stack
      style={{backgroundColor: '#fff', flex: 1, paddingTop: 50}}
      justify="flex-start"
      align="center"
    >
      <Group>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <IconBack style={{position: 'absolute', left: -deviceWidth * 0.4}} />
        </Pressable>
        <Typography variant="Title1">내 정보</Typography>
      </Group>
      <View style={{marginTop: 23, marginBottom: 35}}>
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
      <Stack
        style={{width: deviceWidth * 0.8, height: deviceHeight * 0.08}}
        justify="space-between"
      >
        <Group align="center" position="apart">
          <Typography variant="Info" color="#6f00f8">
            이름
          </Typography>
          <TextInput
            value={name}
            onChangeText={(text) => {
              setName(text);
            }}
            editable={false}
            style={[
              Fonts.Info,
              {
                color: '#8b8b8b',
                width: deviceWidth * 0.6,
                borderBottomColor: '#8b8b8b',
                borderBottomWidth: 0.5,
                paddingVertical: 0,
              },
            ]}
          />
        </Group>
        <Group align="center" position="apart">
          <Typography variant="Info" color="#6f00f8">
            이메일
          </Typography>
          <TextInput
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
            editable={true}
            style={[
              Fonts.Info,
              {
                color: '#8b8b8b',
                width: deviceWidth * 0.6,
                borderBottomColor: '#8b8b8b',
                borderBottomWidth: 0.5,
                paddingVertical: 0,
              },
            ]}
          />
        </Group>
      </Stack>
      <Pressable
        onPress={() => {
          setIsEditing((prev) => !prev);
        }}
        style={{
          paddingVertical: deviceHeight * 0.0125,
          paddingHorizontal: deviceWidth * 0.36,
          borderRadius: deviceHeight * 0.23,
          borderWidth: 1,
          borderColor: '#6f00f8',
          marginTop: deviceHeight * 0.025,
          backgroundColor: isEditing ? '#6f00f8' : '#fff',
        }}
      >
        <Typography variant="Info" color={isEditing ? '#fff' : '#6f00f8'}>
          {isEditing ? '저장하기' : '수정하기'}
        </Typography>
      </Pressable>
      <Stack spacing={7} align="center" style={{marginTop: 10}}>
        <Pressable>
          <Typography variant="Info" color="#8b8b8b">
            로그아웃
          </Typography>
        </Pressable>
        <Pressable>
          <Typography variant="Info" color="#ff0000">
            회원 탈퇴하기
          </Typography>
        </Pressable>
      </Stack>
    </Stack>
  );
}

export default Profile;
