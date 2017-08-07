#!/bin/bash
lsof -Pn | grep ':3000' | awk '{print $2}' | xargs kill -9
#lsof -Pn | grep ':5000' | awk '{print $2}' | xargs kill -9

redis-server &
cd ./oj-server
#npm install
nodemon server.js &
#cd ../oj-client
#npm install
#ng build --watch &
cd ../executor
#pip install -r requirements.txt
#python executor_server.py 5000 &
#python executor_server.py 5001 &
#python executor_server.py 5002 &

echo "=================================================="
read -p "PRESS [ENTER] TO TERMINATE PROCESSES." PRESSKEY

lsof -Pn | grep ':3000' | awk '{print $2}' | xargs kill -9
#lsof -Pn | grep ':5000' | awk '{print $2}' | xargs kill -9
redis-cli shutdown