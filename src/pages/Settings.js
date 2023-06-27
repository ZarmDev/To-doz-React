import React from 'react';
import Customization from './Settings components/Customization'

function addBlur(state) {
    setTimeout(function () { document.getElementById('settingsWindow').className = `${document.getElementById('settingsWindow').className} window` }, 500)
}
class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            settingsState: '',
            list: ['Features', 'Customization', 'About', 'Themes']
        }
        this.exitSettings = this.exitSettings.bind(this)
    }
    componentDidMount() {
        addBlur()
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
                <div id="settingsSidebar">
                    <ul>
                        <h1 id="settingsWindowTitle">Settings</h1>
                        {settingsButton}
                    </ul>
                    {this.state.settingsState == 'Customization' ? <Customization></Customization> : <></>}
                </div>
            </div>
        )
    }
}

export default Settings