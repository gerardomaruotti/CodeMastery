import done from '../assets/icons/Done.svg';
import inProgress from '../assets/icons/InProgress.svg';
import failed from '../assets/icons/Failed.svg';

function ExerciseItem({ topic, isSelected, setTopic }) {
	const isSelectedClasses = isSelected ? 'border-2 border-accent' : 'border border-sidebar hover:border-accent';
	const status = topic.Status === 'Accepted' ? done : topic.Status === 'Rejected' ? failed : inProgress;
	return (
		<div
			className={`flex justify-between items-center text-secondary bg-sidebar shadow  my-1 p-4 rounded-3xl ${isSelectedClasses}`}
			onClick={() => setTopic(topic)}
		>
			<h1 className='font-bold'>{topic.Title}</h1>
			<img src={status} alt='medal' className='w-10 h-10 inline-block ml-8 mr-3' title='Done' />
		</div>
	);
}

export default ExerciseItem;
