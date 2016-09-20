#!/bin/bash

# put heroku dyno into maintenance mode (will return 503 errors)
heroku maintenance:on --app idlelands

# restart the dynos
heroku ps:restart --app idlelands

# wait 3 mins (150 secs wasn't quite long enough for all connections/sockets to drop)
sleep 180

# take heroku dyno out of maintenance mode
heroku maintenance:off --app idlelands
