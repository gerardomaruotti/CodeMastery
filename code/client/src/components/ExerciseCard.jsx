import done from '../assets/icons/Done.svg';
import notDone from '../assets/icons/NotDone.svg';
import inProgress from '../assets/icons/InProgress.svg';
import failed from '../assets/icons/Failed.svg';
import beginner from '../assets/icons/Beginner.svg';
import intermediate from '../assets/icons/Intermediate.svg';
import advanced from '../assets/icons/Advanced.svg';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function ExerciseCard({ topic, exercise }) {
	const navigate = useNavigate();
	const [status, setStatus] = useState('');
	const [level, setLevel] = useState('');

	useEffect(() => {
		setStatus(
			exercise.Status === 'Complete'
				? done
				: exercise.Status === 'Incomplete'
				? notDone
				: exercise.Status === 'In Progress'
				? inProgress
				: exercise.Status === 'Failed'
				? failed
				: notDone
		);
		setLevel(exercise.Level === 'Beginner' ? beginner : exercise.Level === 'Intermediate' ? intermediate : advanced);
	}, [exercise]);

	return (
		<div className='bg-sidebar p-4 rounded-3xl border border-sidebar min-w-[15rem] shadow hover:shadow-lg hover:shadow-accent hover:border-accent duration-300 hover:-translate-y-1'>
			<span className='font-bold line-clamp-2 min-h-[48px]'>{exercise.Title}</span>
			<p className='line-clamp-3 min-h-[72px] my-3'>{exercise.Description}</p>
			<div className='flex justify-center my-2'>
				<OverlayTrigger
					placement='top'
					overlay={
						<Tooltip className='text-accentSecondary' style={{ fontSize: '15px' }}>
							{exercise.Status}
						</Tooltip>
					}
				>
					<img src={status} alt={status} className='w-10 h-10 inline-block mx-8' title={status} />
				</OverlayTrigger>

				<OverlayTrigger
					placement='top'
					overlay={
						<Tooltip className='text-accentSecondary' style={{ fontSize: '15px' }}>
							{exercise.Level}
						</Tooltip>
					}
				>
					<img src={level} alt={level} className='w-11 h-11 inline-block mx-8' title={level} />
				</OverlayTrigger>
			</div>
			<button
				className='p-2 bg-accent font-semibold w-full rounded-full shadow shadow-primary duration-300 active:bg-secondary active:text-sidebar border border-accent hover:border-secondary'
				onClick={() =>
					exercise.Status === 'Complete' || exercise.Status === 'Failed'
						? navigate(`/result/${topic}/${exercise.Title}`)
						: navigate(`/coding/${topic}/${exercise.Title}`)
				}
			>
				Attempt
			</button>
		</div>
	);
}

export default ExerciseCard;
