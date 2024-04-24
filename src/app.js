import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/user.routes.js";
import RoomRouter from "./routes/room.routes.js";
import { socketMiddlewareValidation } from "./middlewares/socket.middleware.js";
import {
  emitInitialTTTSymbol,
  emitTTTPos,
} from "./games/gamesocketutils/tictactoe.gamesocketutils.js";
import {
  emitChessPos,
  emitInitialChessSymbol,
} from "./games/gamesocketutils/chess.gamesocketutils.js";
import {
  emitAnswer,
  emitICEToAvailableUsers,
  emitIceCandidates,
  emitOfferToAvailableUsers,
} from "./media/media.socketutils.js";
import {
  sendCurrentPersonsinRoom,
  sendDisconnectUserName,
} from "./routes/socket.routes.js";

const allowedOrigins = process.env.ALLOWED_CORS_ORIGIN.split(',');

const app = express();
const httpServer = http.createServer(app);
const socketIO = new Server(httpServer, {
  cors: {
    origin: allowedOrigins, // Allow requests from any origin
    methods: ["GET", "POST"], // Allow only specified methods
    // Additional CORS options can be specified here
  },
});

const handleChatMessage = (socket, roomName, msg) => {
  console.log(`Message received in ${roomName}: ${msg}`);
  // Broadcast the message to all clients in the room except the sender
  socket.broadcast.to(roomName).emit("receive_chat_message", msg);
};

// Dynamic namespaces to create rooms
socketIO.use(socketMiddlewareValidation).on("connection", (socket) => {
  const roomName = socket?.roomName;
  const user = socket?.user;

  socket.on("join_room", (joiningRoomName) => {
    if (joiningRoomName !== roomName) {
      socket.emit("error", "You can't connect to this room");
      socket.disconnect();
      return;
    }

    socket.join(roomName);

    sendCurrentPersonsinRoom(socketIO, roomName);

    console.log(`${socket?.user?.username} joined room: ${roomName}`);
  });

  socket.on("send_chat_message", (msg) => {
    handleChatMessage(socket, roomName, msg);
  });

  socket.on("request_ttt_symbol", (msg) => {
    emitInitialTTTSymbol(socketIO, roomName, msg);
  });

  socket.on("send_ttt_pos", (msg) => {
    emitTTTPos(socketIO, roomName, user?.username, msg);
  });

  socket.on("request_chess_symbol", (msg) => {
    emitInitialChessSymbol(socketIO, roomName, msg);
  });

  socket.on("send_chess_pos", (msg) => {
    emitChessPos(socketIO, roomName, user?.username, msg);
  });

  socket.on("send_rtc_new_offer", (msg) => {
    emitOfferToAvailableUsers(socketIO, roomName, msg);
  });

  socket.on("send_rtc_new_ice", (msg) => {
    emitICEToAvailableUsers(socketIO, roomName, msg);
  });

  socket.on("send_rtc_answer", (msg) => {
    emitAnswer(socketIO, roomName, msg);
  });

  socket.on("send_rtc_answer_ice", (msg) => {
    emitIceCandidates(socketIO, roomName, msg);
  });

  socket.on("disconnect", () => {
    sendDisconnectUserName(socketIO, roomName, user?.username);
    sendCurrentPersonsinRoom(socketIO, roomName);
    console.log("User disconnected");
  });
});

// Error handling for invalid namespaces or unauthorized attempts
socketIO.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/rooms", RoomRouter);

app.get("/api/v1/start", (_, res) => {
  res.status(200).send({status: "OK"});
})

export { socketIO, httpServer };
