import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, TextInput, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements'
import Styles from './Styles'
import loc from '../loc'

export default class OnePasswordScreen extends Component {

  state = {
    pass1: '',
    pass2: '',
    disabled: false
  }


  render() {
    const { goBack, navigate } = this.props.navigation;

    return (
        <Modal
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

				<View style={Styles.buttonWrapper}>
				<TouchableOpacity disabled={this.state.disabled}>
					<Button title={this.props.navigation.state.params.buttonText} buttonStyle={Styles.lightButton} textStyle={Styles.lightButtonText} onPress={() => {
						this.state.disabled = true;
                        this.props.navigation.state.params.callback(this.state.pass1)
                        goBack()                        
                    }} />
                </TouchableOpacity>
                </View>

				<View  style={Styles.buttonWrapper}>
					<Button title={loc.cancel} buttonStyle={Styles.lightButton} textStyle={Styles.lightButtonText} onPress={() => {
                        goBack()
                    }} />
                </View>
         </View>
        </Modal>
    );
  }
}