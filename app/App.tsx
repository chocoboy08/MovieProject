/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {SafeAreaView, StatusBar} from 'react-native';

import Home from './view/Home';

function App() {
  StatusBar.setTranslucent(true);
  StatusBar.setBarStyle('default');
  StatusBar.setBackgroundColor('transparent');
  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <Home />
    </SafeAreaView>
  );
}

export default App;
