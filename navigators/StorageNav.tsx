import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AddMovies from '../screens/AddMovies';
import PlayLists from '../screens/PlayLists';
import Search from '../screens/Search';
import Storage from '../screens/Storage';
import StorageDetail from '../screens/StorageDetail';
import {TabParamList} from './Main';

export type StorageStackParamList = {
  Storage: undefined;
  StorageDetail: undefined | {id: number};
  PlayLists: undefined;
  AddMovies: undefined;
  Search: undefined;
};

type StorageNavProps = {
  navigation: BottomTabNavigationProp<TabParamList, 'StorageNav'>;
  route: RouteProp<TabParamList, 'StorageNav'>;
};
const StorageStack = createNativeStackNavigator<StorageStackParamList>();
function StorageNav({navigation, route}: StorageNavProps) {
  const tabHiddenRoutes = ['StorageDetail'];
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
    <StorageStack.Navigator
      initialRouteName="Storage"
      screenOptions={{headerShown: false}}
    >
      <StorageStack.Screen name="Storage" component={Storage} />
      <StorageStack.Screen name="StorageDetail" component={StorageDetail} />
      <StorageStack.Screen name="PlayLists" component={PlayLists} />
      <StorageStack.Screen name="AddMovies" component={AddMovies} />
      <StorageStack.Screen name="Search" component={Search} />
    </StorageStack.Navigator>
  );
}

export default StorageNav;
