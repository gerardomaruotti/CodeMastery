function CircularButton({ icon, action, text, bg, shadow }) {
	const bgClass = bg ? bg : 'sidebar';

	return (
		<div className='mr-4 p-0.5'>
			<button
				className={`bg-${bgClass} w-[50px] border border-sidebar hover:border-accent hover:-translate-y-0.5 p-3 shadow-md ${
					shadow === 'accent' ? 'shadow-accent' : 'shadow-sidebar'
				} rounded-full transform active:bg-accent transition duration-150`}
				onClick={action}
			>
				{icon ? icon : text}
			</button>
		</div>
	);
}

export default CircularButton;
