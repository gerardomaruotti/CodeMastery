const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3001;

const medalAssign = (done, total) => {
	if (done === 0) return '';
	const percentage = (done / total) * 100;
	if (percentage > 0 && percentage <= 50) return 'Bronze';
	if (percentage > 50 && percentage <= 75) return 'Silver';
	if (percentage > 75 && percentage < 100) return 'Gold';
	if (percentage === 100) return 'Trophy';
};

const corsOptions = {
	origin: ['http://localhost:5173', 'http://localhost:3001'],
	credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	session({
		secret: 'my_secret_key',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
	})
);

app.use((req, res, next) => {
	if (!req.session.utente) {
		req.session.User = {
			name: 'Mario',
			surname: 'Rossi',
		};
	}
	next();
});

app.use((req, res, next) => {
	try {
		const exercisesData = fs.readFileSync('./Models/Exercises.json', 'utf-8');
		req.exercises = JSON.parse(exercisesData);
		next();
	} catch (error) {
		console.error('Error during reading Exercises.json:', error.message);
		res.status(500).send('Internal Server Error');
	}
});

app.use((req, res, next) => {
	try {
		const topicsData = fs.readFileSync('./Models/Topics.json', 'utf-8');
		req.topics = JSON.parse(topicsData);
		next();
	} catch (error) {
		console.error('Error during reading Topics.json:', error.message);
		res.status(500).send('Internal Server Error');
	}
});

