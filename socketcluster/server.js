var argv = require('minimist')(process.argv.slice(2));
var SocketCluster = require('socketcluster').SocketCluster;

var _ = require('lodash');
var os = require('os');

var ip = _(os.networkInterfaces())
  .values()
  .flatten()
  .filter(val => val.family === 'IPv4' && val.internal === false)
  .map('address')
  .first();

if(ip) {
  console.log(`Your IP is: ${ip}`);
}

process.on('unhandledRejection', function(reason, p) {
  console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

var socketCluster = new SocketCluster({
  workers: Number(argv.w) || 1,
  stores: Number(argv.s) || 1,
  port: Number(argv.p) || process.env.PORT || 8080,
  appName: argv.n || 'reactive-retro',
  initController: __dirname + '/init.js',
  workerController: __dirname + '/worker.js',
  brokerController: __dirname + '/broker.js',
  socketChannelLimit: 100,
  rebootWorkerOnCrash: argv['auto-reboot'] != false,
  logLevel: process.env.NODE_ENV === 'production' ? 3 : 1
});

socketCluster.on('fail', function(e) {
  console.error(e);
});