import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import ChatRoomList from '../Chat/ChatRoomList';
import GoogleLoginButton from '../Main/GoogleLoginButton';
import Cookies from 'js-cookie';
import { initiateSocketConnection } from '../../utils/socket';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { login, logout } from '../../store/userSlice';
import { CiUser } from 'react-icons/ci';
import { Socket } from 'socket.io-client';

const Sidebar: React.FC = () => {
	const dispatch = useDispatch();
	const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
	const userName = useSelector((state: RootState) => state.user.userName);
	const accessToken = useSelector((state: RootState) => state.user.accessToken);

	useEffect(() => {
		// 로컬 스토리지에서 토큰 확인
		const storedAccessToken = localStorage.getItem('accessToken');
		const storedUsername = localStorage.getItem('userName');

		if (storedAccessToken && storedUsername) {
			dispatch(login({ userName: storedUsername, accessToken: storedAccessToken }));
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

				dispatch(login({ userName, accessToken }));
			}
		}
	}, [dispatch]);

	useEffect(() => {
		if (isLoggedIn && accessToken) {
			initiateSocketConnection(accessToken, handleLogout);
		}
	}, [isLoggedIn, accessToken]);

	const handleGoogleLoginClick = () => {
		window.location.href = '/api/auth/google'; // 서버의 구글 인증 엔드포인트로 리다이렉트
	};

	const handleLogout = (socket?: Socket | null) => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('userName');

		dispatch(logout());

		if (socket) {
			socket.disconnect();
		}

		alert('Your session has expired. Please log in again.');

		window.location.href = '/';
	};

	return (
		<div className="sidebar">
			<div className="title">
				<p>LINGO-CHAT</p>
			</div>
			<Nav />
			<ChatRoomList />
			<div className="google-login">
				{isLoggedIn ? (
					<div className="userWrap">
						<CiUser style={{ margin: '10px' }} />
						<p className="userName"> {userName} </p>
					</div>
				) : (
					<GoogleLoginButton onLoginClick={handleGoogleLoginClick} />
				)}
			</div>
		</div>
	);
};

export default Sidebar;
