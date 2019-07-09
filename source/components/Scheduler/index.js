// Core
import React, { Component } from 'react';

//Components
import Task from 'components/Task';
import Spinner from 'components/Spinner';
import Catcher from 'components/Catcher';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Checkbox from 'theme/assets/Checkbox';
import {sortTasksByGroup} from "instruments";
import FlipMove from 'react-flip-move';

export default class Scheduler extends Component {
    state = {
        tasks: [],
        tasksFilter: '',
        newTaskMessage: '',
        isTasksFetching : true,
    };

    componentDidMount() {
        this._fetchTasksAsync();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const sortedState = prevState;
        sortedState.tasks = sortTasksByGroup(sortedState.tasks);

        return sortedState;
    }

    _fetchTasksAsync = async () => {
        try {
            this._setTasksFetchingState(true);

            const fetchedTasks = await api.fetchTasks();

            this.setState({
                tasks: fetchedTasks,
            });
        } catch ({message}) {
            console.log(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching : state,
        });
    };

    _updateTasksFilter = (e) => {
        const value = e.target.value.toLowerCase();
        this.setState({tasksFilter: value});
    };

    _createTaskAsync = async (e) => {
        e.preventDefault();

        const {newTaskMessage} = this.state;

        if(!newTaskMessage) return null;

        try {
            this._setTasksFetchingState(true);

            const addedTask = await api.createTask(newTaskMessage);

            this.setState(({tasks}) => {
                return {
                    tasks: [addedTask, ...tasks],
                    newTaskMessage: '',
                };
            });
        } catch ({message}) {
            console.log(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _updateNewTaskMessage = (e) => {
        this.setState({newTaskMessage: e.target.value});
    };

    _removeTaskAsync = async (id) => {
        try {
            this._setTasksFetchingState(true);

            await api.removeTask(id);

            this.setState(({tasks}) => {
                return {
                    tasks: tasks.filter((task) => task.id !== id),
                };
            });
        } catch({message}) {
            console.log(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _updateTaskAsync = async (taskToUpdate) => {
        try {
            this._setTasksFetchingState(true);
            console.log('taskToUpdate', taskToUpdate);
            const updatedTask = await api.updateTask(taskToUpdate);
            console.log('updated tassk11', updatedTask);
            this.setState(({tasks}) => {
                return {
                    tasks: tasks.map(task => task.id === updatedTask.id ? updatedTask : task),
                };
            });
        } catch ({message}) {
            console.log(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _getAllCompleted = () => {
      const {tasks} = this.state;
      const isCompletedAll = tasks.every((task) => (task.completed));

      return isCompletedAll;
    };

    _completeAllTasksAsync = async () => {
        if(this._getAllCompleted()) return null;

        try {
            this._setTasksFetchingState(true);

            const {tasks} = this.state;

            await api.completeAllTasks(tasks);

            this.setState(({tasks}) => ({
                tasks: tasks.map((task) => {
                    task.completed = true;
                    return task;
                }),
            }));
        } catch ({message}) {
            console.log(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    render () {
        const {tasks, newTaskMessage, tasksFilter, isTasksFetching } = this.state;
        const tasksJSX = tasks.map((task) => {
            if(tasksFilter && !task.message.includes(tasksFilter)) return null;
            return(
                <Task
                    _updateTaskAsync = {this._updateTaskAsync}
                    _toggleTaskFavorite = {this._toggleTaskFavorite}
                    _toggleTaskCompleted = {this._toggleTaskCompleted}
                    _editTask = {this._editTask}
                    _removeTaskAsync = {this._removeTaskAsync}
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
                <Spinner isSpinning ={isTasksFetching }/>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            onChange={this._updateTasksFilter}
                            placeholder='Поиск'
                            type="search"
                            value={tasksFilter}
                        />
                    </header>
                    <section>
                        <form onSubmit={this._createTaskAsync}>
                            <input
                                maxLength={50}
                                className="createTask"
                                onChange={this._updateNewTaskMessage}
                                placeholder='Описaние моей новой задачи'
                                type="text"
                                value={newTaskMessage}
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div className="overlay">
                            <ul>
                                <FlipMove
                                    duration={400}
                                    enterAnimation="elevator"
                                    leaveAnimation="elevator"
                                    typeName="div"
                                >
                                    {tasksJSX}
                                </FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            color1={'#363636'}
                            color2={'#fff'}
                            checked={this._getAllCompleted()}
                            onClick={this._completeAllTasksAsync }
                        />
                        <span className={Styles.completeAllTasks}>Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}
