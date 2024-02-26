import CircularButton from '../components/CircularButton';
import Sidebar from '../components/Sidebar';
import { IoFilter, IoSearch, IoSwapVertical, IoChevronBack, IoClose } from 'react-icons/io5';
import { FaSortAmountDown } from 'react-icons/fa';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import ExerciseCard from '../components/ExerciseCard';
import { useEffect, useState } from 'react';
import ExercisesAPI from '../api/ExercisesAPI';
import Trophy from '../assets/icons/Trophy.svg';

function ExercisesList() {
	const topic = useParams().topic;
	const [exercises, setExercises] = useState([]);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
	const [sortOption, setSortOption] = useState('');
	const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
	const [isDifficultySubmenuOpen, setIsDifficultySubmenuOpen] = useState(false);
	const [isCompletionSubmenuOpen, setIsCompletionSubmenuOpen] = useState(false);
	const [filterOption, setFilterOption] = useState('');
	const [filteredExercises, setfilteredExercises] = useState(exercises);
	const [completedExercises, setCompletedExercises] = useState(0);
	const statusValues = {
		Incomplete: 0,
		'In Progress': 1,
		Complete: 2,
		Failed: 3,
	};
	const levelValues = {
		Beginner: 0,
		Intermediate: 1,
		Advanced: 2,
	};

	const navigate = useNavigate();
	const location = useLocation();
	let path = location.pathname;
	path = decodeURIComponent(path);
	let displayPath = path.split('/').slice(2).join(' ');

	const clearSearch = () => {
		setSearchText('');
		setfilteredExercises(exercises);
		setIsFilterDropdownOpen(false);
		setIsSortDropdownOpen(false);
	};

	const handleSearch = (e) => {
		const value = e.target.value;
		setSearchText(value);
		const sorted = exercises.filter((exercise) => exercise.Title.toLowerCase().includes(value.toLowerCase()));
		setfilteredExercises(sorted);
	};

	const handleReverseSorting = () => {
		switch (sortOption) {
			case 'name [A-Z]':
				setSortOption('name [Z-A]');
				break;
			case 'name [Z-A]':
				setSortOption('name [A-Z]');
				break;
			case 'completion [D-ND]':
				setSortOption('completion [ND-D]');
				break;
			case 'completion [ND-D]':
				setSortOption('completion [D-ND]');
				break;
			case 'level [B-A]':
				setSortOption('level [A-B]');
				break;
			case 'level [A-B]':
				setSortOption('level [B-A]');
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		ExercisesAPI.getExercises(topic).then(async (res) => {
			if (res.status === 200) {
				let exercisesData = await res.json();
				switch (sortOption) {
					case 'name [A-Z]':
						exercisesData.sort((a, b) => a.Title.localeCompare(b.Title));
						break;
					case 'name [Z-A]':
						exercisesData.sort((a, b) => b.Title.localeCompare(a.Title));
						break;
					case 'completion [D-ND]':
						exercisesData.sort((a, b) => statusValues[b.Status] - statusValues[a.Status]);
						break;
					case 'completion [ND-D]':
						exercisesData.sort((a, b) => statusValues[a.Status] - statusValues[b.Status]);
						break;
					case 'level [B-A]':
						exercisesData.sort((a, b) => levelValues[a.Level] - levelValues[b.Level]);
						break;
					case 'level [A-B]':
						exercisesData.sort((a, b) => levelValues[b.Level] - levelValues[a.Level]);
						break;
					default:
						break;
				}
				if (filterOption) {
					let filterOptions;

					if (filterOption.includes('Progress')) {
						const splitResult = filterOption.split(' ');
						filterOptions = [splitResult.shift(), splitResult.join(' ')];
					} else filterOptions = filterOption.split(' ');

					exercisesData = exercisesData.filter((exercise) => {
						let isFiltered = true;
						filterOptions.forEach((option) => {
							if (option === 'level') {
								isFiltered = isFiltered && exercise.Level === filterOptions[1];
							} else if (option === 'completion') {
								isFiltered = isFiltered && exercise.Status === filterOptions[1];
							}
						});
						return isFiltered;
					});
				}
				setCompletedExercises(exercisesData.filter((exercise) => exercise.Status === 'Complete').length);
				setExercises(exercisesData);
				setfilteredExercises(exercisesData);
			} else console.log(res);
		});
	}, [sortOption, filterOption]);

	useEffect(() => {
		if (exercises.length > 0) {
			setfilteredExercises(exercises);
		}
	}, [exercises]);

	return (
		<div>
			<Sidebar />
			<div className='sm:ml-64 sm:p-4 text-secondary'>
				<div className='flex sticky justify-between top-0 bg-primary'>
					<div className='flex'>
						<CircularButton icon={<IoChevronBack />} action={() => navigate('/')} />
						<div className='flex flex-col justify-center'>
							<h1 className='text-2xl font-semibold'>{displayPath}</h1>
							<div className='flex flex-row items-center pb-2 text-base font-semibold text-accentSecondary'>
								<span>
									{completedExercises}/{exercises.length} Completed&nbsp;
								</span>
								<button className='text-accentSecondary text-lg font-semibold' onClick={clearSearch}>
									{searchText && `• Search by ${searchText}`}&nbsp;
								</button>
								<button onClick={() => setFilterOption('')}>
									{filterOption &&
										`• Filtered by ${filterOption.split(' ')[0].charAt(0).toUpperCase() + filterOption.split(' ')[0].slice(1)}: ${filterOption
											.split(' ')
											.slice(1)
											.join(' ')}`}
								</button>
								<button onClick={() => setSortOption('')}>
									{sortOption && `• Sorted by ${sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}`}&nbsp;
								</button>
								{sortOption && <FaSortAmountDown className='ml-2 text-xl text-accentSecondary cursor-pointer' onClick={handleReverseSorting} />}
							</div>
						</div>
					</div>
					<div className='flex'>
						{isSearchOpen ? (
							<CircularButton icon={<IoSearch />} bg={'accent'} action={() => setIsSearchOpen(false)} />
						) : searchText ? (
							<CircularButton icon={<IoSearch />} shadow={'accent'} action={() => setIsSearchOpen(true)} />
						) : (
							<CircularButton icon={<IoSearch />} action={() => setIsSearchOpen(true)} />
						)}
						{isSortDropdownOpen ? (
							<CircularButton icon={<IoSwapVertical />} bg={'accent'} action={() => setIsSortDropdownOpen(false)} />
						) : sortOption ? (
							<CircularButton
								shadow={'accent'}
								icon={<IoSwapVertical />}
								action={() => {
									setIsFilterDropdownOpen(false);
									setIsSortDropdownOpen(true);
								}}
							/>
						) : (
							<CircularButton
								icon={<IoSwapVertical />}
								action={() => {
									setIsFilterDropdownOpen(false);
									setIsSortDropdownOpen(true);
								}}
							/>
						)}
						{isFilterDropdownOpen ? (
							<CircularButton
								icon={<IoFilter />}
								bg={'accent'}
								action={() => {
									setIsFilterDropdownOpen(false);
									setIsDifficultySubmenuOpen(false);
								}}
							/>
						) : filterOption ? (
							<CircularButton
								shadow={'accent'}
								icon={<IoFilter />}
								action={() => {
									setIsSortDropdownOpen(false);
									setIsFilterDropdownOpen(true);
								}}
							/>
						) : (
							<CircularButton
								icon={<IoFilter />}
								action={() => {
									setIsSortDropdownOpen(false);
									setIsFilterDropdownOpen(true);
								}}
							/>
						)}
					</div>
				</div>
				{isSortDropdownOpen && (
					<div className='absolute right-20 w-48 rounded-xl bg-sidebar border border-accent shadow-lg z-50'>
						<div className='px-2 py-3 flex flex-col'>
							<div className='flex items-center'>
								<p className='text-base text-secondaryText pb-2 pl-1 flex-grow'>Sort by</p>
								{sortOption && (
									<p
										className='pb-2 pl-1 text-[10px] text-accent cursor-pointer mr-1'
										onClickCapture={() => {
											setSortOption('');
											clearSearch();
										}}
									>
										Reset
									</p>
								)}
							</div>
							<button
								className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${
									sortOption.startsWith('name') ? 'bg-accent' : ''
								}`}
								onClick={() => {
									setSortOption(sortOption === 'name [A-Z]' ? '' : 'name [A-Z]');
									setIsSortDropdownOpen(false);
								}}
							>
								Name
							</button>
							<button
								className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${
									sortOption.startsWith('level') ? 'bg-accent' : ''
								}`}
								onClick={() => {
									setSortOption(sortOption === 'level [B-A]' ? '' : 'level [B-A]');
									setIsSortDropdownOpen(false);
								}}
							>
								Level
							</button>
							<button
								className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${
									sortOption.startsWith('completion') ? 'bg-accent' : ''
								}`}
								onClick={() => {
									setSortOption(sortOption === 'completion [D-ND]' ? '' : 'completion [D-ND]');
									setIsSortDropdownOpen(false);
								}}
							>
								Completion
							</button>
						</div>
					</div>
				)}
				{isFilterDropdownOpen && (
					<div className='absolute right-4 w-48 rounded-xl bg-sidebar border border-accent shadow-lg z-50'>
						<div className='px-2 py-3 flex flex-col'>
							<div className='flex items-center'>
								<p className='text-base text-secondaryText pb-2 pl-1 flex-grow'>Filter by</p>
								{filterOption && (
									<p
										className='pb-2 pl-1 text-[10px] text-accent cursor-pointer'
										onClickCapture={() => {
											setFilterOption('');
											clearSearch();
										}}
									>
										Reset
									</p>
								)}
							</div>
							<button
								className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${
									filterOption.includes('level') ? 'bg-accent' : ''
								}`}
								onClick={() => {
									setIsCompletionSubmenuOpen(false);
									setIsDifficultySubmenuOpen(!isDifficultySubmenuOpen);
								}}
							>
								Level
								{isDifficultySubmenuOpen && (
									<div className='absolute px-2 py-3 flex flex-col right-0 w-48 rounded-xl bg-sidebar border border-accent shadow-lg z-50'>
										<div
											className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${
												filterOption.includes('Beginner') ? 'bg-accent' : ''
											}`}
											onClick={() =>
												(filterOption.includes('Beginner') ? setFilterOption('') : setFilterOption('level Beginner')) ||
												setIsFilterDropdownOpen(false)
											}
										>
											Beginner
										</div>
										<div
											className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${
												filterOption.includes('Intermediate') ? 'bg-accent' : ''
											}`}
											onClick={() =>
												(filterOption.includes('Intermediate') ? setFilterOption('') : setFilterOption('level Intermediate')) ||
												setIsFilterDropdownOpen(false)
											}
										>
											Intermediate
										</div>
										<div
											className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${
												filterOption.includes('Advanced') ? 'bg-accent' : ''
											}`}
											onClick={() =>
												(filterOption.includes('Advanced') ? setFilterOption('') : setFilterOption('level Advanced')) ||
												setIsFilterDropdownOpen(false)
											}
										>
											Advanced
										</div>
									</div>
								)}
							</button>

							<button
								className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${
									filterOption.includes('completion') ? 'bg-accent' : ''
								}`}
								onClick={() => {
									setIsDifficultySubmenuOpen(false);
									setIsCompletionSubmenuOpen(!isCompletionSubmenuOpen);
								}}
							>
								Completion
								{isCompletionSubmenuOpen && (
									<div className='absolute px-2 py-3 flex flex-col right-0 w-48 rounded-xl bg-sidebar border border-accent shadow-lg z-50'>
										<div
											className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${
												filterOption.includes('Incomplete') ? 'bg-accent' : ''
											}`}
											onClick={() =>
												(filterOption.includes('Incomplete') ? setFilterOption('') : setFilterOption('completion Incomplete')) ||
												setIsFilterDropdownOpen(false)
											}
										>
											Incomplete
										</div>
										<div
											className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${
												filterOption.includes('Complete') ? 'bg-accent' : ''
											}`}
											onClick={() =>
												(filterOption.includes('Complete') ? setFilterOption('') : setFilterOption('completion Complete')) ||
												setIsFilterDropdownOpen(false)
											}
										>
											Complete
										</div>
										<div
											className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${
												filterOption.includes('Failed') ? 'bg-accent' : ''
											}`}
											onClick={() =>
												(filterOption.includes('Failed') ? setFilterOption('') : setFilterOption('completion Failed')) ||
												setIsFilterDropdownOpen(false)
											}
										>
											Failed
										</div>
										<div
											className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${
												filterOption.includes('In Progress') ? 'bg-accent' : ''
											}`}
											onClick={() =>
												(filterOption.includes('In Progress') ? setFilterOption('') : setFilterOption('completion In Progress')) ||
												setIsFilterDropdownOpen(false)
											}
										>
											In Progress
										</div>
									</div>
								)}
							</button>
						</div>
					</div>
				)}
				{isSearchOpen ? (
					<div className='flex justify-content-center items-center text-secondary w-full'>
						<div className='w-1/2 relative mb-4 mt-2'>
							<input
								type='search'
								name='search'
								placeholder='Search exercises...'
								className='bg-sidebar border border-sidebar placeholder-secondaryText shadow px-4 py-3 w-full rounded-full text-sm focus:outline-none focus:border-accent'
								value={searchText}
								onChange={handleSearch}
								autoFocus
							/>
							{searchText ? (
								<IoClose className='text-xl absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer' onClick={clearSearch} />
							) : (
								<IoSearch className='text-xl absolute right-5 top-1/2 transform -translate-y-1/2' />
							)}
						</div>
					</div>
				) : null}
				{completedExercises === exercises.length && exercises.length > 0 && (
					<div className='flex flex-row items-center w-full h-[20vh] justify-evenly animate-slideDown'>
						<div className='flex flex-row items-center'>
							<img src={Trophy} alt='trophy' className='w-[75px] h-[75px] m-10' />
							<div className='flex flex-col items-start'>
								<h1 className='text-3xl mb-3 font-semibold'>Congratulations, topic completed!</h1>
								<h2 className='text-2xl font-semibold'>Now you can propose an exercise</h2>
							</div>
						</div>
						<button
							className='bg-accent rounded-full py-3 px-10 text-center shadow-lg border border-accent hover:border-secondary active:bg-secondary active:text-sidebar hover:-translate-y-1 duration-150'
							onClick={() => {
								navigate('/propose-page');
							}}
						>
							Propose Exercise
						</button>
					</div>
				)}
				{filteredExercises.length === 0 && (searchText || sortOption || filterOption) ? (
					<div className='flex flex-col items-center w-full h-[50vh] justify-center'>
						<h1 className='text-3xl mb-6 font-semibold'>No Exercise Found!</h1>
						<button
							className='bg-accent rounded-full py-3 px-10 text-center shadow-lg border border-accent hover:border-secondary active:bg-secondary active:text-sidebar hover:-translate-y-1 duration-150'
							onClick={() => {
								setSortOption('');
								setFilterOption('');
								clearSearch();
							}}
						>
							Reset Filters
						</button>
					</div>
				) : (
					<div className='grid grid-flow-row mt-2 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
						{filteredExercises.map((exercise) => (
							<ExerciseCard key={exercise.Title} topic={topic} exercise={exercise} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default ExercisesList;
