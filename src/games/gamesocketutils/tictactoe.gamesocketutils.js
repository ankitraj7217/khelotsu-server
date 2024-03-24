import { tttMaintainer } from "../maintainers/tictactoe.maintainer.js";

const emitInitialTTTSymbol = (io, roomName, receivedMsg) => {
    try {
        // although further validation can be put to check if both players are allowed or not.
        const game = tttMaintainer.createNewGame(roomName, JSON.parse(receivedMsg));
        const response = JSON.stringify({status: 200, 
                data: {
                    playerSymbols: game.playerSymbols,
                    currentPlayer: game.currentPlayer
    }})

        io.in(roomName).emit("receive_ttt_symbol", response);

    } catch (err) {
        const response = {status: 400, error: err?.message};
        io.in(roomName).emit("receive_ttt_symbol", JSON.stringify(response));
    }

}

const emitTTTPos = (io, roomName, username, receivedMsg) => {
    try {
        const msg = JSON.parse(receivedMsg);
        const existingGame = tttMaintainer.getCurrentGame(roomName);
        existingGame.makeMove(username, msg);

        if (existingGame.winner) tttMaintainer.deleteGame(roomName);

        const response = {
            status: 200,
            data: {
                moveIdx: msg,
                symbol: existingGame.playerSymbols[username],
                winner: existingGame.winner
            }
        }
        io.in(roomName).emit("receive_ttt_pos", JSON.stringify(response));
    } catch (err) {
        const response = {status: 400, error: err?.message};
        io.in(roomName).emit("receive_ttt_pos", JSON.stringify(response));
    }
}

export { emitInitialTTTSymbol, emitTTTPos };