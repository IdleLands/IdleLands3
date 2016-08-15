
import _ from 'lodash';
import { StringAssets } from './asset-loader';

export class StringGenerator {
  static _stringFromGrammar(grammar) {
    if(!grammar) return '';
    return _.map(grammar.split(' '), piece => {
      if(!_.includes(piece, '%')) return piece;
      return _.sample(StringAssets[piece.split('%')[1]]);
    })
    .join(' ');
  }

  static providence() {
    const grammar = _.sample(StringAssets.providenceGrammar);
    return this._stringFromGrammar(grammar);
  }

  static battle() {
    const grammar = _.sample(StringAssets.battleGrammar);
    return this._stringFromGrammar(grammar);
  }

  static party() {
    const grammar = _.sample(StringAssets.partyGrammar);
    return this._stringFromGrammar(grammar);
  }
}