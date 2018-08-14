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
import Transfer from './Transfer.js';
import Setting from './Setting.js';

type Props = {};


class HomeScreen extends Component<{}> {
  constructor(props){
    super(props);
    this.state = { account: '账户为空', balanceNow: '0.0000 EOS', accountName: '', from: '', to: '', memo: '','quantity':''};
    this.listenerRef = null;
  }
  componentWillMount()
  {
    // nodejs.start('second.js');
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
        <TextInput style={{height: 40,width: 100, backgroundColor: 'skyblue'}}
        placeholder="请输入账户名"
        onChangeText={(account) => this.setState({accountName: account})}
        />
        <Button title="余额"
            onPress={() => {
              Alert.alert('获取余额,请确认网络是否连接');
              var balanceObj = {
                'category': 'balance',
                'account': this.state.accountName
              };
              nodejs.channel.send(JSON.stringify(balanceObj))
              }
            }
          />
          <Text style={styles.instructions}>{this.state.accountName}</Text>
          <Text style={styles.instructions}>{this.state.balanceNow}</Text>
      </View>
    );
  }
}



export default TabNavigator({
  Home: { screen: HomeScreen},
  Transfer: { screen: Transfer },
  Setting: { screen: Setting },
});

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
