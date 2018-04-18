#!/bin/bash

export PORT=5250

cd ~/www/capture-the-campus
./bin/captureCampus stop || true
./bin/captureCampus start
