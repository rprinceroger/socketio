const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // Correcting this part
const cors = require('cors');

const app = express();
const httpServer = http.createServer(app); // Renaming this variable to httpServer
const io = new Server(httpServer, { // Using the correct variable here
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
		credentials: true // Allow cookies, if needed
	}
});

const port = 4000;

app.use(cors());

// WebSocket Event Handlers
io.on('connection', (socket) => {
	// logs a message if a user is connected to server
	console.log('A user connected:' + socket.id);

	// Event listener that listen to the "chat_message" event from the client. If the event is emitted, the callback function will be triggered with the data parameter "message".
	socket.on('chat_message', (message) => {

		// modify the emitted event with its data to add the id of the client
		const messageWithId = { id: socket.id, message }

		// Emit an event called 'received_message' that will be listened to by the client
		io.emit('received_message', messageWithId);

	});

	// Event listener for disconnection to log in the terminal if our user disconnects the server
	socket.on('disconnect', () => {
		console.log('A user disconnected.');
	})

});

// Run the server on specific port.
httpServer.listen(port, () => { // Using the renamed variable here
	console.log(`Server is running on http://localhost:${port}`);
});
