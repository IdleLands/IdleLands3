
import _ from 'lodash';

import { Dependencies } from 'constitute';

import { FestivalsDb } from './festivals.db';
import { Festival } from './festival';

import { scheduleJob } from 'node-schedule';


@Dependencies(FestivalsDb)
export class Festivals {
  constructor(festivalsDb) {
    this.festivalsDb = festivalsDb;
    this.festivals = [];

    this.init();
  }

  init() {
    this.festivalsDb.getFestivals()
      .then(festivals => {
        this.festivals = festivals || [];
        _.each(festivals, festival => {
          this.setExpiryTimerForFestival(festival);
        });
      });
  }

  addFestival(festival) {
    festival = new Festival(festival);
    this.festivalsDb.saveFestival(festival);
    this.festivals.push(festival);
  }

  setExpiryTimerForFestival(festival) {
    if(festival.endDate < Date.now()) {
      this.festivalsDb.removeFestival(festival);
      return;
    }

    scheduleJob(festival.endDate, () => {
      this.festivalsDb.removeFestival(festival);
    });
  }
}
