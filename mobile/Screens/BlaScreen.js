import React from 'react';
import { StyleSheet, Text, Alert, Button, View, NativeModules } from 'react-native';
import loc from '../loc'
import Styles from './Styles' 

export default class Bla extends React.Component {
  
  static navigationOptions = {
    title: loc.about, 
  };

  render() {
    return (
      <View style={Styles.basicView}>
        <Text style={{marginTop:10}}>Copyright 2017 NYX. All rights reserved.</Text>
        <Text style={{marginTop:10}}>{loc.aboutText}</Text>
      </View>
    );
  }
}
