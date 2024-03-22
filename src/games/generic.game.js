class Game {
    constructor(roomName, players, currentPlayer) {
        if (new.target === Game) {
            throw new TypeError("Can't instantiate abstract class");
        }

        this.roomName = roomName;
        this.players = players; // list of usernames
        this.currentPlayer = currentPlayer; // username -> current player
    }

    makeMove(player, ...args) {
        throw new Error("Please implement makeMove method");
    }

    isValidMove(player, ...args) {
        throw new Error("Please implement isValidMove method");
    }

    setCurrentPlayer() {
        throw new Error("Please implement setCurrentPlayer method");
    }

    // can be win, loss or draw
    isFinalResult() {
        throw new Error("Please implement isFinalResult method");
    }
}

export { Game }