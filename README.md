# IdleLands [![Build Status](https://travis-ci.org/IdleLands/IdleLands.svg?branch=master)](https://travis-ci.org/IdleLands/IdleLands) [![bitHound Overall Score](https://www.bithound.io/github/IdleLands/IdleLands/badges/score.svg)](https://www.bithound.io/github/IdleLands/IdleLands)
An idling game of epic proportions.

## Pre-requisites
* node 6.x
* git
* mongodb
* redis (if you want to test multi-server capabilities)

## Install
* `git clone`
* `npm install`
* Create an `.env` file in the repo root with the key `MONGODB_URI` set to a URI leading to a local or remote mongodb install (eg: `MONGODB_URI=mongodb://localhost:27017/play` and if you're using redis, `REDIS_URL` should be set to where your Redis is setup (eg: `REDIS_URL=redis://localhost:6379`))

## Running
* `npm run start:dev` to start the server
* `npm run test:client -- --players <playercount>` to test with that many players (up to ~1200)

## Making Yourself A Mod
* `mongo`
* `db.players.update({ name: "Your Character Name" }, { $set: { isMod: true } })`

## Possible Errors
* Errors `TypeError: Parameter "url" must be a string, not undefined` or `ReferenceError: (something about a missing proxy)` typically means you have an old version of node (`node --version` to check)
* If `npm run test` (before you PR!) doesn't work, you haven't run `npm install`
* Any other errors or problems, feel free to just ask us in either the game chat or irc channel (*##idlebot* on *irc.freenode.net*). We're a pretty friendly bunch and more than happy to help get you started.

## Tips
* `fork` this repo, then `clone` to your local machine. PRs from your local repo 
* `--silent` is useful to stop "npm err!"s from filling up your screen
* `node --inspect=9222 whatever.js` (e.g. in your `package.json`) gives you a Chrome url so you can debug/profile/etc to your heart's content. Adding the line `debugger;` will break at that point in the js code

## Other IdleLands Repositories
* [Play](https://github.com/IdleLands/Play/) The front end code (angular2, phaser.io, bootstrap)  
* [Global](https://github.com/IdleLands/Global/) The global player information site (angular2, phaser.io, bootstrap)
* [Maps](https://github.com/IdleLands/Maps/) Maps (json+png tilemap. Plus npcs, features etc on the maps)  
* [Custom-Assets](https://github.com/IdleLands/Custom-Assets/) The strings for the game (monsters, vegetables, conversation etc)  

## Contributing
* Make sure your code passes `npm run test` before making a PR. 
* **Any help is help. No matter how small you might think it is, it's ALL very welcome! Thank you!**
