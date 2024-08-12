import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import DeveloperInfoPage from './pages/DeveloperInfoPage';
import MainLayout from './components/Common/MainLayout'; // MainLayout import
import PersonaDetailPage from './pages/PersonaDetailPage';
import ChatRoomPage from './pages/ChatRoomPage';

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<MainPage />} />
					<Route path="developer-info" element={<DeveloperInfoPage />} />
					<Route path="chats/:personaId" element={<PersonaDetailPage />} />
					<Route path="chats/:personaId/room/:chatRoomId" element={<ChatRoomPage />} />
				</Route>
			</Routes>
		</Router>
	);
};

export default App;
