import {ROOT_URL, MAIN_URL, TOKEN} from "REST/config";

export const api = {
    async _fetchTasks() {
        const response = await fetch(MAIN_URL, {
            method: 'GET',
            headers: {
                Authorization: TOKEN,
            },
        });

        if(response.status !== 200) {
            throw new Error('Tasks were not fetched from server');
        }

        const {data: fetchedTasks, meta, message} = await response.json();

        return {fetchedTasks, meta, message};
    },

    async _addTask(newTask) {
        const response = await fetch(MAIN_URL, {
            method: 'POST',
            headers: {
                Authorization: TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        });

        if(response.status !== 200) {
            throw new Error('New task wasn`t send to server');
        }

        const {data: updatedTask, meta, message} = await response.json();

        return {updatedTask, meta, message};
    },

    async _updateTask(editedTasks) {
        const response = await fetch(MAIN_URL, {
            method: 'PUT',
            headers: {
                Authorization: TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedTasks),
        });

        if(response.status !== 200) {
            throw new Error('Task wasn`t updated');
        }

        const {data: updatedTasks, meta, message} = await response.json();

        return {updatedTasks, meta, message};
    },

    async _removeTask(postId) {
        const response = await fetch(`${MAIN_URL}/${postId}`, {
            method: 'DELETE',
            headers: {
              Authorization: TOKEN,
            },
        });

        if (response.status !== 200 && response.status !== 204) {
            throw new Error('Post wasn`t deleted');
        }
    },
};
