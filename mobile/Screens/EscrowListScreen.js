

import React from 'react';
import {
    FlatList,
    View,
    ActivityIndicator,
    TouchableHighlight,
    Image,
    Text
} from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import loc from './loc';
import Styles from './Styles'


export default class EscrowList extends React.Component {
  
      static navigationOptions = {
        title: loc.escrow, 
      };

	state = {
		data:[]
	}

     handleEscrowAddress(address){
     	this.state.data.push({id: address, category: "Escrow"})
        this.setState({data: this.state.data})
    }

    _onEscrowListItemSelected(item) {
        this.selectedIds.add(item.id);
        this.props.onSelectionChange(this.selectedIds);
    };

    constructor(props) {
        super(props);
//         if (!this.props.onSelectionChange) {
//             throw new Error('onSelectionChange prop is required');
//         }
        this.selectedIds = new Set();
    }

	renderFooter = () => {
		const { navigate } = this.props.navigation;
		return (
			<View style={{flexDirection: 'row', alignItems:"center"}}>
            	<Text style={Styles.addressCaption}>{loc.add}</Text>

				<TouchableHighlight  style={{width: 35, height: 35, marginLeft: 15, marginTop: 15}} onPress={() => {
				  navigate('ScanScreen', {callback: this.handleEscrowAddress.bind(this)})
				}}>           
				  <Image style={{width: 35, height: 35}} source={require('./QRScanner.png')} />
				</TouchableHighlight>

			</View>
		);
	}


    render() {
        return (
            <FlatList style={{flex: 1}}
              data={this.state.data}
              renderItem={({item}) => {
                return <ListItem 
                          onPress={() => this._onEscrowListItemSelected(item)}
                          avatar={<Avatar
                                      small 
                                      rounded
                                      title={item.id[0] + item.category[0]}
                                      activeOpacity={0.7}
                                    />}
                          title={item.id + ' ' + item.category}
                          subtitle={item.category}
                        />
              }}

			ListFooterComponent={this.renderFooter}
              
              keyExtractor={i => i.id}
            />
        );
    }
}





