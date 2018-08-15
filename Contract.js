import React, {Component} from 'react';
import {AppState,Platform, StyleSheet, Text, View, Button,TextInput, Alert} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';


export default class Contract extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      accountContract: '',
      contractPath: '',
    };
  }
  render() {
    return (
      <View style={styles.container}>
      <View style={styles.container}>
      <TextInput style={{height: 40,width: 150}}
      placeholder="请输入合约账户名"
      onChangeText={(account) => this.setState({accountContract: account})}
      />
      </View>
      <View style={styles.container}>
      <TextInput style={{height: 40,width: 150}}
      placeholder="请输入合约文件路径"
      onChangeText={(account) => this.setState({accountContract: account})}
      />
      </View>
      <View style={styles.container}>
      <Button title="部署合约"
          onPress={() => {
            Alert.alert('部署合约,请确认网络是否连接');
            var contractObj = {
              'category': 'contract',
              'account': this.state.accountContract
            };
            nodejs.channel.send(JSON.stringify(contractObj));
            }
          }
        />
        </View>

      </View>
    )
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
