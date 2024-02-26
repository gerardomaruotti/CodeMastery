import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from './Contexts';
import { Routes, Route } from 'react-router-dom';
import AuthenticationAPI from './api/AuthenticationAPI';
import NotFound from './pages/NotFound';
import ExercisesList from './pages/ExercisesList';
import CodingPage from './pages/CodingPage';
import TopicsList from './pages/TopicsList';
import ResultsPage from './pages/ResultsPage';
import ProposePage from './pages/ProposePage';
import DocumentationPage from './pages/DocumentationPage';
import MyExercisesPage from './pages/MyExercisesPage';

function App() {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(() => {
		AuthenticationAPI.getSessionAPI().then((response) => {
			if (response.status === 200) {
				response.json().then((data) => {
					setUser(data);
					setIsLoading(false);
				});
			} else {
				setIsLoading(false);
			}
		});
	}, []);

	return (
		<>
			{isLoading ? (
				<div>Loading...</div>
			) : (
				<BrowserRouter>
					<UserContext.Provider value={{ user, setUser }}>
						<Routes>
							<Route path='*' element={<NotFound />} />
							<Route path='/' element={<TopicsList />} />
							<Route path='/topics/:topic' element={<ExercisesList />} />
							<Route path='/coding-page/:topic/:exercise' element={<CodingPage />} />
							<Route path='/results-page/:topic/:exercise' element={<ResultsPage />} />
							<Route path='/my-exercises' element={<MyExercisesPage />} />
							<Route path='/propose-page' element={<ProposePage />} />
							<Route path='/propose-page/:topic/:exercise/edit' element={<ProposePage />} />
							<Route path='/documentation-page' element={<DocumentationPage />} />
						</Routes>
					</UserContext.Provider>
				</BrowserRouter>
			)}
		</>
	);
}

export default App;
