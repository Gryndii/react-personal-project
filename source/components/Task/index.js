// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';
import Edit from 'theme/assets/Edit';
import Star from 'theme/assets/Star';
import Remove from 'theme/assets/Remove';
import Checkbox from 'theme/assets/Checkbox';

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

    render () {
        return (
            <li className = { Styles.task }>
                <div className={Styles.content}>
                    <Checkbox
                        className={Styles.toggleTaskCompletedState}
                        inlineBlock
                        color1={'rgb(59, 142, 243)'}
                        color2={'rgb(255, 255, 255)'}
                        color3={'rgb(59, 142, 243)'}
                    />
                    <input type="text"/>
                </div>
                <div className={Styles.actions}>
                    <Star
                        className={Styles.toggleTaskFavoriteState}
                        inlineBlock
                        color1={'rgb(59, 142, 243)'}
                        color2={'rgb(0, 0, 0)'}
                        color3={'rgb(59, 142, 243)'}
                    />
                    <Edit
                        className={Styles.updateTaskMessageOnClick}
                        inlineBlock
                        color1={'rgb(59, 142, 243)'}
                        color2={'rgb(0, 0, 0)'}
                    />
                    <Remove
                        inlineBlock
                        color1={'rgb(59, 142, 243)'}
                        color2={'rgb(0, 0, 0)'}
                    />
                </div>
            </li>
        );
    }
}
