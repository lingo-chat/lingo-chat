import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initiateSocketConnection = (accessToken: string, handleLogout: () => void) => {
	if (socket) return;

	socket = io('http://34.64.237.17:3080', {
		query: { accessToken },
	});
	console.log('Connecting socket...');

	socket.on('connect', () => {
		console.log('Socket connected:', socket!.id);
		document.dispatchEvent(new Event('socketConnected'));
	});

	socket.on('disconnect', () => {
		console.log('Socket disconnected');
		handleLogout();
	});
};

// 첫 메시지 전송
export const sendFirstMessage = (data: { message: string; personaId: string }, callback: (response: any) => void) => {
	if (socket) {
		socket.emit('send_message', data, (response: any) => {
			callback(response);
		});
	} else {
		console.error('Socket is not initialized.');
	}
};

export const getSocket = () => socket;

export const sendChatRoomMessages = (
	data: { chatRoomId: string; message: string },
	callback: (response: any) => void,
) => {
	if (socket) {
		socket.emit('chat_message', data, (response: any) => {
			callback(response);
		});
	} else {
		console.error('Socket is not initialized.');
	}
};

// 특정 채팅방 이벤트 구독
export const subscribeToChatRoomMessages = (
	chatRoomId: string,
	cb: (data: { message: string; isFinal: boolean }) => void,
) => {
	if (!socket) return;
	const event = `new_chat_message_${chatRoomId}`;

	const onMessage = (data: { message: string; isFinal: boolean }) => {
		console.log('data????', data.message);
		cb(data);
	};
	socket.on(event, onMessage);

	// 구독 해제 함수
	const unsubscribe = () => {
		if (socket) {
			socket.off(event, onMessage); // 이벤트 리스너 제거
		}
	};

	return unsubscribe;
};

export const registerChatRoomListener = (
	cb: (data: { id: number; title: string; persona: any; created_at: string; updated_at: string }) => void,
) => {
	if (!socket) return;

	socket.on('new_chat_room', (data: { newChatRoom: any }) => {
		const chatRoom = data.newChatRoom;

		cb({
			id: chatRoom.id,
			title: chatRoom.title,
			persona: chatRoom.persona,
			created_at: chatRoom.created_at,
			updated_at: chatRoom.updated_at,
		});
	});
};
