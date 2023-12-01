import React from 'react';
import Customization from '../components/settingsComponents/Customization.js'
import Data from '../components/settingsComponents/Data.js'
import Features from '../components/settingsComponents/Features.js'
import Themes from '../components/settingsComponents/Themes.js'

const settingsList = ['Features', 'Customization', 'Data', 'Themes', 'Scripts']

class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            settingsState: '',
        }
        this.exitTool = this.exitTool.bind(this)
    }
    exitTool() {
        this.props.exitTool()
    }
    goToSetting(setting) {
        this.setState({
            settingsState: setting
        })
    }
    render() {
        const settingsButton = settingsList.map((item, index) => {
            return <li key={index} onClick={() => { this.goToSetting(item) }}>{item}</li>;
        })
        return (
            <div id="settingsWindow" className="tool">
                <button className="themedButton exitToolButton" onClick={this.exitTool}>❌</button>
                <div id="settingsSidebar">
                    <ul>
                        <h1 id="settingsWindowTitle">Settings</h1>
                        {settingsButton}
                    </ul>
                    {this.state.settingsState == 'Customization' ? <Customization></Customization> : <></>}
                    {this.state.settingsState == 'Features' ? <Features></Features> : <></>}
                    {this.state.settingsState == 'Data' ? <Data></Data> : <></>}
                    {this.state.settingsState == 'Themes' ? <Themes></Themes> : <></>}
                </div>
            </div>
        )
    }
}

export default Settings