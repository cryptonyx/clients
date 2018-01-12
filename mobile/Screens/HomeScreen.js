import React from 'react';

import {
  AppRegistry,
  Button, View, StyleSheet
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import ScanScreen from './ScanScreen';
import AboutScreen from './AboutScreen';
import PickFileScreen from './PickFile';
import WalletsListScreen from './WalletsListScreen';
import ImportWalletScreen from './ImportWalletScreen';
// import ImportModal from './ImportModal';
import CreateModal from './CreateModal';
import ReviewModal from './ReviewModal';
import TransactionsScreen from './TransactionsScreen';
import ExecuteTransactionScreen from './ExecuteTransactionScreen'
import TwoPasswordScreen from './TwoPasswordScreen'
import OnePasswordScreen from './OnePasswordScreen'
import EscrowListScreen from './EscrowListScreen'


export default HS = StackNavigator({
  Home: {screen: WalletsListScreen },
  ScanScreen: {screen: ScanScreen },
  EscrowListScreen: {screen:EscrowListScreen},
  AboutScreen: {screen: AboutScreen },
  PickFileScreen: {screen: PickFileScreen },
  ImportWalletScreen: {screen: ImportWalletScreen },
//   ImportModal: {screen: ImportModal },
  CreateModal: {screen: CreateModal },
  ReviewModal: {screen: ReviewModal },
  TransactionsScreen: {screen: TransactionsScreen},
  ExecuteTransactionScreen: {screen: ExecuteTransactionScreen},
  TwoPasswordScreen: {screen: TwoPasswordScreen},
  OnePasswordScreen: {screen: OnePasswordScreen}
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
  }
});
