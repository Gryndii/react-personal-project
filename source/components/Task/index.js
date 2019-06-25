// Core
import React, { PureComponent, createRef } from 'react';

// Instruments
import Styles from './styles.m.css';
import Edit from 'theme/assets/Edit';
import Star from 'theme/assets/Star';
import Remove from 'theme/assets/Remove';
import Checkbox from 'theme/assets/Checkbox';
import cx from 'classnames';

export default class Task extends PureComponent {
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

    state = {
        isEditing: false,
        editedMessage: this.props.message,
    };

    taskInput = createRef();

    _handleEditing = (e) => {
        const {id, message, _editTask} = this.props;
        const {isEditing, editedMessage} = this.state;

        if(isEditing && editedMessage && editedMessage!== message) _editTask(id, editedMessage);

        this.setState((prevState) => {
            return {
                isEditing: !prevState.isEditing,
            };
        }, () => {
            this.taskInput.current.focus();
        });
    };

    _handleKeyPress = (e) => {
        const {id, message, _editTask} = this.props;
        const {editedMessage} = this.state;

        if(e.key === 'Enter' && editedMessage && editedMessage!== message) {
            _editTask(id, editedMessage);

            this.setState({
                isEditing: false,
            });

        } else if(e.key === 'Escape') {
            this.setState({
               isEditing: false,
               editedMessage: message,
            });
        }
    };

    _getNewMessage = (e) => {
        this.setState({
            editedMessage: e.target.value,
        });
    };

    render () {
        const {
            _completeTask, _addToFavTask, _removeTask, completed, favorite, id
        } = this.props;

        const {isEditing, editedMessage} = this.state;

        return (
            <li className = { cx(Styles.task, {[Styles.completed] : completed}) }>
                <div className={Styles.content}>
                    <Checkbox
                        className={Styles.toggleTaskCompletedState}
                        inlineBlock
                        color1={'rgb(59, 142, 243)'}
                        color2={'rgb(255, 255, 255)'}
                        color3={'rgb(59, 142, 243)'}
                        checked={completed}
                        onClick={() => _completeTask(id)}
                    />
                    <input
                        type="text"
                        value={editedMessage}
                        maxLength="50"
                        ref={this.taskInput}
                        disabled={!isEditing}
                        onChange={(e) => this._getNewMessage(e)}
                        onKeyDown={(e) => this._handleKeyPress(e)}
                    />
                </div>
                <div className={Styles.actions}>
                    <Star
                        className={Styles.toggleTaskFavoriteState}
                        inlineBlock
                        color1={'rgb(59, 142, 243)'}
                        color2={'rgb(0, 0, 0)'}
                        color3={'rgb(59, 142, 243)'}
                        checked={favorite}
                        onClick={() => _addToFavTask(id)}
                    />
                    <Edit
                        className={Styles.updateTaskMessageOnClick}
                        inlineBlock
                        color1={'rgb(59, 142, 243)'}
                        color2={'rgb(0, 0, 0)'}
                        checked={isEditing}
                        onClick={(e) => this._handleEditing(e)}
                    />
                    <Remove
                        inlineBlock
                        color1={'rgb(59, 142, 243)'}
                        color2={'rgb(0, 0, 0)'}
                        onClick={() => _removeTask(id)}
                    />
                </div>
            </li>
        );
    }
}
