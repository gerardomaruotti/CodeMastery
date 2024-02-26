import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, OverlayTrigger, Tooltip, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import GeneralButton from '../components/GeneralButton';
import { IoChevronBack, IoChevronUp, IoChevronDown } from 'react-icons/io5';
import { MdOutlineFileUpload } from 'react-icons/md';
import Beginner from '../assets/icons/Beginner.svg';
import Intermediate from '../assets/icons/Intermediate.svg';
import Advanced from '../assets/icons/Advanced.svg';
import HideArrowCode from '../assets/icons/HideArrowCode.svg';
import ShowArrowCode from '../assets/icons/ShowArrowCode.svg';
import Trophy from '../assets/icons/Trophy.svg';
import NoDifficulty from '../assets/icons/DifficultyPlaceholder.svg';
import ProposalsAPI from '../api/ProposalsAPI';
import Swal from 'sweetalert2';
import Banner from '../components/Banner';
import TopicsAPI from '../api/TopicsAPI';

function ProposePage() {
	const navigate = useNavigate();
	const { topic: topicTitle, exercise: exerciseTitle } = useParams();
	const [topicsList, setTopicsList] = useState([]);
	const [selectedTopic, setSelectedTopic] = useState(topicTitle ? topicTitle : null);
	const [showDetails, setShowDetails] = useState(true);
	const [previousExercise, setPreviousExercise] = useState(null);
	const [title, setTitle] = useState('');
	const [difficulty, setDifficulty] = useState('');
	const [solution, setSolution] = useState('');
	const [instructions, setInstructions] = useState('');
	const [description, setDescription] = useState('');
	const [status, setStatus] = useState('');
	const [notes, setNotes] = useState('');
	const [previousTitle, setPreviousTitle] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [titleError, setTitleError] = useState(false);
	const [topicError, setTopicError] = useState(false);
	const [difficultyError, setDifficultyError] = useState(false);
	const [descriptionError, setDescriptionError] = useState(false);
	const [instructionsError, setInstructionsError] = useState(false);
	const [solutionError, setSolutionError] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isDropdownTopicsOpen, setIsDropdownTopicsOpen] = useState(false);
	const [showBanner, setShowBanner] = useState(false);
	const [message, setMessage] = useState('Proposal Sent!');
	const [resultStatus, setResultStatus] = useState('Success');
	const [proposeClick, setProposeClick] = useState(false);
	const [isOpen, setIsOpen] = useState(true);

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	const handleDifficultyChange = (selectedDifficulty) => {
		setDifficulty(selectedDifficulty);
		setIsDropdownOpen(false);
	};

	const handleFileUpload = () => {
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.accept =
			'.txt, .csv, .xml, .html, .json, .js, .py, .php, .css, .java, .c, .cpp, .h, .hpp, .md, .sql, .rb, .r, .pl, .go, .cs, .m, .swift, .vb, .asm, .sh, .ps1, .bat, .psm1, .vbs, .ts, .tsx, .jsx, .tsx, .kt, .kts, .ktm, .ktx';
		fileInput.onchange = (e) => {
			const file = e.target.files[0];
			const reader = new FileReader();
			reader.readAsText(file, 'UTF-8');
			reader.onload = (readerEvent) => {
				Swal.fire({
					title: 'Are you sure?',
					text: 'You are about to replace the current solution!',
					icon: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Confirm',
					cancelButtonText: 'Cancel',
					reverseButtons: true,
				}).then((result) => {
					if (result.isConfirmed) {
						setSolution(readerEvent.target.result);
					}
				});
			};
		};
		fileInput.click();
	};

	const validateFields = () => {
		setTitleError(title.trim() === '');
		setTopicError(selectedTopic === null);
		setDifficultyError(difficulty.trim() === '');
		setDescriptionError(description.trim() === '');
		setInstructionsError(instructions.trim() === '');
		setSolutionError(solution.trim() === '');
	};

	const EditProposal = () => {
		setProposeClick(true);
		validateFields();

		if (
			title.trim() === '' ||
			selectedTopic === null ||
			difficulty.trim() === '' ||
			description.trim() === '' ||
			instructions.trim() === '' ||
			solution.trim() === ''
		)
			return;
		else {
			const proposal = {
				topic: selectedTopic.Title,
				title: title,
				description: description,
				instructions: instructions,
				level: difficulty,
				solution: solution,
				status: 'Pending',
			};

			let alertText = 'Your proposal will be sent to the administrator for approval';

			let changeAlert = 'Your accepted proposal will revert to pending if you continue.';

			if (previousExercise) {
				if (previousExercise.Topic !== proposal.topic) {
					alertText = changeAlert;
				} else if (previousExercise.Title !== proposal.title) {
					alertText = changeAlert;
				} else if (previousExercise.Description !== proposal.description) {
					alertText = changeAlert;
				} else if (previousExercise.Instruction !== proposal.instructions) {
					alertText = changeAlert;
				} else if (previousExercise.Level !== proposal.level) {
					alertText = changeAlert;
				} else if (previousExercise.Solution !== proposal.solution) {
					alertText = changeAlert;
				}
			}

			Swal.fire({
				title: 'Are you sure?',
				text: alertText,
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Confirm',
				cancelButtonText: 'Cancel',
				reverseButtons: true,
			}).then((result) => {
				if (result.isConfirmed) {
					ProposalsAPI.updateProposal(exerciseTitle, proposal)
						.then(async (response) => {
							let message = await response.json();

							setMessage(message.error || 'Proposal Sent');

							if (response.status === 200) {
								setResultStatus('Success');

								setShowBanner(true);
								setTimeout(() => {
									setShowBanner(false);
									navigate(`/my-exercises`);
								}, 1000);
							} else {
								setResultStatus('Error');
								setMessage(message.error);

								setShowBanner(true);
								setTimeout(() => {
									setShowBanner(false);
								}, 1000);
							}
						})
						.catch((error) => {
							console.log(error.message);
						});
				}
			});
		}
	};

	const ProposeCode = () => {
		setProposeClick(true);
		validateFields();

		if (
			title.trim() === '' ||
			selectedTopic === null ||
			difficulty.trim() === '' ||
			description.trim() === '' ||
			instructions.trim() === '' ||
			solution.trim() === ''
		)
			return;
		else {
			const proposal = {
				topic: selectedTopic.Title,
				title: title,
				description: description,
				instructions: instructions,
				level: difficulty,
				solution: solution,
				status: 'Pending',
			};

			Swal.fire({
				title: 'Are you sure?',
				text: 'Your proposal will be sent to the administrator for approval',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Confirm',
				cancelButtonText: 'Cancel',
				reverseButtons: true,
			}).then((result) => {
				if (result.isConfirmed) {
					ProposalsAPI.createProposal(proposal)
						.then(async (response) => {
							let message = await response.json();

							setMessage(message.error || 'Proposal Sent');

							if (response.status === 200) {
								setResultStatus('Success');

								setShowBanner(true);
								setTimeout(() => {
									setShowBanner(false);
									navigate(`/my-exercises`);
								}, 1000);
							} else {
								setResultStatus('Error');
								setMessage(message.error);

								setShowBanner(true);
								setTimeout(() => {
									setShowBanner(false);
								}, 1000);
							}
						})
						.catch((error) => {
							console.log(error.message);
						});
				}
			});
		}
	};

	const HandleBlur = (e) => {
		e.preventDefault();

		if (e.target.value.trim() !== '') {
			setTitle(e.target.value);
			setPreviousTitle(e.target.value);
			setIsEditing(false);
			setTitleError(false);
			setIsEditing(false);
		} else {
			setIsEditing(true);
			setTitleError(true);
		}
	};

	const HandleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (e.target.value.trim() !== '') {
				setTitle(e.target.value);
				setPreviousTitle(e.target.value);
				setTitleError(false);
				setIsEditing(false);
			} else {
				setIsEditing(true);
				setTitleError(true);
			}
		}
	};

	const handleCodeTab = (e) => {
		if (e.key === 'Tab') {
			e.preventDefault();
			const start = e.target.selectionStart;
			const end = e.target.selectionEnd;

			setSolution(solution.substring(0, start) + '\t' + solution.substring(end));

			e.target.selectionStart = e.target.selectionEnd = start + 1;
		}
	};

	useEffect(() => {
		if (exerciseTitle) {
			ProposalsAPI.getProposalDetail(exerciseTitle).then(async (res) => {
				if (res.status === 200) {
					let exerciseData = await res.json();
					setPreviousExercise(exerciseData);
					setTitle(exerciseData.Title);
					setDifficulty(exerciseData.Level);
					setDescription(exerciseData.Description);
					setInstructions(exerciseData.Instruction);
					setSolution(exerciseData.Solution);
					setStatus(exerciseData.Status);
					setNotes(exerciseData.Notes);
					setPreviousTitle(exerciseData.Title);
				} else console.log(res);
			});
		}
	}, []);

	useEffect(() => {
		if (topicTitle) {
			TopicsAPI.getTopicDetail(topicTitle).then(async (res) => {
				if (res.status === 200) {
					let topicData = await res.json();
					setSelectedTopic(topicData);
				} else console.log(res);
			});
		}
	}, [topicTitle]);

	useEffect(() => {
		TopicsAPI.getTopics().then(async (res) => {
			if (res.status === 200) {
				let topicsData = await res.json();
				setTopicsList(topicsData.filter((topic) => topic.Tot_Exercises === topic.Done_Exercises));
			} else console.log(res);
		});
	}, []);

	useEffect(() => {
		if (proposeClick) validateFields();
	}, [title, selectedTopic, difficulty, description, instructions, solution, proposeClick, validateFields]);

	// useEffect(() => {
	// 	if (selectedTopic) setMedal(selectedTopic.Medal);
	// }, [selectedTopic]);

	return (
		<Container className='text-secondary bg-primary p-4' fluid>
			{showBanner && <Banner message={message} status={resultStatus} />}

			<Row>
				<Button
					className='bg-sidebar h-[50px] w-[50px] rounded-full p-3 border border-sidebar hover:border-accent hover:-translate-y-0.5 shadow-md transform active:bg-accent transition duration-150'
					onClick={() => navigate(-1)}
				>
					<IoChevronBack />
				</Button>
				<Col md={2} className='justify-content-start'>
					<Row>
						{!isEditing ? (
							<h1
								onClick={() => {
									setIsEditing(true);
								}}
								placeholder='Type here your title'
								className='hover:border-accent ml-3 w-auto rounded-[20px] hover:border font-semibold text-xl'
								style={{
									border: titleError ? '1px solid red' : 'none',
								}}
							>
								{title || 'Type here for your title'}
							</h1>
						) : (
							<InputGroup>
								<FormControl
									className={`bg-primary text-secondary rounded-[20px] border-0 pl-2`}
									style={{
										border: titleError ? '1px solid red' : 'none',
									}}
									placeholder='Type here your title'
									aria-label='Type here your title'
									aria-describedby='basic-addon2'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									onBlur={HandleBlur}
									onKeyDown={HandleKeyDown}
									autoFocus
								/>
							</InputGroup>
						)}
					</Row>
					<Row>
						<div className='relative mt-1 inline-block text-left'>
							<div>
								<button
									onClick={() => setIsDropdownTopicsOpen(!isDropdownTopicsOpen)}
									type='button'
									className={`d-flex justify-content-center align-items-center bg-sidebar border-sidebar hover:border-accent rounded-[20px] border px-3 py-1`}
									style={{
										border: topicError ? '1px solid red' : 'none',
									}}
									id='options-menu'
									aria-haspopup='true'
									aria-expanded='true'
								>
									{selectedTopic ? selectedTopic.Title : 'Select Topic'}
								</button>
							</div>

							{isDropdownTopicsOpen && (
								<div className='bg-sidebar mt-1 h-20 overflow-y-auto rounded-[20px] shadow-lg' role='menu' aria-labelledby='options-menu'>
									<div className='overflow-y-auto py-1'>
										{topicsList.map((topic) => (
											<button
												key={topic.Title}
												onClick={() => {
													setSelectedTopic(topic);
													setIsDropdownTopicsOpen(false);
												}}
												className='hover:text-accentSecondary px-4 py-2 text-sm text-white'
												role='menuitem'
											>
												{topic.Title}
											</button>
										))}
									</div>
								</div>
							)}
						</div>
					</Row>
				</Col>

				{exerciseTitle ? (
					<Col className='d-flex justify-content-end'>
						<GeneralButton text={'Edit'} action={EditProposal} />
					</Col>
				) : (
					<Col className='d-flex justify-content-end'>
						<GeneralButton text={'Propose'} action={ProposeCode} />
					</Col>
				)}
			</Row>

			<Row className={`mt-4 flex  ${!showDetails ? 'justify-content-center' : ''}`}>
				{showDetails ? (
					<Col md={4} className='overflow-scroll'>
						<div className='w-[95%]'>
							<Row className='justify-content-between align-items-center'>
								<Col className='d-flex align-items-center'>
									<span style={{ marginRight: '5px', fontWeight: 'bold' }}>Difficulty:</span>
									<div className='relative inline-block text-left'>
										<div>
											<button
												onClick={() => setIsDropdownOpen(!isDropdownOpen)}
												type='button'
												className='d-flex justify-content-center align-items-center bg-sidebar border-sidebar hover:border-accent rounded-[20px] border px-3 py-1'
												style={{
													border: difficultyError ? '1px solid red' : 'none',
												}}
												id='options-menu'
												aria-haspopup='true'
												aria-expanded='true'
											>
												<img
													className='mr-2 h-full w-8 pt-2'
													src={
														difficulty === 'Beginner'
															? Beginner
															: difficulty === 'Intermediate'
															? Intermediate
															: difficulty === 'Advanced'
															? Advanced
															: NoDifficulty
													}
													alt={difficulty}
												/>
												{difficulty || 'Select Difficulty'}
											</button>
										</div>

										{isDropdownOpen && <div className='fixed inset-0 bg-transparent' onClick={() => setIsDropdownOpen(false)} />}

										{isDropdownOpen && (
											<div className='bg-sidebar absolute mt-1 rounded-[20px] shadow-lg' role='menu' aria-labelledby='options-menu'>
												<div className='py-1' role='none'>
													<button
														onClick={() => handleDifficultyChange('Beginner')}
														className='hover:text-accentSecondary px-4 py-2 text-sm text-white'
														role='menuitem'
													>
														Beginner
													</button>
													<button
														onClick={() => handleDifficultyChange('Intermediate')}
														className='hover:text-accentSecondary px-4 py-2 text-sm text-white'
														role='menuitem'
													>
														Intermediate
													</button>
													<button
														onClick={() => handleDifficultyChange('Advanced')}
														className='hover:text-accentSecondary px-4 py-2 text-sm text-white'
														role='menuitem'
													>
														Advanced
													</button>
												</div>
											</div>
										)}
									</div>
								</Col>
								<Col>
									<span style={{ marginRight: '5px', fontWeight: 'bold' }}>Medal:</span>
									<OverlayTrigger placement='right' overlay={<Tooltip className='text-accentSecondary'>Trophy</Tooltip>}>
										<img src={Trophy} alt='Trophy' className='inline-block h-10 w-8' title='Trophy' />
									</OverlayTrigger>
								</Col>
							</Row>

							<Row className='mb-4'>
								<div>
									<span className='font-bold'>Description</span>
									<InputGroup>
										<Form.Control
											required
											as='textarea'
											rows={5}
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											className='bg-sidebar mt-1 px-3 pb-2 h-[100%] w-[100%] resize-none rounded-[20px] border-[none] text-sm text-white outline-none'
											placeholder='Write your description here'
											style={{
												paddingTop: '16px',
												paddingLeft: '16px',
												border: descriptionError ? '1px solid red' : 'none',
											}}
										/>
									</InputGroup>
								</div>
							</Row>

							<Row>
								<div>
									<span className='font-bold'>Instructions</span>
									<InputGroup>
										<Form.Control
											required
											as='textarea'
											rows={5}
											value={instructions}
											onChange={(e) => setInstructions(e.target.value)}
											className='bg-sidebar mt-1 px-3 pb-2 h-[100%] w-[100%] resize-none rounded-[20px] border-[none] text-sm text-white outline-none'
											placeholder='Write your instructions here'
											style={{
												paddingTop: '16px',
												paddingLeft: '16px',
												border: instructionsError ? '1px solid red' : 'none',
											}}
										/>
									</InputGroup>
								</div>
							</Row>
							<Row>
								{status === 'Rejected' && (
									<div className=''>
										<div className='bg-sidebar rounded-[20px] mt-4 mb-4 self-end bottom'>
											<button
												className={`w-full py-2 px-3 text-left bg-sidebar rounded-[20px] border border-sidebar hover:border-accent`}
												onClick={handleToggle}
												style={{ zIndex: 10 }}
											>
												<div className='flex'>
													<span className='flex-grow font-bold text-[#d9634c]'>Notes</span>
													{!isOpen && <IoChevronDown className={`w-6 h-6 text-accent`} />}
													{isOpen && <IoChevronUp className={`w-6 h-6 text-accent`} />}
												</div>
											</button>
											{isOpen && (
												<div className='py-2 px-3'>
													<p>{notes}</p>
												</div>
											)}
										</div>
									</div>
								)}
							</Row>
						</div>
					</Col>
				) : null}
				<Col md={showDetails ? 8 : 12} style={!showDetails ? { width: '97%' } : null}>
					<div style={{ position: 'relative' }}>
						<div
							className='bg-sidebar relative h-[80vh] overflow-scroll rounded-[20px]'
							style={{
								zIndex: 999,
								border: solutionError ? '1px solid red' : 'none',
							}}
						>
							<div className='m-[10px] p-2'>
								<div className='mb-3 flex align-middle'>
									<div className='text-secondaryText flex whitespace-nowrap text-[17px] font-bold'>Your Code</div>
									<Button
										className='bg-primary h-[50] w-[50] absolute top-1 right-3 rounded-full p-3 border border-primary hover:border-accent hover:-translate-y-0.5 shadow transform active:bg-accent transition duration-150 flex items-center justify-center'
										onClick={() => handleFileUpload()}
									>
										<MdOutlineFileUpload />
									</Button>
								</div>
								<Form.Group className='mt-2 font-mono'>
									<Form.Control
										required
										as='textarea'
										rows={40}
										onKeyDown={handleCodeTab}
										value={solution}
										onChange={(e) => setSolution(e.target.value)}
										className='bg-sidebar w-[100%] resize-none border-[none] text-white outline-none'
										placeholder='Write your code here'
									/>
								</Form.Group>
							</div>
						</div>
						<Button
							onClick={() => setShowDetails(!showDetails)}
							className='bg-sidebar border-sidebar hover:border-accent active:bg-accent absolute left-[-45px] top-[50%] h-[94px] w-[130px] rounded-[100px] border shadow-lg duration-150 hover:-translate-x-1 hover:shadow-xl'
							style={{ zIndex: 1 }}
						>
							{showDetails ? (
								<img style={{ paddingLeft: '20px' }} alt='Hide button' src={HideArrowCode} />
							) : (
								<img style={{ paddingLeft: '20px' }} alt='Show button' src={ShowArrowCode} />
							)}
						</Button>
					</div>
				</Col>
			</Row>
		</Container>
	);
}

export default ProposePage;
