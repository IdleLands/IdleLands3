
import fs from 'fs';
import _ from 'lodash';

// auto-populated
export const StringAssets = {};
export const ObjectAssets = {};

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
  const baseContents = fs.readFileSync(filename, 'UTF-8').replace(/ {2,}/g, ' ').split('\n');
  return _(baseContents).compact().reject(line => _.includes(line, '#')).value();
};

StringAssets.class = _.map(loadDirectory(`${__dirname}/../core/professions`), ({ filename }) => {
  return filename.split('/')[3].split('.')[0];
});

_.each(['events', 'strings'], folder => {
  _.each(loadDirectory(`${__dirname}/../../assets/content/${folder}`), ({ type, filename }) => {
    StringAssets[type] = parseFile(filename);
  });
});

_.each(['items', 'ingredients', 'monsters', 'npcs'], folder => {
  _.each(loadDirectory(`${__dirname}/../../assets/content/${folder}`), ({ type, filename }) => {
    // TODO parse these into json
    ObjectAssets[type] = parseFile(filename);
  });
});