import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom/client';

class Main extends React.Component {
    constructor(props) {
        super(props)
    }
    render () {
        return (
            <div>
                <div id="topbar">
                    <h1>To-doz</h1>
                </div>
            </div>
        )
    }
}

export default Main