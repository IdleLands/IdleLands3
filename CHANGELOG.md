# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.0"></a>
# [1.0.0](https://github.com/IdleLands/IdleLands/compare/v0.11.1...v1.0.0) (2017-07-22)



<a name="0.11.1"></a>
## [0.11.1](https://github.com/IdleLands/IdleLands/compare/0.12.0...0.11.1) (2017-07-22)



<a name="0.11.0"></a>
# [0.11.0](https://github.com/IdleLands/IdleLands/compare/v0.10.2...v0.11.0) (2017-03-25)


### Bug Fixes

* **achievement:** Jailbird and Impossible now let you draw upon prior ascensions to keep the titles ([e680533](https://github.com/IdleLands/IdleLands/commit/e680533)), closes [#624](https://github.com/IdleLands/IdleLands/issues/624)
* **battle:** damageReductionPercent should be better now(?) ([ffd317e](https://github.com/IdleLands/IdleLands/commit/ffd317e)), closes [#635](https://github.com/IdleLands/IdleLands/issues/635)
* **collectibles:** hadCollectible should no longer break ([9390282](https://github.com/IdleLands/IdleLands/commit/9390282))
* **combat:** floor damage so it doesnt get decimals ([7151d2d](https://github.com/IdleLands/IdleLands/commit/7151d2d)), closes [#641](https://github.com/IdleLands/IdleLands/issues/641)
* **db:** add db indexes for everything ([4acc34e](https://github.com/IdleLands/IdleLands/commit/4acc34e)), closes [#630](https://github.com/IdleLands/IdleLands/issues/630)
* **guild:** cannot invite people to guilds if they are in one and on a different server ([ae86108](https://github.com/IdleLands/IdleLands/commit/ae86108))
* **guild:** cross-server guild invites should work again for real ([9f7ae8d](https://github.com/IdleLands/IdleLands/commit/9f7ae8d))
* **guild:** cross-server invite should work now ([e26db78](https://github.com/IdleLands/IdleLands/commit/e26db78)), closes [#634](https://github.com/IdleLands/IdleLands/issues/634)
* **guild:** donating will no longer crash the game ([6e78797](https://github.com/IdleLands/IdleLands/commit/6e78797))
* **guild:** guild chat joining should not crash server ([84a2e9a](https://github.com/IdleLands/IdleLands/commit/84a2e9a))
* **guild:** guilds will now work properly with regards to event text ([4580e58](https://github.com/IdleLands/IdleLands/commit/4580e58))
* **guild:** inviting cross-server and locally can break one or the other ([4641304](https://github.com/IdleLands/IdleLands/commit/4641304))
* **guild:** max self tax is now 100. will math itself to make it work ([7e607f9](https://github.com/IdleLands/IdleLands/commit/7e607f9)), closes [#632](https://github.com/IdleLands/IdleLands/issues/632)
* **guild:** no more inviting people who already have a guild ([94238a5](https://github.com/IdleLands/IdleLands/commit/94238a5))
* **guild:** salvage will now properly give guild resources from every salvage source ([c805eb4](https://github.com/IdleLands/IdleLands/commit/c805eb4))
* **guild:** some updates will notify all players ([3b3b87f](https://github.com/IdleLands/IdleLands/commit/3b3b87f)), closes [#637](https://github.com/IdleLands/IdleLands/issues/637)
* **guilds:** do not propagate some received events to prevent infinite loops ([954b4b4](https://github.com/IdleLands/IdleLands/commit/954b4b4))
* **personality:** add numbers to TH desc ([e488b7d](https://github.com/IdleLands/IdleLands/commit/e488b7d))
* **personality:** FeelingLucky fix ([e21dcbd](https://github.com/IdleLands/IdleLands/commit/e21dcbd))
* **personality:** greedy and seeker show % now ([60a8a23](https://github.com/IdleLands/IdleLands/commit/60a8a23)), closes [#631](https://github.com/IdleLands/IdleLands/issues/631)
* **pet:** attempt to fix feed max ([45208ae](https://github.com/IdleLands/IdleLands/commit/45208ae)), closes [#620](https://github.com/IdleLands/IdleLands/issues/620)
* **pet:** pet can only gain xp to the owners level max ([42bcb68](https://github.com/IdleLands/IdleLands/commit/42bcb68))
* **pet:** pets that cannot salvage will not be able to ([cbb11bb](https://github.com/IdleLands/IdleLands/commit/cbb11bb)), closes [#642](https://github.com/IdleLands/IdleLands/issues/642)
* **pet:** salvage no longer double-counts materials ([511793c](https://github.com/IdleLands/IdleLands/commit/511793c))
* **pet:** selling all shows nan but gives gold ([ac6b496](https://github.com/IdleLands/IdleLands/commit/ac6b496))


### Features

* **achievement:** new achievement for maxing all the ghostly pets ([60a61eb](https://github.com/IdleLands/IdleLands/commit/60a61eb)), closes [#638](https://github.com/IdleLands/IdleLands/issues/638)
* **achievement:** new achievement for maxing all the ghostly pets ([4d64f7a](https://github.com/IdleLands/IdleLands/commit/4d64f7a)), closes [#638](https://github.com/IdleLands/IdleLands/issues/638)
* **guild:** guild bases ([05db6c8](https://github.com/IdleLands/IdleLands/commit/05db6c8)), closes [#628](https://github.com/IdleLands/IdleLands/issues/628)
* **guild:** items can now be salvaged, there are some pets that can salvage (Dolphin, Parrot) and their salvage rates are slightly inferior to a new pet (Goat). There is also a new personality that will automatically salvage items. ([f01827c](https://github.com/IdleLands/IdleLands/commit/f01827c))
* **irc:** show guild and ascension level in bridge messages ([4639227](https://github.com/IdleLands/IdleLands/commit/4639227)), closes [#640](https://github.com/IdleLands/IdleLands/issues/640)
* **personality:** add Gullible personality ([2b7120f](https://github.com/IdleLands/IdleLands/commit/2b7120f))



<a name="0.10.2"></a>
## [0.10.2](https://github.com/IdleLands/IdleLands/compare/v0.10.1...v0.10.2) (2017-03-20)

<a name="0.10.1"></a>
## [0.10.1](https://github.com/IdleLands/IdleLands/compare/0.10.0...v0.10.1) (2017-03-20)


### Bug Fixes

* **changelog:** changelog should update with every commit now ([a75336c](https://github.com/IdleLands/IdleLands/commit/a75336c))
* **collectibles:** always update collectibles when finding a new one ([404e182](https://github.com/IdleLands/IdleLands/commit/404e182)), closes [#610](https://github.com/IdleLands/IdleLands/issues/610)
* **collectibles:** collectible name will actually be set now ([3716f2b](https://github.com/IdleLands/IdleLands/commit/3716f2b))
* **collectibles:** show the name when getting a new one ([8210ebf](https://github.com/IdleLands/IdleLands/commit/8210ebf))
* **combat:** attempt to fix necro bonecraft screwing with players ([9fb3ff2](https://github.com/IdleLands/IdleLands/commit/9fb3ff2))
* **combat:** can no longer battle yourself ([4911573](https://github.com/IdleLands/IdleLands/commit/4911573)), closes [#612](https://github.com/IdleLands/IdleLands/issues/612)
* **combat:** show results at top of combat log ([d61b34f](https://github.com/IdleLands/IdleLands/commit/d61b34f)), closes [#625](https://github.com/IdleLands/IdleLands/issues/625)
* **equipment:** recalculate stats when equipping items and update the player ([f17f75a](https://github.com/IdleLands/IdleLands/commit/f17f75a))
* **extchat:** attempt to parse messages better to show discord users ([2369a63](https://github.com/IdleLands/IdleLands/commit/2369a63)), closes [#614](https://github.com/IdleLands/IdleLands/issues/614)
* **finditem:** calling people a cheater a lot ([4070d4f](https://github.com/IdleLands/IdleLands/commit/4070d4f))
* **gold:** forsakegold no longer eats all of your gold ([62defbc](https://github.com/IdleLands/IdleLands/commit/62defbc))
* **gold:** you can no longer lose more gold than you have, and forsakegold is less penalizing ([15bf42b](https://github.com/IdleLands/IdleLands/commit/15bf42b))
* **mlab:** battles now expire after 30 minutes instead of 6 hours ([acdc563](https://github.com/IdleLands/IdleLands/commit/acdc563))
* **movement:** fix a weird case where movement would sometimes not generate valid weights ([255787f](https://github.com/IdleLands/IdleLands/commit/255787f))
* **party:** allow you to forcibly request your party via frontend, making it visible to semi-login [refreshes] ([4fd5224](https://github.com/IdleLands/IdleLands/commit/4fd5224))
* **shops:** buying an item will now make a choice ([e10c974](https://github.com/IdleLands/IdleLands/commit/e10c974))
* **shops:** increment some stats when buying items ([a7faa74](https://github.com/IdleLands/IdleLands/commit/a7faa74))
* **shops:** should no longer allow you to buy too powerful items ([ed365dd](https://github.com/IdleLands/IdleLands/commit/ed365dd)), closes [#619](https://github.com/IdleLands/IdleLands/issues/619)
* **statistics:** move combat/combatsolo under the combat root ([fe77254](https://github.com/IdleLands/IdleLands/commit/fe77254)), closes [#589](https://github.com/IdleLands/IdleLands/issues/589)


### Features

* **achievements:** added achievements for affirmer, denier, indecisive ([5accfce](https://github.com/IdleLands/IdleLands/commit/5accfce)), closes [#605](https://github.com/IdleLands/IdleLands/issues/605)
* **achievements:** new jailbird title ([d886418](https://github.com/IdleLands/IdleLands/commit/d886418))
* **achievements:** new wolfmaster title ([33fd8c7](https://github.com/IdleLands/IdleLands/commit/33fd8c7)), closes [#578](https://github.com/IdleLands/IdleLands/issues/578)
* **bosses:** boss timers are now able to be emitted to the client ([03b7ec6](https://github.com/IdleLands/IdleLands/commit/03b7ec6)), closes [#611](https://github.com/IdleLands/IdleLands/issues/611)
* **chests:** you see when you visited a chest in the event log now. ([797fe3e](https://github.com/IdleLands/IdleLands/commit/797fe3e)), closes [#606](https://github.com/IdleLands/IdleLands/issues/606)
* **collectibles:** collectible rarity is now automatically determined ([1466c87](https://github.com/IdleLands/IdleLands/commit/1466c87)), closes [#483](https://github.com/IdleLands/IdleLands/issues/483)
* **combat:** Mages will now prioritize themselves when using Arcane Intelligence ([c98d518](https://github.com/IdleLands/IdleLands/commit/c98d518))
* **combat:** Mages will now prioritize themselves when using Arcane Intelligence ([08aff06](https://github.com/IdleLands/IdleLands/commit/08aff06))
* **finditem:** finding an item will now allow you to also give it to your pet ([438bd3a](https://github.com/IdleLands/IdleLands/commit/438bd3a))
* **forsake:** xp and gold forsake will no longer take positive modifiers when calculating gold/xp lost, meaning no more bloated % from +200% xp festivals ([24e07ce](https://github.com/IdleLands/IdleLands/commit/24e07ce)), closes [#607](https://github.com/IdleLands/IdleLands/issues/607)
* **guilds:** guilds ([8fa3220](https://github.com/IdleLands/IdleLands/commit/8fa3220)), closes [#35](https://github.com/IdleLands/IdleLands/issues/35)
* **newbies:** newbie equipment will never have a negative base score ([0bfb292](https://github.com/IdleLands/IdleLands/commit/0bfb292)), closes [#608](https://github.com/IdleLands/IdleLands/issues/608)
* **pet:** you can now rename pets with a premium item ([5cc3527](https://github.com/IdleLands/IdleLands/commit/5cc3527))
* **pets:** can now send items to other pets ([81d8a84](https://github.com/IdleLands/IdleLands/commit/81d8a84)), closes [#596](https://github.com/IdleLands/IdleLands/issues/596)
* **premium:** added new ILP purchases for teleport locations ([81004b7](https://github.com/IdleLands/IdleLands/commit/81004b7))
* **premium:** added the astral control room ([13dd7bc](https://github.com/IdleLands/IdleLands/commit/13dd7bc))
* **premium:** you can now buy consumable premium items (currently only a pet rename tag is available) ([2b5e404](https://github.com/IdleLands/IdleLands/commit/2b5e404))
* **shops:** shops now show up in certain regions ([5902615](https://github.com/IdleLands/IdleLands/commit/5902615)), closes [#33](https://github.com/IdleLands/IdleLands/issues/33)



<a name="0.9.0"></a>
# 0.9.0 (2017-03-08)
