import React from 'react';

class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.exitSettings = this.exitSettings.bind(this)
    }
    exitSettings() {
        this.props.parentCallback()
    }
    render() {
        return (
            <div id="settingsWindow">
                <button onClick={this.exitSettings} id="exitSettings">❌</button>
                <h1>Settings</h1>
                <div id="settingsSidebar">
                    <ul>
                        <li>Features</li>
                        <li>Customization</li>
                        <li>About</li>
                        <li>Themes</li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Settings