// Core
import React, { Component } from 'react';

//Components
import Task from 'components/Task';
import Spiner from 'components/Spinner';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Checkbox from 'theme/assets/Checkbox';

export default class Scheduler extends Component {
    render () {
        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Task Scheduler</h1>
                        <input type="text" placeholder='Search'/>
                    </header>
                    <section>
                        <form action="">
                            <input type="text" placeholder='Task Description'/>
                            <button>Add Task</button>
                        </form>
                        <ul>
                            <Task/>
                        </ul>
                    </section>
                    <footer>
                        <Checkbox
                            className={Styles.toggleTaskCompletedState}
                            color1={'rgb(54, 54, 54)'}
                            color2={'rgb(255, 255, 255)'}
                            color3={'rgb(54, 54, 54)'}
                        />
                        <span className={Styles.completeAllTasks}>All tasks are completed</span>
                    </footer>
                </main>
            </section>
        );
    }
}
