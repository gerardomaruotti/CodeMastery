import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

function SidebarElement({ text, icon, path, isItemActive }) {
	const navigate = useNavigate();
	const location = useLocation();
	const [message, setMessage] = useState('');

	useEffect(() => {
		location.pathname.startsWith('/coding') ? setMessage('Your progress will be automatically saved') : setMessage('Your progress will be lost');
	}, []);

	const handleNavigation = (event) => {
		if (location.pathname.startsWith('/coding') || location.pathname.startsWith('/proposals')) {
			event.preventDefault();

			Swal.fire({
				title: 'Are you sure?',
				text: message,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Confirm',
				cancelButtonText: 'Cancel',
				reverseButtons: true,
			}).then((result) => {
				if (result.isConfirmed) navigate(path);
			});
		} else navigate(path);
	};

	return (
		<li>
			<Link
				to={path}
				className={`flex items-center py-2 border pl-3 group ${
					isItemActive(path)
						? 'bg-accent rounded-full text-secondary shadow-lg border-accent'
						: 'hover:border-accent border-sidebar rounded-full hover:text-secondary hover:shadow text-secondary active:bg-accent'
				}`}
				onClick={handleNavigation}
			>
				{icon}
				<span className='ms-3'>{text}</span>
			</Link>
		</li>
	);
}

export default SidebarElement;
