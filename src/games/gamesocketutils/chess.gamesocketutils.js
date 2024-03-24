import { chessMaintainer } from "../maintainers/chess.maintainer.js";

const emitInitialChessSymbol = (io, roomName, receivedMsg) => {
    try {
        // although further validation can be put to check if both players are allowed or not.
        const game = chessMaintainer.createNewGame(roomName, JSON.parse(receivedMsg));
        const response = JSON.stringify({status: 200, 
                data: {
                    playerSymbols: game.playerSymbols
                }
            })

        io.in(roomName).emit("receive_chess_symbol", response);

    } catch (err) {
        const response = {status: 400, error: err?.message};
        io.in(roomName).emit("receive_chess_symbol", JSON.stringify(response));
    }
}

const emitChessPos = (io, roomName, username, receivedMsg) => {
    try {
        const msg = JSON.parse(receivedMsg); // msg will contain piece("rb", "rw") moveIdx("22", "44")
        const existingGame = chessMaintainer.getCurrentGame(roomName);
        const response = existingGame.makeMove(username, {...msg});

        if (response.winner) chessMaintainer.deleteGame(roomName);

        io.in(roomName).emit("receive_chess_pos", JSON.stringify(response));
    } catch (err) {
        const response = {status: 400, error: err?.message};
        io.in(roomName).emit("receive_chess_pos", JSON.stringify(response));
    }
}

export { emitInitialChessSymbol, emitChessPos };