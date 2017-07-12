
import { Dependencies } from 'constitute';

import { Player } from './player';

import { PlayerDb } from './player.db';

import { Statistics } from '../statistics/statistics';
import { StatisticsDb } from '../statistics/statistics.db';

import { Achievements } from '../achievements/achievements';
import { AchievementsDb } from '../achievements/achievements.db';

import { Personalities } from '../personalities/personalities';
import { PersonalitiesDb } from '../personalities/personalities.db';

import { Collectibles } from '../collectibles/collectibles';
import { CollectiblesDb } from '../collectibles/collectibles.db';

import { Pets } from '../pets/pets';
import { PetsDb } from '../pets/pets.db';

import { Premium } from '../premium/premium';
import { PremiumDb } from '../premium/premium.db';

import { Logger } from '../../shared/logger';
import { constitute } from '../../shared/di-wrapper';

@Dependencies(PlayerDb, StatisticsDb, AchievementsDb, PersonalitiesDb, CollectiblesDb, PetsDb, PremiumDb)
export class PlayerLoad {
  constructor(playerDb, statisticsDb, achievementsDb, personalitiesDb, collectiblesDb, petsDb, premiumDb) {
    this.playerDb = playerDb;
    this.statisticsDb = statisticsDb;
    this.achievementsDb = achievementsDb;
    this.personalitiesDb = personalitiesDb;
    this.collectiblesDb = collectiblesDb;
    this.petsDb = petsDb;
    this.premiumDb = premiumDb;
  }

  async loadPremium(player, debug = false) {
    if(!player.premiumLink) {
      const premObj = constitute(Premium);
      premObj.init({ _id: player.name, ilp: 0, oneTimeItemsPurchased: {}, purchaseHistory: [] });
      if(debug) console.log('[start] savePremium: ' + player.name);
      await this.premiumDb.savePremium(premObj, debug);
      if(debug) console.log('[end] savePremium: ' + player.name);
      player.premiumLink = player.name;
      player.$premium = premObj;
    } else {
      if(debug) console.log('[start] getPremium: ' + player.name);
      player.$premium = await this.premiumDb.getPremium(player.name, debug);
      if(debug) console.log('[end] getPremium: ' + player.name);
    }
  }

  async loadPets(player, debug = false) {
    if(!player.petsLink) {
      const petsObj = constitute(Pets);
      petsObj.init({ _id: player.name, activePetId: '', earnedPets: [], earnedPetData: {} });
      if(debug) console.log('[start] savePets: ' + player.name);
      await this.petsDb.savePets(petsObj, debug);
      if(debug) console.log('[end] savePets: ' + player.name);
      player.petsLink = player.name;
      player.$pets = petsObj;
    } else {
      if(debug) console.log('[start] getPets: ' + player.name);
      player.$pets = await this.petsDb.getPets(player.name, debug);
      if(debug) console.log('[end] getPets: ' + player.name);
    }
  }

  async loadStatistics(player, debug = false) {
    if(!player.statisticsLink) {
      const statisticsObj = constitute(Statistics);
      statisticsObj.init({ _id: player.name, stats: {} });
      if(debug) console.log('[start] saveStatistics: ' + player.name);
      await this.statisticsDb.saveStatistics(statisticsObj, debug);
      if(debug) console.log('[end] saveStatistics: ' + player.name);
      player.statisticsLink = player.name;
      player.$statistics = statisticsObj;
    } else {
      if(debug) console.log('[start] getStatistics: ' + player.name);
      player.$statistics = await this.statisticsDb.getStatistics(player.name, debug);
      if(debug) console.log('[end] getStatistics: ' + player.name);
    }
  }

  async loadAchievements(player, debug = false) {
    if(!player.achievementsLink) {
      const achievementsObj = constitute(Achievements);
      achievementsObj.init({ _id: player.name, achievements: {}, uniqueAchievements: 0 });
      if(debug) console.log('[start] saveAchievements: ' + player.name);
      await this.achievementsDb.saveAchievements(achievementsObj, debug);
      if(debug) console.log('[end] saveAchievements: ' + player.name);
      player.achievementsLink = player.name;
      player.achievementsLink = player.name;
      player.$achievements = achievementsObj;
    } else {
      if(debug) console.log('[start] getAchievements: ' + player.name);
      player.$achievements = await this.achievementsDb.getAchievements(player.name, debug);
      if(debug) console.log('[end] getAchievements: ' + player.name);
    }
  }

  async loadPersonalities(player, debug = false) {
    if(!player.personalitiesLink) {
      const personalitiesObj = constitute(Personalities);
      personalitiesObj.init({ _id: player.name, activePersonalities: {}, earnedPersonalities: [] });
      if(debug) console.log('[start] savePersonalities: ' + player.name);
      await this.personalitiesDb.savePersonalities(personalitiesObj, debug);
      if(debug) console.log('[end] savePersonalities: ' + player.name);
      player.personalitiesLink = player.name;
      player.$personalities = personalitiesObj;
    } else {
      if(debug) console.log('[start] getPersonalities: ' + player.name);
      player.$personalities = await this.personalitiesDb.getPersonalities(player.name, debug);
      if(debug) console.log('[end] getPersonalities: ' + player.name);
    }
  }

  async loadCollectibles(player, debug = false) {
    if(!player.collectiblesLink) {
      const collectiblesObj = constitute(Collectibles);
      collectiblesObj.init({ _id: player.name, collectibles: {} });
      if(debug) console.log('[start] saveCollectibles: ' + player.name);
      await this.collectiblesDb.saveCollectibles(collectiblesObj, debug);
      if(debug) console.log('[end] saveCollectibles: ' + player.name);
      player.collectiblesLink = player.name;
      player.$collectibles = collectiblesObj;
    } else {
      if(debug) console.log('[start] getCollectibles: ' + player.name);
      player.$collectibles = await this.collectiblesDb.getCollectibles(player.name, debug);
      if(debug) console.log('[end] getCollectibles: ' + player.name);
    }
  }

  async loadPlayer(playerId) {
    const playerObj = await this.playerDb.getPlayer({ _id: playerId });

    try {
      const player = constitute(Player);
      player.init(playerObj);

      let debug = false;
      if(player.name === 'Great Character Name') debug = true;
      if(debug) console.log('Loading player data for: ' + player.name);

      await Promise.all([
        this.loadStatistics(player, debug),
        this.loadAchievements(player, debug),
        this.loadPersonalities(player, debug),
        this.loadCollectibles(player, debug),
        this.loadPets(player, debug),
        this.loadPremium(player, debug)
      ]);

      if(debug) console.log('All player data loaded for: ' + player.name);

      player.$personalities.checkPersonalities(player);

      player.$pets.restorePetData(player);
      player.$pets.checkPets(player);

      player.$premium.checkDonatorFirstTimeBonus(player);

      if(player.hasGuild) {
        player.guild.verifyPlayer(player);
      }

      player.isOnline = true;
      player.recalculateStats();

      if(debug) console.log('Player fully loaded: ' + player.name);

      return player;
    } catch(e) {
      Logger.error('PlayerLoad:loadPlayer', e);
      throw(e);
    }
  }
}