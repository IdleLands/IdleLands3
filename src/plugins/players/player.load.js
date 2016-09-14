
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

import { Logger } from '../../shared/logger';
import { constitute } from '../../shared/di-wrapper';

@Dependencies(PlayerDb, StatisticsDb, AchievementsDb, PersonalitiesDb, CollectiblesDb, PetsDb)
export class PlayerLoad {
  constructor(playerDb, statisticsDb, achievementsDb, personalitiesDb, collectiblesDb, petsDb) {
    this.playerDb = playerDb;
    this.statisticsDb = statisticsDb;
    this.achievementsDb = achievementsDb;
    this.personalitiesDb = personalitiesDb;
    this.collectiblesDb = collectiblesDb;
    this.petsDb = petsDb;
  }

  async loadPets(player) {
    if(!player.petsLink) {
      const petsObj = constitute(Pets);
      petsObj.init({ _id: player.name, activePetId: '', earnedPets: [], earnedPetData: {} });
      await this.petsDb.savePets(petsObj);
      player.petsLink = player.name;
      player.$pets = petsObj;
    } else {
      player.$pets = await this.petsDb.getPets(player.name);
    }
  }

  async loadStatistics(player) {
    if(!player.statisticsLink) {
      const statisticsObj = constitute(Statistics);
      statisticsObj.init({ _id: player.name, stats: {} });
      await this.statisticsDb.saveStatistics(statisticsObj);
      player.statisticsLink = player.name;
      player.$statistics = statisticsObj;
    } else {
      player.$statistics = await this.statisticsDb.getStatistics(player.name);
    }
  }

  async loadAchievements(player) {
    if(!player.achievementsLink) {
      const achievementsObj = constitute(Achievements);
      achievementsObj.init({ _id: player.name, achievements: {} });
      await this.achievementsDb.saveAchievements(achievementsObj);
      player.achievementsLink = player.name;
      player.$achievements = achievementsObj;
    } else {
      player.$achievements = await this.achievementsDb.getAchievements(player.name);
    }
  }

  async loadPersonalities(player) {
    if(!player.personalitiesLink) {
      const personalitiesObj = constitute(Personalities);
      personalitiesObj.init({ _id: player.name, activePersonalities: {}, earnedPersonalities: [] });
      await this.personalitiesDb.savePersonalities(personalitiesObj);
      player.personalitiesLink = player.name;
      player.$personalities = personalitiesObj;
    } else {
      player.$personalities = await this.personalitiesDb.getPersonalities(player.name);
    }
  }

  async loadCollectibles(player) {
    if(!player.collectiblesLink) {
      const collectiblesObj = constitute(Collectibles);
      collectiblesObj.init({ _id: player.name, collectibles: {} });
      await this.collectiblesDb.saveCollectibles(collectiblesObj);
      player.collectiblesLink = player.name;
      player.$collectibles = collectiblesObj;
    } else {
      player.$collectibles = await this.collectiblesDb.getCollectibles(player.name);
    }
  }

  async loadPlayer(playerId) {

    const playerObj = await this.playerDb.getPlayer({ _id: playerId });

    try {
      const player = constitute(Player);
      player.init(playerObj);

      await Promise.all([
        this.loadStatistics(player),
        this.loadAchievements(player),
        this.loadPersonalities(player),
        this.loadCollectibles(player),
        this.loadPets(player)
      ]);

      player.$personalities.checkPersonalities(player);

      player.$pets.restorePetData(player);
      player.$pets.checkPets(player);

      player.isOnline = true;
      player.recalculateStats();

      return player;
    } catch(e) {
      Logger.error('PlayerLoad:loadPlayer', e);
      throw(e);
    }
  }
}