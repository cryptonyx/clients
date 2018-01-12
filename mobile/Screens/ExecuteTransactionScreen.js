import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, NativeModules, TextInput, Alert, ScrollView, Image, ToastAndroid } from 'react-native';  
import { Button } from 'react-native-elements'
import Styles from './Styles'
import Canvas from 'react-native-canvas';
import blockies from '../blockies' 
import loc from './loc'


export default class ExecuteTransactionScreen extends Component {
 
	state = {
		sendAmount: '0.00',
		recipient: '',
		gasLimit: '50000'
	}

  static navigationOptions = {
    title: loc.sendEther,
  };

     setDestinationWallet(destinationWallet){
        this.setState({recipient: destinationWallet});
    }

	canvasForRecipient(recipient) {

	}

  render() {
  	const { goBack, navigate } = this.props.navigation;

    return (
        <Modal
          animationType="slide"
          transparent={false}
          onRequestClose={() => {goBack()}}
          >

          <ScrollView style={Styles.basicView}>
            <Text style={Styles.addressCaption}>{loc.source}</Text>
            <Text style={Styles.addressStyle} >{this.props.navigation.state.params.account}</Text>
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
           		<Text style={Styles.amountStyle}>{this.props.navigation.state.params.amount} ETH</Text>

  			</View>


			<View style={{flexDirection: 'row', alignItems:"center"}}>
            	<Text style={Styles.addressCaption}>{loc.destination}</Text>

				<TouchableHighlight  style={{width: 35, height: 35, marginLeft: 15, marginTop: 15}} onPress={() => {
				  navigate('ScanScreen', {callback: this.setDestinationWallet.bind(this)})
				}}>           
				  <Image style={{width: 35, height: 35}} source={require('./QRScanner.png')} />
				</TouchableHighlight>

			</View>


    
			<View style={{marginTop: 15, flexDirection: 'row', alignItems:"center"}}>
            	
 				<Canvas ref={(canvas) => {
							if(canvas==null)
								return null;

							blockies({ // All options are optional
										c: canvas,
										seed: this.state.recipient.toLowerCase(), // seed used to generate icon data, default: random
						// 				color: '#dfe', // to manually specify the icon color, default: random
						// 				bgcolor: '#aaa', // choose a different background color, default: random
										size: 8, // width/height of the icon in blocks, default: 8
										scale: 10, // width/height of each block in pixels, default: 4
						// 				spotcolor: '#000' // each pixel has a 13% chance of being of a third color, 
										// default: random. Set to -1 to disable it. These "spots" create structures
										// that look like eyes, mouths and noses. 
									})  				
				}}/>

   
           		<TextInput style={Styles.addressStyle} style={{flex: 1, marginLeft: 15}} onChangeText={(recipient) => this.setState({recipient})} >{this.state.recipient}</TextInput>
  			</View>
 
			<View style={{marginTop: 15, flexDirection: 'row', alignItems:"center"}}>
				<Text>{loc.sum}: </Text>
				<TextInput style={{width: 200}} keyboardType='numeric' onChangeText={(sendAmount) => this.setState({sendAmount})} value={this.state.sendAmount} />
			</View>

			<View style={{marginTop: 10, flexDirection: 'row', alignItems:"center"}}>
				<Text>{loc.gasLimit}: </Text>
				<TextInput style={{width: 200}} keyboardType='numeric' onChangeText={(gasLimit) => this.setState({gasLimit})} value={this.state.gasLimit} />
			</View>

			<View style={{marginTop: 20, flexDirection: 'row', alignItems:"center"}}>
				<Text>{loc.password}: </Text>
			  <TextInput id="pass1" secureTextEntry={true}
				style={{width: 250}}
				onChangeText={(text) => this.setState({pass1: text})}
			  />
			 </View>
 
			<View style={Styles.buttonWrapper}>
				<Button title={loc.sendEtherBtnCap} buttonStyle={Styles.lightButton} textStyle={Styles.lightButtonText} onPress={() => {

						ToastAndroid.showWithGravity(loc.processing+'...', ToastAndroid.LONG, ToastAndroid.CENTER);
						
						NativeModules.TestNative.sendEther(this.props.navigation.state.params.account, this.state.recipient, this.state.gasLimit, this.state.pass1, this.state.sendAmount, (str) => {
							Alert.alert(str);
						})

				}}>
				</Button>
			</View>

        </ScrollView>
        </Modal>
    );
  }
}