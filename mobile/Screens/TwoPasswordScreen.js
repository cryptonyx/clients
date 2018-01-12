import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, TextInput, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements'
import Styles from './Styles'
import loc from './loc' 

export default class TwoPasswordScreen extends Component {

  state = {
    pass1: '',
    pass2: '',
    textStyle: Styles.lightButtonText
  }


  render() {
    const { goBack, navigate } = this.props.navigation;

    return (
        <Modal   style={Styles.basicView}
          animationType="slide"
          transparent={false}
          onRequestClose={() => {goBack()}}
          >
         <View  style={Styles.basicView}>
			
            	<Text style={{marginTop: 40, fontSize: 18}}>{this.props.navigation.state.params.caption}</Text>

         	  <View style={{flexDirection: 'row', alignItems:"center", marginTop: 22}}>
         	  	  <Text style={{marginRight: 15}}>pass1</Text>
				  <TextInput id="pass1" secureTextEntry={true}
					style={{height: 40, width: 250}}
					onChangeText={(text) => this.setState({pass1: text})}
				  />
              </View>
              <View style={{flexDirection: 'row', alignItems:"center"}}>
              		<Text style={{marginRight: 15}}>pass2</Text>
				  <TextInput id="pass2" secureTextEntry={true}
					style={{height: 40, width: 250}}
					onChangeText={(text) => this.setState({pass2: text})}
				  />
			  </View>

				<View  style={Styles.buttonWrapper}>
					<Button title={this.props.navigation.state.params.buttonText} buttonStyle={Styles.lightButton} textStyle={this.state.textStyle} onPress={() => {
						this.state.textStyle = Styles.lightButtonTextDisabled;
                        this.props.navigation.state.params.callback({pass1: this.state.pass1, pass2: this.state.pass2})
                        goBack()
                    }} />
                </View>

				<View  style={Styles.buttonWrapper}>
					<Button title={loc.cancel} buttonStyle={Styles.lightButton} textStyle={this.state.textStyle} onPress={() => {
                        goBack()
                    }} />
                </View>
         </View>
        </Modal>
    );
  }
}