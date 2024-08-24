import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { subscribeToChatRoomMessages } from '../utils/socket';
import MessageInput from '../components/Chat/MessageInput';

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

	const addMessage = (message: { text: string; fromAI: boolean }) => {
		setMessages((prevMessages) => [...prevMessages, message]);
	};

	React.useEffect(() => {
		setChatRooms({ chatRoomId: chatRoomId });
		if (chatRoom?.chatRoomId) {
			setMessages([]);
		}
		if (initialMessage) {
			addMessage({ text: initialMessage, fromAI: false }); // `fromAI`는 초기 메시지이므로 `false`로 설정
		}
	}, [initialMessage]);

	React.useEffect(() => {
		if (isLoggedIn && chatRoomId) {
			const handleNewMessage = (data: { message: string; isFinal: boolean }) => {
				// 메세지 누적
				partialMessageRef.current += data.message;

				// 실시간으로 화면에 표시
				setDisplayedMessage(partialMessageRef.current);

				if (data.isFinal) {
					addMessage({ text: partialMessageRef.current + data.message, fromAI: true });
					setDisplayedMessage('');
					partialMessageRef.current = '';
				}
				//message.chatRoomId === chatRoomId 비교 예정
			};
			subscribeToChatRoomMessages(chatRoomId, handleNewMessage);
		}
	}, [isLoggedIn, chatRoomId]);

	console.log(messages);

	if (!personaId || !chatRoomId) {
		return <div>페르소나 ID가 제공되지 않았습니다.</div>;
	}

	return (
		<div className="chatlog-wrap">
			<div>
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
		flex: 1,
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
