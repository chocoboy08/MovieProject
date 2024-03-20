import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import IconCalendar from '../assets/icon_calendar.svg';
import IconFolder from '../assets/icon_folder.svg';
import IconHome from '../assets/icon_home.svg';
import IconProfile from '../assets/icon_profile.svg';
import Home from '../screens/Home';
import CalendarNav from './CalendarNav';
import HomeNav from './HomeNav';
import StorageNav from './StorageNav';

export type TabParamList = {
  HomeNav: undefined;
  StorageNav: undefined;
  CalendarNav: undefined;
  ProfileNav: undefined;
};
const Tab = createBottomTabNavigator<TabParamList>();

function Main() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6F00F8',
        tabBarInactiveTintColor: '#C3C3C3',
        tabBarStyle: {height: 67},
        tabBarItemStyle: {paddingTop: 10},
        tabBarLabelStyle: {paddingBottom: 14},
        tabBarHideOnKeyboard: true,
        unmountOnBlur: true,
      }}
    >
      <Tab.Screen
        name="HomeNav"
        component={HomeNav}
        options={{
          tabBarIcon: ({color}) => {
            return <IconHome fill={color} />;
          },
          title: '홈',
        }}
      />

      <Tab.Screen
        name="StorageNav"
        component={StorageNav}
        options={{
          tabBarIcon: ({color}) => {
            return <IconFolder fill={color} />;
          },
          title: '보관함',
        }}
      />
      <Tab.Screen
        name="CalendarNav"
        component={CalendarNav}
        options={{
          tabBarIcon: ({color}) => {
            return <IconCalendar fill={color} />;
          },
          title: '캘린더',
        }}
      />
      <Tab.Screen
        name="ProfileNav"
        component={Home}
        options={{
          tabBarIcon: ({color}) => {
            return <IconProfile fill={color} />;
          },
          title: 'MY',
        }}
      />
    </Tab.Navigator>
  );
}

export default Main;
