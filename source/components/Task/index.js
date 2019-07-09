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

    _setTaskEditingState = (state=true, callback) => {
        this.setState({
            isEditing: state,
        }, () => {
            if(typeof callback === 'function') callback();
        });
    };

    _handleEditing = (e) => {
        const {message, _updateTaskAsync} = this.props;
        const {isEditing, editedMessage} = this.state;

        if(isEditing && editedMessage && editedMessage!== message) {
            _updateTaskAsync({
                ...this.props,
                message: editedMessage,
            });
        }

        this._setTaskEditingState(!isEditing, () => {
            this.taskInput.current.focus();
        });
    };

    _updateTaskMessageOnKeyDown = (e) => {
        const {message} = this.props;
        const {editedMessage} = this.state;

        if(e.key === 'Enter' && editedMessage && editedMessage!== message) {
            this._handleEditing();

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
            _toggleTaskFavorite, _toggleTaskCompleted, _updateTaskAsync, _removeTaskAsync, completed, favorite, id
        } = this.props;

        const {isEditing, editedMessage} = this.state;

        return (
            <li className = { cx(Styles.task, {[Styles.completed] : completed}) }>
                <div className={Styles.content}>
                    <Checkbox
                        className={Styles.toggleTaskCompletedState}
                        inlineBlock
                        color1="#3B8EF3"
                        color2="#FFF"
                        checked={completed}
                        onClick={() => _updateTaskAsync({
                            ...this.props,
                            completed: !this.props.completed,
                        })}
                    />
                    <input
                        type="text"
                        value={editedMessage}
                        maxLength={50}
                        ref={this.taskInput}
                        disabled={!isEditing}
                        onChange={(e) => this._getNewMessage(e)}
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
                        onClick={() => _updateTaskAsync({
                            ...this.props,
                            favorite: !this.props.favorite,
                        })}
                    />
                    <Edit
                        className={Styles.updateTaskMessageOnClick}
                        inlineBlock
                        color1={'#3B8EF3'}
                        color2={'#000'}
                        checked={isEditing}
                        onClick={(e) => this._handleEditing(e)}
                    />
                    <Remove
                        className="removeTask"
                        inlineBlock
                        color1={'#3B8EF3'}
                        color2={'#000'}
                        onClick={() => _removeTaskAsync(id)}
                    />
                </div>
            </li>
        );
    }
}
