import '../styles/GeneralStyle.css';
import React from 'react';
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';

function Banner({ message, status }) {
	const icon = status === 'Success' ? <IoCheckmarkCircleOutline /> : <IoCloseCircleOutline />;
	return (
		<div className={`banner animate-slideUp flex flex-row items-center ${status === 'Success' ? `bg-accent` : `bg-accentThird`}`}>
			<div className='banner-icon mr-2'>{icon}</div>
			<div className='banner-message'>{message}</div>
		</div>
	);
}

export default Banner;
