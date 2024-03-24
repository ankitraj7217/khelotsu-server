export const initInitialPiecePos = () => {
    const chessBoard = Array.from({ length: 8 }, () => Array(8).fill(""));

    // Initialize black pieces
    chessBoard[0][0] = "rb"; // Rook
    chessBoard[0][1] = "kb"; // Knight
    chessBoard[0][2] = "bb"; // Bishop
    chessBoard[0][3] = "qb"; // Queen
    chessBoard[0][4] = "kib"; // King
    chessBoard[0][5] = "bb"; // Bishop
    chessBoard[0][6] = "kb"; // Knight
    chessBoard[0][7] = "rb"; // Rook

    for (let i = 0; i < 8; i++) {
        chessBoard[1][i] = "pb"; // Pawn
    }

    // Initialize white pieces
    chessBoard[7][0] = "rw"; // Rook
    chessBoard[7][1] = "kw"; // Knight
    chessBoard[7][2] = "bw"; // Bishop
    chessBoard[7][3] = "qw"; // Queen
    chessBoard[7][4] = "kiw"; // King
    chessBoard[7][5] = "bw"; // Bishop
    chessBoard[7][6] = "kw"; // Knight
    chessBoard[7][7] = "rw"; // Rook

    for (let i = 0; i < 8; i++) {
        chessBoard[6][i] = "pw"; // Pawn
    }

    return chessBoard;
}

// valueInStr -> "34", "44" valueToSet -> "rb", "rw"
export const setPos = (arr2d, valueInStr, valueToSet) => {
    const row = parseInt(valueInStr.charAt(0), 10);
    const column = parseInt(valueInStr.charAt(1), 10);
    arr2d[row][column] = valueToSet;
}

export const getCurrentPiecePos = (arr2d, pieceType) => 
    arr2d.flatMap((row, i) => row.map((cell, j) => cell === pieceType ? `${i}${j}` : null)).filter(pos => pos !== null)?.[0];

export const getPieceType = (type) => {
    const lastIdxValue = type.charAt(type.length - 1);
    return lastIdxValue === "w" ? "w" : "b";
}

// if there is another piece on path
export const isPieceOnPos = (arr2d, row, col) =>
    arr2d[row][col] !== "" && arr2d[row][col] !== ".";

export const getValidPosRook = (arr2d, currPos, type) => {
    const [row, col] = currPos.split("").map(Number);
    const freeIdxPos = [];

    for (let i = row - 1; i >= 0; i--) {
        if (arr2d[i][col] === "" || arr2d[i][col] === ".") freeIdxPos.push(`${i}${col}`);
        else {
            if (getPieceType(arr2d[i][col]) !== type) freeIdxPos.push(`${i}${col}`);
            break;
        }
    }

    for (let i = row + 1; i < 8; i++) {
        if (arr2d[i][col] === "" || arr2d[i][col] === ".") freeIdxPos.push(`${i}${col}`);
        else {
            if (getPieceType(arr2d[i][col]) !== type) freeIdxPos.push(`${i}${col}`);
            break;
        }
    }

    for (let i = col - 1; i >= 0; i--) {
        if (arr2d[row][i] === "" || arr2d[row][i] === ".") freeIdxPos.push(`${row}${i}`);
        else {
            if (getPieceType(arr2d[row][i]) !== type) freeIdxPos.push(`${row}${i}`);
            break;
        }
    }

    for (let i = col + 1; i < 8; i++) {
        if (arr2d[row][i] === "" || arr2d[row][i] === ".") freeIdxPos.push(`${row}${i}`);
        else {
            if (getPieceType(arr2d[row][i]) !== type) freeIdxPos.push(`${row}${i}`);
            break;
        }
    }

    return freeIdxPos;
}

export const getValidPosKnight = (arr2d, currPos, type) => {
    
    const [row, col] = currPos.split("").map(Number);
    const freeIdxPos = [];

    // Define all possible knight move offsets
    const offsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    // Iterate over each possible move offset
    for (const [offsetRow, offsetCol] of offsets) {
        const newRow = row + offsetRow;
        const newCol = col + offsetCol;

        // Check if the new position is within the board bounds
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const newPos = `${newRow}${newCol}`;
            const newPosPieceType = getPieceType(arr2d[newRow][newCol]);

            // Check if the new position is empty or has an opponent's piece
            if (arr2d[newRow][newCol] === "" || arr2d[newRow][newCol] === "." || newPosPieceType !== type) {
                freeIdxPos.push(newPos);
            }
        }
    }
    
    return freeIdxPos;
}

export const getValidPosBishop = (arr2d, currPos, type) => {
    const [row, col] = currPos.split("").map(Number);
    const freeIdxPos = [];

    // Define all possible bishop move offsets
    const offsets = [
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    // Iterate over each possible move offset
    for (const [offsetRow, offsetCol] of offsets) {
        let newRow = row + offsetRow;
        let newCol = col + offsetCol;

        // Keep moving diagonally until out of board bounds
        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const newPos = `${newRow}${newCol}`;
            const newPosPieceType = getPieceType(arr2d[newRow][newCol]);

            // Check if the new position is empty or has an opponent's piece
            if (arr2d[newRow][newCol] === "" || arr2d[newRow][newCol] === "." || newPosPieceType !== type) {
                freeIdxPos.push(newPos);
            }

            // If there's a piece in the path, stop iterating in this direction
            if (isPieceOnPos(arr2d, newRow, newCol)) {
                break;
            }

            // Move to the next diagonal position
            newRow += offsetRow;
            newCol += offsetCol;
        }
    }

    return freeIdxPos;
}

