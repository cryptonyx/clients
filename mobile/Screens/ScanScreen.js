'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Modal
} from 'react-native';
import Camera from 'react-native-camera';
import loc from './loc'


export default class ScanScreen extends Component {

	state = {
		scanned: false
	}
	scanBarCode(d) {
		if(this.state.scanned) {
			this.props.navigation.goBack();
			return;
		}
		this.setState({scanned: true});
		
		this.props.navigation.state.params.callback(d.data)
		this.props.navigation.goBack();
	}
	
  render() {
  	const { goBack } = this.props.navigation;
    return (
      <Modal
      onRequestClose={() => {goBack()}}>
        <Camera
        	onBarCodeRead={this.scanBarCode.bind(this)} 
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[{loc.capture}]</Text>
        </Camera>
      </Modal>
    );
  }

  takePicture() {
    const options = {};
    //options.location = ...
    this.camera.capture({metadata: options})
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});