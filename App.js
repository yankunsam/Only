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
    this.state = { account: '账户为空', balanceNow: '0.0000 EOS'};
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
      <Button title="由eosio.token 发送eosio 100.0000 EOS"
          onPress={() => nodejs.channel.send('transfer')}
        />
      <Button title="账户"
          onPress={() => nodejs.channel.send('blocks')}
        />
        <Button title="余额"
            onPress={() => nodejs.channel.send('balance')}
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
