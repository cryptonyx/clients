import React, { Component } from 'react';
import { Text, View, StyleSheet, NativeModules, Alert, ToastAndroid } from 'react-native';
import Styles from './Styles'
import { Button } from 'react-native-elements'
import loc from '../loc'

export default class WalletCreation extends Component {

  static navigationOptions = {
    title: loc.createOrImport,
  };

  state = {file:''}

	importCallback(importPasswords){ 

		ToastAndroid.showWithGravity(loc.processing + '...', ToastAndroid.LONG, ToastAndroid.CENTER);

        NativeModules.TestNative.addKey(this.state.file, importPasswords.pass1, importPasswords.pass2,  (str) => {
            Alert.alert(str);
        })
	}

	createCallback(pass) {										

		ToastAndroid.showWithGravity(loc.processing + '...', ToastAndroid.LONG, ToastAndroid.CENTER);

        NativeModules.TestNative.createKey(pass,  (str) => {
            Alert.alert(str);
        })
	}


  render() {
  	const { navigate } = this.props.navigation;
    return (
          <View style={Styles.basicView}>
            <View style={Styles.buttonWrapper}>
              <Button buttonStyle={Styles.lightButton} textStyle={Styles.lightButtonText}
                title={loc.importBtnCap}
                onPress={() =>
                  {

                    NativeModules.FilePickerManager.showFilePicker(null, (response) => {
                      console.log('Response = ', response);

                      if (response.didCancel) {
                        console.log('User cancelled file picker');
                      }
                      else if (response.error) {
                        console.log('FilePickerManager Error: ', response.error);
                      }
                      else {
                        this.setState({
                          file: response.path
                        });

                        navigate('TwoPasswordScreen', {callback: this.importCallback.bind(this), buttonText: loc.importBtnCap, caption: loc.twoPasswordsCap})

                      }
                    });


                }}
              />
            </View> 
            <View style={Styles.buttonWrapper}>
              <Button buttonStyle={Styles.lightButton} textStyle={Styles.lightButtonText}
                title={loc.createBtnCap}
                onPress={() =>
                  {
                    navigate('OnePasswordScreen', {callback: this.createCallback.bind(this), buttonText: loc.createBtnCap, caption: loc.onePasswordCap})
                }} 
              />
            </View>
            <Text style={{color:'lightgrey', textAlign:'center', marginTop: 15}}>Tip: NYX uses Geth key format</Text>
          </View>
    );
  }
}

