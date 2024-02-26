import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ExercisesAPI from '../api/ExercisesAPI';
import TopicsAPI from '../api/TopicsAPI';
import { Container, Col, Row, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import GeneralButton from '../components/GeneralButton';
import { IoChevronBack, IoChevronDown, IoChevronUp } from 'react-icons/io5';
import Beginner from '../assets/icons/Beginner.svg';
import Intermediate from '../assets/icons/Intermediate.svg';
import Advanced from '../assets/icons/Advanced.svg';
import Gold from '../assets/icons/Gold.svg';
import Silver from '../assets/icons/Silver.svg';
import Bronze from '../assets/icons/Bronze.svg';
import MedalPlaceholder from '../assets/icons/MedalPlaceholder.svg';
import Trophy from '../assets/icons/Trophy.svg';
import Swal from 'sweetalert2';

function ResultsPage() {
	const navigate = useNavigate();
	const { exercise, topic } = useParams();
	const [selectedExercise, setSelectedExercise] = useState({});
	const [selectedTopic, setSelectedTopic] = useState({});
	const [score, setScore] = useState(0);
	const [fidelity, setFidelity] = useState(0.0);
	const [isOpen, setIsOpen] = useState(false);

	const renderStars = () => {
		const stars = [];
		const centerX = 0;
		const centerY = 0;
		const radius = 45;
		const starCount = 6;

		for (let i = 0; i < starCount; i++) {
			const angle = (i * 2 * Math.PI) / starCount;
			const x = centerX + radius * Math.cos(angle);
			const y = centerY + radius * Math.sin(angle);

			const starStyle = {
				position: 'absolute',
				left: `${x}px`,
				top: `${y}px`,
				fontSize: '1rem',
			};

			stars.push(
				<span key={i} className={`star ${i < score ? 'filled' : ''}`} style={starStyle} role='img' aria-label='Star'>
					⭐
				</span>
			);
		}

		return stars;
	};

	const retryExercise = () => {
		Swal.fire({
			title: 'Are you sure?',
			text: 'You will lose your current progress!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Retry',
			cancelButtonText: 'Cancel',
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed)
				ExercisesAPI.retryExercise(topic, exercise)
					.then(() => {
						navigate(`/coding/${topic}/${exercise}`);
					})
					.catch((error) => {
						console.log(error);
					});
		});
	};

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		ExercisesAPI.getExerciseDetail(topic, exercise).then((response) => {
			if (response.status === 200) {
				response.json().then((data) => {
					setSelectedExercise({ ...data });
				});
			} else alert('Failed to load exercise');
		});

		TopicsAPI.getTopicDetail(topic).then((response) => {
			if (response.status === 200) {
				response.json().then((data) => {
					setSelectedTopic({ ...data });
				});
			} else alert('Failed to load topic');
		});
	}, [exercise, topic]);

	useEffect(() => {
		selectedExercise.Status === 'Complete'
			? setFidelity(Math.round(Math.random() * 50 + 50))
			: selectedExercise.Status === 'Failed'
			? setFidelity(Math.round(Math.random() * 50))
			: setFidelity(Math.round(Math.random() * 100 * 10) / 10);
	}, [selectedExercise.Status]);

	useEffect(() => {
		setScore(Math.floor((fidelity / 100) * (999 - 100 + 1)) + 100);
	}, [fidelity]);

	return (
		<Container className='p-4 text-secondary bg-primary' fluid>
			<Row>
				<Button
					className='bg-sidebar w-[50px] border border-sidebar hover:border-accent hover:-translate-y-0.5 p-3 shadow rounded-full transform active:bg-accent transition duration-150'
					onClick={() => navigate(`/topics/${topic}`)}
				>
					<IoChevronBack />
				</Button>
				<Col md={2} className='justify-content-start'>
					<h1 className='text-xl font-semibold text-secondary'>{exercise}</h1>
					<span className='pb-2 text-base font-semibold text-accentSecondary '>{topic}</span>
				</Col>

				<Col className='d-flex justify-content-end'>
					<GeneralButton text={'Retry'} action={retryExercise} />
				</Col>
			</Row>

			<Row className='mb-5 d-flex align-items-center justify-content-center'>
				<Col>
					<div className='max-w-md mx-auto mt-4 rounded-[20px] bg-sidebar'>
						<div className='bg-sidebar rounded-[20px]'>
							<button
								className={`w-full py-2 px-3 text-left bg-sidebar rounded-[20px] border border-sidebar hover:border-accent`}
								onClick={handleToggle}
							>
								<div className='flex'>
									<span className='flex-grow text-lg font-semibold'>Exercise Details</span>
									{!isOpen && <IoChevronDown className={`w-6 h-6 text-accent`} />}
									{isOpen && <IoChevronUp className={`w-6 h-6 text-accent`} />}
								</div>
							</button>
							{isOpen && (
								<div className='py-2 px-3'>
									<Row className='mb-4'>
										<Col>
											<span className='text-sm' style={{ marginRight: '5px', fontWeight: 'bold' }}>
												Difficulty:
											</span>
											<OverlayTrigger placement='top' overlay={<Tooltip className='text-accentSecondary'>{selectedExercise.Level}</Tooltip>}>
												<img
													src={selectedExercise.Level === 'Beginner' ? Beginner : selectedExercise.Level === 'Intermediate' ? Intermediate : Advanced}
													alt={selectedExercise.Level}
													title={selectedExercise.Level}
													className='inline-block w-8 h-10 mt-2'
												/>
											</OverlayTrigger>
										</Col>
										<Col className='flex justify-center items-center'>
											<span className='text-sm' style={{ marginRight: '5px', fontWeight: 'bold' }}>
												Medal:
											</span>
											<OverlayTrigger placement='top' overlay={<Tooltip className='text-accentSecondary'>{selectedTopic.Medal}</Tooltip>}>
												<img
													src={
														selectedTopic.Medal === 'Gold'
															? Gold
															: selectedTopic.Medal === 'Silver'
															? Silver
															: selectedTopic.Medal === 'Bronze'
															? Bronze
															: selectedTopic.Medal === 'Trophy'
															? Trophy
															: MedalPlaceholder
													}
													alt={selectedTopic.Medal}
													className='inline-block w-8 h-10 mt-2'
													title={selectedTopic.Medal}
												/>
											</OverlayTrigger>
										</Col>
									</Row>

									<Row className='mb-4'>
										<span className='text-sm' style={{ fontWeight: 'bold' }}>
											Description
										</span>
										<p className='text-sm'>{selectedExercise.Description}</p>
									</Row>

									<Row className='mb-4'>
										<span className='text-sm' style={{ fontWeight: 'bold' }}>
											Instructions
										</span>
										<p className='text-sm'>{selectedExercise.Instruction}</p>
									</Row>
								</div>
							)}
						</div>
					</div>
				</Col>

				<Col md={6} className='d-flex justify-content-center align-items-center'>
					<div className='text-center'>
						<Row>
							<h1 className='text-lg' style={{ fontWeight: 'bold', paddingBottom: '5px' }}>
								{fidelity >= 50.0 ? 'Successfully Passed!' : 'Not Passed!'}
							</h1>
						</Row>
						<Row>
							<span>Fidelity: {fidelity}%</span>
						</Row>
					</div>
				</Col>

				<Col className='d-flex justify-content-end'>
					<div style={{ marginRight: '180px', position: 'relative', textAlign: 'right' }}>
						<p style={{ width: '140px', position: 'absolute', bottom: '0%', transform: 'translateY(90%) translateX(-100px)' }}>+{score} pts</p>
						{renderStars()}
					</div>
				</Col>
			</Row>

			<Row>
				<Col>
					<Form.Group
						className='relative h-screen bg-sidebar rounded-[20px] overflow-scroll mb-10 p-3 flex flex-col'
						style={{ resize: 'horizontal', maxWidth: '100%' }}
					>
						<div className="[font-family:'Lato-Bold',Helvetica] font-bold text-[17px] tracking-[0] leading-[normal] whitespace-nowrap flex text-secondaryText">
							Your Code
						</div>
						<Form.Control
							as='textarea'
							disabled
							rows={40}
							className='w-full h-[100%] mt-2 bg-sidebar border-[none] text-white outline-none resize-none'
							defaultValue={selectedExercise.Code}
						/>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group
						className='relative h-screen bg-sidebar rounded-[20px] overflow-scroll mb-10 p-3 flex flex-col'
						style={{ resize: 'horizontal', maxWidth: '100%' }}
					>
						<div className="[font-family:'Lato-Bold',Helvetica] font-bold text-[17px] tracking-[0] leading-[normal] whitespace-nowrap flex text-secondaryText">
							Solution
						</div>
						<Form.Control
							as='textarea'
							disabled
							rows={40}
							className='w-full h-[100%] mt-2 bg-sidebar border-[none] text-white outline-none resize-none'
							defaultValue={selectedExercise.Solution}
						/>
					</Form.Group>
				</Col>
			</Row>
		</Container>
	);
}

export default ResultsPage;
