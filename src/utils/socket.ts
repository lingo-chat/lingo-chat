import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initiateSocketConnection = (accessToken: string, handleLogout: () => void) => {
	socket = io('http://localhost:3080', {
		query: { accessToken },
	});
	console.log('Connecting socket...');

	socket.on('connect', () => {
		console.log('Socket connected:', socket!.id);
	});

	socket.on('disconnect', () => {
		console.log('Socket disconnected');
		handleLogout();
	});
};
