@echo off
title Akvario Test
start cmd.exe /k node ./test/testServer.js
start cmd.exe /k node server.js -T
timeout 1
start cmd.exe /k node ./test/client/testClient.js
start cmd.exe /k node ./test/client/testClient.js
exit
