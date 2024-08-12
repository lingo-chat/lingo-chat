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

export const sendMessage = (data: { message: string; personaId: string }, callback: (response: any) => void) => {
	if (socket) {
		socket.emit('send_message', data, (response: any) => {
			callback(response);
		});
	} else {
		console.error('Socket is not initialized.');
	}
};

export const subscribeToMessages = (cb: (message: string) => void) => {
	if (!socket) return;

	socket.on('new_message', (msg) => {
		console.log('New message received:', msg);
		cb(msg);
	});
};

export const getSocket = () => socket;

export const registerChatRoomListener = (onNewChatRoom: (newRoom: any) => void) => {
	if (!socket) return;
	socket.on('new_chat_room', onNewChatRoom);

	// 컴포넌트 언마운트 시 웹소켓 리스너 정리
	// return () => {
	//     socket.off('new_chat_room', onNewChatRoom);
	// };
};
