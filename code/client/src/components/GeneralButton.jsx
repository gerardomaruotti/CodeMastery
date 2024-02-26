import React from 'react';
import { Button } from 'react-bootstrap';

function GeneralButton({ text, action }) {
	return (
		<Button
			className='bg-sidebar shadow m-2 rounded-full border border-sidebar hover:border-accent active:bg-accent duration-150 hover:-translate-y-0.5 hover:shadow-xl'
			style={{ width: '100px', height: '30px', fontSize: '15px' }}
			onClick={action}
		>
			{text}
		</Button>
	);
}

export default GeneralButton;
