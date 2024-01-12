/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import Main from './view/Main';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Main: undefined;
};
function App() {
  StatusBar.setTranslucent(true);
  StatusBar.setBarStyle('default');
  StatusBar.setBackgroundColor('transparent');
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Main" component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
