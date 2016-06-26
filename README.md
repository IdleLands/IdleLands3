# IdleLands [![Build Status](https://travis-ci.org/IdleLands/IdleLands.svg?branch=master)](https://travis-ci.org/IdleLands/IdleLands)
An idling game of epic proportions.

## Pre-requisites
* node 6.x
* git
* mongodb

## Install
* `git clone`
* `npm install`
* Create a `.env` file with the key `MONGODB_URI` set to a URI leading to a local or remote mongodb install

## Running
* `npm start` to start the server
* `npm run test:client -- --players <playercount>` to test with that many players.

## Contributing
* Make sure your code passes `npm run test` before making a PR.