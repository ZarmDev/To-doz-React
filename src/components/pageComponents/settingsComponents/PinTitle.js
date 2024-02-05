import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom/client';

// A feature I wasn't sure about

class PinTitle extends React.Component {
    constructor(props) {
        super(props)
    }
    render () {
        var section = this.props.section
        return (
            <div className="PinTitle">
                <h1>{this.props.item.split('|')[0]}</h1>
            </div>
        )
    }
}

export default PinTitle