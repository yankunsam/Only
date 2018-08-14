/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AppState,Platform, StyleSheet, Text, View, Button,TextInput} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';

type Props = {};
export default class App extends Component<{}> {
  constructor(props){
    super(props);
    this.state = { account: '账户为空', balanceNow: '0.0000 EOS', accountName: '', from: '', to: '', memo: ''};
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
      <TextInput style={{height: 40}}
      placeholder="付款方"
      onChangeText={(from) => this.setState({from: from})}
      />
      <TextInput style={{height: 40}}
      placeholder="收款方"
      onChangeText={(to) => this.setState({to: to})}
      />
      <TextInput style={{height: 40}}
      placeholder="备注"
      onChangeText={(memo) => this.setState({memo: memo})}
      />
      <Button title="转账"
          onPress={ () => {
            var transObj = {
              'category': 'transfer',
              'from': this.state.from,
              'quantity': '100.0000 EOS',
              'to': this.state.to,
              'memo': this.state.memo
            };
            nodejs.channel.send(JSON.stringify(transObj))
          }
        }
        />
        <TextInput style={{height: 40}}
        placeholder="请输入账户名"
        onChangeText={(account) => this.setState({accountName: account})}
        />
        <Button title="余额"
            onPress={() => {
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
  },
});
