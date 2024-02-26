import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function NotFound() {
	const navigate = useNavigate();
	return (
		<>
			<Sidebar />
			<div className='bg-primary h-screen m-[30vh] text-secondary text-center'>
				<h1 className='pt-20 text-3xl font-bold'>404</h1>
				<p className='text-lg font-semibold pt-2'>Page not found.</p>
				<button className='p-2 mt-2 bg-accent font-semibold rounded-full shadow h-10 w-72' onClick={() => navigate('/')}>
					Go Home
				</button>
			</div>
		</>
	);
}

export default NotFound;
