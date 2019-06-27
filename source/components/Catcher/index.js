//Core
import React, {Component} from 'react';

//Instruments
import Styles from './styles.m.css';

export default class Catcher extends Component {
    state = {
        isError: false,
    };

    componentDidCatch(error, errorInfo) {
        console.log('ERROR', error);
        console.log('ERROR TRACE', errorInfo);

        this.setState({
            isError: true,
        });
    }

    render () {
        const children = this.props.children;
        const {isError} = this.state;

        if (isError) {
            return(
                <div className={Styles.catcher}>
                    <h1>
                        Oops... Something went wrong. <br/>
                    </h1>
                    <p>
                        Our developers are fixing it already. <br/>
                        Try to visit us 1 hour later.
                    </p>
                </div>
            );
        }

        return (children);
    }
}