app.use((req, res, next) => {
	try {
		const proposesData = fs.readFileSync('./Models/Proposes.json', 'utf-8');
		req.proposes = JSON.parse(proposesData);
		next();
	} catch (error) {
		console.error('Error during reading Proposes.json:', error.message);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/api/session', (req, res) => {
	res.status(200).json(req.session.User);
});

app.get('/api/proposals', (req, res) => {
	const proposalsList = req.proposes.ProposesList;

	res.status(200).json(proposalsList);
});

app.get('/api/proposals/:id', (req, res) => {
	const { id } = req.params;

	if (!id) return res.status(400).json({ error: 'Missing id' });

	const proposalsList = req.proposes.ProposesList;

	let proposalDetails = proposalsList.find((p) => p.Title === id);

	if (!proposalDetails) return res.status(404).json({ error: 'Proposal not found' });

	res.status(200).json(proposalDetails);
});

app.post('/api/proposals', (req, res) => {
	const { topic, title, description, instructions, level, solution, status } = req.body;

	if (!topic || !title || !description || !instructions || !level || !solution || !status)
		return res.status(400).json({ error: 'Missing proposal fields' });

	const proposalsList = req.proposes.ProposesList;

	let proposalIndex = proposalsList.findIndex((p) => p.Title === title);

	if (proposalIndex !== -1) return res.status(409).json({ error: 'Proposal already exists' });

	const finalStatus = Math.floor(Math.random() * 3) === 0 ? 'Accepted' : Math.floor(Math.random() * 3) === 1 ? 'Rejected' : 'Pending';

	const newProposal = {
		Topic: topic,
		Title: title,
		Description: description,
		Instruction: instructions,
		Level: level,
		Solution: solution,
		Status: finalStatus,
		Notes: finalStatus === 'Rejected' ? 'The proposal was rejected due to non-compliance with the stability criteria' : '',
	};

	proposalsList.push(newProposal);

	fs.writeFileSync('./Models/Proposes.json', JSON.stringify(req.proposes));

	res.status(200).json(newProposal);
});

app.put('/api/proposals/:id', (req, res) => {
	const { id } = req.params;
	const { topic, title, description, instructions, level, solution, status } = req.body;

	if (!id) return res.status(400).json({ error: 'Missing id' });

	const proposalsList = req.proposes.ProposesList;

	let proposalIndex = proposalsList.findIndex((p) => p.Title === id);

	if (proposalIndex === -1) return res.status(404).json({ error: 'Proposal not found' });

	const finalStatus = Math.floor(Math.random() * 3) === 0 ? 'Accepted' : Math.floor(Math.random() * 3) === 1 ? 'Rejected' : 'Pending';

	const newProposal = {
		Topic: topic,
		Title: title,
		Description: description,
		Instruction: instructions,
		Level: level,
		Solution: solution,
		Status: finalStatus,
		Notes: finalStatus === 'Rejected' ? 'The proposal was rejected due to non-compliance with the stability criteria' : '',
	};

	proposalsList[proposalIndex] = newProposal;

	fs.writeFileSync('./Models/Proposes.json', JSON.stringify(req.proposes));

	res.status(200).json(newProposal);
});

app.delete('/api/proposals/:id', (req, res) => {
	const { id } = req.params;

	if (!id) return res.status(400).json({ error: 'Missing id' });

	const proposalsList = req.proposes.ProposesList;

	let proposalIndex = proposalsList.findIndex((p) => p.Title === id);

	if (proposalIndex === -1) return res.status(404).json({ error: 'Proposal not found' });

	proposalsList.splice(proposalIndex, 1);

	fs.writeFileSync('./Models/Proposes.json', JSON.stringify(req.proposes));

	res.status(200).json(proposalsList);
});

app.get('/api/topics', (req, res) => {
	const topicsList = req.topics.TopicsList;

	topicsList.sort((a, b) => {
		return a.Title.localeCompare(b.Title);
	});

	res.status(200).json(topicsList);
});

app.get('/api/topics/:topic/exercises', (req, res) => {
	const { topic } = req.params;

	if (!topic) return res.status(400).json({ error: 'Missing topic' });

	const topicsList = req.exercises.ExercisesList;

	if (!topicsList.hasOwnProperty(topic)) return res.status(404).json({ error: 'Topic not found' });

	let topicExercises = topicsList[topic];

	topicExercises.sort((a, b) => {
		return a.Title.localeCompare(b.Title);
	});

	res.status(200).json(topicExercises);
});

app.get('/api/topics/:topic/exercises/:exercise', (req, res) => {
	const { topic, exercise } = req.params;

	if (!topic || !exercise) return res.status(400).json({ error: 'Missing topic or exercise' });

	const topicsList = req.exercises.ExercisesList;

	if (!topicsList.hasOwnProperty(topic)) return res.status(404).json({ error: 'Topic not found' });

	let topicExercises = topicsList[topic];

	let exerciseDetails = topicExercises.find((e) => e.Title === exercise);

	if (!exerciseDetails) return res.status(404).json({ error: 'Exercise not found' });

	res.status(200).json(exerciseDetails);
});

app.get('/api/topics/:topic', (req, res) => {
	const { topic } = req.params;

	if (!topic) return res.status(400).json({ error: 'Missing topic' });

	const topicsList = req.topics.TopicsList;

	let topicDetails = topicsList.find((t) => t.Title === topic);

	if (!topicDetails) return res.status(404).json({ error: 'Topic not found' });

	res.status(200).json(topicDetails);
});

app.post('/api/topics/:topic/exercises/:exercise/save', (req, res) => {
	const { topic, exercise } = req.params;
	const code = req.body.code;

	if (!topic || !exercise || !code) return res.status(400).json({ error: 'Missing topic, exercise or code' });

	const topicsList = req.exercises.ExercisesList;

	if (!topicsList.hasOwnProperty(topic)) return res.status(404).json({ error: 'Topic not found' });

	let topicExercises = topicsList[topic];

	let exerciseDetails = topicExercises.find((e) => e.Title === exercise);

	if (!exerciseDetails) return res.status(404).json({ error: 'Exercise not found' });

	exerciseDetails.Code === code ? null : (exerciseDetails.Status = 'In Progress');

	exerciseDetails.Code = code;

	fs.writeFileSync('./Models/Exercises.json', JSON.stringify(req.exercises));

	res.status(200).json({ message: 'Exercise saved' });
});

app.post('/api/topics/:topic/exercises/:exercise/submit', (req, res) => {
	const { topic, exercise } = req.params;
	const { status, code } = req.body;

	if (!topic || !exercise || !status) return res.status(400).json({ error: 'Missing topic, exercise or status' });

	const topicsList = req.exercises.ExercisesList;

	if (!topicsList.hasOwnProperty(topic)) return res.status(404).json({ error: 'Topic not found' });

	let topicExercises = topicsList[topic];

	let exerciseDetails = topicExercises.find((e) => e.Title === exercise);

	if (!exerciseDetails) return res.status(404).json({ error: 'Exercise not found' });

	exerciseDetails.Status = status;

	exerciseDetails.Code = code;

	if (status === 'Complete') {
		let topicsList = req.topics;
		let topicDetails = topicsList.TopicsList.find((t) => t.Title === topic);
		if (topicDetails) {
			topicDetails.Done_Exercises++;
			topicDetails.Medal = medalAssign(topicDetails.Done_Exercises, topicDetails.Tot_Exercises);
			topicDetails.Medal === 'Trophy' ? (topicDetails.Complete = true) : (topicDetails.Complete = false);
		}
	}

	fs.writeFileSync('./Models/Exercises.json', JSON.stringify(req.exercises));
	fs.writeFileSync('./Models/Topics.json', JSON.stringify(req.topics));

	res.status(200).json({ message: 'Exercise status updated' });
});

app.post('/api/topics/:topic/exercises/:exercise/retry', (req, res) => {
	const { topic, exercise } = req.params;

	if (!topic || !exercise) return res.status(400).json({ error: 'Missing topic, exercise or status' });

	const topicsList = req.exercises.ExercisesList;

	if (!topicsList.hasOwnProperty(topic)) return res.status(404).json({ error: 'Topic not found' });

	let topicExercises = topicsList[topic];

	let exerciseDetails = topicExercises.find((e) => e.Title === exercise);

	if (!exerciseDetails) return res.status(404).json({ error: 'Exercise not found' });

	let topics = req.topics;

	let topicDetails = topics.TopicsList.find((t) => t.Title === topic);

	if (topicDetails && exerciseDetails.Status === 'Complete' && topicDetails.Done_Exercises > 0) {
		topicDetails.Done_Exercises--;
		topicDetails.Medal = medalAssign(topicDetails.Done_Exercises, topicDetails.Tot_Exercises);
		topicDetails.Medal === 'Trophy' ? (topicDetails.Complete = true) : (topicDetails.Complete = false);
	}
	exerciseDetails.Status = 'In Progress';

	exerciseDetails.Code = '// Your code here\n';

	fs.writeFileSync('./Models/Exercises.json', JSON.stringify(req.exercises));
	fs.writeFileSync('./Models/Topics.json', JSON.stringify(req.topics));

	res.status(200).json({ message: 'Exercise status updated' });
});

app.listen(port, () => {
	console.log(`Server listening on port: ${port}`);
});
