import { useLocation } from 'react-router-dom';
import { IoBook, IoCompass, IoHelpCircle, IoPersonCircle } from 'react-icons/io5';
import SidebarElement from './SidebarElement';
import { UserContext } from '../Contexts';
import { useContext } from 'react';

function Sidebar() {
	const { user } = useContext(UserContext);
	const location = useLocation();

	const isItemActive = (path) => {
		return location.pathname === path;
	};

	return (
		<aside
			id='default-sidebar'
			className='fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 shadow-xl'
			aria-label='Sidebar'
		>
			<div className='h-full px-4 py-4 overflow-y-auto bg-sidebar'>
				<h1 className='text-2xl font-bold text-secondary mb-4'>CodeMastery</h1>
				<ul className='space-y-2 font-medium'>
					<SidebarElement text='Topics' icon={<IoCompass />} path='/' isItemActive={isItemActive} />
					<SidebarElement text='My Exercises' icon={<IoBook />} path='/my-exercises' isItemActive={isItemActive} />
					<SidebarElement text='Documentation' icon={<IoHelpCircle />} path='/documentation-page' isItemActive={isItemActive} />
				</ul>
				<div className='fixed bottom-6 pl-1'>
					<div className='flex text-secondary '>
						<div className='flex items-center'>
							<IoPersonCircle className='w-8 h-8' />
							<span className='ms-2'>
								{user.name} {user.surname}
							</span>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}

export default Sidebar;
