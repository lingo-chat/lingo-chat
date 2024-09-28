import { useState, useEffect } from 'react';

// Redis에서 조회하기
const fetchMessagesFromRedis = async (chatRoomId: string) => {
	const response = await fetch(`/api/chats/redis/${chatRoomId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // 또는 필요한 인증 헤더
		},
	});

	const data = await response.json();

	if (response.ok && data.result) {
		return data.result;
	}
	return null;
};

// DB에서 조회하기
const fetchMessagesFromDB = async (chatRoomId: string) => {
	const response = await fetch(`/api/chats/db/${chatRoomId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // 또는 필요한 인증 헤더
		},
	});

	const data = await response.json();

	if (response.ok && data.result) {
		return data.result;
	}
	return null;
};

const useFetchChatLogs = (chatRoomId: string) => {
	const [logs, setLogs] = useState<Array<any>>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const initializeChatLogs = async () => {
			setIsLoading(true);

			// 1. 로컬스토리지에서 확인
			const localLogs = localStorage.getItem(`chat_logs_${chatRoomId}`);
			if (localLogs) {
				const parsedLogs = JSON.parse(localLogs);

				setLogs(parsedLogs);
				setIsLoading(false);
				return;
			}

			// 2. 레디스에서 확인
			const redisLogs = await fetchMessagesFromRedis(chatRoomId);
			if (redisLogs.length) {
				const formattedLogs = redisLogs.map((log: string) => {
					const validJsonString = log.replace(/'/g, '"');
					return JSON.parse(validJsonString);
				});

				const messages = formattedLogs.map((v: any) => ({
					text: v.content,
					fromAI: v.role === 'assistant',
				}));

				localStorage.setItem(`chat_logs_${chatRoomId}`, JSON.stringify(messages));
				setLogs(messages);
				setIsLoading(false);
				return;
			}

			// 3. db에서 확인
			const dbLogs = await fetchMessagesFromDB(chatRoomId);

			if (dbLogs.length > 0) {
				const messages = dbLogs.map((v: any) => ({
					text: v.content,
					fromAI: v.role === 'assistant',
				}));

				localStorage.setItem(`chat_logs_${chatRoomId}`, JSON.stringify(messages));
				setLogs(messages);
				setIsLoading(false);
				return;
			}
		};

		initializeChatLogs();
	}, [chatRoomId]);

	return { logs, isLoading };
};

export default useFetchChatLogs;
