import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
	const [isMouseOver, setIsMouseOver] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		if (
			location.pathname.startsWith('/coding-page') ||
			location.pathname.startsWith('/results-page') ||
			location.pathname.startsWith('/propose-page')
		) {
			const handleMouseMove = (e) => {
				const mouseX = e.clientX;
				const isOnLeftSide = isSidebarOpen ? mouseX <= 200 : mouseX <= 10;
				setIsMouseOver(isOnLeftSide);
			};

			window.addEventListener('mousemove', handleMouseMove);

			return () => {
				window.removeEventListener('mousemove', handleMouseMove);
			};
		} else {
			setIsMouseOver(false);
			return;
		}
	}, [location, isSidebarOpen]);

	useEffect(() => {
		let timeoutId;
		if (isMouseOver) {
			timeoutId = setTimeout(() => {
				setIsSidebarOpen(true);
			}, 750);
		} else {
			setIsSidebarOpen(false);
		}

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [isMouseOver]);

	return (
		<div>
			{isSidebarOpen && <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />}

			<div style={{ marginLeft: isSidebarOpen ? '250px' : '0', transition: 'margin-left 0.3s' }}>{children}</div>
		</div>
	);
};

export default Layout;
