import Sidebar from '../components/Sidebar';
import TopicItem from '../components/TopicItem';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoSwapVertical, IoClose } from 'react-icons/io5';
import { FaSortAmountDown } from 'react-icons/fa';
import CircularButton from '../components/CircularButton';
import TopicsAPI from '../api/TopicsAPI';

function TopicsList() {
	const navigate = useNavigate();
	const [topics, setTopics] = useState([]);
	const [selectedTopic, setSelectedTopic] = useState({});
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [sortOption, setSortOption] = useState('');
	const [filteredTopics, setFilteredTopics] = useState(topics);
	const medalValues = {
		Trophy: 4,
		Gold: 3,
		Silver: 2,
		Bronze: 1,
		'': 0,
	};

	const clearSearch = () => {
		setSearchText('');
		setFilteredTopics(topics);
	};

	const handleSearch = (e) => {
		const value = e.target.value;
		setSearchText(value);
		const sorted = topics.filter((topic) => topic.Title.toLowerCase().includes(value.toLowerCase()));
		setFilteredTopics(sorted);
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
			default:
				break;
		}
	};

	useEffect(() => {
		TopicsAPI.getTopics().then(async (res) => {
			if (res.status === 200) {
				let topicsData = await res.json();
				switch (sortOption) {
					case 'name [A-Z]':
						topicsData.sort((a, b) => a.Title.localeCompare(b.Title));
						break;
					case 'name [Z-A]':
						topicsData.sort((a, b) => b.Title.localeCompare(a.Title));
						break;
					case 'completion [D-ND]' /** Before Done */:
						topicsData.sort((a, b) => medalValues[b.Medal] - medalValues[a.Medal]);
						break;
					case 'completion [ND-D]':
						topicsData.sort((a, b) => medalValues[a.Medal] - medalValues[b.Medal] || a.Done_Exercises - b.Done_Exercises);

					default:
						break;
				}
				setTopics(topicsData);
			} else console.log(res);
		});
	}, [sortOption]);

	useEffect(() => {
		if (topics.length > 0) {
			setSelectedTopic(topics[0]);
			setFilteredTopics(topics);
		}
	}, [topics]);

	return (
		<>
			<Sidebar />
			<div className='sm:ml-64 sm:p-4 text-secondary'>
				<div className='bg-primary sticky top-0 flex flex-row justify-between items-center mb-2'>
					<div className='flex flex-col'>
						<h1 className='text-3xl font-bold'>Topics</h1>
						<div className='flex flex-row items-center'>
							<button className='text-accentSecondary text-lg font-semibold' onClick={clearSearch}>
								{searchText && `Search by ${searchText}${sortOption ? ' and\u00A0' : ''}`}
							</button>
							<button className='text-accentSecondary text-lg font-semibold' onClick={() => setSortOption('')}>
								{sortOption && `Sorted by ${sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}`}
							</button>

							{sortOption && <FaSortAmountDown className='ml-2 text-xl text-accentSecondary cursor-pointer' onClick={handleReverseSorting} />}
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
						{isDropdownOpen ? (
							<CircularButton icon={<IoSwapVertical />} bg={'accent'} action={() => setIsDropdownOpen(false)} />
						) : sortOption ? (
							<CircularButton icon={<IoSwapVertical />} shadow={'accent'} action={() => setIsDropdownOpen(true)} />
						) : (
							<CircularButton icon={<IoSwapVertical />} action={() => setIsDropdownOpen(true)} />
						)}
					</div>
				</div>
				{isDropdownOpen && (
					<div className='absolute right-4 w-48 rounded-xl bg-sidebar border border-accent shadow-lg z-50'>
						<div className='px-2 py-3 flex flex-col'>
							<div className='flex items-center'>
								<p className='text-base text-secondaryText pb-2 pl-1 flex-grow'>Sort by</p>
								{sortOption && (
									<p
										className='pb-2 pl-1 text-[10px] text-accent cursor-pointer mr-1'
										onClickCapture={() => {
											setSortOption('');
											clearSearch();
											setIsDropdownOpen(false);
										}}
									>
										Reset
									</p>
								)}
							</div>
							<button
								className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${sortOption.startsWith('name') ? 'bg-accent' : ''
									}`}
								onClick={() => {
									setSortOption(sortOption === 'name [A-Z]' ? '' : 'name [A-Z]');
									setIsDropdownOpen(false);
								}}
							>
								Name
							</button>
							<button
								className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${sortOption.startsWith('completion') ? 'bg-accent' : ''
									}`}
								onClick={() => {
									setSortOption(sortOption === 'completion [D-ND]' ? '' : 'completion [D-ND]');
									setIsDropdownOpen(false);
								}}
							>
								Completion
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
								placeholder='Search topics...'
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
				<div className='flex'>
					{filteredTopics.length === 0 && searchText !== '' ? (
						<div className='flex flex-col items-center w-full h-[50vh] justify-center'>
							<h1 className='text-3xl mb-6 font-semibold'>No Topic Found!</h1>
							<button
								className='bg-accent rounded-full py-3 px-10 text-center shadow-lg border border-accent hover:border-secondary active:bg-secondary active:text-sidebar hover:-translate-y-1 duration-150'
								onClick={() => {
									clearSearch();
								}}
							>
								Reset Filters
							</button>
						</div>
					) : (
						<div className='flex flex-col p-2 rounded-2xl pt-0 max-h-[75vh] overflow-y-auto' style={{ flex: '2', height: 'calc(100vh - 50px)' }}>
							{filteredTopics.map((topic) => (
								<TopicItem key={topic.Title} topic={topic} isSelected={selectedTopic.Title === topic.Title} setTopic={setSelectedTopic} />
							))}
						</div>
					)}
					{selectedTopic && filteredTopics.length > 0 ? (
						<div className='bg-sidebar h-[65vh] p-4 rounded-3xl sticky top-20 flex flex-col justify-between' style={{ flex: '3' }}>
							<div>
								<div className='flex flex-row justify-between'>
									<h1 className='text-2xl font-semibold text-secondary'>{selectedTopic.Title}</h1>
									<span className='text-accentSecondary font-semibold'>
										{selectedTopic.Done_Exercises}/{selectedTopic.Tot_Exercises} Completed
									</span>
								</div>
								<h1 className='text-xl mt-2 font-semibold text-secondaryText'>Description</h1>
								<p className='mt-2 text-base'>{selectedTopic.Description}</p>
							</div>
							{selectedTopic.Title && (
								<button
									className='p-2 mt-2 bg-accent font-semibold w-full rounded-full shadow border border-accent duration-150 hover:border-secondary active:bg-secondary active:text-sidebar'
									onClick={() => navigate('/topics/' + selectedTopic.Title)}
								>
									Choose Topic
								</button>
							)}
						</div>
					) : null}
				</div>
			</div>
		</>
	);
}

export default TopicsList;
