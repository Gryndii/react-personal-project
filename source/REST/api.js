import {ROOT_URL, MAIN_URL, TOKEN} from "REST/config";
import {BaseTaskModel} from "instruments";
import moment from 'moment';

export const api = {
    async fetchTasks() {
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

        return fetchedTasks;
    },

    async createTask(newTaskMessage) {
        const newTask = new BaseTaskModel();
        newTask.message = newTaskMessage;
        newTask.created = moment().unix();

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

        return updatedTask;
    },

    async updateTask(editedTask) {
        const response = await fetch(MAIN_URL, {
            method: 'PUT',
            headers: {
                Authorization: TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([editedTask]),
        });

        if(response.status !== 200) {
            throw new Error('Task wasn`t updated');
        }

        const {data: updatedTask, meta, message} = await response.json();

        return updatedTask;
    },

    async removeTask(postId) {
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

    async completeAllTasks(tasks) {
        const promiseAll = await Promise.all(
            tasks.map(async (task) => {
                task.completed = true;

                const response = await fetch(MAIN_URL, {
                    method: 'PUT',
                    headers: {
                        Authorization: TOKEN,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([task]),
                });

                if(response.status !== 200) {
                    throw new Error('One of tasks wasn`t completed');
                }
            })
        );
    },
};
