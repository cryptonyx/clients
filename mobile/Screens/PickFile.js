import React from 'react';
import { StyleSheet, Button, Alert, View, NativeModules, TextInput } from 'react-native';

export default class PickFile extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Button title="Pick Geth private key JSON file" onPress={() => {

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
				  file: response
				});
				
				
				NativeModules.TestNative.addKey(response.path, this.state.text, this.state.text,  (str) => {
					Alert.alert(str);
				})
				
				
				
			  }
			});

        }}>
        </Button>
        
       
	  <TextInput id="pass1" secureTextEntry={true}
        style={{height: 40, width: 250, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => this.setState({text})}
      />
       
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});