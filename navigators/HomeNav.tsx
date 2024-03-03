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
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
function HomeNav({navigation, route}: HomeStackProps) {
  const tabHiddenRoutes = ['Search', 'AddRecord'];
  const routeName = getFocusedRouteNameFromRoute(route);
  React.useLayoutEffect(() => {
    if (routeName) {
      if (tabHiddenRoutes.includes(routeName)) {
        navigation.setOptions({tabBarStyle: {display: 'none'}});
      } else {
        navigation.setOptions({tabBarStyle: {height: 67, display: 'flex'}});
      }
    }
  });
  return (
    <HomeStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Home"
    >
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="AddRecord" component={AddRecord} />
      <HomeStack.Screen name="Search" component={Search} />
      <HomeStack.Screen name="Detail" component={Detail} />
      <HomeStack.Screen name="Writting" component={Writting} />
    </HomeStack.Navigator>
  );
}

export default HomeNav;
