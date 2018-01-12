import React from 'react';
import {
  AppRegistry,
  Text,
  StyleSheet,
  Image,
  Button
} from 'react-native';
import { DrawerNavigator } from 'react-navigation';

import HomeScreen from './Screens/HomeScreen';
import ScanScreen from './Screens/ScanScreen';
import AboutScreen from './Screens/AboutScreen';
import PickFileScreen from './Screens/PickFile';
import EscrowListScreen from './Screens/EscrowListScreen';


// class HomeScreen extends React.Component {
//   static navigationOptions = {
//     title: 'Welcome',
//   };
//   render() {
//     return <Text>Hello, Navigation!</Text>;
//   }
// }


class MyNotificationsScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Notifications',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('./Screens/assets/menu.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back home"
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});


export default Eth = DrawerNavigator({
  Home: { screen: HomeScreen },
  EscrowListScreen: {screen: EscrowListScreen},
//   ScanScreen: {screen: ScanScreen },
  AboutScreen: {screen: AboutScreen },
//   PickFileScreen: {screen: PickFileScreen },
//   Notifications: {
//     screen: MyNotificationsScreen,
//   },
});

// if you are using create-react-native-app you don't need this line
AppRegistry.registerComponent('Eth', () => Eth);


