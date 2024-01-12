import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import IconCalendar from '../assets/icon_calendar.svg';
import IconFolder from '../assets/icon_folder.svg';
import IconHome from '../assets/icon_home.svg';
import IconProfile from '../assets/icon_profile.svg';
import Home from './home/Home';
const Tab = createBottomTabNavigator();
function Main() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6F00F8',
        tabBarInactiveTintColor: '#C3C3C3',
        tabBarStyle: {height: 68},
        tabBarItemStyle: {paddingTop: 10},
        tabBarLabelStyle: {paddingBottom: 14},
      }}
    >
      <Tab.Screen
        name="홈"
        component={Home}
        options={{
          tabBarIcon: ({color}) => {
            return <IconHome fill={color} />;
          },
        }}
      />
      <Tab.Screen
        name="보관함"
        component={Home}
        options={{
          tabBarIcon: ({color}) => {
            return <IconFolder fill={color} />;
          },
        }}
      />
      <Tab.Screen
        name="캘린더"
        component={Home}
        options={{
          tabBarIcon: ({color}) => {
            return <IconCalendar fill={color} />;
          },
        }}
      />
      <Tab.Screen
        name="MY"
        component={Home}
        options={{
          tabBarIcon: ({color}) => {
            return <IconProfile fill={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default Main;
