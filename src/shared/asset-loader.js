
import fs from 'fs';
import _ from 'lodash';

// auto-populated
export const StringAssets = {};
export const ObjectAssets = {};

const replaceMultiSpaces = (string) => {
  return string.replace(/ {2,}/g, ' ');
};

class JSONParser {
  static _parseInitialArgs(string) {
    if(!string || _.includes(string, '#')) return [];
    string = replaceMultiSpaces(string);
    const split = string.split('"');
    return [split[1], split[2]];
  }

  static _parseParameters(baseObj = {}, parameters) {
    const paramData = _.map(parameters.split(' '), item => {
      const arr = item.split('=');
      const retVal = {};
      const testVal = +arr[1];

      if(!arr[0]) return {};

      let newVal = 0;
      if(_.isNaN(testVal) && _.isUndefined(arr[1])) {
        newVal = 1;
      } else if(_.includes(['class','gender','link','expiration','zone'], arr[0])) {
        newVal = arr[1];
      } else {
        newVal = testVal;
      }

      retVal[arr[0]] = newVal;
      return retVal;

    });

    return _.reduce(paramData, (cur, prev) => {
      _.extend(prev, cur);
      return prev;
    }, baseObj);
  }

  static parseMonsterString(str) {
    if(!_.includes(str, 'level')) return;
    const [name, parameters] = this._parseInitialArgs(str);
    if(!parameters) return;
    const monsterData = this._parseParameters({ name }, parameters);
    return monsterData;
  }

  static parseNPCString(str) {
    const [name, parameters] = this._parseInitialArgs(str);
    const npcData = this._parseParameters({ name }, parameters);
    return npcData;
  }

  static parseItemString(str, type) {
    const [name, parameters] = this._parseInitialArgs(str);
    if(!parameters) return;

    const itemData = this._parseParameters({ name: name, type: type }, parameters);
    return itemData;
  }
}

const loadDirectory = (dir) => {
  const results = [];

  const list = fs.readdirSync(dir);
  _.each(list, basefilename => {
    const filename = `${dir}/${basefilename}`;
    results.push({ filename, type: basefilename.split('.')[0] });
  });

  return results;
};

const parseFile = (filename) => {
  const baseContents = replaceMultiSpaces(fs.readFileSync(filename, 'UTF-8')).split('\n');
  return _(baseContents).compact() /* .reject(line => _.includes(line, '#')) */ .value();
};

StringAssets.class = _.map(loadDirectory(`${__dirname}/../core/professions`), ({ filename }) => {
  const split = filename.split('/');
  return split[split.length - 1].split('.')[0];
});

_.each(['events', 'strings'], folder => {
  _.each(loadDirectory(`${__dirname}/../../assets/content/${folder}`), ({ type, filename }) => {
    StringAssets[type] = parseFile(filename);
  });
});

const parseTable = {
  items: JSONParser.parseItemString.bind(JSONParser),
  ingredients: JSONParser.parseItemString.bind(JSONParser),
  monsters: JSONParser.parseMonsterString.bind(JSONParser),
  npcs: JSONParser.parseNPCString.bind(JSONParser)
};

_.each(['items', 'ingredients', 'monsters', 'npcs'], folder => {
  _.each(loadDirectory(`${__dirname}/../../assets/content/${folder}`), ({ type, filename }) => {
    ObjectAssets[type] = _.compact(_.map(parseFile(filename), line => parseTable[folder](line, type)));
  });
});