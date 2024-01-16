/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StatusBar} from 'react-native';
import Main from './view/Main';
import Search from './view/search/Search';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  AddRecord: undefined;
  Search: undefined;
};
function App() {
  StatusBar.setTranslucent(true);
  StatusBar.setBarStyle('default');
  StatusBar.setBackgroundColor('transparent');
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Search" component={Search} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
