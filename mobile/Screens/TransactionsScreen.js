import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet
} from 'react-native';
import { ListItem } from 'react-native-elements';
import eth from 'ethjs-unit'
import Styles from './Styles'
import loc from '../loc'

class Transactions extends React.Component {

  
  static navigationOptions = {
    title: loc.transactions, 
  };

  state = {
    seed: 1,
    page: 1,
    transactions: [],
    isLoading: false,
    isRefreshing: false,  
  };

  loadTransactions = () => {
    const { transactions, seed, page } = this.state;
    this.setState({ isLoading: true });

    fetch(`https://etherchain.org/api/account/${this.props.navigation.state.params.account}/tx/`+seed, {timeout: 5000})
      .then(res => res.json())
      .then(res => {
        this.setState({
          transactions: page === 1 ? res.data : [...transactions, ...res.data],
          isRefreshing: false,
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleRefresh = () => {
    this.setState({
      seed: this.state.seed + 1,
      isRefreshing: true,
    }, () => {
      this.loadTransactions();
    });
  };

  handleLoadMore = () => {
    this.setState({
      page: this.state.page + 1
    }, () => {
      this.loadTransactions();
    });
  };

  componentDidMount() {
    this.loadTransactions();
  };

  render() {
    const { transactions, isRefreshing } = this.state;
 
    return (
      <View style={Styles.basicView}>
        {
          transactions &&
            <FlatList
              data={transactions}
              renderItem={({item}) => {

                // calculate time since transactions
                var tm = new Date(item.time)



                date_now = new Date();
                seconds = Math.floor((date_now - (tm))/1000);
                minutes = Math.floor(seconds/60);
                hours = Math.floor(minutes/60);
                days = Math.floor(hours/24);

                hours = hours-(days*24);
                minutes = minutes-(days*24*60)-(hours*60);
                seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);




                var amount = eth.fromWei(item.amount, 'ether')

                var direction = 'OUT'
                var directionStyle = 'orange'
                if(this.props.navigation.state.params.account.toUpperCase() === item.recipient.toUpperCase()) {
                  direction = 'IN'
                  directionStyle = 'green'   
                }    

                return <ListItem  
                  title={  
                   <View style={{flexDirection:'row', alignItems:'center'}}>
                      <Text style={{textAlign:'center', color:'white', backgroundColor:directionStyle, borderRadius:5, width:35}}>{direction}</Text>
                      <View style={{flex: 1, marginLeft: 15}}> 
                        <View style={{flexDirection: 'row'}}><Text>TxHash: </Text><Text numberOfLines={1} style={{color: 'rgb(52, 152, 219)'}}>{item.hash}</Text></View>
                        <Text>{loc.age}: {days}d {hours}h {minutes}m {seconds}s</Text> 
                        <View style={{flexDirection: 'row'}}><Text>{loc.source}: </Text><Text numberOfLines={1} style={{color: 'rgb(52, 152, 219)'}}>{item.sender}</Text></View>
                        <View style={{flexDirection: 'row'}}><Text>{loc.destination}: </Text><Text numberOfLines={1} style={{color: 'rgb(52, 152, 219)'}}>{item.recipient}</Text></View>
                        <View style={{flexDirection: 'row'}}><Text>{loc.sum}: </Text><Text style={{fontWeight: 'bold'}}>{amount} ETH</Text></View>
                        <Text>{loc.usedGas}: {item.gasUsed}</Text>
                      </View>
                    </View>  
                  }
  
//                   subtitle={
//                     {/*<View>
//                       <Text>from: {item.sender}</Text>
//                       <Text>to: {item.recipient}</Text>
//                     </View>*/}
//                   }
                />
              }}
               
              keyExtractor={i => i.hash}
              refreshing={isRefreshing}
              onRefresh={this.handleRefresh.bind(this)}
              onEndReached={this.handleLoadMore.bind(this)}
              onEndThreshold={0}
            />
        }
      </View>
    )
  }
}


const s = StyleSheet.create({
  scene: {
    flex: 1,
    paddingTop: 25,
  },
  transaction: {
    width: '100%',
    backgroundColor: '#333',
    marginBottom: 10,
    paddingLeft: 25,
  },
  transactionName: {
    fontSize: 17,
    paddingVertical: 20,
    color: '#fff'
  }
});

export default Transactions;
