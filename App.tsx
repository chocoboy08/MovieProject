/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StatusBar} from 'react-native';
import Main from './navigators/Main';

function App() {
  StatusBar.setTranslucent(true);
  StatusBar.setBarStyle('default');
  StatusBar.setBackgroundColor('transparent');
  return (
    <NavigationContainer>
      <Main />
    </NavigationContainer>
  );
}

export default App;
