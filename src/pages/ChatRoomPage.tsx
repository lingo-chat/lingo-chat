import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { subscribeToChatRoomMessages } from '../utils/socket';
import MessageInput from '../components/Chat/MessageInput';
import useFetchChatLogs from '../components/Chat/useFetchChatLogs';

const ChatRoomPage: React.FC = () => {
	const location = useLocation();
	const state = location.state as { initialMessage?: string } | undefined;
	const initialMessage = state?.initialMessage;

	const { personaId, chatRoomId } = useParams<{ personaId: string; chatRoomId: string }>();
	const [chatRoom, setChatRooms] = useState<{ chatRoomId: string | undefined }>();
	const [messages, setMessages] = useState<Array<{ text: string; fromAI: boolean }>>([]);
	const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
	const partialMessageRef = useRef<string>('');
	const [displayedMessage, setDisplayedMessage] = useState<string>('');

	const { logs, isLoading } = useFetchChatLogs(chatRoomId || '');

	const addMessage = (message: { text: string; fromAI: boolean }) => {
		setMessages((prevMessages) => {
			const updatedMessages = [...prevMessages, message];
			localStorage.setItem(`chat_logs_${chatRoomId}`, JSON.stringify(updatedMessages));

			return updatedMessages;
		});
	};

	React.useEffect(() => {
		if (!isLoading && logs.length >= 0) {
			setMessages((prevMessages) => [...prevMessages, ...logs]);
		}
	}, [logs]);

	// 채팅방 상태 업데이트
	React.useEffect(() => {
		if (!chatRoom || chatRoom.chatRoomId !== chatRoomId) {
			setChatRooms({ chatRoomId: chatRoomId });
			setMessages([]);
		}

		if (initialMessage && !messages.some((msg) => msg.text === initialMessage)) {
			setMessages((prevMessages) => [...prevMessages, { text: initialMessage, fromAI: false }]);
		}

		if (isLoggedIn && chatRoomId) {
			const handleNewMessage = (data: { message: string; isFinal: boolean }) => {
				partialMessageRef.current += data.message;

				// 화면에 표시될 메시지가 변경된 경우에만 업데이트
				if (partialMessageRef.current !== displayedMessage) {
					setDisplayedMessage(partialMessageRef.current);
				}

				// 메시지가 완료된 경우
				if (data.isFinal) {
					addMessage({ text: partialMessageRef.current, fromAI: true });
					setDisplayedMessage(''); // 화면에 표시된 메시지 초기화
					partialMessageRef.current = ''; // 메시지 버퍼 초기화
				}
			};

			// 채팅방 메시지 구독
			const unsubscribe = subscribeToChatRoomMessages(chatRoomId, handleNewMessage);

			return () => {
				if (unsubscribe) unsubscribe();
				setMessages([]);
				setDisplayedMessage('');
			};
		}
	}, [initialMessage, chatRoomId, isLoggedIn]);

	if (!personaId || !chatRoomId) {
		return <div>페르소나 ID가 제공되지 않았습니다.</div>;
	}

	return (
		<div className="chatlog-wrap">
			<div className="messagesContainer" style={{ overflowY: 'auto' }}>
				{messages.map((msg, index) => (
					<div key={index} style={msg.fromAI ? styles.messageFromAIWrap : styles.messageFromUserWrap}>
						<div style={msg.fromAI ? styles.messageFromAI : styles.messageFromUser}>{msg.text}</div>
					</div>
				))}
				{displayedMessage && <div style={styles.messageFromAI}>{displayedMessage}</div>}
			</div>

			<MessageInput personaId={personaId} chatRoomId={chatRoomId} addMessage={addMessage} />
		</div>
	);
};

const styles = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	messagesContainer: {
		overflowY: 'auto',
		padding: '10px',
	},
	messageFromAIWrap: {
		width: '100%',
		display: 'flex',
		alignItems: 'flex-start',
	},
	messageFromAI: {
		backgroundColor: '#e1f5fe',
		padding: '10px',
		borderRadius: '10px 10px 10px 0',
		marginBottom: '5px',
		width: 'auto',
	},
	messageFromUserWrap: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end',
	},
	messageFromUser: {
		backgroundColor: '#f1f8e9',
		padding: '10px',
		marginBottom: '5px',
		borderRadius: '10px 10px 0px',
		width: 'auto',
	},
};

export default ChatRoomPage;
