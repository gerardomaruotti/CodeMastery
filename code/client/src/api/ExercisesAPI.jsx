const serverURL = 'http://localhost:3001';

const ExercisesAPI = {
	getExerciseDetail: (topicTitle, exerciseTitle) => {
		return fetch(serverURL + `/api/topics/${topicTitle}/exercises/${exerciseTitle}`, {
			method: 'GET',
			credentials: 'include',
		});
	},

	getExercises: (topicTitle) => {
		return fetch(serverURL + `/api/topics/${topicTitle}/exercises`, {
			method: 'GET',
			credentials: 'include',
		});
	},

	saveExercise: (topicTitle, exerciseTitle, code) => {
		return fetch(serverURL + `/api/topics/${topicTitle}/exercises/${exerciseTitle}/save`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code }),
		});
	},

	submitExercise: (topicTitle, exerciseTitle, code, status) => {
		return fetch(serverURL + `/api/topics/${topicTitle}/exercises/${exerciseTitle}/submit`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code, status }),
		});
	},

	retryExercise: (topicTitle, exerciseTitle) => {
		return fetch(serverURL + `/api/topics/${topicTitle}/exercises/${exerciseTitle}/retry`, {
			method: 'POST',
			credentials: 'include',
		});
	},
};

export default ExercisesAPI;
