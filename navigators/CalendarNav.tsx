import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Calendar from '../screens/Calendar';

const CalendarStack = createNativeStackNavigator();
function CalendarNav() {
  return (
    <CalendarStack.Navigator
      initialRouteName="Calendar"
      screenOptions={{headerShown: false}}
    >
      <CalendarStack.Screen name="Calendar" component={Calendar} />
    </CalendarStack.Navigator>
  );
}

export default CalendarNav;
