var http = require('http');
var Eos = require('oasisjs')
var rn_bridge = require('rn-bridge');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');

let msg_number=0;
var mongodburl = 'mongodb://124.127.156.41:27017/'

let config = {
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
  var obj = JSON.parse(msg);
  switch(obj.category) {
    case 'configuration':
      config['httpEndpoint'] = obj.httpEndpoint;
      eos = Eos(config);
      var configObj = {
        'httpEndpoint': config['httpEndpoint']
      };
      rn_bridge.channel.send(JSON.stringify(configObj));
      break;
    case 'transfer':
      transferPara = {
        "from": obj.from,
        "to": obj.to,
        "quantity": obj.quantity,
        "memo": obj.memo
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
      // var wasm = fs.readFileSync('eosio.token.wasm');
      var balancePara = {
        'code': 'eosio.token',
        'account': JSON.parse(msg).account,
        'symbol': 'EOS'
      };
      eos.getCurrencyBalance(balancePara,(error,result) => {
        var rel = {
          balanceNow: result[0],
          accountName: JSON.parse(msg).account,
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