// Function to get valid positions for the queen piece
export const getValidPosQueen = (arr2d, currPos, type) => {
    const [row, col] = currPos.split("").map(Number);
    const freeIdxPos = [];

    // Define all possible queen move offsets (combination of rook and bishop moves)
    const offsets = [
        [-1, 0], [1, 0], [0, -1], [0, 1],   // Rook moves
        [-1, -1], [-1, 1], [1, -1], [1, 1]  // Bishop moves
    ];

    // Iterate over each possible move offset
    for (const [offsetRow, offsetCol] of offsets) {
        let newRow = row + offsetRow;
        let newCol = col + offsetCol;

        // Keep moving until out of board bounds
        while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const newPos = `${newRow}${newCol}`;
            const newPosPieceType = getPieceType(arr2d[newRow][newCol]);

            // Check if the new position is empty or has an opponent's piece
            if (arr2d[newRow][newCol] === "" || arr2d[newRow][newCol] === "." || newPosPieceType !== type) {
                freeIdxPos.push(newPos);
            }

            // If there's a piece in the path, stop iterating in this direction
            if (isPieceOnPos(arr2d, newRow, newCol)) {
                break;
            }

            // Move to the next position based on the offset
            newRow += offsetRow;
            newCol += offsetCol;
        }
    }

    return freeIdxPos;
}

// Function to get valid positions for the king piece
export const getValidPosKing = (arr2d, currPos, type) => {
    const [row, col] = currPos.split("").map(Number);
    const freeIdxPos = [];

    // Define all possible king move offsets
    const offsets = [
        [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
    ];

    // Iterate over each possible move offset
    for (const [offsetRow, offsetCol] of offsets) {
        const newRow = row + offsetRow;
        const newCol = col + offsetCol;

        // Check if the new position is within the board bounds
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const newPos = `${newRow}${newCol}`;
            const newPosPieceType = getPieceType(arr2d[newRow][newCol]);

            // Check if the new position is empty or has an opponent's piece
            if (arr2d[newRow][newCol] === "" || arr2d[newRow][newCol] === "." || newPosPieceType !== type) {
                freeIdxPos.push(newPos);
            }
        }
    }

    return freeIdxPos;
}

// Function to get valid positions for any piece type
export const getValidPosPieceWhite = (arr2d, currPos) => {
    const [row, col] = currPos.split("").map(Number);
    const freeIdxPos = [];

    const offsetSlant = [[-1, -1], [-1, 1]];


    // Straight empty
    const newStRow = row - 1;
    const newStCol = col + 0;

    // Check if the new position is within the board bounds
    if (newStRow >= 0 && newStRow < 8 && newStCol >= 0 && newStCol < 8 && !isPieceOnPos(arr2d, newStRow, newStCol))
        freeIdxPos.push(`${newStRow}${newStCol}`);

    // Iterate over each possible move offset
    for (const [offsetRow, offsetCol] of offsetSlant) {
        const newRow = row + offsetRow;
        const newCol = col + offsetCol;

        // Check if the new position is within the board bounds
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const newPos = `${newRow}${newCol}`;
            const newPosPieceType = getPieceType(arr2d[newRow][newCol]);

            // Check if the new position is empty or has an opponent's piece
            if (newPosPieceType !== "w" && isPieceOnPos(arr2d, newRow, newCol)) {
                freeIdxPos.push(newPos);
            }
        }
    }

    return freeIdxPos;
}

export const getValidPosPieceBlack = (arr2d, currPos) => {
    const [row, col] = currPos.split("").map(Number);
    const freeIdxPos = [];

    const offsetSlant = [[1, 1], [1, -1]];


    // Straight empty
    const newStRow = row + 1;
    const newStCol = col + 0;

    // Check if the new position is within the board bounds
    if (newStRow >= 0 && newStRow < 8 && newStCol >= 0 && newStCol < 8 && !isPieceOnPos(arr2d, newStRow, newStCol))
        freeIdxPos.push(`${newStRow}${newStCol}`);

    // Iterate over each possible move offset
    for (const [offsetRow, offsetCol] of offsetSlant) {
        const newRow = row + offsetRow;
        const newCol = col + offsetCol;

        // Check if the new position is within the board bounds
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const newPos = `${newRow}${newCol}`;
            const newPosPieceType = getPieceType(arr2d[newRow][newCol]);

            // Check if the new position is empty or has an opponent's piece
            if (newPosPieceType !== "b" && isPieceOnPos(arr2d, newRow, newCol)) {
                freeIdxPos.push(newPos);
            }
        }
    }

    return freeIdxPos;
}

// arr2d -> chess board, pieceType -> "rb", currPos -> "44"
export const getValidPos = (arr2d, pieceType, currPos) => {
    switch (pieceType) {
        case "rw":
            return getValidPosRook(arr2d, currPos, "w");
        case "rb":
            return getValidPosRook(arr2d, currPos, "b");
        case "kw":
            return getValidPosKnight(arr2d, currPos, "w");
        case "kb":
            return getValidPosKnight(arr2d, currPos, "b");
        case "bw":
            return getValidPosBishop(arr2d, currPos, "w");
        case "bb":
            return getValidPosBishop(arr2d, currPos, "b");
        case "qw":
            return getValidPosQueen(arr2d, currPos, "w");
        case "qb":
            return getValidPosQueen(arr2d, currPos, "b");
        case "kiw":
            return getValidPosKing(arr2d, currPos, "w");
        case "kib":
            return getValidPosKing(arr2d, currPos, "b");
        case "pw":
            return getValidPosPieceWhite(arr2d, currPos);
        case "pb":
            return getValidPosPieceBlack(arr2d, currPos);

        default:
            return []
    }
}