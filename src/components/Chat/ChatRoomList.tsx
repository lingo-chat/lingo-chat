import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Link } from 'react-router-dom';
import { registerChatRoomListener } from '../../utils/socket';

const ChatRoomList: React.FC = () => {
	const [chatRooms, setChatRooms] = useState<Array<{ id: number; title: string; persona: any }>>([]);
	const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

	useEffect(() => {
		if (isLoggedIn) {
			const fetchChatRoomsData = async () => {
				try {
					const rooms = await fetchChatRooms();
					setChatRooms(rooms);
				} catch (error) {
					console.error('Failed to fetch chat rooms:', error);
				}
			};

			fetchChatRoomsData();

			const handleSocketConnected = () => {
				registerChatRoomListener((newChatRoom) => {
					const { created_at, id, persona, title, updated_at } = newChatRoom;
					setChatRooms((prevRooms) => [...prevRooms, { created_at, id, persona, title, updated_at }]);
				});
			};

			// 소켓 연결이 완료되었을 때 발생하는 이벤트 감지
			document.addEventListener('socketConnected', handleSocketConnected);
		}
	}, [isLoggedIn]);

	const fetchChatRooms = async () => {
		const response = await fetch(`http://34.64.237.17:3000/chats/chat-rooms`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // 또는 필요한 인증 헤더
			},
		});

		const data = await response.json();

		if (data.lenght === 0) return [];

		return data.result;
	};

	return (
		<div className="chatroom-wrap">
			<ul>
				{chatRooms.map((room) => (
					<li key={room.id}>
						<Link to={`/chats/${room.persona.id}/room/${room.id}`}>{room.title}</Link>
					</li>
				))}
			</ul>
		</div>
	);
};
export default ChatRoomList;
