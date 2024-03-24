import Chess from "../chess.game.js";

class ChessMaintainer {
    constructor() {
        if (ChessMaintainer.singletonInstance) return ChessMaintainer.singletonInstance;

        this.gamesMap = new Map();
        ChessMaintainer.singletonInstance = this;
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

        const freshGame = new Chess(roomName, twoPlayers, "");
        this.gamesMap.set(roomName, freshGame);
        
        return freshGame;
    }

    deleteGame(roomName) {
        this.gamesMap.delete(roomName);
    }
}

const chessMaintainer = new ChessMaintainer();

export { chessMaintainer };
