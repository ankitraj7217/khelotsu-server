const handleChatMessage = (socket, roomName, msg) => {
  console.log(`Message received in ${roomName}: ${msg}`);
  // Broadcast the message to all clients in the room except the sender
  socket.broadcast.emit("chat message", msg);
};

const sendDisconnectUserName = (io, roomName, msg) => {
  try {
    const response = { status: 200, data: msg };
    console.log("user disconnected response: ", response);
    io.in(roomName).emit(
      "receive_disconnect_username",
      JSON.stringify(response)
    );
  } catch (err) {
    const response = { status: 400, error: err?.message };
    io.in(roomName).emit(
      "receive_disconnect_username",
      JSON.stringify(response)
    );
  }
};

const sendCurrentPersonsinRoom = (socketIO, roomName) => {
  const room = socketIO.sockets.adapter.rooms.get(roomName);

  if (room) {
    const personsInRoom = Array.from(room).map(
      (socketId) => socketIO.sockets.sockets.get(socketId)?.user?.username
    );

    const response = {
      status: 200,
      data: personsInRoom,
    };

    // also send on disconnect
    socketIO
      .in(roomName)
      .emit("receive_curr_persons_in_room", JSON.stringify(response));
  } else {
    socketIO.in(roomName).emit(
      "receive_curr_persons_in_room",
      JSON.stringify({
        status: 400,
        error: "Error while retrieving persons in room.",
      })
    );
  }
};

export { sendDisconnectUserName, sendCurrentPersonsinRoom };
