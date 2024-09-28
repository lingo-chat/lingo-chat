import React, { useState } from 'react';
import { useParams } from 'react-router';
import MessageInput from '../components/Chat/MessageInput';

const PersonaDetailPage: React.FC = () => {
	const { personaId } = useParams<{ personaId: string }>();
	const [persona, setPersona] = useState<any>(null);

	React.useEffect(() => {
		const fetchPersona = async () => {
			const response = await fetch(`/api/persona/${personaId}`);

			// 응답이 성공적이지 않은 경우
			if (!response.ok) {
				throw new Error('페르소나 목록을 가져오는데 실패했습니다.');
			}

			const data = await response.json();
			setPersona(data.result);
		};

		fetchPersona();
	}, [personaId]);

	// 이 코드를 나중에라도 고치고 싶다.
	if (!personaId) {
		return <div>페르소나 ID가 제공되지 않았습니다.</div>;
	}

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
			<div>
				{persona ? (
					<div className="detail-wrap">
						<img src={persona.image_url} alt={persona.name} />
						<div className="description">
							<p style={{ margin: '5px', fontWeight: 'bold' }}>{persona.name}</p>
							<p style={{ margin: '5px', color: 'gray' }}>{persona.description}</p>
						</div>
					</div>
				) : (
					<p>Loading...</p>
				)}
			</div>
			<MessageInput personaId={personaId} chatRoomId={''} />
		</div>
	);
};

export default PersonaDetailPage;
