
import { Dependencies, Container } from 'constitute';
import _ from 'lodash';

import { Logger } from '../../shared/logger';

import { Equipment } from '../../core/base/equipment';

import { SETTINGS } from '../../static/settings';
import petdata from '../../../assets/maps/content/pets.json';
import { Pet } from './pet';

@Dependencies(Container)
export class Pets {
  constructor(container) {
    const PetsDb = require('./pets.db.js').PetsDb;
    try {
      container.schedulePostConstructor((petsDb) => {
        this.petsDb = petsDb;
      }, [PetsDb]);
    } catch (e) {
      Logger.error('Pets', e);
    }
  }

  // clear current variables and set new
  init(opts) {
    this._id = undefined;
    this.earnedPets = [];
    this.earnedPetData = {};
    this.activePetId = '';
    this.$pets = [];
    _.extend(this, opts);
  }

  __emptyGear({ slot }) {
    return new Equipment({ name: 'nothing', type: slot });
  }

  get activePet() {
    return _.find(this.$pets, { $petId: this.activePetId });
  }

  _updateSimplePetInfo(petType, key, value) {
    _.find(this.earnedPets, { name: petType })[key] = value;
  }

  _syncGear(pet) {
    if(!pet.equipment) pet.equipment = {};

    _.each(pet.$slots, (value, key) => {
      if(!pet.equipment[key]) pet.equipment[key] = [];
      while(pet.equipment[key].length < value) {
        pet.equipment[key].push(this.__emptyGear({ slot: key }));
      }

      while(pet.equipment[key].length > value) {
        pet.addToInventory(pet.equipment[key].shift());
      }
    });

  }

  _setupPetData(petName, petData, myPetData, player) {
    myPetData.$specialStats = petData.specialStats;
    myPetData.$category = petData.category;
    myPetData.$slots = petData.slots;
    myPetData.$scale = petData.scale;
    myPetData.$scaleCost = petData.scaleCost;
    myPetData.$petId = petName;
    myPetData.$ownerRef = player;
    myPetData.$manager = this;
  }

  addNewPet(player, type, name) {
    if(this.earnedPetData[type]) return;
    if(!name || !name.trim() || name.length > 20) return;

    const cost = petdata[type].cost;
    if(player.gold < cost) return;

    player.gainGold(-cost);
    player.$statistics.incrementStat('Character.Gold.Spent', cost);

    const pet = new Pet();
    this._setupPetData(type, petdata[type], pet, player);
    pet.init({
      name,
      creator: player.name,
      owner: player.name,
      attr: _.sample(SETTINGS.validPetAttributes)
    });

    this._syncGear(pet);

    const petInList = _.find(this.earnedPets, { name: type });
    petInList.bought = true;
    petInList.level = 1;
    petInList.profession = 'Monster';
    petInList.petName = name;

    this.activePetId = type;

    this.earnedPetData[type] = pet.buildSaveObject();
    this.$pets.push(pet);

    this.save();
    player.save();

    player._updatePet();
  }

  restorePetData(player) {
    _.each(petdata, (petData, petName) => {
      if(!this.earnedPetData[petName]) return;
      const myPetData = this.earnedPetData[petName];
      this._setupPetData(petName, petData, myPetData, player);
    });

    this.$pets = _.map(_.values(this.earnedPetData), d => {
      const pet = new Pet();
      pet.init(d);
      this._syncGear(pet);
      return pet;
    });
  }

  feedGold(player, amount) {
    amount = Math.round(+amount);
    if(_.isNaN(amount) || amount <= 0 || player.gold < amount) return 'Bad amount of gold specified.';

    const pet = this.activePet;
    const xpGained = pet.$_scale.xpPerGold * amount;

    if(!pet.canGainXp()) return 'Pet cannot gain XP at this time.';

    player.gainGold(-amount);
    player.$statistics.incrementStat('Character.Pet.GoldFed', amount);
    pet.gainXp(xpGained);

    player._updatePet();
  }

  changePet(player, newPetType) {
    if(!this.earnedPetData[newPetType]) return;
    this.activePetId = newPetType;
    player.__updatePetActive();
    this.save();
  }

  togglePetSmartSetting(setting) {
    if(!_.includes(['self', 'sell', 'equip'], setting)) return;
    const pet = this.activePet;
    pet.smart[setting] = !pet.smart[setting];

    this.save();
  }

  changePetProfession(player, newProfession) {
    const allProfessions = player.$statistics.getStat('Character.Professions');
    if(!allProfessions[newProfession] && newProfession !== 'Monster') return;

    this.activePet.changeProfession(newProfession);
    player.__updatePetActive();
    player.__updatePetBasic();
  }

  changePetAttr(player, newAttr) {
    const allAttrs = player.$achievements.petAttributes();
    if(!_.includes(allAttrs, newAttr)) return;

    this.activePet.changeAttr(newAttr);
    player.__updatePetActive();
    player.__updatePetBasic();
  }

