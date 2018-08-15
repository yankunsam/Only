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
import Contract from './Contract.js';

type Props = {};


class HomeScreen extends Component<{}> {
  constructor(props){
    super(props);
    this.state = {
      account: '账户为空',
      balanceNow: '0.0000 EOS',
      accountName: '',
      from: '',
      to: '',
      memo: '',
      quantity:'',
      chainId: 'c40a90d6bcb4b9b2c2d4c0916ee97a29af42a420372af44fa4f538ddef9e6b83',
      blockAmount: 0,
      accountAmount: 0,
      transactionAmount: 0,

    };
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
      <View style={styles.container}>
        <TextInput style={{height: 40,width: 100}}
        placeholder="请输入账户名"
        onChangeText={(account) => this.setState({accountName: account})}
        />
        </View>
        <View style={styles.container}>
        <Button title="余额查询"
            onPress={() => {
              Alert.alert('获取余额,请确认网络是否连接');
              var balanceObj = {
                'category': 'balance',
                'account': this.state.accountName
              };
              nodejs.channel.send(JSON.stringify(balanceObj));
              }
            }
          />
          </View>
          <View style={styles.container}>
          <Text style={styles.instructions}>{this.state.accountName}</Text>
          </View>
          <View style={styles.container}>
          <Text style={styles.instructions}>{this.state.balanceNow}</Text>
          </View>
          <View style={styles.container}>
          <Button title="区块浏览"
          onPress={ () => {
            var blockObj = {
              'category': 'block',
            };
            nodejs.channel.send(JSON.stringify(blockObj));
          }

          }
          />
          </View>
          <View style={styles.container}>
          </View>
          <View style={styles.container}>
          <Text style={styles.instructions}><Text>区块总数: </Text>{this.state.blockAmount}</Text>
          </View>
          <View style={styles.container}>
          <Text style={styles.instructions}><Text>账户总数: </Text>{this.state.accountAmount}</Text>
          </View>
          <View style={styles.container}>
          <Text style={styles.instructions}><Text>交易总数: </Text>{this.state.transactionAmount}</Text>
          </View>
      </View>
    );
  }
}



export default TabNavigator({
  我的: { screen: HomeScreen},
  转账: { screen: Transfer },
  设置: { screen: Setting },
  合约: { screen: Contract },
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
