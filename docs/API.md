
# IdleLands API

To connect to IdleLands via the API, you must connect using a websocket connection using the Primus library. Currently it uses a standard websocket.


API Call | Arguments | Description
-------- | --------- | -----------
plugin:chat:toggleban | targetName | Mod only. Toggle banned status for a particular user. Generally only used to ban, as they get kicked immediately.
plugin:chat:togglemute | targetName | Mod only. Toggle muted status for a particular user.
plugin:chat:togglepardon | targetName | Mod only. Toggle pardoned status for a particular user.
plugin:chat:sendmessage | text, channel, route | Send a chat message.
plugin:combat:retrieve | battleName, playerName | Retrieve a battle from the database.
plugin:global:allmaps |  | Get all maps for the global page display. Cannot be logged in to execute this function.
plugin:global:pet | playerName | Get all pet information for the global page display. Cannot be logged in to execute this function.
plugin:global:allpets |  | Get all pets for the global page display. Cannot be logged in to execute this function.
plugin:global:player | playerName | Get all player information for the global page display. Cannot be logged in to execute this function.
plugin:global:allplayers |  | Get all players for the global page display. Cannot be logged in to execute this function.
plugin:gm:giveevent | targetName, targetEvent | Mod only. Give an event to a particular player.
plugin:gm:giveitem | targetName, targetItemString | Mod only. Give a custom item to a particular player.
plugin:gm:setlevel | targetName, targetLevel | Mod only. Set a players level.
plugin:gm:teleport | targetName, teleData | Mod only. Teleport a user to a location.
plugin:gm:toggleachievement | targetName, achievement | Mod only. Toggle a permanent achievement for the target.
plugin:gm:togglemod | targetName | Mod only. Toggle moderator status for the target.
plugin:pet:attr | newAttr | Change your pets attribute.
plugin:pet:buy | petType, petName | Buy a new pet.
plugin:pet:unequip | itemId | Unequip an item from your pets gear.
plugin:pet:feed | gold | Feed your pet gold.
plugin:pet:equip | itemId | Equip an item from your pets inventory.
plugin:pet:sell | itemId | Sell an item from your pets inventory.
plugin:pet:giveitem | itemId | Give your pet an item from your equipment.
plugin:pet:takeitem | itemId | Take an item from your pet and equip it.
plugin:pet:profession | newProfession | Change your pets profession.
plugin:pet:smart | setting | Toggle a smart pet setting.
plugin:pet:swap | petType | Swap to a different pet.
plugin:pet:takegold |  | Take your pets gold.
plugin:pet:upgrade | upgradeAttr | Upgrade a facet of your pet.
plugin:player:makechoice | id, response | Make a choice from the choice log.
plugin:player:exists | userId | Unauthenticated. Check if a particular player exists for auto-login purposes.
plugin:player:changegender | gender | Change your gender based on the existing gender list.
plugin:player:login | name, gender, professionName, token, userId | Log in or register a new character. Login only requires userId.
plugin:player:logout |  | Log out of the game.
plugin:player:changename | targetName, newName | Mod only. Change targets name to something else.
plugin:player:togglepersonality | personality | Turn a personality on or off.
plugin:player:imregisteringrightnowdontkillme |  | Send this to the server to not have your socket killed while registering.
plugin:player:request:achievements |  | Request achievement data. Generally used only when looking at achievements.
plugin:player:request:collectibles |  | Request collectible data. Generally used only when looking at collectibles.
plugin:player:request:equipment |  | Request equipment data. Generally used only when looking at equipment.
plugin:player:request:personalities |  | Request personality data. Generally used only when looking at personalities.
plugin:player:request:pets |  | Request pet data.
plugin:player:request:statistics |  | Request statistics data. Generally used only when looking at statistics.
plugin:player:changetitle | title | Change your title.
plugin:chat:toggleban | targetName | Mod only. Toggle banned status for a particular user. Generally only used to ban, as they get kicked immediately.
plugin:chat:togglemute | targetName | Mod only. Toggle muted status for a particular user.
plugin:chat:togglepardon | targetName | Mod only. Toggle pardoned status for a particular user.
plugin:chat:sendmessage | text, channel, route | Send a chat message.
plugin:combat:retrieve | battleName, playerName | Retrieve a battle from the database.
plugin:global:allmaps |  | Get all maps for the global page display. Cannot be logged in to execute this function.
plugin:global:pet | playerName | Get all pet information for the global page display. Cannot be logged in to execute this function.
plugin:global:allpets |  | Get all pets for the global page display. Cannot be logged in to execute this function.
plugin:global:player | playerName | Get all player information for the global page display. Cannot be logged in to execute this function.
plugin:global:allplayers |  | Get all players for the global page display. Cannot be logged in to execute this function.
plugin:gm:giveevent | targetName, targetEvent | Mod only. Give an event to a particular player.
plugin:gm:giveitem | targetName, targetItemString | Mod only. Give a custom item to a particular player.
plugin:gm:setlevel | targetName, targetLevel | Mod only. Set a players level.
plugin:gm:teleport | targetName, teleData | Mod only. Teleport a user to a location.
plugin:gm:toggleachievement | targetName, achievement | Mod only. Toggle a permanent achievement for the target.
plugin:gm:togglemod | targetName | Mod only. Toggle moderator status for the target.
plugin:pet:attr | newAttr | Change your pets attribute.
plugin:pet:buy | petType, petName | Buy a new pet.
plugin:pet:unequip | itemId | Unequip an item from your pets gear.
plugin:pet:feed | gold | Feed your pet gold.
plugin:pet:equip | itemId | Equip an item from your pets inventory.
plugin:pet:sell | itemId | Sell an item from your pets inventory.
plugin:pet:giveitem | itemId | Give your pet an item from your equipment.
plugin:pet:takeitem | itemId | Take an item from your pet and equip it.
plugin:pet:profession | newProfession | Change your pets profession.
plugin:pet:smart | setting | Toggle a smart pet setting.
plugin:pet:swap | petType | Swap to a different pet.
plugin:pet:takegold |  | Take your pets gold.
plugin:pet:upgrade | upgradeAttr | Upgrade a facet of your pet.
plugin:player:makechoice | id, response | Make a choice from the choice log.
plugin:player:exists | userId | Unauthenticated. Check if a particular player exists for auto-login purposes.
plugin:player:changegender | gender | Change your gender based on the existing gender list.
plugin:player:login | name, gender, professionName, token, userId | Log in or register a new character. Login only requires userId.
plugin:player:logout |  | Log out of the game.
plugin:player:changename | targetName, newName | Mod only. Change targets name to something else.
plugin:player:togglepersonality | personality | Turn a personality on or off.
plugin:player:imregisteringrightnowdontkillme |  | Send this to the server to not have your socket killed while registering.
plugin:player:request:achievements |  | Request achievement data. Generally used only when looking at achievements.
plugin:player:request:collectibles |  | Request collectible data. Generally used only when looking at collectibles.
plugin:player:request:equipment |  | Request equipment data. Generally used only when looking at equipment.
plugin:player:request:personalities |  | Request personality data. Generally used only when looking at personalities.
plugin:player:request:pets |  | Request pet data.
plugin:player:request:statistics |  | Request statistics data. Generally used only when looking at statistics.
plugin:player:changetitle | title | Change your title.
