import React from 'react';

class Data extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="settingsContent">
            <h1>Data</h1>
            <div>
            <input type="color"></input>
            </div>
            </div>
        )
    }
}

export default Data;