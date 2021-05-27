[//]: # (FOR BETTER FORMATTING VISIT https://github.com/Akvariet/P2)

# P2 project - Akvario chat

This is the P2 project of group B2-18. The project started on February 1st and ended on 27/5.

The topic of the project was "En ny corona-hverdag" (Everyday life with corona) and was about using software to aid us through the pandemic.

## Our Goals
- Make online social events possible by having the chat environment emulate the physical aspects of real life.
- Connect people in larger groups and enable people to mingle online.

## Configuration
- To configure the client modify **production** in */public/js/clientConfig.js* 
- To configure the server modify */scripts/serverConfig.js*

## Running the program
To run the program, Node.js and node package manager(npm) are required. To download Node.js and npm go to [Nodejs's](https://nodejs.org/en/download/) website. 

You can then use the script called *start.bat* if you are on a windows machine. Just click it and it will run.

**If you are using Linux or MacOS, follow this.**
- Open a terminal.
- Before starting the program, first type `npm i` to install all dependencies.
- Then type `npm run start` to start the server. 
- After that the website can be accessed from *http://localhost:3200*

### Testing the program
If you are on a windows machine just click *startTest.bat* found in the root folder. It will open 5 terminals, which you can just close afterwards.

If there is no output on the *testServer.js* terminal window, the test was successful, and you can just close the terminals.

**If you are using Linux or MacOS, follow this.**
- Open 4 terminals.
- Type `node ./test/testServer.js`
- Then in the second terminal `node ./server.js`
- In the third and fourth terminal `node ./test/client/testClient.js`
