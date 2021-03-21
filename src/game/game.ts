import type { Game, Ctx } from 'boardgame.io';
import _ from 'underscore';

export type { Ctx };

export interface Player {
    id: string;
    name: string;
    hand: Card[];
}

export interface Card {
    id: string;
}

export interface DixitGame extends Game {
    players: Player[];
    deck: Card[];
    drawPile: Card[];
    candidates: {cardId: string, owner: string}[];
    voting: {cardId: string, playerId: string}[];
    phase: number;
    score: number[];
    oldScore: number[];
}

const DIXIT_IMAGES_COUNT = 145;

export const Dixit = {
    name: "Dixit",
    setup: (ctx: Ctx, setupData: any): DixitGame => {
        const deck = Array.from(Array(DIXIT_IMAGES_COUNT).keys()).map(v => ({ id: `${v}` }));
        let drawPile: Card[] = _.shuffle(deck);
        const CARDS_IN_HAND = 6;

        let players: Player[] = [];

        // fill players
        for (let i = 0; i < ctx.numPlayers; i++) {
            const hand = _.first(drawPile, CARDS_IN_HAND);
            drawPile = _.rest(drawPile, CARDS_IN_HAND);
            const player = {
                id: `${i}`,
                name: "Spieler",
                hand: hand
            };
            players.push(player);
        }

        return {
            players,
            deck,
            drawPile,
            candidates: [],
            phase: 0,
            voting: [],
            score: players.map(() => 0),
            oldScore: players.map(() => 0)
        };
    },
    phases: {
        main: {
            start: true,
            onBegin: (G: DixitGame, ctx: Ctx) => {
                ctx.events?.setActivePlayers!({
                    all: "lobby"
                });
            }
        }
    },
    turn: {
        onBegin: (G: DixitGame, ctx: Ctx) => {
            if (G.phase === 0) {
                return;
            }

            ctx.events?.setActivePlayers!({
                currentPlayer: "storyteller_chooses_card"
            });
        },
        stages: {
            lobby: {
                moves: { ChangeName, Ready } 
            },
            storyteller_chooses_card: {
                moves: { Choose }
            },
            others_choose_cards: {
                moves: { Choose }
            },
            others_vote: {
                moves: { Vote }
            },
            result: {
                moves: { Continue }
            }
        }
    }
}

function ChangeName(G: DixitGame, ctx: Ctx, name: string) {
    G.players[parseInt(ctx.playerID!)].name = name;
}

function Ready(G: DixitGame, ctx: Ctx) {
    ctx.events?.endStage!();
    if (!ctx.activePlayers || (Object.keys(ctx.activePlayers).length === 1 && ctx.playerID! in ctx.activePlayers)) {
        // last player
        // this player must advance the game
        G.phase = 1;
        ctx.events?.setActivePlayers!({
            currentPlayer: "storyteller_chooses_card"
        });
    }
}

function Choose(G: DixitGame, ctx: Ctx, cardId: string) {
    ctx.events?.endStage!();

    G.players[parseInt(ctx.playerID!)].hand = _.filter(G.players[parseInt(ctx.playerID!)].hand, card => card.id !== cardId);
    G.candidates.push({ cardId, owner: ctx.playerID! });

    const isStoryteller = ctx.playerID === ctx.currentPlayer
    if (isStoryteller) {
        ctx.events?.setActivePlayers!({
            others: "others_choose_cards"
        });
        G.phase = G.phase + 1;
    } else {
        if (!ctx.activePlayers || (Object.keys(ctx.activePlayers).length === 1 && ctx.playerID! in ctx.activePlayers)) {
            // last player
            // this player must advance the game
            ctx.events?.setActivePlayers!({
                others: "others_vote"
            });
            G.phase = G.phase + 1;
            G.candidates = _.shuffle(G.candidates);
        }
    }
}

function Vote(G: DixitGame, ctx: Ctx, cardId: string) {
    ctx.events?.endStage!();
    G.voting.push({
        cardId, playerId: ctx.playerID!
    });

    if (!ctx.activePlayers || (Object.keys(ctx.activePlayers).length === 1 && ctx.playerID! in ctx.activePlayers)) {
        // last player
        // this player must advance the game
        ctx.events?.setActivePlayers!({
            all: "result"
        });

        G.phase = G.phase + 1;

        const storyteller = G.players[parseInt(ctx.currentPlayer)];
        const candidateStoryteller = G.candidates.find(can => can.owner === storyteller.id)!;
        const votesForStoryteller = G.voting.filter(v => v.cardId === candidateStoryteller.cardId);

        if (votesForStoryteller.length > 0 && votesForStoryteller.length < G.players.length - 1) {
            G.score = G.score.map((score, playerIdx) => {
                const player = G.players[playerIdx];
                if (player.id === storyteller.id) {
                    return score + 3;
                } else {
                    const myCandidate = G.candidates.find(can => can.owner === player.id)!;
                    const myVotes = G.voting.filter(v => v.cardId === myCandidate.cardId);
                    const bonus = G.voting.find(vo => vo.playerId === player.id)!.cardId === G.candidates.find(can => can.owner === G.players[parseInt(ctx.currentPlayer)].id)!.cardId ? 3 : 0;

                    return score + myVotes.length + bonus;
                }
            });
        } else {
            G.score = G.score.map((score, playerIdx) => {
                return playerIdx === parseInt(storyteller.id) ? score : score + 2;
            });
        }
    }
}

function Continue(G: DixitGame, ctx: Ctx) {
    ctx.events?.endStage!();
    if (!ctx.activePlayers || (Object.keys(ctx.activePlayers).length === 1 && ctx.playerID! in ctx.activePlayers)) {
        // last player
        // this player must advance the game
        ctx.events?.endTurn!();
        G.phase = 1;
        G.candidates = [];
        G.voting = [];
        G.oldScore = G.score;

        if (G.drawPile.length < G.players.length) {
            G.phase = 10;
            return;
        }

        const drawnCards = _.first(G.drawPile, G.players.length)!;
        G.drawPile = _.rest(G.drawPile, G.players.length);

        G.players = G.players.map((pl, idx) => {
            return {
                ...pl,
                hand: [...pl.hand, drawnCards[idx]]
            };
        });
    }
}