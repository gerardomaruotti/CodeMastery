import gold from '../assets/icons/Gold.svg';
import silver from '../assets/icons/Silver.svg';
import bronze from '../assets/icons/Bronze.svg';
import trophy from '../assets/icons/Trophy.svg';
import placeholder from '../assets/icons/MedalPlaceholder.svg';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function TopicItem({ topic, isSelected, setTopic }) {
	const medal =
		topic.Medal === 'Gold'
			? gold
			: topic.Medal === 'Silver'
				? silver
				: topic.Medal === 'Bronze'
					? bronze
					: topic.Medal === 'Trophy'
						? trophy
						: placeholder;


	return isSelected ? (
		<div
			className={'flex justify-between items-center border-2 border-accent shadow text-secondary bg-sidebar my-1 p-4 rounded-3xl'}
			onClick={() => setTopic(topic)}
		>
			<div>
				<h1 className='font-bold'>{topic.Title}</h1>
				<span className='text-accentSecondary'>
					{topic.Done_Exercises}/{topic.Tot_Exercises}
				</span>
			</div>
			<OverlayTrigger
				placement='top'
				overlay={
					<Tooltip className='text-accentSecondary' style={{ fontSize: '15px' }}>
						{topic.Medal || 'No Medal'}
					</Tooltip>
				}
			>
				<img src={medal} alt='medal' className='w-10 h-10 inline-block ml-8 mr-3' title='Done' />
			</OverlayTrigger>
		</div >
	) : (
		<div
			className={'flex justify-between items-center text-secondary bg-sidebar shadow  my-1 p-4 border border-sidebar hover:border-accent rounded-3xl'}
			onClick={() => setTopic(topic)}
		>
			<div>
				<h1 className='font-bold'>{topic.Title}</h1>
				<span className='text-accentSecondary'>
					{topic.Done_Exercises}/{topic.Tot_Exercises}
				</span>
			</div>
			<OverlayTrigger
				placement='top'
				overlay={
					<Tooltip className='text-accentSecondary' style={{ fontSize: '15px' }}>
						{topic.Medal || 'No Medal'}
					</Tooltip>
				}
			>
				<img src={medal} alt='medal' className='w-10 h-10 inline-block ml-8 mr-3' title='Done' />
			</OverlayTrigger>		</div>
	);
}

export default TopicItem;
