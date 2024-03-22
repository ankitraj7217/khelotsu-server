import { Game } from "./generic.game.js";

class TicTacToeGame extends Game {
    constructor(roomName, players, currentPlayer) {
        super(roomName, players, currentPlayer);
        this.playerSymbols = this.getInitialSymbol(...players);
        this.board = Array(9).fill(-1);
        this.winner = null;
    }

    getInitialSymbol(player1, player2) {
        const randomNum = Math.random();
        const symbol1 = randomNum < 0.5 ? "X" : "O";
        const symbol2 = symbol1 === "X" ? "O" : "X";

        return { [player1]: symbol1, [player2]: symbol2 };
    }

    isValidMove(player, moveIdx) {
        if (player !== this.currentPlayer) {
            throw new Error("Current player has to wait.");
        } else if (moveIdx > 9 || this.board[moveIdx] !== -1) {
            throw new Error("Invalid move.");
        }

        return true;

    }

    makeMove(player, moveIdx) {
        if (this.isValidMove(player, moveIdx)) {
            this.board[moveIdx] = this.playerSymbols[player];
            this.setCurrentPlayer();
            this.isFinalResult();
        }
    }

    setCurrentPlayer() {
        const currPlayerIdx = this.players.findIndex(player => player === this.currentPlayer);

        if (currPlayerIdx === -1) {
            throw new Error("Error while setting current player");
        }

        const nextPlayerIdx = (currPlayerIdx + 1) % this.players.length;
        this.currentPlayer = this.players[nextPlayerIdx];
    }

    getPlayerFromSymbol(symbol) {
        for (const player in this.playerSymbols) {
            if (this.playerSymbols[player] === symbol) {
                return player;
            }
        }
        return null; // If no player found with the given symbol
    }

    isFinalResult() {
        const winningPositions = [
            [0, 1, 2],
            [0, 3, 6],
            [0, 4, 8],
            [1, 4, 7],
            [2, 5, 8],
            [2, 4, 6],
            [3, 4, 5],
            [6, 7, 8],
        ]

        const arr = this.board;

        for (let i = 0; i < winningPositions.length; i++) {
            const tempArr = winningPositions[i]; // just an alias for ease
            if (
                arr[tempArr[0]] === "X" &&
                arr[tempArr[1]] === "X" &&
                arr[tempArr[2]] === "X"
            ) {
                this.winner = `${this.getPlayerFromSymbol("X")} has won`;
                return;
            }
            else if (
                arr[tempArr[0]] === "O" &&
                arr[tempArr[1]] === "O" &&
                arr[tempArr[2]] === "O"
            ) {
                this.winner = `${this.getPlayerFromSymbol("O")} has won`;
                return;
            }
        }

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === -1) {
                this.winner = null;  // game not yet finished
                return;
            }
        }

        this.winner = "Cat's Game";
    }
}

export { TicTacToeGame };