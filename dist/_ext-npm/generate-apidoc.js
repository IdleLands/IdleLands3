"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const fs = require("fs");
let docString = `
# IdleLands API

To connect to IdleLands via the API, you must connect using a websocket connection using the Primus library. Currently it uses a standard websocket.
`;
const normalizedPath = require('path').join(__dirname, '..');
const getAllSocketFunctions = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    _.each(list, basefilename => {
        const filename = `${dir}/${basefilename}`;
        const stat = fs.statSync(filename);
        if (stat && stat.isDirectory())
            results = results.concat(getAllSocketFunctions(filename));
        else if (_.includes(basefilename, '.socket'))
            results.push(filename);
    });
    return results;
};
const allSocketFunctions = getAllSocketFunctions(normalizedPath);
const allSocketRequires = _.map(allSocketFunctions, require);
docString += '\n\n';
docString += 'API Call | Arguments | Description\n';
docString += '-------- | --------- | -----------\n';
_.each(allSocketRequires, obj => {
    docString += `${obj.event} | ${obj.args} | ${obj.description}\n`;
});
fs.writeFileSync('docs/API.md', docString);
