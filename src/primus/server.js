
import * as fs from 'fs';

import * as _ from 'lodash';
import * as Primus from 'primus';
import * as Emit from 'primus-emit';
// import Multiplex from 'primus-multiplex';

import { chatSetup } from '../plugins/chat/chat.setup';

import { GameState } from '../core/game-state';
import { Logger } from '../shared/logger';

import * as allteleports from '../../assets/maps/content/teleports.json';

export const primus = (() => {
  if(process.env.NO_START_GAME) return {};

  const ip = _(require('os').networkInterfaces())
    .values()
    .flatten()
    .filter(val => val.family === 'IPv4' && val.internal === false)
    .map('address')
    .first();

  if(ip) {
    Logger.important('Server', `Server IP is: ${ip}:${process.env.PORT || 8080}` + (process.env.QUIET ? ' (quiet mode. ssh...)' : ''));
  }

  const express = require('express');
  const compression = require('compression');
  const serve = express();
  serve.use(compression(), express.static('assets', { maxAge: '7d' }));

  const compressedTeleports = _.extend({}, allteleports.towns, allteleports.bosses, allteleports.dungeons, allteleports.trainers, allteleports.other);

  const mapData = _.sortBy(_.map(GameState.getInstance().world.maps, (val, key) => {
    return { name: key, path: val.path };
  }), 'name');

  serve.get('/maps', (req, res) => {
    res.json({
      maps: mapData,
      teleports: compressedTeleports
    });
  });

  serve.get('/maps/world-maps/guilds/:name', (req, res) => {
    const guild = GameState.getInstance().guilds.getGuild(req.params.name);
    if(!guild) return res.status(500).json({ error: 'No map' });
    res.json(guild.$base.map);
  });

  const finalhandler = require('finalhandler');

  // load primus
  const server = require('http').createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    serve(req, res, finalhandler(req, res));
  });

  server.on('error', (e) => {
    Logger.error('HTTP', e);
    process.exit(1);
  });

  server.listen(process.env.PORT || 8080);

  Logger.important('Server', 'Express started.');

  const primus = new Primus(server, { iknowhttpsisbetter: true, parser: 'JSON', transformer: 'websockets' });

// load socket functions
  const normalizedPath = require('path').join(__dirname, '..');

  const getAllSocketFunctions = (dir) => {
    let results = [];

    const list = fs.readdirSync(dir);
    _.each(list, basefilename => {
      const filename = `${dir}/${basefilename}`;
      const stat = fs.statSync(filename);
      if(stat && stat.isDirectory()) results = results.concat(getAllSocketFunctions(filename));
      else if(_.includes(basefilename, '.socket')) results.push(filename);
    });

    return results;
  };

  const allSocketFunctions = getAllSocketFunctions(normalizedPath);
  const allSocketRequires = _.map(allSocketFunctions, require);

  primus.plugin('emit', Emit);

  chatSetup(primus);

  primus.players = {};

  primus.addPlayer = (playerName, spark) => {
    if(!primus.players[playerName]) primus.players[playerName] = [];
    // _.each(primus.players[playerName], spark => primus.delPlayer(playerName, spark));
    // if(!primus.players[playerName]) primus.players[playerName] = [];
    primus.players[playerName].push(spark);
  };

  primus.delPlayer = (playerName, spark) => {
    if(spark) {
      primus.players[playerName] = _.without(primus.players[playerName], spark);
      spark.end();
    } else {
      _.each(primus.players[playerName], iterSpark => {
        primus.players[playerName] = _.without(primus.players[playerName], iterSpark);
        iterSpark.end();
      });
    }

    if(!primus.players[playerName].length) {
      delete primus.players[playerName];
    }
  };

  primus.emitToPlayers = (players = [], data) => {
    _.each(players, player => {
      _.each(primus.players[player], spark => {
        spark.write(data);
      });
    });
  };

// force setting up the global connection
  new (require('../shared/db-wrapper').DbWrapper)().connectionPromise();

  primus.on('connection', spark => {
    const respond = (data) => {
      spark.write(data);
    };

    _.each(allSocketRequires, obj => obj.socket(spark, primus, (data) => {
      data.event = obj.event;
      respond(data);
    }));

    spark.on('error', e => {
      Logger.error('Spark', e);
    });

    setTimeout(() => {
      if(spark.authToken || spark._registering) return;
      spark.end();
    }, 10000);
  });

  primus.on('error', e => {
    Logger.error('Primus', e);
  });

  if(process.env.NODE_ENV !== 'production') {
    _.each(['Play'], root => {
      const path = require('path').join(__dirname, '..', '..', '..', root);
      fs.stat(path, e => {
        if(e) {
          Logger.error('Primus:Generate', e);
          return;
        }
        
        Logger.important('Primus:Generate', `${root} is installed. Generating a Primus file for it.`);
        primus.save(`${path}/primus.gen.js`);
      });
    });
  }

  return primus;
})();
