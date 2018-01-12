import React, { Component } from "react";
import { View, Text, FlatList, NativeModules, Button, DeviceEventEmitter, Image } from "react-native";

import { List, ListItem, Avatar, SearchBar } from "react-native-elements";
import FAB from 'react-native-fab'
import blockies from '../blockies'
import Canvas from 'react-native-canvas';
// import keys from '../shim'
import eth from 'ethjs-unit'
import RNFS from 'react-native-fs';
import loc from './loc'


class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    return (
      <ListItem
        {...this.props}
        onPress={this._onPress}
      />
    )
  }
}



/////////////////////////////////////
class FlatListDemo extends React.PureComponent {


  static navigationOptions = {
    title: loc.wallets,
    headerRight: <Image style={{alignSelf: 'center', width: 44, height: 44, marginRight: 10}} 
          source={require('../img/nyx.png')}
        />,  
  };
	
	
  constructor(props) {
    super(props);

    this.state = {
	  totalETH: 0,
	  totalUSD: 0,
	  totalBTC: 0,
		peers: '',
		currentBlock: '',    	
      selected: (new Map(): Map<string, boolean>),	
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
    };

    this.handleBlocksUpdate = this.handleBlocksUpdate.bind(this)
    this.handlePeersUpdate = this.handlePeersUpdate.bind(this)
  }

	handlePeersUpdate(e) {
		this.setState({peers: e})
	}

	handleBlocksUpdate(e) {
		this.setState({currentBlock: e.toLocaleString('en')})		
	}

  componentDidMount() {
 	  DeviceEventEmitter.addListener('blocksUpdate', this.handleBlocksUpdate);
	  DeviceEventEmitter.addListener('peersUpdate', this.handlePeersUpdate);

	  NativeModules.TestNative.subscribeForPeerCount();
	  NativeModules.TestNative.subscribeForNewBlocks();

   this.makeLocalRequest();
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD`;
//     this.setState({ loading: true });
    fetch(url, {timeout: 5000})
      .then(res => res.json())
      .then(res => {
	    var a = this.state.data;

		var tot = 0.0
		for(i = 0; i < a.length; i++) {
			var f = parseFloat(a[i].amount)
			tot += f;
		}
		var tUSD = res.USD * tot;
		var tBTC = res.BTC * tot;

 		tUSD = Number((tUSD).toFixed(2));
 		tBTC = Number((tBTC).toFixed(6));

        this.setState({
 		  totalETH: tot,
		  totalUSD: tUSD,
		  totalBTC: tBTC
        });
      })
      .catch(error => {
      		console.log(error.toString())
//         this.setState({ error, loading: false });
      });
  };

 
	async requestAccountBalances(data) {
        var accounts = data.accounts;
		for (i = 0; i < accounts.length; i++) {

			var a;
			var error;
			try {
				var res = await fetch('https://etherchain.org/api/account/'+accounts[i].account, {timeout: 5000})
				a = await res.json()
			}
			catch(error){
				this.setState({
				  error: error,
				  loading: false,
				  refreshing: false
				});

				break;				
			}

			if(a.data.length > 0) // only for accounts published to blockchain 
				accounts[i].amount = eth.fromWei(a.data[0].balance, 'ether')  
		} 
 
		this.setState({
		  data: accounts,
		  error: error,
		  loading: false,
		  refreshing: false
		});

		this.makeRemoteRequest();
	}
 	
 
  makeLocalRequest = () => {
	this.setState({ loading: true });
	
	NativeModules.TestNative.getAccounts((accountsJson) => {
	    var a = JSON.parse(accountsJson);
		this.setState({
		  data: a.accounts,
		})
		this.requestAccountBalances(a)
	})

    const { page, seed } = this.state;
  };

  handleRefresh = () => {
    this.setState({
        refreshing: true
    }, () => {
        this.makeLocalRequest();
    })
  }


_keyExtractor = (item, index) => item.account;

 	
  createBlockie(item){   
  
  			  
    		var path = RNFS.DocumentDirectoryPath + '/' + item.account.toLowerCase() + '.address_image_small_uri';

//     		if(await RNFS.exists(path)) {
//     			var blockieContent = await RNFS.readFile(path, 'utf8')
//     			console.log(blockieContent)
// 				return {uri: path}
//     		}
  			
  			return <Canvas ref={(canvas) => {
  						if(canvas==null)
  							return null;

						blockies({ // All options are optional
									c: canvas,
									seed: item.account.toLowerCase(), // seed used to generate icon data, default: random
					// 				color: '#dfe', // to manually specify the icon color, default: random
					// 				bgcolor: '#aaa', // choose a different background color, default: random
									size: 8, // width/height of the icon in blocks, default: 8
									scale: 4, // width/height of each block in pixels, default: 4
					// 				spotcolor: '#000' // each pixel has a 13% chance of being of a third color, 
									// default: random. Set to -1 to disable it. These "spots" create structures
									// that look like eyes, mouths and noses. 
								})  				
  			}}/>
	}

   createAvatar = (item) => {
		return <Avatar
		  small
		  rounded
		  source={this.createBlockie(item)}
		  onPress={() => console.log("Works!")}
		  activeOpacity={0.7}
		/>
   }
   
	renderHeader = () => {
		return (
		<View style={{flex: 1, padding: 12, backgroundColor:'rgb(240, 240, 240)', alignItems: 'center'}}>
			<Text style={{color:'rgb(118, 106, 106)'}}>{loc.peers}: {this.state.peers}  |  {loc.lastBlock}: {this.state.currentBlock} </Text>
			<Text style={{color:'rgb(118, 106, 106)', fontSize:14, fontWeight:'bold'}}>ETH {this.state.totalETH}</Text>
			<Text style={{color:'rgb(118, 106, 106)', fontSize:14, fontWeight:'bold'}}>${this.state.totalUSD}, BTC {this.state.totalBTC}</Text>
		</View>)
	  };
 

  _renderItem = ({item}) => (
    <MyListItem
      roundAvatar
      id={item.account}
      onPressItem={(id: string) => {
			this.props.navigation.navigate('ReviewModal', {account: id, amount: item.amount})
			// updater functions are preferred for transactional updates
			this.setState((state) => {
			  // copy the map rather than modifying state.
			  const selected = new Map(state.selected);
			  selected.set(id, !selected.get(id)); // toggle
			  return {selected};
	    })}}
      selected={!!this.state.selected.get(item.account)}
      title={item.amount + ' ETH'}
      subtitle={item.account}
      avatar={this.createBlockie(item)}
    />
  );

  render() {
    const { navigate } = this.props.navigation;
    return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={this.state.data}
        renderItem={this._renderItem}
        refreshing = {this.state.refreshing}
        onRefresh = {this.handleRefresh}
        keyExtractor={this._keyExtractor}
        ListHeaderComponent={this.renderHeader.bind(this)}
      />
    <FAB buttonColor="green" iconTextColor="#FFFFFF" onClickAction={() => {navigate('ImportWalletScreen', { name: 'Add wallet' })}} visible={true} />

    </View>
	);
  }
}


export default FlatListDemo;