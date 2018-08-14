/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AppState,Platform, StyleSheet, Text, View, Button,TextInput, Alert} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';
import { TabNavigator } from 'react-navigation';

type Props = {};
class HomeScreen extends Component<{}> {
  constructor(props){
    super(props);
    this.state = { account: '账户为空', balanceNow: '0.0000 EOS', accountName: '', from: '', to: '', memo: '','quantity':''};
    this.listenerRef = null;
  }
  componentWillMount()
  {
    nodejs.start('main.js');
    this.listenerRef = ((rel) => {
      this.setState(JSON.parse(rel));
    });
    nodejs.channel.addListener(
      'message',
      this.listenerRef,
      this
    );
  }
  componentWillUnmount()
  {
    if (this.listenerRef) {
      nodejs.channel.removeListener('message', this.listenerRef);
    }
  }
  render() {
    return (
      <View style={styles.container}>
      <TextInput style={{height: 40,width: 100}}
      placeholder="付款方"
      onChangeText={(from) => this.setState({from: from})}
      />
      <TextInput style={{height: 40,width: 100}}
      placeholder="收款方"
      onChangeText={(to) => this.setState({to: to})}
      />
      <TextInput style={{height: 40,width: 100}}
      placeholder="1.0000 EOS"
      onChangeText={(quantity) => this.setState({quantity: quantity})}
      />
      <TextInput style={{height: 40,width: 100}}
      placeholder="备注"
      onChangeText={(memo) => this.setState({memo: memo})}
      />
      <Button title="转账"
          onPress={ () => {
            var transObj = {
              'category': 'transfer',
              'from': this.state.from,
              'quantity': this.state.quantity,
              'to': this.state.to,
              'memo': this.state.memo
            };
            nodejs.channel.send(JSON.stringify(transObj))
            Alert.alert('转账成功？');
          }
        }
        />
        <TextInput style={{height: 40,width: 100, backgroundColor: 'skyblue'}}
        placeholder="请输入账户名"
        onChangeText={(account) => this.setState({accountName: account})}
        />
        <Button title="余额"
            onPress={() => {
              Alert.alert('获取余额');
              var balanceObj = {
                'category': 'balance',
                'account': this.state.accountName
              };
              nodejs.channel.send(JSON.stringify(balanceObj))
              }
            }
          />
          <Text style={styles.instructions}>{this.state.account}</Text>
          <Text style={styles.instructions}>{this.state.balanceNow}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    flex: 1
  },
});
class Setting extends Component {
  render() {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
      <Text> You EOS node configuration</Text>
      </View>
    );
  }
}

export default TabNavigator({
  Home: { screen: HomeScreen},
  Settings: { screen: Setting },
});
