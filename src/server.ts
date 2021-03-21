// src/server.js
import * as path from 'path';
const serve = require('koa-static');
const { Server } = require('boardgame.io/server');
import { Dixit } from './game/game';


const server = Server({ games: [Dixit] });
const PORT = process.env.PORT == null ? 8000 : parseInt(process.env.PORT);

const frontEndAppBuildPath = path.resolve(__dirname, '../build');
server.app.use(serve(frontEndAppBuildPath))

const lobbyConfig = {
  apiPort: 8080,
  apiCallback: () => console.log('Running Lobby API on port 8080...'),
};

server.run({port: PORT, lobbyConfig}, () => {
  server.app.use(
    async (ctx: any, next: any) => await serve(frontEndAppBuildPath)(
      Object.assign(ctx, { path: 'index.html' }),
      next
    )
  )
});