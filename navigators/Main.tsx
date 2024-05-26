import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AddMovies from '../screens/AddMovies';
import Detail from '../screens/Detail';
import Login from '../screens/Login';
import MonthlyMovies from '../screens/MonthlyMovies';
import PlayLists from '../screens/PlayLists';
import Profile from '../screens/Profile';
import Search from '../screens/Search';
import StorageDetail from '../screens/StorageDetail';
import Writting from '../screens/Writting';
import TabNav from './TabNav';

export type MainStackParamList = {
  TabNav: undefined;
  Login: undefined;
  Search: undefined;
  Detail: {id: number};
  Writting: undefined;
  MonthlyMovies: {year: number; month: number};
  StorageDetail: undefined | {id: number};
  PlayLists: undefined;
  AddMovies: undefined;
  Profile: undefined;
};
const MainStack = createNativeStackNavigator<MainStackParamList>();
function Main() {
  return (
    <MainStack.Navigator screenOptions={{headerShown: false}}>
      <MainStack.Screen name="TabNav" component={TabNav} />
      <MainStack.Screen name="Login" component={Login} />
      <MainStack.Screen name="Search" component={Search} />
      <MainStack.Screen name="Detail" component={Detail} />
      <MainStack.Screen name="Writting" component={Writting} />
      <MainStack.Screen name="MonthlyMovies" component={MonthlyMovies} />
      <MainStack.Screen name="StorageDetail" component={StorageDetail} />
      <MainStack.Screen name="PlayLists" component={PlayLists} />
      <MainStack.Screen name="AddMovies" component={AddMovies} />
      <MainStack.Screen name="Profile" component={Profile} />
    </MainStack.Navigator>
  );
}

export default Main;
