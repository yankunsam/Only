var http = require('http');
var Eos = require('oasisjs')
var rn_bridge = require('rn-bridge');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');
let msg_number=0;
var mongodburl = 'mongodb://124.127.156.41:27017/'

let config = {
  chainId: "8a679bd6c011ff93eff0cb99d997bf72a69a0aaddc430d7e9c4b705f4de4d843", // 32 byte (64 char) hex string
  keyProvider: ['5KiDMuzQcK8q3M2MKHLyY4azLq8WnyYHdRN9VCsBh5sq6gDXnuf'], // WIF string or array of keys..
  httpEndpoint: 'http://124.127.156.41:8888',
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
      if (obj.httpEndpoint) {
        config['httpEndpoint'] = obj.httpEndpoint;
      }
      if (obj.privateKey) {
        config.keyProvider.push(obj.privateKey);
      }
      if(obj.chainId) {
        config['chainId'] = obj.chainId;
      }
      eos = Eos(config);
      var configObj = {
        'httpEndpoint': config['httpEndpoint'],
        'privateKey': config['keyProvider'],
        'chainId': config['chainId'],
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
      var balancePara = {
        'code': 'eosio.token',
        'account': JSON.parse(msg).account,
        'symbol': 'EOS'
      };
      eos.getCurrencyBalance(balancePara,(error,result) => {
        if (error) {
          throw error;
        };
        console.log("result", result)
        var rel = {
          balanceNow: result[0],
          accountName: JSON.parse(msg).account,
        };
        rn_bridge.channel.send(JSON.stringify(rel));
      })
      break;
    case 'block':
      MongoClient.connect(mongodburl, function(err, db) {
        if (err) {
          throw err
        }
        var dbo = db.db('EOS')
        dbo.collection('blocks').count({},(err, numDocs) => {
          if(err) {
            throw err
          }
          var rel = {
            blockAmount: numDocs,
          };
          rn_bridge.channel.send(JSON.stringify(rel));
          db.close()

        });
        dbo.collection('accounts').count({},(err, numDocs) => {
          if(err) {
            throw err
          }
          var rel = {
            accountAmount: numDocs,
          };
          rn_bridge.channel.send(JSON.stringify(rel));
          db.close()

        });
        dbo.collection('transactions').count({},(err, numDocs) => {
          if(err) {
            throw err
          }
          var rel = {
            transactionAmount: numDocs,
          };
          rn_bridge.channel.send(JSON.stringify(rel));
          db.close()

        });

      })
      break;
    case 'contract':
      var wasm = fs.readFileSync(path.join(__dirname, 'eosio.token.wasm'));
      eos.setcode(obj.account, 0, 0, wasm).then(rel => {console.log('EOS:',rel)});
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
