import { socketIO } from "../app";


const handleChatMessage = (socket, roomName, msg) => {
    console.log(`Message received in ${roomName}: ${msg}`);
    // Broadcast the message to all clients in the room except the sender
    socket.broadcast.emit('chat message', msg);
};

// Dynamic namespaces to create rooms
socketIO.of(/^\/\w+$/).on('connection', (socket) => {
    const namespace = socket.nsp; // Get the namespace object
    const roomName = namespace.name; // Extract the room name from the namespace

    if (roomName !== socket.roomName) {
        socket.emit('error', 'You are not allowed to join this room.');
        socket.disconnect();
        return;
    }
    console.log('New connection to room:', roomName, socket?.user);

    socket.on('chat_message', (msg) => {
        console.log(`Message received in ${roomName}: ${msg}`);
        handleChatMessage(socket, roomName, msg);
    });
});

// Error handling for invalid namespaces or unauthorized attempts
socketIO.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
});
