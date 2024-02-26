const serverURL = 'http://localhost:3001';

const AuthenticationAPI = {
	getSessionAPI: () => {
		return fetch(serverURL + '/api/session', {
			method: 'GET',
			credentials: 'include',
		});
	},
};

export default AuthenticationAPI;
