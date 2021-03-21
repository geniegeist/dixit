"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.Dixit = void 0;
var underscore_1 = require("underscore");
var DIXIT_IMAGES_COUNT = 145;
exports.Dixit = {
    name: "Dixit",
    setup: function (ctx, setupData) {
        var deck = Array.from(Array(DIXIT_IMAGES_COUNT).keys()).map(function (v) { return ({ id: "" + v }); });
        var drawPile = underscore_1["default"].shuffle(deck);
        var CARDS_IN_HAND = 6;
        var players = [];
        // fill players
        for (var i = 0; i < ctx.numPlayers; i++) {
            var hand = underscore_1["default"].first(drawPile, CARDS_IN_HAND);
            drawPile = underscore_1["default"].rest(drawPile, CARDS_IN_HAND);
            var player = {
                id: "" + i,
                name: "Spieler",
                hand: hand
            };
            players.push(player);
        }
        return {
            players: players,
            deck: deck,
            drawPile: drawPile,
            candidates: [],
            phase: 0,
            voting: [],
            score: players.map(function () { return 0; }),
            oldScore: players.map(function () { return 0; })
        };
    },
    phases: {
        main: {
            start: true,
            onBegin: function (G, ctx) {
                var _a;
                (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setActivePlayers({
                    all: "lobby"
                });
            }
        }
    },
    turn: {
        onBegin: function (G, ctx) {
            var _a;
            if (G.phase === 0) {
                return;
            }
            (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setActivePlayers({
                currentPlayer: "storyteller_chooses_card"
            });
        },
        stages: {
            lobby: {
                moves: { ChangeName: ChangeName, Ready: Ready }
            },
            storyteller_chooses_card: {
                moves: { Choose: Choose }
            },
            others_choose_cards: {
                moves: { Choose: Choose }
            },
            others_vote: {
                moves: { Vote: Vote }
            },
            result: {
                moves: { Continue: Continue }
            }
        }
    }
};
function ChangeName(G, ctx, name) {
    G.players[parseInt(ctx.playerID)].name = name;
}
function Ready(G, ctx) {
    var _a, _b;
    (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.endStage();
    if (!ctx.activePlayers || (Object.keys(ctx.activePlayers).length === 1 && ctx.playerID in ctx.activePlayers)) {
        // last player
        // this player must advance the game
        G.phase = 1;
        (_b = ctx.events) === null || _b === void 0 ? void 0 : _b.setActivePlayers({
            currentPlayer: "storyteller_chooses_card"
        });
    }
}
function Choose(G, ctx, cardId) {
    var _a, _b, _c;
    (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.endStage();
    G.players[parseInt(ctx.playerID)].hand = underscore_1["default"].filter(G.players[parseInt(ctx.playerID)].hand, function (card) { return card.id !== cardId; });
    G.candidates.push({ cardId: cardId, owner: ctx.playerID });
    var isStoryteller = ctx.playerID === ctx.currentPlayer;
    if (isStoryteller) {
        (_b = ctx.events) === null || _b === void 0 ? void 0 : _b.setActivePlayers({
            others: "others_choose_cards"
        });
        G.phase = G.phase + 1;
    }
    else {
        if (!ctx.activePlayers || (Object.keys(ctx.activePlayers).length === 1 && ctx.playerID in ctx.activePlayers)) {
            // last player
            // this player must advance the game
            (_c = ctx.events) === null || _c === void 0 ? void 0 : _c.setActivePlayers({
                others: "others_vote"
            });
            G.phase = G.phase + 1;
            G.candidates = underscore_1["default"].shuffle(G.candidates);
        }
    }
}
function Vote(G, ctx, cardId) {
    var _a, _b;
    (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.endStage();
    G.voting.push({
        cardId: cardId, playerId: ctx.playerID
    });
    if (!ctx.activePlayers || (Object.keys(ctx.activePlayers).length === 1 && ctx.playerID in ctx.activePlayers)) {
        // last player
        // this player must advance the game
        (_b = ctx.events) === null || _b === void 0 ? void 0 : _b.setActivePlayers({
            all: "result"
        });
        G.phase = G.phase + 1;
        var storyteller_1 = G.players[parseInt(ctx.currentPlayer)];
        var candidateStoryteller_1 = G.candidates.find(function (can) { return can.owner === storyteller_1.id; });
        var votesForStoryteller = G.voting.filter(function (v) { return v.cardId === candidateStoryteller_1.cardId; });
        if (votesForStoryteller.length > 0 && votesForStoryteller.length < G.players.length - 1) {
            G.score = G.score.map(function (score, playerIdx) {
                var player = G.players[playerIdx];
                if (player.id === storyteller_1.id) {
                    return score + 3;
                }
                else {
                    var myCandidate_1 = G.candidates.find(function (can) { return can.owner === player.id; });
                    var myVotes = G.voting.filter(function (v) { return v.cardId === myCandidate_1.cardId; });
                    var bonus = G.voting.find(function (vo) { return vo.playerId === player.id; }).cardId === G.candidates.find(function (can) { return can.owner === G.players[parseInt(ctx.currentPlayer)].id; }).cardId ? 3 : 0;
                    return score + myVotes.length + bonus;
                }
            });
        }
        else {
            G.score = G.score.map(function (score, playerIdx) {
                return playerIdx === parseInt(storyteller_1.id) ? score : score + 2;
            });
        }
    }
}
function Continue(G, ctx) {
    var _a, _b;
    (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.endStage();
    if (!ctx.activePlayers || (Object.keys(ctx.activePlayers).length === 1 && ctx.playerID in ctx.activePlayers)) {
        // last player
        // this player must advance the game
        (_b = ctx.events) === null || _b === void 0 ? void 0 : _b.endTurn();
        G.phase = 1;
        G.candidates = [];
        G.voting = [];
        G.oldScore = G.score;
        if (G.drawPile.length < G.players.length) {
            G.phase = 10;
            return;
        }
        var drawnCards_1 = underscore_1["default"].first(G.drawPile, G.players.length);
        G.drawPile = underscore_1["default"].rest(G.drawPile, G.players.length);
        G.players = G.players.map(function (pl, idx) {
            return __assign(__assign({}, pl), { hand: __spreadArrays(pl.hand, [drawnCards_1[idx]]) });
        });
    }
}
