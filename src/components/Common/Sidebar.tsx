import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import ChatRoomList from '../Chat/ChatRoomList';
import GoogleLoginButton from '../Main/GoogleLoginButton';
import Cookies from 'js-cookie';
import { initiateSocketConnection } from '../../utils/socket';

const Sidebar: React.FC = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userName, setUserName] = useState('');

	useEffect(() => {
		// 로컬 스토리지에서 토큰 확인
		const storedAccessToken = localStorage.getItem('accessToken');
		const storedUsername = localStorage.getItem('userName');

		if (storedAccessToken && storedUsername) {
			setIsLoggedIn(true);
			setUserName(storedUsername);
			initiateSocketConnection(storedAccessToken, handleLogout);
		} else {
			// 쿠키에서 토큰 가져오기
			const accessToken = Cookies.get('access-token');
			const refreshToken = Cookies.get('refresh-token');
			const userName = Cookies.get('user-name');

			if (accessToken && refreshToken && userName) {
				// 로컬 스토리지에 토큰 저장
				localStorage.setItem('accessToken', accessToken);
				localStorage.setItem('refreshToken', refreshToken);
				localStorage.setItem('userName', userName);

				// 쿠키 삭제
				Cookies.remove('access-token');
				Cookies.remove('refresh-token');
				Cookies.remove('user-name');

				setIsLoggedIn(true);
				setUserName(userName);
			}
		}
	}, []);

	const handleGoogleLoginClick = () => {
		window.location.href = 'http://localhost:3000/auth/google'; // 서버의 구글 인증 엔드포인트로 리다이렉트
	};

	const handleLogout = () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('userName');

		alert('Your session has expired. Please log in again.');

		window.location.href = '/';
	};

	return (
		<div className="sidebar">
			<div className="title">
				<p>LingoChat</p>
			</div>
			<Nav />
			<ChatRoomList />
			<div className="google-login">
				{isLoggedIn ? (
					<p className="userName">welcome {userName}!</p>
				) : (
					<GoogleLoginButton onLoginClick={handleGoogleLoginClick} />
				)}
			</div>
		</div>
	);
};

export default Sidebar;
