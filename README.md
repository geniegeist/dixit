# Welcome to Dixit

This is an online game variant of Dixit. All you need is a browser and some friends to play with you.

![](https://i.imgur.com/L1Qmjqb.png)

**Demo:** [dixit-team42.herokuapp.com/:matchID/:numOfPlayers/:playerID](https://dixit-team42.herokuapp.com/hello-world/4/0)

To create a game type the following url into your browser

 `dixit-team42.herokuapp.com/hello-world/4/0`

This will create a game with match id `hello-world` for `4` players. You will enter the game as a player with id `0`.

To play with your friends, share the link
 `dixit-team42.herokuapp.com/hello-world/4/PLAYER_ID`
 with your friends where you replace `PLAYER_ID` with a number from 0 to 5. Each of your friends including you should receive a unique player id. 

## Implementation Details

This game was developed using [boardgame.io](boardgame.io), React and Typescript.

*To-Do: describe architecture, etc...*

## Building and Employment

Type `npm run start` to start the client.

Type `tsc src/server.ts --outDir server_build` to compile the Typescript code into Javascript and type `npm run serve` to start the server from the server_build directory.

## To-Do

 - ...

