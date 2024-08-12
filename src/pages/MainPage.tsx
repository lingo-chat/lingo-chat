import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonaList from '../components/Chat/PersonaList';

const MainPage: React.FC = () => {
	const [userInfo, setUserInfo] = useState<any>(null);
	const navigate = useNavigate();

	const handleSelectPersona = async (personaId: number) => {
		navigate(`/chats/${personaId}`);
	};

	return (
		<div>
			<h1>페르소나 캐릭터 목록</h1>
			<PersonaList onSelect={handleSelectPersona} />
		</div>
	);
};

export default MainPage;
