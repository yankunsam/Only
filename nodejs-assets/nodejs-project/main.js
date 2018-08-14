var http = require('http');
var Eos = require('oasisjs')
var rn_bridge = require('rn-bridge');
var MongoClient = require('mongodb').MongoClient;

let msg_number=0;
var mongodburl = 'mongodb://124.127.156.41:27017/'

var config = {
  chainId: "c40a90d6bcb4b9b2c2d4c0916ee97a29af42a420372af44fa4f538ddef9e6b83", // 32 byte (64 char) hex string
  keyProvider: ['5KZ2ytRsGMxRAycpFqFnkRF8mNfZTomQKnaXzh1FtbRPgbaTAF3','5Hz2G2L9p3k7YhkqGJaioNJQnYKjtZKKS2y3wRLDobCQAtXg5oA','5KRwwqFRdZ1v5UNcXPk72Mq3t4ucs7kMmqKx9HLpUnnk74iKWen'], // WIF string or array of keys..
  httpEndpoint: 'http://124.127.156.41:8888',
  // httpEndpoint: 'http://192.168.1.212:8888',
  expireInSeconds: 60,
  broadcast: true,
  verbose: false, // API activity
  sign: true
};
eos = Eos(config)


// Echo every message received from react-native.
rn_bridge.channel.on('message', (msg) => {
  switch(msg) {
    case 'transfer':
      transferPara = {
        "from": 'eosio.token',
        "to": 'eosio',
        "quantity": '100.0000 EOS',
        "memo": 'by react native'
      };
      eos.transfer(transferPara,(error,result)=>{
        if (error) {
          throw error;
        }
      });
      break;
    case 'suspend':
      listVersionsHTTPServer.close();
      break;
    case 'resume':
      if(!listVersionsHTTPServer.listening)
        listVersionsHTTPServer = listVersionsServer.listen(3001);
      break;
    case 'balance':
      balance = {
        'code': 'eosio.token',
        'account': 'eosio.token',
        'symbol': 'EOS'
      }
      eos.getCurrencyBalance(balance,(error,result) => {
        var rel = {
          balanceNow: result[0]
        };
        rn_bridge.channel.send(JSON.stringify(rel));
    })
      break;
    case 'blocks':
      MongoClient.connect(mongodburl, function(err, db) {
        if (err) {
          throw err
        }
        var dbo = db.db('EOS')
        dbo.collection('accounts').find({}).toArray((err, result) => {
          if(err) {
            throw err
          }
          var rel = {
            account: '第一个账户',
          };
          var temp = JSON.stringify(rel);
          console.log(temp);
          rn_bridge.channel.send(temp);
          db.close()

        })
      })
      break;
    default:
      break;
  }
});
// Inform react-native node is initialized.
var init = {
  lastNodeMessage: 'Node was initialized.'
};
rn_bridge.channel.send(JSON.stringify(init));
