// Core
import React, { PureComponent, createRef } from 'react';
import {string, bool, func} from 'prop-types';

// Instruments
import Styles from './styles.m.css';
import Edit from 'theme/assets/Edit';
import Star from 'theme/assets/Star';
import Remove from 'theme/assets/Remove';
import Checkbox from 'theme/assets/Checkbox';
import cx from 'classnames';

export default class Task extends PureComponent {
    state = {
        newMessage: this.props.message,
        isTaskEditing: false,
    };

    static propTypes = {
        id: string.isRequired,
        completed: bool.isRequired,
        favorite: bool.isRequired,
        message: string.isRequired,
        _updateTaskAsync: func.isRequired,
        _removeTaskAsync: func.isRequired,
    };

    taskInput = createRef();

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _setTaskEditingState = (isTaskEditing) => {
        this.setState({
            isTaskEditing: isTaskEditing,
        }, () => {
            if(isTaskEditing) this._taskInputFocus();
        });
    };

    _taskInputFocus = () => {
        this.taskInput.current.focus();
    };

    _updateNewTaskMessage = (e) => {
        const newMessage = e.target.value;

        this.setState({
            newMessage: newMessage,
        });
    };

    _updateTask = (taskToUpdate) => {
        this._setTaskEditingState(false);

        if(this.state.newMessage === this.props.message) return null;

        this.props._updateTaskAsync(taskToUpdate);
    };

    _updateTaskMessageOnClick = () => {
        const updatedTask = this._getTaskShape({
            message: this.state.newMessage,
        });

        if(this.state.isTaskEditing) {
            this._updateTask(updatedTask);
            return null;
        } else {
            this._setTaskEditingState(true);
        }
    };

    _cancelUpdatingTaskMessage = () => {
        this._setTaskEditingState(false);

        this.setState({
            newMessage: this.props.message,
        });
    };

    _updateTaskMessageOnKeyDown = (e) => {
        if(!this.state.newMessage)  return null;

        const updatedTask = this._getTaskShape({
            message: this.state.newMessage,
        });

        if(e.key === 'Enter') {
            this._updateTask(updatedTask);
        } else if(e.key === 'Escape') {
            this._cancelUpdatingTaskMessage();
        }
    };

    _toggleTaskCompletedState = () => {
        const updatedTask = this._getTaskShape({
            completed: !this.props.completed,
        });
        this.props._updateTaskAsync(updatedTask);
    };

    _toggleTaskFavoriteState = () => {
        const updatedTask = this._getTaskShape({
            favorite: !this.props.favorite,
        });
        this.props._updateTaskAsync(updatedTask);
    };

    _removeTask = () => {
        this.props._removeTaskAsync(this.props.id);
    };

    render () {
        const {completed, favorite} = this.props;
        const {newMessage, isTaskEditing} = this.state;

        return (
            <li className = { cx(Styles.task, {[Styles.completed] : completed}) }>
                <div className={Styles.content}>
                    <Checkbox
                        className={Styles.toggleTaskCompletedState}
                        inlineBlock
                        color1="#3B8EF3"
                        color2="#FFF"
                        checked={completed}
                        onClick={this._toggleTaskCompletedState}
                    />
                    <input
                        type="text"
                        value={newMessage}
                        maxLength={50}
                        ref={this.taskInput}
                        disabled={!isTaskEditing}
                        onChange={(e) => this._updateNewTaskMessage(e)}
                        onKeyDown={(e) => this._updateTaskMessageOnKeyDown(e)}
                    />
                </div>
                <div className={Styles.actions}>
                    <Star
                        className={Styles.toggleTaskFavoriteState}
                        inlineBlock
                        color1={'#3B8EF3'}
                        color2={'#000'}
                        checked={favorite}
                        onClick = {this._toggleTaskFavoriteState}
                    />
                    <Edit
                        className={Styles.updateTaskMessageOnClick}
                        inlineBlock
                        color1={'#3B8EF3'}
                        color2={'#000'}
                        checked={isTaskEditing}
                        onClick={this._updateTaskMessageOnClick}
                    />
                    <Remove
                        className="removeTask"
                        inlineBlock
                        color1={'#3B8EF3'}
                        color2={'#000'}
                        onClick={this._removeTask}
                    />
                </div>
            </li>
        );
    }
}
