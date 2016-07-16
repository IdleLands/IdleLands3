
import { Event } from '../../../core/base/event';

// import { MessageCategories } from '../../../shared/adventure-log';

export const WEIGHT = 5;

// Create a party
export class Party extends Event {
  static operateOn(/* player */) {

    /*
    TODO
     - pick 3 random people to form a party with (they cant be in a party)
     - add choices to their event log
     - auto make this person the leader
     */

    /*
    const id = Event.chance.guid();
    const message = `Would you like to buy «${item.fullname}» for ${cost} gold?`;
    const eventText = this.eventText('merchant', player, { item: item.fullname, shopGold: cost });
    const extraData = { item, cost, eventText };

    player.addChoice({ id, message, extraData, event: 'Party', choices: ['Yes', 'No'] });
    */
  }

  static makeChoice(/* player, id, response */) {
    /*
    if(response !== 'Yes') return;
    const choice = _.find(player.choices, { id });

    player.$statistics.incrementStat('Character.Gold.Spent', choice.extraData.cost);
    this.emitMessage({ affected: [player], eventText: choice.extraData.eventText, category: MessageCategories.GOLD });
    */
  }

}

