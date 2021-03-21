import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { useParams } from 'react-router-dom';
import { Board } from './Board';
import { Dixit } from './game/game';

export const DixitClient = ({ debug }) => {
    const { numPlayers, playerID, matchID } = useParams();

    if (debug === true) {
        const SHClient = Client({
            game: Dixit,
            board: Board,
            numPlayers: 5
        });
    
        return <SHClient matchID={"hallowelt"} playerID={"0"} />
    }

    const DixitClient = Client({
        game: Dixit,
        board: Board,
        multiplayer: SocketIO({ server: `https://${window.location.hostname}` }),
        numPlayers: parseInt(numPlayers),
        //multiplayer: SocketIO({ server: `localhost:8000` }),
    });
    
    return <DixitClient matchID={matchID} playerID={playerID} />
}