import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MyPage from '../screens/MyPage';
import Profile from '../screens/Profile';

export type MyPageStackParamList = {
  MyPage: undefined;
  Profile: undefined;
};
type MyPageNavProps = {};
const MyPageStack = createNativeStackNavigator<MyPageStackParamList>();
function MyPageNav() {
  return (
    <MyPageStack.Navigator
      initialRouteName="MyPage"
      screenOptions={{headerShown: false}}
    >
      <MyPageStack.Screen name="MyPage" component={MyPage} />
      <MyPageStack.Screen name="Profile" component={Profile} />
    </MyPageStack.Navigator>
  );
}

export default MyPageNav;
