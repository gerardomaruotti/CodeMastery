import '../styles/DocumentationStyle.css';
import React, { useState } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { IoSearch, IoClose } from 'react-icons/io5';
import MedalPlaceholder from '../assets/icons/MedalPlaceholder.svg';
import NoDifficulty from '../assets/icons/DifficultyPlaceholder.svg';
import Sign from '../assets/icons/Sign.svg';
import Bronze from '../assets/icons/Bronze.svg';
import Silver from '../assets/icons/Silver.svg';
import Gold from '../assets/icons/Gold.svg';
import Trophy from '../assets/icons/Trophy.svg';
import Beginner from '../assets/icons/Beginner.svg';
import Intermediate from '../assets/icons/Intermediate.svg';
import Advanced from '../assets/icons/Advanced.svg';
import Sidebar from '../components/Sidebar';

function DocumentationPage() {
	const [searchText, setSearchText] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [selectedCard, setSelectedCard] = useState();
	const [isHovered, setIsHovered] = useState(0);

	const clearSearch = () => {
		setSearchText('');
	};

	const handleCardClick = (item) => {
		setSelectedCard(item);
		setShowModal(true);
	};

	const data = [
		{
			title: 'Introduction',
			icon: Sign,
			description:
				"In this section, you will find a guide that walks you through each step of the site, providing clarity on features and functionality. Whether you're a newcomer or seasoned user, discover, learn, and optimize your experience with ease.",
		},
		{
			title: 'Medals',
			icon: MedalPlaceholder,
			description:
				'In this section, you will find a comprehensive list of medals along with their descriptions. Explore the achievements and distinctions represented by each medal type, providing insight into the recognition and significance attached to these honors.',
		},
		{
			title: 'Difficulty',
			icon: NoDifficulty,
			description:
				'In this section, you will find a detailed list of difficulty levels along with their respective descriptions. Explore the intricacies of each difficulty setting, ranging from Easy to Advanced.',
		},
	];

	const filteredData = data.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()));

	const IntroItem = () => {
		return (
			<div>
				<div className='flex items-center justify-center space-x-40 mb-5'>
					<button className='zoom-button py-2 px-4' onMouseEnter={() => setIsHovered(1)} onMouseLeave={() => setIsHovered(0)}>
						1<div className='cursor-default line line-right' onMouseEnter={() => setIsHovered(0)}></div>
					</button>

					<button className='zoom-button py-2 px-4' onMouseEnter={() => setIsHovered(2)} onMouseLeave={() => setIsHovered(0)}>
						2<div className='cursor-default line2 line-right' onMouseEnter={() => setIsHovered(0)}></div>
					</button>

					<button className='zoom-button py-2 px-4' onMouseEnter={() => setIsHovered(3)} onMouseLeave={() => setIsHovered(0)}>
						3<div className='cursor-default line3 line-right' onMouseEnter={() => setIsHovered(0)}></div>
					</button>

					<button className='zoom-button py-2 px-4' onMouseEnter={() => setIsHovered(4)} onMouseLeave={() => setIsHovered(0)}>
						4
					</button>
				</div>

				<div>
					<Row>
						<Col onMouseEnter={() => setIsHovered(1)} onMouseLeave={() => setIsHovered(0)}>
							<div className={`rounded-2xl overflow-scroll bg-accent mx-2 my-2 ${isHovered === 1 ? 'hovered' : ''}`}>
								<div className='px-6 py-3' style={{ width: '15dvw', height: '30dvh' }}>
									<div className='flex items-center justify-content-center'>
										<div className='text-[#FFFFFF] font-bold text-xl text-center'>1. Topic</div>
									</div>
									<p className='text-secondary text-base'>
										Users start by selecting a topic from the system's suggestions, each associated with a set of exercises. As users complete tasks,
										they earn medals (Bronze, Silver, Gold or Trophy) based on the number of accomplished exercises, fostering engagement and
										recognition.
									</p>
								</div>
							</div>
						</Col>
						<Col onMouseEnter={() => setIsHovered(2)} onMouseLeave={() => setIsHovered(0)}>
							<div className={`rounded-2xl overflow-scroll shadow-lg bg-accent mx-2 my-2 ${isHovered === 2 ? 'hovered' : ''}`}>
								<div className='px-6 py-3' style={{ width: '15dvw', height: '30dvh' }}>
									<div className='flex items-center justify-content-center'>
										<div className='text-[#FFFFFF] font-bold text-xl text-center'>2. Exercise</div>
									</div>
									<p className='text-secondary text-base'>
										In the second step, users select exercises tailored to their preferred difficulty level (Beginner, Intermediate or Advanced) from
										the system's offerings. Each exercise comes with a completion status, providing insights into the user's coding proficiency and
										progress.
									</p>
								</div>
							</div>
						</Col>
						<Col onMouseEnter={() => setIsHovered(3)} onMouseLeave={() => setIsHovered(0)}>
							<div className={`rounded-2xl overflow-scroll shadow-lg bg-accent mx-2 my-2 ${isHovered === 3 ? 'hovered' : ''}`}>
								<div className='px-6 py-3' style={{ width: '15dvw', height: '30dvh' }}>
									<div className='flex items-center justify-content-center'>
										<div className='text-[#FFFFFF] font-bold text-xl text-center'>3. Evaluation</div>
									</div>
									<p className='text-secondary text-base'>
										The third step involves the actual coding process, with users executing their code to test its functionality. After confirmation,
										the system evaluates the code, assigning a score that reflects the quality of the implementation, considering factors like
										efficiency and optimization
									</p>
								</div>
							</div>
						</Col>
						<Col onMouseEnter={() => setIsHovered(4)} onMouseLeave={() => setIsHovered(0)}>
							<div className={`rounded-2xl overflow-scroll shadow-lg bg-accent mx-2 my-2 ${isHovered === 4 ? 'hovered' : ''}`}>
								<div className='px-6 py-3' style={{ width: '15dvw', height: '30dvh' }}>
									<div className='flex items-center justify-content-center'>
										<div className='text-[#FFFFFF] font-bold text-xl text-center'>4. Proposes</div>
									</div>
									<p className='text-secondary text-base'>
										Upon <span className='text-[#000000]'>successfully</span> completing all exercises within a topic, users can propose new exercises
										related to that topic for evaluation (Acceptance, Pending or Rejection). This step ensures a comprehensive understanding of the
										topic and encourages user engagement in the learning process.
									</p>
								</div>
							</div>
						</Col>
					</Row>
				</div>
			</div>
		);
	};

	const MedalItem = () => {
		return (
			<div className='flex-col items-center justify-center'>
				<div
					className='text-secondaryText'
					style={{ width: '50rem', marginBottom: '2rem', textAlign: 'justify', lineHeight: '1.5', fontSize: '1.1rem' }}
				>
					<p>
						In our application, we've implemented an engaging
						<span className='text-accentThird font-bold'> gamification </span>
						system to inspire users toward continuous improvement. This innovative system introduces{' '}
						<span className='text-accent font-bold'>Medals</span> that reflect the number of completed exercises in comparison to the total exercises
						within a specific topic.
						<br></br>
						<br></br>
						The counting adheres to the following guidelines:
					</p>
					<ul style={{ paddingLeft: '40px', listStyleType: 'disc' }}>
						<li>
							<span className='text-accentSecondary' style={{ fontWeight: 'bold' }}>
								No Medal
							</span>{' '}
							- Included only on the Exercise Proposal page and used solely as the default medal.
						</li>
						<li>
							<span className='text-accentSecondary' style={{ fontWeight: 'bold' }}>
								Bronze
							</span>{' '}
							- Completed exercises from 0 &lt; <sup>1</sup>&frasl;<sub>2</sub> of Total Exercises.
						</li>
						<li>
							<span className='text-accentSecondary' style={{ fontWeight: 'bold' }}>
								Silver
							</span>{' '}
							- Completed exercises from <sup>1</sup>&frasl;<sub>2</sub> &lt; <sup>3</sup>&frasl;<sub>4</sub> of Total Exercises.
						</li>
						<li>
							<span className='text-accentSecondary' style={{ fontWeight: 'bold' }}>
								Gold
							</span>{' '}
							- Completed exercises from <sup>3</sup>&frasl;<sub>4</sub> &lt; Total Exercises.
						</li>
						<li>
							<span className='text-accentSecondary' style={{ fontWeight: 'bold' }}>
								Trophy
							</span>{' '}
							- Successfully completing all the exercises.
						</li>
					</ul>
				</div>

				<div>
					<Row>
						<Col>
							<div className='flex justify-content-center'>
								<img src={MedalPlaceholder} alt='MedalPlaceholder' style={{ width: '70px', height: '70px' }} />
							</div>
							<div className='text-center'>
								<p className='text-accentSecondary font-bold text-xl text-center'>No Medal</p>
							</div>
						</Col>

						<Col>
							<div className='flex justify-content-center'>
								<img src={Bronze} alt='Bronze' style={{ width: '70px', height: '70px' }} />
							</div>
							<div className='text-center'>
								<p className='text-accentSecondary font-bold text-xl text-center'>Bronze</p>
							</div>
						</Col>

						<Col>
							<div className='flex justify-content-center'>
								<img src={Silver} alt='Silver' style={{ width: '70px', height: '70px' }} />
							</div>
							<div className='text-center'>
								<p className='text-accentSecondary font-bold text-xl text-center'>Silver</p>
							</div>
						</Col>

						<Col>
							<div className='flex justify-content-center'>
								<img src={Gold} alt='Gold' style={{ width: '70px', height: '70px' }} />
							</div>
							<div className='text-center'>
								<p className='text-accentSecondary font-bold text-xl text-center'>Gold</p>
							</div>
						</Col>

						<Col>
							<div className='flex justify-content-center'>
								<img src={Trophy} alt='Trophy' style={{ width: '70px', height: '70px' }} />
							</div>
							<div className='text-center'>
								<p className='text-accentSecondary font-bold text-xl text-center'>Trophy</p>
							</div>
						</Col>
					</Row>
				</div>
			</div>
		);
	};

	const DifficultyItem = () => {
		return (
			<div className='flex-col items-center justify-center'>
				<div
					className='text-secondaryText'
					style={{ width: '50rem', marginBottom: '2rem', textAlign: 'justify', lineHeight: '1.5', fontSize: '1.1rem' }}
				>
					<p>
						Our application features a <span className='text-accentThird font-bold'>Difficulty System</span> to assist users in evaluating their
						knowledge level within a specific topic. This system enables users to study a topic from the ground up, engaging in step-by-step exercises
						of increasing difficulty. This tailored approach facilitates <span className='text-accent font-bold'>Comprehensive Learning</span>,
						allowing users to build a strong foundation and progressively advance their skills in the subject matter.
						<br></br>
						<br></br>
						The difficulty levels comprise:
					</p>
					<ul style={{ paddingLeft: '40px', listStyleType: 'disc' }}>
						<li>
							<span className='text-accentSecondary' style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
								No Difficulty
							</span>{' '}
							- Included only on the Proposal Page and used solely as the default difficulty.
						</li>
						<li>
							<span className='text-accentSecondary' style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
								Beginner
							</span>{' '}
							- Ideal for newcomers, offering an introductory experience to build a solid foundation.
						</li>
						<li>
							<span className='text-accentSecondary' style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
								Intermediate
							</span>{' '}
							- Tailored for users with a basic understanding, providing a more challenging experience.
						</li>
						<li>
							<span className='text-accentSecondary' style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
								Advanced
							</span>{' '}
							- Geared towards individuals with in-depth knowledge, offering advanced exercises to test and deepen their understanding.
						</li>
					</ul>
				</div>

				<div>
					<Row>
						<Col>
							<div className='flex justify-content-center'>
								<img src={NoDifficulty} alt='NoDifficulty' style={{ width: '70px', height: '70px' }} />
							</div>
							<div className='text-center'>
								<p className='text-accentSecondary font-bold text-xl text-center'>No Difficulty</p>
							</div>
						</Col>

						<Col>
							<div className='flex justify-content-center'>
								<img src={Beginner} alt='Beginner' style={{ width: '70px', height: '70px' }} />
							</div>
							<div className='text-center'>
								<p className='text-accentSecondary font-bold text-xl text-center'>Beginner</p>
							</div>
						</Col>

						<Col>
							<div className='flex justify-content-center'>
								<img src={Intermediate} alt='Intermediate' style={{ width: '70px', height: '70px' }} />
							</div>
							<div className='text-center'>
								<p className='text-accentSecondary font-bold text-xl text-center'>Intermediate</p>
							</div>
						</Col>

						<Col>
							<div className='flex justify-content-center'>
								<img src={Advanced} alt='Advanced' style={{ width: '70px', height: '70px' }} />
							</div>
							<div className='text-center'>
								<p className='text-accentSecondary font-bold text-xl text-center'>Advanced</p>
							</div>
						</Col>
					</Row>
				</div>
			</div>
		);
	};

	const Card = ({ title, icon, description }) => {
		return (
			<div className='cursor-pointer rounded-3xl overflow-scroll shadow-lg bg-accent mx-2 my-2 hover:scale-105' onClick={() => handleCardClick(title)}>
				<div className='px-6 py-4' style={{ width: '20vw', height: '25vh' }}>
					<div className='flex items-center justify-content-center'>
						<span className='text-2xl mr-2'>
							<img src={icon} alt='icon' style={{ width: '30px', height: '40px' }} />
						</span>
						<div className='text-[#FFFFFFF] font-bold text-2xl text-center'>{title}</div>
					</div>
					<p className='text-secondary text-base'>{description}</p>
				</div>
			</div>
		);
	};

	return (
		<Container className='p-4 text-secondary bg-primary h-screen' fluid>
			<div style={{ marginLeft: '250px' }}>
				<Sidebar />
				<div className='flex flex-col mx-auto'>
					<Row className='d-flex text-center justify-content-center align-items-center'>
						<h1 className='text-3xl font-bold'>Documentation</h1>
					</Row>

					<Row>
						<p className='text-center font-bold mb-3'>Everything you need to get in touch with our application!</p>
						<div className='flex justify-content-center items-center text-secondary w-full'>
							<div className='w-1/2 relative mb-4 mt-2'>
								<input
									type='search'
									name='search'
									placeholder='Search the docs...'
									className='bg-sidebar border border-sidebar placeholder-secondaryText shadow px-4 py-3 w-full rounded-full text-sm focus:outline-none focus:border-accent'
									value={searchText}
									onChange={(e) => setSearchText(e.target.value)}
								/>
								{searchText ? (
									<IoClose className='text-xl absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer' onClick={clearSearch} />
								) : (
									<IoSearch className='text-xl absolute right-5 top-1/2 transform -translate-y-1/2' />
								)}
							</div>
						</div>
					</Row>
					<Row className='flex items-center justify-center mt-10'>
						<div className='flex flex-wrap justify-center gap-4'>
							{filteredData.map((item, index) => (
								<Card key={index} title={item.title} icon={item.icon} description={item.description} />
							))}
						</div>
					</Row>
					<Modal
						show={showModal}
						onHide={() => setShowModal(false)}
						className='fixed inset-0 d-flex items-center justify-content-center'
						style={{ marginLeft: '250px' }}
					>
						<div className='bg-sidebar p-6 rounded-3xl'>
							<div className='flex justify-content-between items-center'>
								<h1 className='text-3xl font-bold text-accent'>{selectedCard}</h1>
								<button onClick={() => setShowModal(false)}>
									<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' className='h-6 w-6 text-accent'>
										<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
									</svg>
								</button>
							</div>
							<div className='mt-4 flex justify-content-center'>
								{selectedCard === 'Introduction' && <IntroItem />}
								{selectedCard === 'Medals' && <MedalItem />}
								{selectedCard === 'Difficulty' && <DifficultyItem />}
							</div>
						</div>
					</Modal>
				</div>
			</div>
		</Container>
	);
}

export default DocumentationPage;
