import React, {Component} from 'react';
import {AppState,Platform, StyleSheet, Text, View, Button,TextInput, Alert} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';

export default class Setting extends Component<{}> {
  constructor(props){
    super(props);
    this.state = {
      httpEndpoint: "http://124.127.156.41:8888",
      privateKey: "5Hz2G2L9p3k7YhkqGJaioNJQnYKjtZKKS2y3wRLDobCQAtXg5oA",
      chainId: "c40a90d6bcb4b9b2c2d4c0916ee97a29af42a420372af44fa4f538ddef9e6b83",
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
    return(
      <View style={styles.container}>
      <View style={styles.container}>
      <TextInput style={{height: 40,width: 100,textBreakStrategy: 'balanced'}}
      placeholder="httpEndpoint"
      onChangeText={(httpEndpoint) => this.setState({httpEndpoint: httpEndpoint})}
      />
      </View>

      <View style={styles.container}>
      <TextInput style={{height: 40,width: 100}}
      placeholder="私钥"
      onChangeText={(privateKey) => this.setState({privateKey: privateKey})}
      />
      </View>
      <View style={styles.container}>
      <TextInput style={{height: 40,width: 100}}
      placeholder="ChainId"
      onChangeText={(chainId) => this.setState({chainId: chainId})}
      />
      </View>
      <View style={styles.container}>
      <Button title="配置"
        onPress={
          () => {
            Alert.alert("确认配置");
            var configurationObj = {
              'category': 'configuration',
              'httpEndpoint': this.state.httpEndpoint,
              'chainId': this.state.chainId,
              'privateKey': this.state.privateKey,
            };
            nodejs.channel.send(JSON.stringify(configurationObj));
          }
        }
      />
      </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c9c7c7',
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
