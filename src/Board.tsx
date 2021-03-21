import styled from 'styled-components';
import { DixitGame, Ctx } from './game/game';
import BG from './assets/ui/board-background.jpg';
import Phase00Lobby from './board/Phase00Lobby';
import Phase01StorytellerChoose from './board/Phase01StorytellerChoose';
import Phase02OtherChoose from './board/Phase02OtherChoose';
import Phase03Vote from './board/Phase03Vote';
import Phase04Result from './board/Phase04Result';
import BottomNavigation from './board/BottomNavigation';

interface Props {
    G: DixitGame;
    ctx: Ctx;
    playerID: string;
    moves: any;
}

export const Board = (props: Props) => {
    const me = props.G.players[parseInt(props.playerID)];
    const isStoryteller = props.ctx.currentPlayer === me.id;


    return (
        <Wrapper>
            <CenterWrapper>
                {props.G.phase === 0 &&
                    <Phase00Lobby
                        name={props.G.players[parseInt(props.playerID)].name}
                        changeName={(name: string) => {
                            props.moves.ChangeName(name);
                        }}
                        ready={() => props.moves.Ready()}
                        isReady={props.ctx.activePlayers![props.playerID] === undefined}
                    />
                }
                {props.G.phase === 1 &&
                    <Phase01StorytellerChoose
                        handCards={me.hand}
                        storyteller={props.G.players[parseInt(props.ctx.currentPlayer)]}
                        isStoryteller={isStoryteller}
                        onChooseCard={(cardId) => {
                            if (isStoryteller) {
                                props.moves.Choose(cardId);
                            }
                        }}
                    />
                }
                {props.G.phase === 2 &&
                    <Phase02OtherChoose
                        isStoryteller={isStoryteller}
                        players={props.G.players}
                        playerId={props.playerID}
                        onSelectCard={(card) => {
                            props.moves.Choose(card.id);
                        }}
                    />
                }
                {props.G.phase === 3 &&
                    <Phase03Vote
                        storytellerName={props.G.players[parseInt(props.ctx.currentPlayer)].name}
                        isStoryteller={isStoryteller}
                        playerState={props.G.players.map(pl => {
                            return {
                                name: pl.name, didVote: (props.G.voting.findIndex(v => v.playerId === pl.id) > -1) || pl.id === props.ctx.currentPlayer, id: pl.id
                            };
                        })}
                        candidates={props.G.candidates.map(candidate => ({
                            card: props.G.deck[parseInt(candidate.cardId)],
                            isMine: candidate.owner === props.playerID
                        }))}
                        vote={cardId => {
                            props.moves.Vote(cardId);
                        }}
                        didVote={props.G.voting.find(vote => vote.playerId === props.playerID)?.cardId}
                    />
                }
                {props.G.phase === 4 &&
                    <Phase04Result
                        candidates={props.G.candidates.map(candidate => ({
                            card: props.G.deck[parseInt(candidate.cardId)],
                            owner: props.G.players[parseInt(candidate.owner)],
                            votedBy: props.G.voting.filter(v => v.cardId === candidate.cardId).map(v => props.G.players[parseInt(v.playerId)])
                        }))}
                        score={props.G.score}
                        oldScore={props.G.oldScore}
                        onContinue={() => props.moves.Continue()}
                        didContinue={props.ctx.activePlayers![props.playerID] === undefined}
                    />
                }
                {props.G.phase === 10 &&
                    <h1>Ende</h1>
                }
                <Bottom>
                    <BottomNavigation players={props.G.score.map((score, playerIdx) => {
                        return {
                            id: `${playerIdx}`,
                            name: props.G.players[playerIdx].name,
                            score
                        };
                    })} storyteller={props.ctx.currentPlayer} />
                </Bottom>
            </CenterWrapper>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 100%;
    height: 100vh;
    background-color: black;
    display: flex;
    justify-content: center;
`;

const CenterWrapper = styled.div`
    position: relative;
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 1024px;
    height: 100%;
    background-image: url(${BG});
`;

const Bottom = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    height: 110px;
`;