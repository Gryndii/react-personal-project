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
    };

    taskInput = createRef();

    _handleEditing = () => {
        this.setState(({isEditing}) => {
            return {
                isEditing: !isEditing,
            };
        });
        this.taskInput.current.focus();
    };

    render () {
        const {
            _completeTask, _addToFavTask, _editTask, _removeTask, message, completed, favorite, id
        } = this.props;

        const {isEditing} = this.state;

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
                        value={message}
                        ref={this.taskInput}
                        disabled={!isEditing}
                        onChange={(e) => _editTask(id, e)}
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
                        onClick={this._handleEditing}
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