  upgradePet(player, scaleAttr) {

    const pet = this.activePet;

    if(pet.$scale[scaleAttr].length - 1 === pet.scaleLevel[scaleAttr]) return;

    const cost = pet.$scaleCost[scaleAttr][pet.scaleLevel[scaleAttr]];
    if(player.gold < cost) return;

    player.gainGold(-cost);
    player.$statistics.incrementStat('Character.Gold.Spent', cost);
    player.$statistics.incrementStat('Character.Pet.Upgrades');

    pet.scaleLevel[scaleAttr]++;

    pet.doUpgrade(scaleAttr);

    player.__updatePetActive();
  }

  takePetGold(player) {
    const pet = this.activePet;
    const gold = pet.gold.getValue();

    player.gainGold(gold);
    pet.gainGold(-gold);

    player.$statistics.incrementStat('Character.Pet.GoldTaken', gold);

    player.__updatePetActive();
  }

  checkPetRequirements(player, { requirements }) {
    const { statistics, achievements, collectibles, bosses } = requirements;

    let earned = true;

    if(statistics) {
      _.each(statistics, (value, key) => {
        let statVal = player.$statistics.getStat(key);
        if(_.isObject(statVal)) statVal = player.$statistics.countChild(key);

        if(statVal < value) earned = false;
      });
    }

    if(achievements) {
      _.each(achievements, ({ name, tier }) => {
        if(!player.$achievements.hasAchievementAtTier(name, tier)) earned = false;
      });
    }

    if(collectibles) {
      _.each(collectibles, collectible => {
        if(!player.$collectibles.hasCollectible(collectible)) earned = false;
      });
    }

    if(bosses) {
      _.each(bosses, boss => {
        if(!player.$statistics.getStat(`Character.BossKills.${boss}`)) earned = false;
      });
    }

    return earned;
  }

  sellPetItem(player, itemId) {
    const pet = this.activePet;
    if(!this.activePet) return;

    const item = _.find(pet.inventory, { id: itemId });
    if(!item) return;

    pet.sellItem(item);
    pet.removeFromInventory(item);

    player.__updatePetActive();
  }

  unequipPetItem(player, itemId) {
    const pet = this.activePet;
    if(!this.activePet) return;

    if(pet.inventoryFull()) {
      return 'Pet inventory full.';
    }

    const item = _.find(_.flatten(_.values(pet.equipment)), { id: itemId });
    if(!item) return;

    if(item.isNothing) {
      return 'Cannot unequip nothing.';
    }

    if(item.type === 'soul') {
      return 'Souls are irreplaceable.';
    }

    pet.unequip(item, true);
    pet.addToInventory(item);

    player.__updatePetActive();
  }

  equipPetItem(player, itemId) {
    const pet = this.activePet;
    if(!this.activePet) return;

    const item = _.find(pet.inventory, { id: itemId });
    if(!item) return;

    if(!pet.canManuallyEquip(item)) {
      return 'No place to equip item.';
    }

    if(!pet.canEquip(item)) {
      return 'Item too strong for pet or pet does not have the correct appendages.';
    }

    pet.equip(item, true);
    pet.removeFromInventory(item);

    player.__updatePetActive();
  }

  giveItemToPet(player, itemId) {
    const pet = this.activePet;
    if(!this.activePet) return;

    if(pet.inventoryFull()) {
      return 'Pet inventory full.';
    }

    const item = _.find(_.values(player.equipment), { id: itemId });
    if(!item) return;
    
    if(item.type === 'providence') {
      return 'Providences are gifts from the gods, you cannot forsake them like this.';
    }

    if(item.isNothing) {
      return 'Cannot unequip nothing.';
    }

    item._wasEquipped = true;

    player.unequip(item, this.__emptyGear({ slot: item.type }));
    pet.addToInventory(item);

    player._updateEquipment();
    player.__updatePetActive();
  }

  takeItemFromPet(player, itemId) {
    const pet = this.activePet;
    if(!this.activePet) return;

    const item = _.find(pet.inventory, { id: itemId });
    if(!item) return;

    if(!player.equipment[item.type].isNothing) {
      return 'Cannot equip over something.';
    }

    if(!player.canEquip(item) && !item._wasEquipped) {
      return 'Item too powerful for you.';
    }

    player.equip(item);
    pet.removeFromInventory(item);

    player._updateEquipment();
    player.__updatePetActive();
  }

  checkPets(player) {
    _.each(petdata, (petData, petName) => {
      if(_.find(this.earnedPets, { name: petName })) return;
      if(!this.checkPetRequirements(player, petData)) return;

      this.earnedPets.push({ bought: false, name: petName });
    });
  }

  get petInfo() {
    return _.reduce(_.keys(petdata), (prev, cur) => {
      prev[cur] = _.pick(petdata[cur], ['cost', 'category', 'description']);
      return prev;
    }, {});
  }

  buildSaveObject() {
    _.each(this.$pets, pet => {
      this.earnedPetData[pet.$petId] = pet.buildSaveObject();
    });
    return _.omitBy(this, (val, key) => _.startsWith(key, '$'));
  }

  save() {
    this.petsDb.savePets(this.buildSaveObject());
  }
}
