import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import DeveloperInfoPage from './pages/DeveloperInfoPage';
import MainLayout from './components/Common/MainLayout'; // MainLayout import

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<MainPage />} />
					<Route path="developer-info" element={<DeveloperInfoPage />} />
				</Route>
			</Routes>
		</Router>
	);
};

export default App;
