/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React from 'react';
import {StatusBar} from 'react-native';
import Main from './navigators/Main';

const queryClient = new QueryClient();
function App() {
  StatusBar.setTranslucent(true);
  StatusBar.setBarStyle('default');
  StatusBar.setBackgroundColor('transparent');
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Main />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;
