import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import IconCalendar from '../assets/icon_calendar.svg';
import IconFolder from '../assets/icon_folder.svg';
import IconHome from '../assets/icon_home.svg';
import IconProfile from '../assets/icon_profile.svg';
import Calendar from '../screens/Calendar';
import Home from '../screens/Home';
import MyPage from '../screens/MyPage';
import Storage from '../screens/Storage';

export type TabParamList = {
  Home: undefined;
  Storage: undefined;
  Calendar: undefined;
  MyPage: undefined;
};
const Tab = createBottomTabNavigator<TabParamList>();

function TabNav() {
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
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({color}) => {
            return <IconHome fill={color} />;
          },
          title: '홈',
        }}
      />

      <Tab.Screen
        name="Storage"
        component={Storage}
        options={{
          tabBarIcon: ({color}) => {
            return <IconFolder fill={color} />;
          },
          title: '보관함',
        }}
      />
      <Tab.Screen
        component={Calendar}
        name="Calendar"
        options={{
          tabBarIcon: ({color}) => {
            return <IconCalendar fill={color} />;
          },
          title: '캘린더',
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
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

export default TabNav;
