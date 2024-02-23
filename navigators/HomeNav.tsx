import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AddRecord from '../screens/AddRecord';
import Detail from '../screens/Detail';
import Home from '../screens/Home';
import Search from '../screens/Search';
import Writting from '../screens/Writting';
import {TabParamList} from './Main';

export type HomeStackParamList = {
  Home: undefined;
  AddRecord: undefined;
  Search: undefined;
  Detail: undefined;
  Writting: undefined;
};
type HomeStackProps = {
  navigation: BottomTabNavigationProp<TabParamList, 'HomeNav'>;
  route: RouteProp<TabParamList, 'HomeNav'>;
};
const Stack = createNativeStackNavigator<HomeStackParamList>();
function HomeNav({navigation, route}: HomeStackProps) {
  React.useLayoutEffect(() => {
    const tabHiddenRoutes = ['Search', 'AddRecord'];
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName) {
      if (tabHiddenRoutes.includes(routeName)) {
        navigation.setOptions({tabBarStyle: {display: 'none'}});
      } else {
        navigation.setOptions({tabBarStyle: {height: 67, display: 'flex'}});
      }
    }
  });
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AddRecord" component={AddRecord} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Detail" component={Detail} />
      <Stack.Screen name="Writting" component={Writting} />
    </Stack.Navigator>
  );
}

export default HomeNav;
