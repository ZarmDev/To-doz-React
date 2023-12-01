import React from 'react';

class Features extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="settingsContent">
            <h1>Features</h1>
            <div>
                <h2>Toolbar</h2>
                <label for="blurEnabled">Focus Session</label>
                <input id="blurEnabled" type="checkbox"></input><br></br>
                <label for="blurEnabled">Enable Blur?</label>
                <input id="blurEnabled" type="checkbox"></input><br></br>
            </div>
            </div>
        )
    }
}

export default Features;