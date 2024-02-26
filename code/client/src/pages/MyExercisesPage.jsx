import Sidebar from '../components/Sidebar';
import ExerciseItem from '../components/ExerciseItem';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoSwapVertical, IoTrash, IoPencil, IoAdd, IoClose, IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { FaSortAmountDown } from 'react-icons/fa';
import CircularButton from '../components/CircularButton';
import Accepted from '../assets/icons/Done.svg';
import Pending from '../assets/icons/InProgress.svg';
import Rejected from '../assets/icons/Failed.svg';
import ProposalsAPI from '../api/ProposalsAPI';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import TopicsAPI from '../api/TopicsAPI';
import Swal from 'sweetalert2';

function MyExercisesPage() {
	const navigate = useNavigate();
	const [proposedExercises, setProposedExercises] = useState([]);
	const [selectedExercise, setSeletedExercise] = useState([]);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [sortOption, setSortOption] = useState('');
	const [filteredExercises, setFilteredExercises] = useState(proposedExercises);
	const [isAllowed, setIsAllowed] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const statusValues = {
		Pending: 2,
		Accepted: 1,
		Rejected: 0,
	};

	const clearSearch = () => {
		setSearchText('');
		setFilteredExercises(proposedExercises);
	};

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	const handleSearch = (e) => {
		const value = e.target.value;
		setSearchText(value);
		const sorted = proposedExercises.filter((exercise) => exercise.Title.toLowerCase().includes(value.toLowerCase()));
		setFilteredExercises(sorted);
	};

	const deleteProposal = (proposalId) => {
		Swal.fire({
			title: 'Are you sure?',
			text: 'You will not be able to recover this exercise!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			cancelButtonText: 'Cancel',
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed)
				ProposalsAPI.deleteProposal(proposalId).then(async (res) => {
					if (res.status === 200) {
						let proposalsData = await res.json();
						setProposedExercises(proposalsData);
					} else console.log(res);
				});
		});
	};

	useEffect(() => {
		if (isAllowed)
			ProposalsAPI.getProposals().then(async (res) => {
				if (res.status === 200) {
					let proposalsData = await res.json();
					switch (sortOption) {
						case 'name [A-Z]':
							proposalsData.sort((a, b) => a.Title.localeCompare(b.Title));
							break;
						case 'name [Z-A]':
							proposalsData.sort((a, b) => b.Title.localeCompare(a.Title));
							break;
						case 'completion [A-R]':
							proposalsData.sort((a, b) => statusValues[b.Status] - statusValues[a.Status]);
							break;
						case 'completion [R-A]':
							proposalsData.sort((a, b) => statusValues[a.Status] - statusValues[b.Status]);
							break;
						default:
							break;
					}
					setProposedExercises(proposalsData);
				} else console.log(res);
			});
	}, [sortOption, isAllowed]);

	const handleReverseSorting = () => {
		switch (sortOption) {
			case 'name [A-Z]':
				setSortOption('name [Z-A]');
				break;
			case 'name [Z-A]':
				setSortOption('name [A-Z]');
				break;
			case 'completion [A-R]':
				setSortOption('completion [R-A]');
				break;
			case 'completion [R-A]':
				setSortOption('completion [A-R]');
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		if (proposedExercises.length > 0) {
			setSeletedExercise(proposedExercises[0]);
			setFilteredExercises(proposedExercises);
		}
	}, [proposedExercises]);

	useEffect(() => {
		TopicsAPI.getTopics().then(async (res) => {
			if (res.status === 200) {
				let topicsData = await res.json();
				setIsAllowed(topicsData.some((topic) => topic.Tot_Exercises === topic.Done_Exercises));
			}
		});
	}, []);

	return isAllowed ? (
		proposedExercises.length > 0 ? (
			<>
				<Sidebar />
				<div className='sm:ml-64 sm:p-4  text-secondary'>
					<div className='bg-primary sticky top-0 flex flex-row justify-between items-center mb-2'>
						<div className='flex flex-col'>
							<h1 className='text-3xl font-bold'>My Exercises</h1>
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
									className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${
										sortOption.startsWith('name') ? 'bg-accent' : ''
									}`}
									onClick={() => {
										setSortOption(sortOption === 'name [A-Z]' ? '' : 'name [A-Z]');
										setIsDropdownOpen(false);
									}}
								>
									Name
								</button>
								<button
									className={`text-start pl-2 py-1 rounded-lg border border-sidebar hover:border-accent duration-150 ${
										sortOption.startsWith('completion') ? 'bg-accent' : ''
									}`}
									onClick={() => {
										setSortOption(sortOption === 'completion [A-R]' ? '' : 'completion [A-R]');
										setIsDropdownOpen(false);
									}}
								>
									Completion
								</button>
							</div>
						</div>
					)}
					<div className='flex'>
						{filteredExercises.length === 0 && searchText !== '' ? (
							<div className='flex flex-col items-center w-full h-[50vh] justify-center'>
								<h1 className='text-3xl mb-6 font-semibold'>No Exercise Found!</h1>
								<button
									className='bg-accent rounded-full py-3 px-10 text-center shadow-lg border border-accent hover:border-secondary active:bg-secondary active:text-sidebar hover:-translate-y-1 duration-150'
									onClick={() => {
										clearSearch();
										setSortOption('');
									}}
								>
									Reset Filters
								</button>
							</div>
						) : (
							<div className='flex flex-col p-2 rounded-2xl pt-0 max-h-[75vh] overflow-y-auto' style={{ flex: '2', height: 'calc(100vh - 50px)' }}>
								{filteredExercises.map((exercise) => (
									<ExerciseItem
										key={exercise.Title}
										topic={exercise}
										isSelected={selectedExercise.Title === exercise.Title}
										setTopic={setSeletedExercise}
									/>
								))}
							</div>
						)}
						{selectedExercise && filteredExercises.length > 0 ? (
							<div className='bg-sidebar h-[65vh] p-4 rounded-3xl sticky top-20 flex flex-col justify-between' style={{ flex: '3' }}>
								<div>
									<h1 className='text-2xl font-semibold'>{selectedExercise.Title}</h1>
									<h2 className='text-xl text-accentSecondary font-semibold'>{selectedExercise.Topic}</h2>
									<p className='mt-2 text-base'>{selectedExercise.Description}</p>
								</div>
								<div>
									{selectedExercise.Status === 'Rejected' && (
										<div className='w-full mx-auto mt-4 mb-4 self-end bottom rounded-[20px] bg-primary'>
											<div className='bg-primary rounded-[20px]'>
												{isOpen && (
													<div className='py-2 px-3'>
														<p className='text-md'>{selectedExercise.Notes}</p>
													</div>
												)}
												<button
													className={`w-full py-2 px-3 text-left bg-primary rounded-[20px] border border-primary hover:border-accent`}
													onClick={handleToggle}
												>
													<div className='flex'>
														<span className='flex-grow text-lg font-medium text-[#d9634c]'>Notes</span>
														{isOpen && <IoChevronDown className={`w-6 h-6 text-accent`} />}
														{!isOpen && <IoChevronUp className={`w-6 h-6 text-accent`} />}
													</div>
												</button>
											</div>
										</div>
									)}
									<div className='flex justify-between items-center'>
										{selectedExercise.Status === 'Accepted' && (
											<OverlayTrigger placement='top' overlay={<Tooltip className='text-accentSecondary pb-2'>Accepted</Tooltip>}>
												<img src={Accepted} alt='medal' className='w-12 h-12 inline-block mr-3' title='Accepted' />
											</OverlayTrigger>
										)}
										{selectedExercise.Status === 'Rejected' && (
											<OverlayTrigger placement='top' overlay={<Tooltip className='text-accentSecondary pb-2'>Rejected</Tooltip>}>
												<img src={Rejected} alt='medal' className='w-12 h-12 inline-block mr-3' title='Rejected' />
											</OverlayTrigger>
										)}
										{selectedExercise.Status === 'Pending' && (
											<OverlayTrigger placement='top' overlay={<Tooltip className='text-accentSecondary pb-2'>Pending</Tooltip>}>
												<img src={Pending} alt='medal' className='w-12 h-12 inline-block mr-3' title='Pending' />
											</OverlayTrigger>
										)}
										<div className='flex justify-end '>
											<CircularButton
												icon={<IoPencil />}
												bg={'primary'}
												action={() => navigate(`/proposals/${selectedExercise.Topic}/${selectedExercise.Title}/edit`)}
											/>
											<CircularButton
												icon={<IoTrash />}
												bg={'primary'}
												action={() => {
													deleteProposal(selectedExercise.Title);
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						) : null}
					</div>
					<button
						className='fixed bottom-5 right-5 p-3 bg-accent font-semibold rounded-full shadow border border-accent duration-150 hover:-translate-y-1 hover:-translate-x-1 hover:border-secondary active:bg-secondary active:text-sidebar'
						onClick={() => navigate('/proposals')}
					>
						<IoAdd className='w-4 h-4' />
					</button>
				</div>
			</>
		) : (
			<>
				<Sidebar />
				<div className='sm:ml-64 sm:p-4  text-secondary'>
					<div className='bg-primary sticky top-0 flex flex-row justify-between items-center mb-2'>
						<div className='flex flex-col'>
							<h1 className='text-3xl font-bold'>My Exercises</h1>
							<div className='flex flex-row'>
								<button className='text-accentSecondary text-lg font-semibold' onClick={clearSearch}>
									{searchText && `Search by ${searchText}`}
								</button>
								<button className='text-accentSecondary text-lg font-semibold' onClick={() => setSortOption('')}>
									{sortOption && `Sorted by ${sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}`}
								</button>
							</div>
						</div>
					</div>
					<div className='flex flex-col items-center w-full h-[50vh] justify-center'>
						<h1 className='text-3xl mb-6 font-semibold'>No Proposals Found!</h1>
						<button
							className='bg-accent rounded-full py-3 px-10 text-center shadow-lg border border-accent hover:border-secondary active:bg-secondary active:text-sidebar hover:-translate-y-1 duration-150'
							onClick={() => navigate('/proposals')}
						>
							Propose a new exercise
						</button>
					</div>
				</div>
			</>
		)
	) : (
		<>
			<Sidebar />
			<div className='sm:ml-64 sm:p-4  text-secondary'>
				<div className='bg-primary sticky top-0 flex flex-row justify-between items-center mb-2'>
					<div className='flex flex-col'>
						<h1 className='text-3xl font-bold'>My Exercises</h1>
						<div className='flex flex-row'>
							<button className='text-accentSecondary text-lg font-semibold' onClick={clearSearch}>
								{searchText && `Search by ${searchText}`}
							</button>
							<button className='text-accentSecondary text-lg font-semibold' onClick={() => setSortOption('')}>
								{sortOption && `Sorted by ${sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}`}
							</button>
						</div>
					</div>
				</div>
				<div className='flex flex-col items-center w-full h-[50vh] justify-center'>
					<h1 className='text-3xl mb-6 font-semibold text-accentThird'>Don't give up!</h1>
					<h2 className='text-center'>In order to propose an exercise, you need to successfully complete all the exercises of a specific topic.</h2>
					<button
						className='bg-accent rounded-full py-3 px-10 text-center shadow-lg border border-accent hover:border-secondary active:bg-secondary active:text-sidebar hover:-translate-y-1 duration-150 mt-6'
						onClick={() => navigate('/')}
					>
						See Topics
					</button>
				</div>
			</div>
		</>
	);
}

export default MyExercisesPage;
