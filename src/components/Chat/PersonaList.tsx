import React, { useEffect, useState } from 'react';

interface Persona {
	id: number;
	name: string;
	description: string;
	image_url: string; // Assuming each persona has an image
}

interface PersonaListProps {
	onSelect: (personaId: number) => void; // 선택된 페르소나의 ID를 부모 컴포넌트로 전달
}

const PersonaList: React.FC<PersonaListProps> = ({ onSelect }) => {
	const [personas, setPersonas] = useState<Persona[]>([]);

	useEffect(() => {
		const fetchPersonas = async () => {
			const response = await fetch('/api/persona');

			// 응답이 성공적이지 않은 경우
			if (!response.ok) {
				throw new Error('페르소나 목록을 가져오는데 실패했습니다.');
			}

			const data = await response.json();
			setPersonas(data.result);
		};

		fetchPersonas();
	}, []);

	return (
		<div className="personalist-wrap">
			{personas.map((persona) => (
				<div key={persona.id} onClick={() => onSelect(persona.id)} className="persona-id">
					<img src={persona.image_url} alt={persona.image_url} />
					<p style={{ fontWeight: 'bold', padding: '5px', margin: 0 }}>{persona.name}</p>
					<p style={{ color: 'gray', padding: '5px', margin: 0, fontSize: '13px' }}>{persona.description}</p>
				</div>
			))}
		</div>
	);
};

export default PersonaList;
