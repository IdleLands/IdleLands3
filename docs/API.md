
# IdleLands API

To connect to IdleLands via the API, you must connect using a websocket connection using the Primus library. Currently it uses a standard websocket.


API Call | Arguments | Description
-------- | --------- | -----------
plugin:chat:toggleban | targetName | Mod only. Toggle banned status for a particular user. Generally only used to ban, as they get kicked immediately.
plugin:chat:togglemute | targetName | Mod only. Toggle muted status for a particular user.
plugin:chat:togglepardon | targetName | Mod only. Toggle pardoned status for a particular user.
plugin:chat:sendmessage | text, channel, route | Send a chat message.
plugin:combat:retrieve | battleName, playerName | Retrieve a battle from the database.
plugin:festival:cancel | festivalId | Mod only. Cancel a festival.
plugin:festival:create | targetFestivalString | Mod only. Create a festival.
plugin:gm:giveevent | targetName, targetEvent | Mod only. Give an event to a particular player.
plugin:gm:givegold | targetName, bonusGold | Mod only. Give gold to a particular player.
plugin:gm:giveilp | targetName, bonusIlp | Mod only. Give ILP to a particular player.
plugin:gm:giveitem | targetName, targetItemString | Mod only. Give a custom item to a particular player.
plugin:gm:setstat | targetName, targetStat, targetValue | Mod only. Set a stat for a particular player.
plugin:gm:setlevel | targetName, targetLevel | Mod only. Set a players level.
plugin:gm:teleport | targetName, teleData | Mod only. Teleport a user to a location.
plugin:gm:toggleachievement | targetName, achievement | Mod only. Toggle a permanent achievement for the target.
plugin:gm:togglemod | targetName | Mod only. Toggle moderator status for the target.
plugin:gm:updateassets |  | Mod only. Update the assets then reboot.
plugin:guild:building:build | buildingName, slot | Build a building in the guild.
plugin:guild:building:movebase | newBase | Move the guild to a new place.
plugin:guild:building:updateprop | buildingName, propName, propValue | Update a building property.
plugin:guild:building:upgrade | buildingName | Upgrade a building in the guild.
plugin:guild:create | name, tag | Create a new guild.
plugin:guild:demote | memberName | Demote a member to member status.
plugin:guild:disband |  | Disband your guild.
plugin:guild:donate | gold | Donate to your guild.
plugin:guild:invite:accept |  | Accept a guild invitation.
plugin:guild:invite:reject |  | Reject a guild invitation.
plugin:guild:invite | newMemberName | Invite a new member to your guild.
plugin:guild:kick | memberName | Kick someone from your guild.
plugin:guild:leave |  | Leave your guild.
plugin:guild:motd | motd | Update your guilds MOTD.
plugin:guild:player:tax | newRate | Update your personal tax rate.
plugin:guild:renameretag | name, tag | Rename/retag from your guild.
plugin:guild:promote | memberName | Promote a member to Mod status.
plugin:guild:tax | newRate | Update your guilds tax rate.
plugin:pet:attr | newAttr | Change your pets attribute.
plugin:pet:buy | petType, petName | Buy a new pet.
plugin:pet:pass | itemId, petId | Pass an item from your pets inventory to another pet.
plugin:pet:unequip | itemId | Unequip an item from your pets gear.
plugin:pet:feed | gold | Feed your pet gold.
plugin:pet:feedmax |  | Feed your pet maximum gold.
plugin:pet:equip | itemId | Equip an item from your pets inventory.
plugin:pet:salvage | itemId | Salvage an item from your pets inventory.
plugin:pet:salvageall |  | Salvage all items from your pets inventory.
plugin:pet:sell | itemId | Sell an item from your pets inventory.
plugin:pet:sellall |  | Sell all items from your pets inventory.
plugin:pet:giveitem | itemId | Give your pet an item from your equipment.
plugin:pet:takeitem | itemId | Take an item from your pet and equip it.
plugin:pet:rename | petId, newName | Rename your pet. Requires 1 Rename Tag: Pet.
plugin:pet:profession | newProfession | Change your pets profession.
plugin:pet:smart | setting | Toggle a smart pet setting.
plugin:pet:swap | petType | Swap to a different pet.
plugin:pet:takegold |  | Take your pets gold.
plugin:pet:upgrade | upgradeAttr | Upgrade a facet of your pet.
plugin:player:ascend |  | Ascend.
plugin:player:buyshopitem | itemId | Buy an item from the shop.
plugin:player:makechoice | id, response | Make a choice from the choice log.
plugin:player:exists | userId | Unauthenticated. Check if a particular player exists for auto-login purposes.
plugin:player:changegender | gender | Change your gender based on the existing gender list.
plugin:player:login | name, gender, professionName, token, userId | Log in or register a new character. Login only requires userId.
plugin:player:logout |  | Log out of the game.
plugin:player:changename | targetName, newName | Mod only. Change targets name to something else.
plugin:player:partyleave |  | Leave your current party.
plugin:player:togglepersonality | personality | Turn a personality on or off.
plugin:player:imregisteringrightnowdontkillme |  | Send this to the server to not have your socket killed while registering.
plugin:player:request:achievements |  | Request achievement data. Generally used only when looking at achievements.
plugin:player:request:bosstimers |  | Request bosstimer data. Generally used only when looking at maps.
plugin:player:request:collectibles |  | Request collectible data. Generally used only when looking at collectibles.
plugin:player:request:equipment |  | Request equipment data. Generally used only when looking at equipment.
plugin:player:request:guild |  | Request guild data.
plugin:player:request:guildbuildings |  | Request guild buildings data.
plugin:player:request:party |  | Request party data. Generally used only when looking at overview.
plugin:player:request:personalities |  | Request personality data. Generally used only when looking at personalities.
plugin:player:request:pets |  | Request pet data.
plugin:player:request:shop |  | Request shop data. Generally used only when looking at shop data.
plugin:player:request:statistics |  | Request statistics data. Generally used only when looking at statistics.
plugin:player:changetitle | title | Change your title.
plugin:premium:buyilp | ilpBuy | Buy ILP with gold.
plugin:premium:buyilpitem | item | Buy items with ILP.
