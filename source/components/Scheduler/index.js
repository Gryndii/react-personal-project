// Core
import React, { Component } from 'react';

//Components
import Task from 'components/Task';
import Spinner from 'components/Spinner';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Checkbox from 'theme/assets/Checkbox';
import {BaseTaskModel, sortTasksByGroup, sortTasksByDate} from "instruments";
import moment from 'moment';

export default class Scheduler extends Component {
    state = {
        tasks: [],
        searchMessage: '',
        newTaskMessage: '',
        isLoading: false,
    };

    componentDidMount() {
        this._fetchTasks();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const sortedState = prevState;
        sortedState.tasks = sortTasksByGroup(sortedState.tasks);

        return sortedState;
    }

    _fetchTasks = async () => {
        try {
            this._setLoadingState(true);

            const {fetchedTasks} = await api._fetchTasks();

            this.setState({
                tasks: fetchedTasks,
            });
        } catch ({message}) {
            console.log(message);
        } finally {
            this._setLoadingState(false);
        }
    };

    _setLoadingState = (state) => {
        this.setState({
            isLoading: state,
        });
    };

    _handleSearch = (e) => {
        this.setState({searchMessage: e.target.value});
    };

    _addTask = async (e) => {
        e.preventDefault();

        const {newTaskMessage} = this.state;

        if(!newTaskMessage) return;

        const newTask = new BaseTaskModel();
        newTask.message = newTaskMessage;
        newTask.created = moment().unix();

        try {
            this._setLoadingState(true);

            const {updatedTask} = await api._addTask(newTask);

            this.setState(({tasks}) => {
                return {
                    tasks: [updatedTask, ...tasks],
                    newTaskMessage: '',
                };
            });
        } catch ({message}) {
            console.log(message);
        } finally {
            this._setLoadingState(false);
        }
    };

    _getNewTaskMessage = (e) => {
        this.setState({newTaskMessage: e.target.value});
    };

    _removeTask = async (id) => {
        try {
            this._setLoadingState(true);

            await api._removeTask(id);

            this.setState(({tasks}) => {
                return {
                    tasks: tasks.filter((task) => task.id !== id),
                };
            });
        } catch({message}) {
            console.log(message);
        } finally {
            this._setLoadingState(false);
        }
    };

    _completeTask = (id) => {


        // this.setState(({tasks}) => {
        //     return {
        //         tasks: tasks.map((task) => {
        //             if(task.id === id) {
        //                 task.completed = !task.completed;
        //                 return task;
        //             } else {
        //                 return task;
        //             }
        //         }),
        //     };
        // });
    };

    _addToFavTask = (id) => {
        this.setState(({tasks}) => {
            return {
                tasks: tasks.map((task) => {
                    if(task.id === id) {
                        task.favorite = !task.favorite;
                        return task;
                    } else {
                        return task;
                    }
                }),
            };
        });
    };

    _editTask = (id, editedMessage) => {
        this.setState(({tasks}) => {
            return {
                tasks: tasks.map((task) => {
                    if(task.id === id) {
                        task.message = editedMessage;
                        return task;
                    } else {
                        return task;
                    }
                }),
            };
        });
    };

    _completeAllTasks = () => {
        this.setState(({tasks}) => {
            return {
                tasks: tasks.map((task) => {
                    task.completed = true;
                    return task;
                }),
            };
        });
    };

    render () {
        const {tasks, newTaskMessage, searchMessage, isLoading} = this.state;
        const tasksJSX = tasks.map((task) => {
            if(searchMessage && !task.message.includes(searchMessage)) return null;
            return(
                <Task
                    _completeTask = {this._completeTask}
                    _addToFavTask = {this._addToFavTask}
                    _editTask = {this._editTask}
                    _removeTask = {this._removeTask}
                    message={task.message}
                    completed={task.completed}
                    favorite={task.favorite}
                    id={task.id}
                    key={task.id}
                />
            );
        });

        return (
            <section className = { Styles.scheduler }>
                <main>
                    {isLoading ? <Spinner/> : null}
                    <header>
                        <h1>Task Scheduler</h1>
                        <input
                            type="text"
                            placeholder='Search'
                            onChange={this._handleSearch}
                            value={searchMessage}
                        />
                    </header>
                    <section>
                        <form action="" onSubmit={this._addTask}>
                            <input
                                type="text"
                                placeholder='Task Description'
                                onChange={this._getNewTaskMessage}
                                value={newTaskMessage}
                            />
                            <button>Add Task</button>
                        </form>
                        <ul>
                            {tasksJSX}
                        </ul>
                    </section>
                    <footer>
                        <Checkbox
                            className={Styles.toggleTaskCompletedState}
                            color1={'rgb(54, 54, 54)'}
                            color2={'rgb(255, 255, 255)'}
                            color3={'rgb(54, 54, 54)'}
                            checked={tasks.every((task) => task.completed)}
                            onClick={this._completeAllTasks}
                        />
                        <span className={Styles.completeAllTasks}>All tasks are completed</span>
                    </footer>
                </main>
            </section>
        );
    }
}
