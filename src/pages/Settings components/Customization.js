import React from 'react';

class Customization extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="settingsContent">
            <h1>Customization</h1>
            <div>
            <input type="color"></input>
            </div>
            </div>
        )
    }
}

export default Customization;