import React from 'react';
import Customization from './Settings components/Customization'

class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            settingsState: '',
            list: ['Features', 'Customization', 'About', 'Themes']
        }
        this.exitSettings = this.exitSettings.bind(this)
    }
    exitSettings() {
        this.props.parentCallback()
    }
    goToSetting(setting) {
        this.setState({
            settingsState: setting
        })
    }
    render() {
        const settingsButton = this.state.list.map((item, index) => {
            return <li key={index} onClick={() => { this.goToSetting(item) }}>{item}</li>;
        })
        return (
            <div id="settingsWindow">
                <button className="themedButton" onClick={this.exitSettings} id="exitSettings">❌</button>
                <h1>Settings</h1>
                <div id="settingsSidebar">
                    <ul>
                        {settingsButton}
                    </ul>
                    {this.state.settingsState == 'Customization' ? <Customization></Customization> : <></>}
                </div>
            </div>
        )
    }
}

export default Settings