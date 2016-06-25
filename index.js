
require('babel-register');
require('babel-polyfill');

var socketCluster = require('./socketcluster/server').socketCluster;
var proxy = require('./socketcluster/proxy').SocketProxy;
proxy.setSocketCluster(socketCluster);

require('./src/core/event-loop');