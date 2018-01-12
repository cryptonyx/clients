import React, { Component } from 'react';
import { Modal, TouchableHighlight, View, StyleSheet, NativeModules, TextInput, Alert, Text, ScrollView, Clipboard, ToastAndroid } from 'react-native';
import { Button } from 'react-native-elements'
import Canvas from 'react-native-canvas';
import blockies from '../blockies'
import Styles from './Styles'
import loc from './loc'  

export default class ReviewModal extends Component {
 
  static navigationOptions = {
    title: loc.manageWallet,
  };

	exportCallback(exportPasswords){
		NativeModules.TestNative.exportKey(this.props.navigation.state.params.account, exportPasswords.pass1, exportPasswords.pass2, (str) => {
			Alert.alert(str);
		})
	}

	removeCallback(pass) {										
		NativeModules.TestNative.removeKey(this.props.navigation.state.params.account, pass, (str) => {
			Alert.alert(str);
		})
	}

  render() {
  	const { goBack, navigate } = this.props.navigation;
  
    return (
        <ScrollView style={Styles.basicView}> 
			<View style={{marginTop: 15, flexDirection: 'row', alignItems:"center"}}>
            	<Text style={{fontSize:19, fontFamily: 'Helvetica Neue',  color:'rgb(44, 62, 80)'}}>{loc.address}</Text>
            	<Button title={'['+loc.copy+']'}  buttonStyle={Styles.copyButton} textStyle={Styles.copyButtonText} onPress={() => {
						Clipboard.setString(this.props.navigation.state.params.account);
						ToastAndroid.show(loc.copied + '  ' + this.props.navigation.state.params.account, ToastAndroid.SHORT);
					}}/>  
            </View> 
            <Text style={{fontSize:15, fontFamily: 'Helvetica Neue', color:'rgb(180, 188, 194)'}} >{this.props.navigation.state.params.account}</Text>
			<View style={{marginTop: 15, flexDirection: 'row', alignItems:"center"}}>
				<Canvas ref={(canvas) => {
							if(canvas==null)
								return null;

							blockies({ // All options are optional
										c: canvas,
										seed: this.props.navigation.state.params.account.toLowerCase(), // seed used to generate icon data, default: random
						// 				color: '#dfe', // to manually specify the icon color, default: random
						// 				bgcolor: '#aaa', // choose a different background color, default: random
										size: 8, // width/height of the icon in blocks, default: 8
										scale: 10, // width/height of each block in pixels, default: 4
						// 				spotcolor: '#000' // each pixel has a 13% chance of being of a third color, 
										// default: random. Set to -1 to disable it. These "spots" create structures
										// that look like eyes, mouths and noses. 
									})  				
				}}/>
           		<Text style={{marginLeft: 15, fontSize:19, fontFamily: 'Helvetica Neue',  color:'rgb(44, 62, 80)'}}>{this.props.navigation.state.params.amount} ETH</Text>

  			</View>


				<View  style={Styles.buttonWrapper}>
					<Button title={loc.sendEtherBtnCap} buttonStyle={Styles.lightButton} textStyle={Styles.lightButtonText} onPress={() => {

							navigate('ExecuteTransactionScreen', {account: this.props.navigation.state.params.account, amount: this.props.navigation.state.params.amount})

					}}>
					</Button>
				</View>

				<View   style={Styles.buttonWrapper}>
					<Button title={loc.viewTransactionsBtnCap} buttonStyle={Styles.lightButton} textStyle={Styles.lightButtonText} onPress={() => {
						navigate('TransactionsScreen', { account:this.props.navigation.state.params.account})
					}}>
					</Button>
				</View>
		
				<View style={{marginTop: 40}}> 
					<View style={Styles.buttonWrapper} >

						<Button title={loc.exportKeyBtnCap} buttonStyle={Styles.lightButton} textStyle={Styles.lightButtonText} onPress={() => {
								navigate('TwoPasswordScreen', {callback: this.exportCallback.bind(this), buttonText: loc.exportKeyBtnCap, caption: loc.exportTitle})
						}}/>
					</View>
 
					<View style={Styles.buttonWrapper}> 
						<Button title={loc.removeWalletBtnCap} buttonStyle={Styles.lightButton} textStyle={{color:'red'}} onPress={() => {

								navigate('OnePasswordScreen', {callback: this.removeCallback.bind(this), buttonText: loc.removeWalletBtnCap, caption: loc.removeTitle})   
						}}/> 
					</View>
				</View>
				 
         </ScrollView> 
    );
  }
}