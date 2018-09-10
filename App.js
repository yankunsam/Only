/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AppState,Platform, StyleSheet, Text, View, Button,TextInput, Alert, Dimensions, TouchableOpacity} from 'react-native';
// import Image from 'react-native-scalable-image';
import nodejs from 'nodejs-mobile-react-native';
import { TabNavigator } from 'react-navigation';
import Transfer from './Transfer.js';
import Setting from './Setting.js';
import Contract from './Contract.js';
import AutoHeightImage from 'react-native-auto-height-image';

type Props = {};
import image from './img/search.png';
import search_1 from './img/search_1.png';
import { createStackNavigator } from 'react-navigation';

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
        <View style={styles.search}>
        <View style={{flex: 1,alignItems:'flex-end'}}>
        <TouchableOpacity
        onPress={()=>{
          // alert('will jump to mainnet status')
          this.props.navigation.navigate('Transfer')
        }}
        >
        <Text>mainnet</Text>
        </TouchableOpacity>
        </View>
        <View style={{flex: 6}}>
          <AutoHeightImage
                width={370}
                source={image}
          />
          </View>
        </View>
        <View style={styles.input}>
          <TextInput style={styles.textinput}
            placeholder="trx/block/account"
            />
            <TouchableOpacity
              style={styles.searchbutton}
              onPress={()=>{
                alert("will show you the result")
              }}
              >
                <AutoHeightImage
                      width={50}
                      source={search_1}
                />
            </TouchableOpacity>
          </View>

        <View style={styles.other}>
          <View style={{flex: 1}} />
          <View style={{flex: 1}} />
          <View style={{flex: 2}} />
          <Text style={{flex: 1}}>about us</Text>
        </View>

      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Transfer: Transfer,
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

// export default TabNavigator({
//   我的: { screen: HomeScreen},
//   // 转账: { screen: Transfer },
//   // 设置: { screen: Setting },
//   // 合约: { screen: Contract },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  search: {
    width: '100%',
    // height: '100%',
    // resizeMode: 'contain',
    flex: 1.5,
    backgroundColor: '#ffffff'
  },
  input: {
    flex: 0.5,
    backgroundColor: '#ffffff',
    flexDirection: 'row'

  },
  textinput: {
    flex: 6,
    backgroundColor: '#ffffff',
    // borderLeftWidth: 4,
    // borderRightWidth: 4,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 4
  },
  searchbutton: {
    flex: 1.25,
    width: '100%',
  },
  other: {
    flex: 2,
    backgroundColor: '#ffffff',
    alignItems: 'flex-start',
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
