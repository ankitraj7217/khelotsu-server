import { Game } from "./generic.game.js";
import { getCurrentPiecePos, getPieceType, getValidPos, initInitialPiecePos } from "./utils/chess.utils.js";

class Chess extends Game {
    constructor (roomName, players, currentPlayer) {
        super(roomName, players, currentPlayer);
        this.playerSymbols = this.getInitialSymbol(...players);
        this.chessBoard = initInitialPiecePos();
        this.winner = null;
    }

    getInitialSymbol(player1, player2) {
        const randomNum = Math.random();
        const symbol1 = randomNum < 0.5 ? "w" : "b";
        const symbol2 = symbol1 === "w" ? "b" : "w";

        this.currentPlayer = player1;

        return { [player1]: symbol1, [player2]: symbol2 };
    }

    // player -> userName, piece -> "rb", "rw", moveIdx -> "34", "44"
    makeMove(player, piece, moveIdx) {
        if (player !== this.currentPlayer) throw new Error(`Please wait for your chance ${player}`);

        const givenPlayerSymbol = this.playerSymbols[player];
        const pieceTypeSymbol = getPieceType(piece);
        if (givenPlayerSymbol !== pieceTypeSymbol) throw new Error(`Please move your piece ${player}`);

        const currentPiecePos = getCurrentPiecePos(piece);
        if (!currentPiecePos) throw new Error(`Please move valid piece ${player}`);

        const validPos = getValidPos(this.chessBoard, piece, currentPiecePos);
        if (!validPos.includes(moveIdx)) throw new Error(`Please move at correct place ${player}`);

        setPos(this.chessBoard, moveIdx, piece);
        setPos(this.chessBoard, currentPiecePos, "");
        this.isFinalResult();
        this.setCurrentPlayer();

        return {
            status: 200,
            data: {
                piece,
                moveIdx,
                winner: this.winner
            }
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

    isFinalResult() {
        const playerSymbol = this.playerSymbols[this.currentPlayer];
        const playerKingSymbol = `ki${playerSymbol}`;

        const doesKingExist = this.chessBoard.flat().includes(playerKingSymbol);
        doesKingExist && (this.winner = this.currentPlayer)

    }
}

export default Chess;