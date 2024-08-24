import React from 'react';
import { useNavigate } from 'react-router-dom';
import PersonaList from '../components/Chat/PersonaList';

const MainPage: React.FC = () => {
	const navigate = useNavigate();

	const handleSelectPersona = async (personaId: number) => {
		navigate(`/chats/${personaId}`);
	};

	return (
		<div className="main-wrap">
			<div className="text-wrap">
				<p style={{ fontSize: '20px', fontWeight: 'bold' }}>캐릭터 챗</p>
				<p style={{ margin: '0' }}>다양한 AI 친구들과 롤플레잉을 즐겨보세요</p>
			</div>
			<PersonaList onSelect={handleSelectPersona} />
		</div>
	);
};

export default MainPage;
