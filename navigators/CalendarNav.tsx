import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Calendar from '../screens/Calendar';
import Detail from '../screens/Detail';
import MonthlyMovies from '../screens/MonthlyMovies';
import Search from '../screens/Search';

export type CalendarStackParamList = {
  Calendar: undefined;
  MonthlyMovies: undefined;
  Detail: undefined;
  Search: undefined;
};
const CalendarStack = createNativeStackNavigator<CalendarStackParamList>();
function CalendarNav() {
  return (
    <CalendarStack.Navigator
      initialRouteName="Calendar"
      screenOptions={{headerShown: false}}
    >
      <CalendarStack.Screen name="Calendar" component={Calendar} />
      <CalendarStack.Screen name="MonthlyMovies" component={MonthlyMovies} />
      <CalendarStack.Screen name="Detail" component={Detail} />
      <CalendarStack.Screen name="Search" component={Search} />
    </CalendarStack.Navigator>
  );
}

export default CalendarNav;
