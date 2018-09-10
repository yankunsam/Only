import React, {Component} from 'react';
import {AppState,Platform, StyleSheet, Text, View, Button,TextInput, Alert} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';


export default class MainnetStatus extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      blockAmount: 0,
      accountAmount: 0,
      transactionAmount: 0,
    };
  }
  render() {
    return (
      <View>
      <Text> Hello MainnetStatus</Text>
      </View>
    )
  }
}
