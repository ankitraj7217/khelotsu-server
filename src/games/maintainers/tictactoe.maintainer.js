import { TicTacToeGame } from "../tictactoe.game.js";

class TTTMaintainer {
    constructor() {
        if (TTTMaintainer.singletonInstance) {
            return TTTMaintainer.singletonInstance;
        }

        this.gamesMap = new Map();
        TTTMaintainer.singletonInstance = this;
    }

    getCurrentGame(roomName) {
        let game = this.gamesMap.get(roomName);

        if (!game) throw new Error("Start new game by clicking on Start.");

        return game;
    }

    createNewGame(roomName, players) {
        let twoPlayers = players;
        if (twoPlayers && twoPlayers.length < 2) throw new Error("Ensure 2 players are there");
        if (twoPlayers.length > 2) twoPlayers = players.sort(() => Math.random() - 0.5).slice(0, 2);

        const randomNum = Math.random();
        const currentPlayer = randomNum < 0.5 ? twoPlayers[0] : twoPlayers[1];

        const freshGame = new TicTacToeGame(roomName, twoPlayers, currentPlayer);
        this.gamesMap.set(roomName, freshGame);
        
        return freshGame;
    }

    deleteGame(roomName) {
        this.gamesMap.delete(roomName);
    }
}

const tttMaintainer = new TTTMaintainer();

export { tttMaintainer };