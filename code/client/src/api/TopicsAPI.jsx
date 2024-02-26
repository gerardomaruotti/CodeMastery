const serverURL = 'http://localhost:3001';

const TopicsAPI = {
    getTopicDetail: (topicTitle) => {
        return fetch(serverURL + `/api/topics/${topicTitle}`, {
            method: 'GET',
            credentials: 'include',
        });
    },

    getTopics: () => {
        return fetch(serverURL + `/api/topics`, {
            method: 'GET',
            credentials: 'include',
        });
    }
};

export default TopicsAPI;
