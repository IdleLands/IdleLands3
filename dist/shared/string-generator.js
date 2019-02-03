"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const asset_loader_1 = require("./asset-loader");
class StringGenerator {
    static _stringFromGrammar(grammar) {
        if (!grammar)
            return '';
        return _.map(grammar.split(' '), piece => {
            if (!_.includes(piece, '%'))
                return piece;
            return _.sample(asset_loader_1.StringAssets[piece.split('%')[1]]);
        })
            .join(' ');
    }
    static providence() {
        const grammar = _.sample(asset_loader_1.StringAssets.providenceGrammar);
        return this._stringFromGrammar(grammar);
    }
    static battle() {
        const grammar = _.sample(asset_loader_1.StringAssets.battleGrammar);
        return this._stringFromGrammar(grammar);
    }
    static party() {
        const grammar = _.sample(asset_loader_1.StringAssets.partyGrammar);
        return this._stringFromGrammar(grammar);
    }
}
exports.StringGenerator = StringGenerator;
