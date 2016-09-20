#!/bin/bash

npm install --save babel-cli

# obviously we could also put our babel command in here, to create the dist subtree, thusly:
babel -q --compact true --minified -d /app/dist /app/src

# put a temp file in there, for the /hello endpoint (so we know it's all working)
# cp /app/test.js /app/dist/
