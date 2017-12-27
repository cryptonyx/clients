import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, StyleSheet, Button, NativeModules, TextInput, Alert } from 'react-native';

export default class CreateModal extends Component {
 
 
  static navigationOptions = {
    title: 'Create Wallet',
  };


  render() {
  	const { goBack } = this.props.navigation;
    return (
        <View>
 
        {/* Create Modal*/}
        <Modal
          animationType="slide"
          transparent={false}
          visible={true}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{marginTop: 22}}>
          <View>
            <Text>Create new wallet</Text>





        <Button title="Create new wallet" onPress={() => {



				NativeModules.TestNative.createKey(this.state.pass1,  (str) => {
					Alert.alert(str);
				})


        }}>
        </Button>


	  <TextInput id="pass1" secureTextEntry={true}
        style={{height: 40, width: 250, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => this.setState({pass1: text})}
      />
	  <TextInput id="pass2" secureTextEntry={true}
        style={{height: 40, width: 250, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => this.setState({pass2: text})}
      />




            <TouchableHighlight style={{marginTop: 22}} onPress={() => {
              this.setState({pass1:"", pass2:""});
              goBack()
            }}>
              <Text>Hide Modal</Text>
            </TouchableHighlight>

          </View>
         </View>
        </Modal>

        </View>
    );
  }
}