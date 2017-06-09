
# IdleLands Class Spells

## Table of Contents

1. [Archer](#archer)
2. [Barbarian](#barbarian)
3. [Bard](#bard)
4. [Beatomancer](#beatomancer)
5. [Bitomancer](#bitomancer)
6. [Cleric](#cleric)
7. [Clockborg](#clockborg)
8. [Druid](#druid)
9. [Fencer](#fencer)
10. [Fighter](#fighter)
11. [Generalist](#generalist)
12. [Jester](#jester)
13. [Mage](#mage)
14. [MagicalMonster](#magicalmonster)
15. [Monster](#monster)
16. [Necromancer](#necromancer)
17. [Pirate](#pirate)
18. [Rogue](#rogue)
19. [SandwichArtist](#sandwichartist)
20. [Trickster](#trickster)


## Archer

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 
smoke bomb ([SmokeBomb 1](../src/plugins/combat/spells/SmokeBomb.js)) | Debuff | 5 | Throws a bomb that reduces DEX of all enemies. | 
take aim ([TakeAim 1](../src/plugins/combat/spells/TakeAim.js)) | Physical | 7 | Restores a set amount of Focus to the caster. | 
venom coating ([VenomCoating 1](../src/plugins/combat/spells/VenomCoating.js)) | Buff | 15 | Applies Venom and Poison effects to an ally's weapon. | 
double shot ([Multishot 1](../src/plugins/combat/spells/Multishot.js)) | Physical | 25 | An attack that hits multiple times. | 
shattershot ([Shattershot 1](../src/plugins/combat/spells/Shattershot.js)) | Physical | 25 | An attack that applies random debuffs to the target. | 
anti-magic arrow ([AntimagicArrow 1](../src/plugins/combat/spells/AntimagicArrow.js)) | Physical | 30 | An attack that reduces the target's mp. | 
smoke grenade ([SmokeBomb 2](../src/plugins/combat/spells/SmokeBomb.js)) | Debuff | 35 | Throws a bomb that reduces DEX of all enemies. | 
relentless assault ([RelentlessAssault 1](../src/plugins/combat/spells/RelentlessAssault.js)) | Physical | 50 | Performs two additional Attacks per round, costing 25 Focus each round for 10 rounds. | 
triple shot ([Multishot 2](../src/plugins/combat/spells/Multishot.js)) | Physical | 55 | An attack that hits multiple times. | 
venom slathering ([VenomCoating 2](../src/plugins/combat/spells/VenomCoating.js)) | Buff | 55 | Applies Venom and Poison effects to an ally's weapon. | 
anti-magic burst ([AntimagicArrow 2](../src/plugins/combat/spells/AntimagicArrow.js)) | Physical | 65 | An attack that reduces the target's mp. | 
shatterblast ([Shattershot 2](../src/plugins/combat/spells/Shattershot.js)) | Physical | 65 | An attack that applies random debuffs to the target. | 
trance focus ([TakeAim 2](../src/plugins/combat/spells/TakeAim.js)) | Physical | 65 | Restores a set amount of Focus to the caster. | 
quadruple shot ([Multishot 3](../src/plugins/combat/spells/Multishot.js)) | Physical | 85 | An attack that hits multiple times. | 
smoke missile ([SmokeBomb 3](../src/plugins/combat/spells/SmokeBomb.js)) | Debuff | 85 | Throws a bomb that reduces DEX of all enemies. | 
anti-magic blast ([AntimagicArrow 3](../src/plugins/combat/spells/AntimagicArrow.js)) | Physical | 100 | An attack that reduces the target's mp. | Ivory Arrow


## Barbarian

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 
berserk ([Berserk 1](../src/plugins/combat/spells/Berserk.js)) | Physical | 1 | A spell that increases Rage by a set amount. | 
crazy ([Berserk 2](../src/plugins/combat/spells/Berserk.js)) | Physical | 35 | A spell that increases Rage by a set amount. | 
cleave ([Cleave 1](../src/plugins/combat/spells/Cleave.js)) | Physical | 50 | An attack that consumes all Rage to deal massive damage. | 
strike ([Attack 2](../src/plugins/combat/spells/Attack.js)) | Physical | 50 | A simple attack that uses STR to deal damage. | 
out of control ([Berserk 3](../src/plugins/combat/spells/Berserk.js)) | Physical | 75 | A spell that increases Rage by a set amount. | 


## Bard

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
Light From The Stars ([LightFromTheStars 1](../src/plugins/combat/spells/LightFromTheStars.js)) | Buff | 1 | A buff that increases CON and LUK of all allies. | Soaked Sitar
Litany of Pain ([LitanyOfPain 1](../src/plugins/combat/spells/LitanyOfPain.js)) | Debuff | 1 | A debuff that deals damage to an enemy every turn. | 
Our Hearts Ignite ([OurHeartsIgnite 1](../src/plugins/combat/spells/OurHeartsIgnite.js)) | Buff | 1 | A buff that increases STR and INT of all allies. | 
There Is No Escape ([ThereIsNoEscape 1](../src/plugins/combat/spells/ThereIsNoEscape.js)) | Buff | 1 | A buff that increases DEX and AGI of all allies. | 
Through the Pale Moonlight ([PaleMoonlight 1](../src/plugins/combat/spells/PaleMoonlight.js)) | Buff | 1 | A buff that heals all allies every turn. | 
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 
Hymn of Torment ([LitanyOfPain 2](../src/plugins/combat/spells/LitanyOfPain.js)) | Debuff | 50 | A debuff that deals damage to an enemy every turn. | 
Our Hearts Blaze ([OurHeartsIgnite 2](../src/plugins/combat/spells/OurHeartsIgnite.js)) | Buff | 50 | A buff that increases STR and INT of all allies. | 
Purity From The Stars ([LightFromTheStars 2](../src/plugins/combat/spells/LightFromTheStars.js)) | Buff | 50 | A buff that increases CON and LUK of all allies. | Soaked Sitar
Shining Bright Against the Night ([PaleMoonlight 2](../src/plugins/combat/spells/PaleMoonlight.js)) | Buff | 50 | A buff that heals all allies every turn. | 
You Shant Get Away ([ThereIsNoEscape 2](../src/plugins/combat/spells/ThereIsNoEscape.js)) | Buff | 50 | A buff that increases DEX and AGI of all allies. | 
Chant of Obliteration ([LitanyOfPain 3](../src/plugins/combat/spells/LitanyOfPain.js)) | Debuff | 100 | A debuff that deals damage to an enemy every turn. | Ancient Lute


## Beatomancer

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 


## Bitomancer

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 
bit ([Bit 1](../src/plugins/combat/spells/Bit.js)) | Digital | 1 | A spell that uses INT to deal damage. | 
byte ([Byte 1](../src/plugins/combat/spells/Byte.js)) | Digital | 1 | A spell that uses INT to deal damage to an enemy and heal the caster. | 
flip the bit ([FlipTheBit 1](../src/plugins/combat/spells/FlipTheBit.js)) | Digital | 1 | A spell that reverses the target's current HP and MP values | 
freeleech ([Freeleech 1](../src/plugins/combat/spells/Freeleech.js)) | Digital | 1 | A spell that steals Bandwidth from all enemies. | 
kilobit ([Bit 2](../src/plugins/combat/spells/Bit.js)) | Digital | 8 | A spell that uses INT to deal damage. | 
kilobyte ([Byte 2](../src/plugins/combat/spells/Byte.js)) | Digital | 8 | A spell that uses INT to deal damage to an enemy and heal the caster. | 
single-channel RAM ([DownloadRAM 1](../src/plugins/combat/spells/DownloadRAM.js)) | Digital | 8 | A spell that increases the caster's STR, DEX and AGI and decreases the caster's INT. | 
dual-channel RAM ([DownloadRAM 2](../src/plugins/combat/spells/DownloadRAM.js)) | Digital | 16 | A spell that increases the caster's STR, DEX and AGI and decreases the caster's INT. | 
megabit ([Bit 3](../src/plugins/combat/spells/Bit.js)) | Digital | 16 | A spell that uses INT to deal damage. | 
megabyte ([Byte 3](../src/plugins/combat/spells/Byte.js)) | Digital | 16 | A spell that uses INT to deal damage to an enemy and heal the caster. | 
DoS ([DoS 1](../src/plugins/combat/spells/DoS.js)) | Digital | 32 | A spell that causes an enemy to drop packets on some rounds, ending their turn. | 
gigabit ([Bit 4](../src/plugins/combat/spells/Bit.js)) | Digital | 32 | A spell that uses INT to deal damage. | 
gigabyte ([Byte 4](../src/plugins/combat/spells/Byte.js)) | Digital | 32 | A spell that uses INT to deal damage to an enemy and heal the caster. | 
triple-channel RAM ([DownloadRAM 3](../src/plugins/combat/spells/DownloadRAM.js)) | Digital | 32 | A spell that increases the caster's STR, DEX and AGI and decreases the caster's INT. | 
zero-day threat ([ZeroDay 1](../src/plugins/combat/spells/ZeroDay.js)) | Digital | 32 | A spell that increases the damage that an enemy takes. | 
DDoS ([DoS 2](../src/plugins/combat/spells/DoS.js)) | Digital | 64 | A spell that causes an enemy to drop packets on some rounds, ending their turn. | 
quad-channel RAM ([DownloadRAM 4](../src/plugins/combat/spells/DownloadRAM.js)) | Digital | 64 | A spell that increases the caster's STR, DEX and AGI and decreases the caster's INT. | 
terabit ([Bit 5](../src/plugins/combat/spells/Bit.js)) | Digital | 64 | A spell that uses INT to deal damage. | 
terabyte ([Byte 5](../src/plugins/combat/spells/Byte.js)) | Digital | 64 | A spell that uses INT to deal damage to an enemy and heal the caster. | 
zero-day attack ([ZeroDay 2](../src/plugins/combat/spells/ZeroDay.js)) | Digital | 64 | A spell that increases the damage that an enemy takes. | 
persistent DDoS ([DoS 3](../src/plugins/combat/spells/DoS.js)) | Digital | 128 | A spell that causes an enemy to drop packets on some rounds, ending their turn. | Gauntlet
petabit ([Bit 6](../src/plugins/combat/spells/Bit.js)) | Digital | 128 | A spell that uses INT to deal damage. | Steel Flower
petabyte ([Byte 6](../src/plugins/combat/spells/Byte.js)) | Digital | 128 | A spell that uses INT to deal damage to an enemy and heal the caster. | Giant Sized Flask
zero-day assault ([ZeroDay 3](../src/plugins/combat/spells/ZeroDay.js)) | Digital | 128 | A spell that increases the damage that an enemy takes. | Vial of Liquid Fate


## Cleric

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 
cure ([Cure 1](../src/plugins/combat/spells/Cure.js)) | Heal | 1 | A spell that heals an ally. | 
holy bolt ([HolyBolt 1](../src/plugins/combat/spells/HolyBolt.js)) | Holy | 1 | A spell that uses INT to deal damage. | 
boar strength ([ClericStrength 1](../src/plugins/combat/spells/ClericStrength.js)) | Buff | 15 | A buff that increases an ally's STR | 
divine bolt ([HolyBolt 2](../src/plugins/combat/spells/HolyBolt.js)) | Holy | 25 | A spell that uses INT to deal damage. | 
heal ([Cure 2](../src/plugins/combat/spells/Cure.js)) | Heal | 25 | A spell that heals an ally. | 
revive ([Revive 1](../src/plugins/combat/spells/Revive.js)) | Heal | 25 | A spell that revives a dead ally. | 
cure group ([CureGroup 1](../src/plugins/combat/spells/CureGroup.js)) | Heal | 30 | A spell that heals all allies. | 
demon strength ([ClericStrength 2](../src/plugins/combat/spells/ClericStrength.js)) | Buff | 30 | A buff that increases an ally's STR | 
celestial bolt ([HolyBolt 3](../src/plugins/combat/spells/HolyBolt.js)) | Holy | 55 | A spell that uses INT to deal damage. | 
heal group ([CureGroup 2](../src/plugins/combat/spells/CureGroup.js)) | Heal | 55 | A spell that heals all allies. | 
dragon strength ([ClericStrength 3](../src/plugins/combat/spells/ClericStrength.js)) | Buff | 60 | A buff that increases an ally's STR | 
restore ([Cure 3](../src/plugins/combat/spells/Cure.js)) | Heal | 65 | A spell that heals an ally. | 
resurrect ([Revive 2](../src/plugins/combat/spells/Revive.js)) | Heal | 65 | A spell that revives a dead ally. | 
tranquility ([Tranquility 1](../src/plugins/combat/spells/Tranquility.js)) | Buff | 75 | A buff that massively reduces damage taken by all targets for two turns. | 
restore group ([CureGroup 3](../src/plugins/combat/spells/CureGroup.js)) | Heal | 95 | A spell that heals all allies. | 
titan strength ([ClericStrength 4](../src/plugins/combat/spells/ClericStrength.js)) | Buff | 95 | A buff that increases an ally's STR | 
revitalize ([Cure 4](../src/plugins/combat/spells/Cure.js)) | Heal | 115 | A spell that heals an ally. | Strand of Fate
revitalize group ([CureGroup 4](../src/plugins/combat/spells/CureGroup.js)) | Heal | 145 | A spell that heals all allies. | Gauntlet


## Clockborg

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 


## Druid

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 


## Fencer

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 


## Fighter

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 
double strike ([MultiStrike 1](../src/plugins/combat/spells/MultiStrike.js)) | Physical | 1 | An attack that hits multiple times. | 
blunt hit ([BluntHit 1](../src/plugins/combat/spells/BluntHit.js)) | Physical | 15 | An attack that stuns the target for one turn. | 
strike ([Attack 2](../src/plugins/combat/spells/Attack.js)) | Physical | 50 | A simple attack that uses STR to deal damage. | 
triple strike ([MultiStrike 2](../src/plugins/combat/spells/MultiStrike.js)) | Physical | 50 | An attack that hits multiple times. | 
assault ([Attack 3](../src/plugins/combat/spells/Attack.js)) | Physical | 100 | A simple attack that uses STR to deal damage. | Broken Katana


## Generalist

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 
sweeping generalization ([SweepingGeneralization 1](../src/plugins/combat/spells/SweepingGeneralization.js)) | Physical | 5 | A spell that uses STR and DEX to attack all enemies. | 
energy barrier ([EnergyWall 1](../src/plugins/combat/spells/EnergyWall.js)) | Buff | 15 | A buff that reduces damage taken by an ally. | 
fortify ([Fortify 1](../src/plugins/combat/spells/Fortify.js)) | Buff | 15 | A buff that increases STR, DEX and AGI of an ally. | 
treatment ([Treatment 1](../src/plugins/combat/spells/Treatment.js)) | Buff | 20 |  | 
energy barricade ([EnergyWall 2](../src/plugins/combat/spells/EnergyWall.js)) | Buff | 45 | A buff that reduces damage taken by an ally. | 
greater fortify ([Fortify 2](../src/plugins/combat/spells/Fortify.js)) | Buff | 45 | A buff that increases STR, DEX and AGI of an ally. | 
broad generalization ([SweepingGeneralization 2](../src/plugins/combat/spells/SweepingGeneralization.js)) | Physical | 50 | A spell that uses STR and DEX to attack all enemies. | 
greater treatment ([Treatment 2](../src/plugins/combat/spells/Treatment.js)) | Buff | 60 |  | 
ultimate fortify ([Fortify 3](../src/plugins/combat/spells/Fortify.js)) | Buff | 90 | A buff that increases STR, DEX and AGI of an ally. | 
energy wall ([EnergyWall 3](../src/plugins/combat/spells/EnergyWall.js)) | Buff | 95 | A buff that reduces damage taken by an ally. | 
ultimate treatment ([Treatment 3](../src/plugins/combat/spells/Treatment.js)) | Buff | 120 |  | Doctor's Floating Device
energy greatwall ([EnergyWall 4](../src/plugins/combat/spells/EnergyWall.js)) | Buff | 165 | A buff that reduces damage taken by an ally. | Jar of Magic Dust


## Jester

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 
strike ([Attack 2](../src/plugins/combat/spells/Attack.js)) | Physical | 90 | A simple attack that uses STR to deal damage. | 


## Mage

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 
energy missile ([EnergyMissile 1](../src/plugins/combat/spells/EnergyMissile.js)) | Energy | 1 | A spell that uses INT to deal damage. | 
energy shield ([EnergyShield 1](../src/plugins/combat/spells/EnergyShield.js)) | Buff | 5 | A buff that reduces damage taken by an ally. | 
frostbite ([Frostbite 1](../src/plugins/combat/spells/Frostbite.js)) | Ice | 15 | A spell that causes an enemy to be frostbitten on some turns. | 
magic intelligence ([MageIntelligence 1](../src/plugins/combat/spells/MageIntelligence.js)) | Buff | 15 | A buff that increases INT of an ally. | 
double fire ([MultiFire 1](../src/plugins/combat/spells/MultiFire.js)) | Fire | 25 | A spell that hits multiple times. | 
energy blast ([EnergyMissile 2](../src/plugins/combat/spells/EnergyMissile.js)) | Energy | 25 | A spell that uses INT to deal damage. | 
energy buckler ([EnergyShield 2](../src/plugins/combat/spells/EnergyShield.js)) | Buff | 25 | A buff that reduces damage taken by an ally. | 
magic brilliance ([MageIntelligence 2](../src/plugins/combat/spells/MageIntelligence.js)) | Buff | 30 | A buff that increases INT of an ally. | 
thunderstrike ([Thunderstrike 1](../src/plugins/combat/spells/Thunderstrike.js)) | Thunder | 35 | Summons a storm cloud that deals damage to an enemy after a number of rounds. | 
triple fire ([MultiFire 2](../src/plugins/combat/spells/MultiFire.js)) | Fire | 55 | A spell that hits multiple times. | 
arcane intelligence ([MageIntelligence 3](../src/plugins/combat/spells/MageIntelligence.js)) | Buff | 60 | A buff that increases INT of an ally. | 
astral flare ([EnergyMissile 3](../src/plugins/combat/spells/EnergyMissile.js)) | Energy | 65 | A spell that uses INT to deal damage. | 
cold snap ([Frostbite 2](../src/plugins/combat/spells/Frostbite.js)) | Ice | 65 | A spell that causes an enemy to be frostbitten on some turns. | 
energy towershield ([EnergyShield 3](../src/plugins/combat/spells/EnergyShield.js)) | Buff | 65 | A buff that reduces damage taken by an ally. | 
quadruple fire ([MultiFire 3](../src/plugins/combat/spells/MultiFire.js)) | Fire | 85 | A spell that hits multiple times. | 
thunderstorm ([Thunderstrike 2](../src/plugins/combat/spells/Thunderstrike.js)) | Thunder | 85 | Summons a storm cloud that deals damage to an enemy after a number of rounds. | 
arcane brilliance ([MageIntelligence 4](../src/plugins/combat/spells/MageIntelligence.js)) | Buff | 95 | A buff that increases INT of an ally. | 
energy omegashield ([EnergyShield 4](../src/plugins/combat/spells/EnergyShield.js)) | Buff | 125 | A buff that reduces damage taken by an ally. | Jar of Magic Dust
fire star ([MultiFire 4](../src/plugins/combat/spells/MultiFire.js)) | Fire | 185 | A spell that hits multiple times. | Bucket of Lava


## MagicalMonster

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 
double prod ([MultiStrike 1](../src/plugins/combat/spells/MultiStrike.js)) | Physical | 15 | An attack that hits multiple times. | Fighter's Manual
energy prod ([EnergyMissile 1](../src/plugins/combat/spells/EnergyMissile.js)) | Energy | 15 | A spell that uses INT to deal damage. | Mage's Tome
mini cure ([Cure 1](../src/plugins/combat/spells/Cure.js)) | Heal | 15 | A spell that heals an ally. | Cleric's Text
sweepo generalizo ([SweepingGeneralization 1](../src/plugins/combat/spells/SweepingGeneralization.js)) | Physical | 15 | A spell that uses STR and DEX to attack all enemies. | Generalist's Guidebook
Song of Hurt ([LitanyOfPain 1](../src/plugins/combat/spells/LitanyOfPain.js)) | Debuff | 25 | A debuff that deals damage to an enemy every turn. | Ancient Lute
second-old ([DayOldBread 1](../src/plugins/combat/spells/DayOldBread.js)) | Physical | 30 |  | Funny Fungus
colander ([Siphon 1](../src/plugins/combat/spells/Siphon.js)) | Debuff | 35 | A spell that uses INT to deal damage and heal the caster, with a debuff that decreases the target's STR, DEX, AGI, LUK, INT and CON. | Evil Pebble
venom layer ([VenomCoating 1](../src/plugins/combat/spells/VenomCoating.js)) | Buff | 35 | Applies Venom and Poison effects to an ally's weapon. | Feathered Cap


## Monster

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 


## Necromancer

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 
siphon ([Siphon 1](../src/plugins/combat/spells/Siphon.js)) | Debuff | 1 | A spell that uses INT to deal damage and heal the caster, with a debuff that decreases the target's STR, DEX, AGI, LUK, INT and CON. | 
drain ([Siphon 2](../src/plugins/combat/spells/Siphon.js)) | Debuff | 15 | A spell that uses INT to deal damage and heal the caster, with a debuff that decreases the target's STR, DEX, AGI, LUK, INT and CON. | 
poisontouch ([DebuffTouch 1](../src/plugins/combat/spells/DebuffTouch.js)) | Debuff | 15 | A debuff that may apply Poison, Prone and Venom effects. | 
summon ([Summon 1](../src/plugins/combat/spells/Summon.js)) | Physical | 25 |  | 
deteriorate ([Siphon 3](../src/plugins/combat/spells/Siphon.js)) | Debuff | 35 | A spell that uses INT to deal damage and heal the caster, with a debuff that decreases the target's STR, DEX, AGI, LUK, INT and CON. | 
stuntouch ([DebuffTouch 2](../src/plugins/combat/spells/DebuffTouch.js)) | Debuff | 35 | A debuff that may apply Poison, Prone and Venom effects. | 
venomtouch ([DebuffTouch 3](../src/plugins/combat/spells/DebuffTouch.js)) | Debuff | 55 | A debuff that may apply Poison, Prone and Venom effects. | 
wither ([Siphon 4](../src/plugins/combat/spells/Siphon.js)) | Debuff | 75 | A spell that uses INT to deal damage and heal the caster, with a debuff that decreases the target's STR, DEX, AGI, LUK, INT and CON. | 
bonecraft ([Bonecraft 1](../src/plugins/combat/spells/Bonecraft.js)) | Heal | 80 | A spell that reanimates a dead target to fight for the caster's party. | Necronomicon
deathtouch ([DebuffTouch 4](../src/plugins/combat/spells/DebuffTouch.js)) | Debuff | 85 | A debuff that may apply Poison, Prone and Venom effects. | Forbidden Cleric's Text


## Pirate

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 
bottle toss ([BottleToss 1](../src/plugins/combat/spells/BottleToss.js)) | Debuff | 1 | Throw a bottle at a target, dealing damage based on STR, CON, and # of Bottles. Has a chance of throwing multiple bottles. Requires and consumes 9 bottles each throw. Deals 1.5x damage if the Drunk personality is activated. | 
death glare ([DeathGlare 1](../src/plugins/combat/spells/DeathGlare.js)) | Debuff | 7 | Glares at a target, reducing STR of the entire enemy team. Lasts up to 4 turns and reduces up to 50 STR based on # of bottles. | 
pirate shanty ([PirateShanty 1](../src/plugins/combat/spells/PirateShanty.js)) | Buff | 25 | Sings an inspirational sea shanty with an ally, increasing STR and drunkenness. STR boost scales on # of Bottles. The "DrunkenStupor" effect is gained when drunknness reaches 100%. | 
drunken frenzy ([DrunkenFrenzy 1](../src/plugins/combat/spells/DrunkenFrenzy.js)) | Physical | 30 | Drunkenly ravages a random enemy, dealing 2x damage if the personality Drunk is activated. Reduces drunkenness by 10% and replenishes bottle count by 30-40. | 
grog dance ([GrogDance 1](../src/plugins/combat/spells/GrogDance.js)) | Physical | 37 | Dances like a pirate, increasing DEX and replenishing bottle count by 15-45. Also increases drunkenness by 25% | 
retch ([Retch 1](../src/plugins/combat/spells/Retch.js)) | Physical | 40 |  | 
strike ([Attack 2](../src/plugins/combat/spells/Attack.js)) | Physical | 75 | A simple attack that uses STR to deal damage. | 
vomit ([Retch 2](../src/plugins/combat/spells/Retch.js)) | Physical | 80 |  | 
explosive vomit ([Retch 3](../src/plugins/combat/spells/Retch.js)) | Physical | 120 |  | Unpleasant Glass of Water


## Rogue

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 
opening strike ([OpeningStrike 1](../src/plugins/combat/spells/OpeningStrike.js)) | Physical | 1 | An attack that uses STR and DEX to deal damage. | 
backstab ([Backstab 1](../src/plugins/combat/spells/Backstab.js)) | Physical | 8 | A combo attack that follows Opening Strike. | 
chain stab ([ChainStab 1](../src/plugins/combat/spells/ChainStab.js)) | Physical | 8 | A combo attack that follows Opening Strike, Backstab or Chain Stab. | 
fade away ([FadeAway 1](../src/plugins/combat/spells/FadeAway.js)) | Physical | 10 | Restores Stamina. | 
heartbleed ([Heartbleed 1](../src/plugins/combat/spells/Heartbleed.js)) | Physical | 15 | A combo attack that follows Chain Stab. Applies a debuff to the target that deals damage every turn. | 
strike ([Attack 2](../src/plugins/combat/spells/Attack.js)) | Physical | 25 | A simple attack that uses STR to deal damage. | 
wombo combo ([WomboCombo 1](../src/plugins/combat/spells/WomboCombo.js)) | Physical | 25 | A three-hit combo attack that follows Chain Stab or Heartbleed. | 
finishing blow ([FinishingBlow 1](../src/plugins/combat/spells/FinishingBlow.js)) | Physical | 38 | A combo attack that follows Wombo Combo, Savage Stab, or Heartbleed. | 
savage stab ([SavageStab 1](../src/plugins/combat/spells/SavageStab.js)) | Physical | 45 |  | 
shadowstep ([FadeAway 2](../src/plugins/combat/spells/FadeAway.js)) | Physical | 50 | Restores Stamina. | 
opening strike ([OpeningStrike 2](../src/plugins/combat/spells/OpeningStrike.js)) | Physical | 61 | An attack that uses STR and DEX to deal damage. | 
backstab ([Backstab 2](../src/plugins/combat/spells/Backstab.js)) | Physical | 68 | A combo attack that follows Opening Strike. | 
chain stab ([ChainStab 2](../src/plugins/combat/spells/ChainStab.js)) | Physical | 68 | A combo attack that follows Opening Strike, Backstab or Chain Stab. | 
heartbleed ([Heartbleed 2](../src/plugins/combat/spells/Heartbleed.js)) | Physical | 75 | A combo attack that follows Chain Stab. Applies a debuff to the target that deals damage every turn. | 
wombo combo ([WomboCombo 2](../src/plugins/combat/spells/WomboCombo.js)) | Physical | 85 | A three-hit combo attack that follows Chain Stab or Heartbleed. | 
vanish from sight ([FadeAway 3](../src/plugins/combat/spells/FadeAway.js)) | Physical | 90 | Restores Stamina. | 
finishing blow ([FinishingBlow 2](../src/plugins/combat/spells/FinishingBlow.js)) | Physical | 98 | A combo attack that follows Wombo Combo, Savage Stab, or Heartbleed. | 
savage stab ([SavageStab 2](../src/plugins/combat/spells/SavageStab.js)) | Physical | 105 |  | Thief's Locket


## SandwichArtist

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 
résumé ([Résumé 1](../src/plugins/combat/spells/Résumé.js)) | Physical | 1 |  | 
day-old ([DayOldBread 1](../src/plugins/combat/spells/DayOldBread.js)) | Physical | 5 |  | 
toasted ([ToastedSandwich 1](../src/plugins/combat/spells/ToastedSandwich.js)) | Fire | 10 |  | 
poisoned ([PoisonedSandwich 1](../src/plugins/combat/spells/PoisonedSandwich.js)) | Physical | 15 |  | 
feed ally ([FeedAlly 1](../src/plugins/combat/spells/FeedAlly.js)) | Physical | 20 |  | 
food fight ([FoodFight 1](../src/plugins/combat/spells/FoodFight.js)) | Physical | 20 |  | 
burnt ([ToastedSandwich 2](../src/plugins/combat/spells/ToastedSandwich.js)) | Fire | 40 |  | 
food melee ([FoodFight 2](../src/plugins/combat/spells/FoodFight.js)) | Physical | 50 |  | 
stuff ally ([FeedAlly 2](../src/plugins/combat/spells/FeedAlly.js)) | Physical | 50 |  | 
week-old ([DayOldBread 2](../src/plugins/combat/spells/DayOldBread.js)) | Physical | 50 |  | 
food brawl ([FoodFight 3](../src/plugins/combat/spells/FoodFight.js)) | Physical | 75 |  | 
well-done ([ToastedSandwich 3](../src/plugins/combat/spells/ToastedSandwich.js)) | Fire | 90 |  | 
month-old ([DayOldBread 3](../src/plugins/combat/spells/DayOldBread.js)) | Physical | 100 |  | Funny Fungus


## Trickster

Name | Element | Level | Description | Required Collectibles
---- | ------- | ----- | ----------- | ---------------------
attack ([Attack 1](../src/plugins/combat/spells/Attack.js)) | Physical | 1 | A simple attack that uses STR to deal damage. | 


