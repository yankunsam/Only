/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AppState,Platform, StyleSheet, Text, View, Button} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<{}> {
  constructor(props){
    super(props);
    this.state = { lastNodeMessage: 'No message yet.' };
    this.listenerRef = null;
  }
  componentWillMount()
  {
    nodejs.start('main.js');
    this.listenerRef = ((msg) => {
      this.setState({lastNodeMessage: msg});
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
  componentDidMount(){
    AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        nodejs.channel.send('resume');
      }
      if (state === 'background') {
        nodejs.channel.send('suspend');
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
      <Button title="由eosio.token 发送eosio 100.0000 EOS"
          onPress={() => nodejs.channel.send('versions')}
        />
      <Button title="账户"
          onPress={() => nodejs.channel.send('blocks')}
        />
        <Text style={styles.instructions}>{this.state.lastNodeMessage}</Text>
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
