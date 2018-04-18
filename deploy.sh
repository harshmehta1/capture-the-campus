#!/bin/bash

export PORT=5250
export MIX_ENV=prod
export GIT_PATH=/home/capturecampus/src/capture-the-campus

PWD=`pwd`
if [ $PWD != $GIT_PATH ]; then
	echo "Error: Must check out git repo to $GIT_PATH"
	echo "  Current directory is $PWD"
	exit 1
fi

if [ $USER != "capturecampus" ]; then
	echo "Error: must run as user 'capturecampus'"
	echo "  Current user is $USER"
	exit 2
fi

mix deps.get
(cd assets && npm install)
(cd assets && ./node_modules/brunch/bin/brunch b -p)
mix phx.digest
mix release --env=prod

mkdir -p ~/www
mkdir -p ~/old

NOW=`date +%s`
if [ -d ~/www/capture-the-campus ]; then
	echo mv ~/www/capture-the-campus ~/old/$NOW
	mv ~/www/capture-the-campus ~/old/$NOW
fi

mkdir -p ~/www/capture-the-campus
REL_TAR=~/src/capture-the-campus/_build/prod/rel/captureCampus/releases/0.0.1/captureCampus.tar.gz
(cd ~/www/capture-the-campus && tar xzvf $REL_TAR)

crontab - <<CRONTAB
@reboot bash /home/capturecampus/src/capture-the-campus/start.sh
CRONTAB

#. start.sh
