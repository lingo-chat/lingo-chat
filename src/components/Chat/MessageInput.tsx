import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { sendFirstMessage, sendChatRoomMessages } from '../../utils/socket';
import { useNavigate } from 'react-router';

interface MessageInputProps {
	personaId: string;
	chatRoomId: string;
	addMessage?: (message: { text: string; fromAI: boolean }) => void; // 선택적 prop
}

const MessageInput: React.FC<MessageInputProps> = ({ personaId, chatRoomId, addMessage }) => {
	const [message, setMessage] = useState<string>('');
	const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
	const navigate = useNavigate();

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(event.target.value);
	};

	const handleSendClick = async () => {
		if (!isLoggedIn) {
			alert('로그인 후 이용해주세요!');
			return;
		}

		if (message.trim() === '') {
			return;
		}

		if (chatRoomId) {
			// 채팅창
			if (addMessage) {
				addMessage({ text: message, fromAI: false });
			}

			sendChatRoomMessages({ chatRoomId, message }, (response: any) => {});
			setMessage('');
		} else {
			// 페르소나창

			sendFirstMessage({ message, personaId }, (response: any) => {
				if (response && response.result.chatRoomId) {
					navigate(`/chat/${personaId}/room/${response.result.chatRoomId}`, {
						state: {
							initialMessage: message,
						},
					});
				}
				setMessage('');
			});
		}
	};

	return (
		<div style={styles.container}>
			<input
				type="text"
				placeholder="Type your message..."
				value={message}
				onChange={handleInputChange}
				style={styles.input}
			/>
			<button onClick={handleSendClick} style={styles.button}>
				Send
			</button>
		</div>
	);
};

const styles = {
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '10px 60px 10px 60px',
	},
	input: {
		width: '80%',
		padding: '10px',
		fontSize: '16px',
		borderRadius: '4px',
		border: '1px solid #ccc',
		marginRight: '10px',
	},
	button: {
		padding: '10px 20px',
		fontSize: '16px',
		borderRadius: '4px',
		border: 'none',
		backgroundColor: '#1b9c4e',
		color: 'white',
		cursor: 'pointer',
	},
};

export default MessageInput;
