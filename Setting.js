import React, {Component} from 'react';
import {AppState,Platform, StyleSheet, Text, View, Button,TextInput, Alert} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';

export default class Setting extends Component<{}> {
  constructor(props){
    super(props);
    this.state = {
      httpEndpoint: "http://192.168.0.101:8888",
    };
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
    return(
      <View>
      <View>
      <Text>节点配置: </Text>
      <TextInput style={{height: 40,width: 100}}
      placeholder="httpEndpoint"
      onChangeText={(httpEndpoint) => this.setState({httpEndpoint: httpEndpoint})}
      />
      <Button title="配置"
        onPress={
          () => {
            Alert.alert("确认配置");
            var configurationObj = {
              'category': 'configuration',
              'httpEndpoint': this.state.httpEndpoint
            };
            nodejs.channel.send(JSON.stringify(configurationObj));
          }
        }
      />
      <Text >{this.state.httpEndpoint}</Text>

      </View>
      </View>
    );
  }
}
