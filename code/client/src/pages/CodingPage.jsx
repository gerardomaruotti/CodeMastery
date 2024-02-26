import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExercisesAPI from '../api/ExercisesAPI';
import TopicsAPI from '../api/TopicsAPI';
import { Container, Row, Col, OverlayTrigger, Tooltip, Button, Form } from 'react-bootstrap';
import GeneralButton from '../components/GeneralButton';
import Banner from '../components/Banner';
import { IoChevronBack, IoPlay } from 'react-icons/io5';
import Beginner from '../assets/icons/Beginner.svg';
import Intermediate from '../assets/icons/Intermediate.svg';
import Advanced from '../assets/icons/Advanced.svg';
import HideArrowCode from '../assets/icons/HideArrowCode.svg';
import ShowArrowCode from '../assets/icons/ShowArrowCode.svg';
import Gold from '../assets/icons/Gold.svg';
import Silver from '../assets/icons/Silver.svg';
import Bronze from '../assets/icons/Bronze.svg';
import MedalPlaceholder from '../assets/icons/MedalPlaceholder.svg';
import Swal from 'sweetalert2';

function CodingPage() {
	const navigate = useNavigate();
	const { topic, exercise } = useParams();
	const [selectedExercise, setSelectedExercise] = useState({});
	const [selectedTopic, setSelectedTopic] = useState({});
	const [showDetails, setShowDetails] = useState(true);
	const [workingStatus, setWorkingStatus] = useState('');
	const [isChecking, setIsChecking] = useState(false);
	const [code, setCode] = useState(selectedExercise.Code);
	const [showBanner, setShowBanner] = useState(false);
	const [message, setMessage] = useState('Successfully Saved!');
	const [resultStatus, setResultStatus] = useState('Success');
	const initialCode = selectedExercise.Code;

	const handleKeyDown = (e) => {
		if (e.key === 'Tab') {
			e.preventDefault();
			const start = e.target.selectionStart;
			const end = e.target.selectionEnd;

			setCode(code.substring(0, start) + '\t' + code.substring(end));

			e.target.selectionStart = e.target.selectionEnd = start + 1;
		}
	};

	const SubmitCode = () => {
		Swal.fire({
			title: 'Are you sure you want to submit this exercise?',
			text: 'Your code will be evaluated and you will receive a score',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			reverseButtons: true,
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					let workingStatusDef = '';
					let sol = selectedExercise.Solution.replace(/\/\/.*$/gm, '').replace(/\n/g, '');
					let c = code.replace(/\/\/.*$/gm, '').replace(/\n/g, '');

					if (initialCode === code) workingStatusDef = "Doesn't Work!";
					else if (c === sol) workingStatusDef = 'Works!';
					else workingStatusDef = workingStatus === '' ? (Math.random() < 0.5 ? 'Works!' : "Doesn't Work!") : workingStatus;

					ExercisesAPI.submitExercise(selectedTopic.Title, selectedExercise.Title, code, workingStatusDef === 'Works!' ? 'Complete' : 'Failed').then(
						() => {
							navigate(`/results-page/${selectedTopic.Title}/${selectedExercise.Title}`);
						}
					);
				} catch (error) {
					setResultStatus('Error');
					setMessage('An error occurred while saving the exercise.');
				}
			} else if (result.isDenied) {
				Swal.fire('Not submitted correctly', '', 'info');
			}
		});
	};

	const SaveCode = () => {
		Swal.fire({
			title: 'Do you want to save the changes?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Save',
			reverseButtons: true,
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await ExercisesAPI.saveExercise(selectedTopic.Title, selectedExercise.Title, code);
					const message = await response.json();

					response.status === 200 ? setResultStatus('Success') : setResultStatus('Error');

					setMessage(message.error || message.message);
				} catch (error) {
					setResultStatus('Error');
					setMessage('An error occurred while saving the exercise.');
				} finally {
					setShowBanner(true);
					setTimeout(() => {
						setShowBanner(false);
					}, 1000);
				}
			} else if (result.isDenied) {
				Swal.fire('Changes are not saved', '', 'info');
			}
		});
	};

	const RunCode = () => {
		setIsChecking(true);

		setTimeout(() => {
			if (initialCode === code) setWorkingStatus("Doesn't Work!");
			else setWorkingStatus(Math.random() < 0.5 ? 'Works!' : "Doesn't Work!");
			setIsChecking(false);
		}, 2000);
	};

	const handleBackButton = () => {
		Swal.fire({
			title: 'Are you sure you want to go back?',
			text: 'Your progress will be automatically saved',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			reverseButtons: true,
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await ExercisesAPI.saveExercise(selectedTopic.Title, selectedExercise.Title, code);
					const message = await response.json();

					response.status === 200 ? setResultStatus('Success') : setResultStatus('Error');

					setMessage(message.error || message.message);

					if (response.status === 200) {
						setShowBanner(true);
						setTimeout(() => {
							setShowBanner(false);
							navigate(`/topics/${selectedTopic.Title}`);
						}, 1000);
					} else {
						Swal.fire({
							title: 'Error',
							text: 'An error occurred while saving the exercise.',
							icon: 'error',
							confirmButtonText: 'Don’t save',
							showCancelButton: true,
							cancelButtonText: 'Stay on page',
							reverseButtons: true,
						}).then((result) => {
							if (result.isConfirmed) {
								setMessage('Not Saved!');

								setShowBanner(true);
								setTimeout(() => {
									setShowBanner(false);
									navigate(-1);
								}, 1000);
							}
						});
					}
				} catch (error) {
					setResultStatus('Error');
					setMessage('An error occurred while saving the exercise.');
				}
			}
		});
	};
	useEffect(() => {
		ExercisesAPI.getExerciseDetail(topic, exercise).then((response) => {
			if (response.status === 200) {
				response.json().then((data) => {
					setSelectedExercise(data);
				});
			} else alert('Failed to load exercise');
		});

		TopicsAPI.getTopicDetail(topic).then((response) => {
			if (response.status === 200) {
				response.json().then((data) => {
					setSelectedTopic(data);
				});
			} else alert('Failed to load topic');
		});
	}, [exercise]);

	useEffect(() => {
		setCode(selectedExercise.Code);
	}, [selectedExercise]);

	return (
		<Container className='p-4 text-secondary bg-primary' fluid>
			{showBanner && <Banner message={message} status={resultStatus} />}
			<Row className='relative'>
				<Button
					className='bg-sidebar w-[50px] border border-sidebar hover:border-accent hover:-translate-y-0.5 p-3 shadow rounded-full transform active:bg-accent transition duration-150'
					onClick={handleBackButton}
				>
					<IoChevronBack />
				</Button>
				<Col md={2} className='justify-content-start'>
					<h1 className='text-xl font-semibold text-secondary'>{selectedExercise.Title}</h1>
					<span className='pb-2 text-base font-semibold text-accentSecondary'>{selectedTopic.Title}</span>
				</Col>

				<Col md={7} className='d-flex justify-content-center align-items-center text-center'>
					{isChecking ? (
						<div className='animate-spin rounded-full border-t-4 h-7 w-7'></div>
					) : (
						<>
							<OverlayTrigger
								placement='bottom'
								overlay={
									<Tooltip className='text-accentSecondary' style={{ fontSize: '10px' }}>
										Run Code
									</Tooltip>
								}
							>
								<Button
									className='bg-sidebar w-[50px] border border-sidebar hover:border-accent hover:-translate-y-0.5 p-3 shadow rounded-full transform active:bg-accent transition duration-150'
									onClick={RunCode}
								>
									<IoPlay />
								</Button>
							</OverlayTrigger>
							<h1 style={{ fontWeight: 'bold', fontSize: '20px', marginLeft: '5px' }}>{workingStatus}</h1>
						</>
					)}
				</Col>

				<Col className='d-flex justify-content-end'>
					<GeneralButton text={'Save'} action={SaveCode} />
					<GeneralButton text={'Submit'} action={SubmitCode} />
				</Col>
			</Row>

			<Row className={`mt-4 flex ${!showDetails ? 'justify-content-center' : ''}`}>
				{showDetails ? (
					<Col md={4} className='overflow-scroll'>
						<Row className='justify-content-between align-items-center'>
							<Col>
								<span style={{ marginRight: '5px', fontWeight: 'bold' }}>Difficulty:</span>
								<OverlayTrigger placement='right' overlay={<Tooltip className='text-accentSecondary'>{selectedExercise.Level}</Tooltip>}>
									<img
										src={selectedExercise.Level === 'Beginner' ? Beginner : selectedExercise.Level === 'Intermediate' ? Intermediate : Advanced}
										alt={selectedExercise.Level}
										className='inline-block w-8 h-10'
										title={selectedExercise.Level}
									/>
								</OverlayTrigger>
							</Col>

							<Col>
								<span style={{ marginRight: '5px', fontWeight: 'bold' }}>Medal:</span>
								<OverlayTrigger placement='right' overlay={<Tooltip className='text-accentSecondary'>{selectedTopic.Medal}</Tooltip>}>
									<img
										src={
											selectedTopic.Medal === 'Gold'
												? Gold
												: selectedTopic.Medal === 'Silver'
												? Silver
												: selectedTopic.Medal === 'Bronze'
												? Bronze
												: MedalPlaceholder
										}
										alt={selectedTopic.Medal}
										className='inline-block w-8 h-10'
										title={selectedTopic.Medal}
									/>
								</OverlayTrigger>
							</Col>
						</Row>

						<Row className='mb-4'>
							<div>
								<span style={{ fontWeight: 'bold' }}>Description</span>
								<p className='text-sm'>{selectedExercise.Description}</p>
							</div>
						</Row>

						<Row>
							<div>
								<span style={{ fontWeight: 'bold' }}>Instructions</span>
								<p className='text-sm'>{selectedExercise.Instruction}</p>
							</div>
						</Row>
					</Col>
				) : null}

				<Col md={showDetails ? 8 : 12} style={!showDetails ? { width: '97%' } : null}>
					<div style={{ position: 'relative' }}>
						<div className='relative h-screen bg-sidebar rounded-[20px] overflow-scroll' style={{ zIndex: 999 }}>
							<div className='m-[10px] p-2'>
								<div className="[font-family:'Lato-Bold',Helvetica] font-bold text-lg tracking-[0] leading-[normal] whitespace-nowrap flex text-secondaryText">
									Your Code
								</div>
								<Form.Group className='h-[100%] mt-2'>
									<Form.Control
										as='textarea'
										rows={40}
										className='w-[100%] h-[100%] bg-sidebar border-[none] text-secondary font-mono outline-none resize-none'
										defaultValue={code}
										value={code}
										autoFocus
										onChange={(e) => setCode(e.target.value)}
										onKeyDown={handleKeyDown}
										style={{ whiteSpace: 'pre', overflowWrap: 'break-word', tabSize: 4 }}
									/>
								</Form.Group>
							</div>
						</div>
						<Button
							onClick={() => setShowDetails(!showDetails)}
							className='absolute w-[130px] h-[94px] top-[50%] left-[-45px] bg-sidebar border border-sidebar rounded-[100px] hover:border-accent active:bg-accent duration-150 hover:-translate-x-0.5 hover:shadow-xl shadow-lg'
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

export default CodingPage;
