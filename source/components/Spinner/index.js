// Core
import React from 'react';

// Instruments
import Styles from './styles.m.css';

const Spinner = ({isSpinning}) => {
    return(
        isSpinning
            ? <div className = { Styles.spinner } />
            : null
    );
};

export default Spinner;
