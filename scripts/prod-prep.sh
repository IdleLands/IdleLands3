#!/bin/bash

# change to root
#cd ..

# obviously we could also put our babel command in here, to create the dist subtree, thusly:
#babel -q --compact true --minified -d dist src

# but for now...
# put a temp file in there, for the /hello endpoint (so we know it's all working)
echo 'hello' dist/hello.txt

# delete the dist line from .gitignore, so git->heroku will auto pick up the dist dir
sed -i '.bak' '/dist/d' .gitignore

