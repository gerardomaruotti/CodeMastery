const serverURL = 'http://localhost:3001';

const ProposalsAPI = {
	getProposalDetail: (proposalId) => {
		return fetch(serverURL + `/api/proposals/${proposalId}`, {
			method: 'GET',
			credentials: 'include',
		});
	},

	getProposals: () => {
		return fetch(serverURL + `/api/proposals`, {
			method: 'GET',
			credentials: 'include',
		});
	},

	createProposal: (proposal) => {
		return fetch(serverURL + `/api/proposals`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(proposal),
		});
	},

	updateProposal: (proposalId, proposal) => {
		return fetch(serverURL + `/api/proposals/${proposalId}`, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(proposal),
		});
	},

	deleteProposal: (proposalId) => {
		return fetch(serverURL + `/api/proposals/${proposalId}`, {
			method: 'DELETE',
			credentials: 'include',
		});
	},
};

export default ProposalsAPI;
