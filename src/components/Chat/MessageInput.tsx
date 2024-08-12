import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { sendMessage } from '../../utils/socket';
import { useNavigate, useParams } from 'react-router';

interface MessageInputProps {
	personaId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ personaId }) => {
	const [message, setMessage] = useState<string>('');
	const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
	const navigate = useNavigate();

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(event.target.value);
	};

	const handleSendClick = () => {
		if (!isLoggedIn) {
			alert('로그인 후 이용해주세요!');
			return;
		}

		if (message.trim() === '') {
			return;
		}

		sendMessage({ message, personaId }, (response: any) => {
			console.log(message, personaId);
			console.log('Message sent:', response);

			console.log(response.result);

			if (response && response.result.chatRoomId) {
				navigate(`/chats/${personaId}/room/${response.result.chatRoomId}`);
			}

			setMessage('');
		});
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
		padding: '10px',
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
		backgroundColor: '#007bff',
		color: 'white',
		cursor: 'pointer',
	},
};

export default MessageInput;
