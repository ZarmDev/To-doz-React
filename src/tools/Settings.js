import React, { useEffect, useState } from 'react';
import Customization from '../components/pageComponents/settingsComponents/pages/Customization.js'
import Data from '../components/pageComponents/settingsComponents/Data.js'
import Features from '../components/pageComponents/settingsComponents/pages/Features.js'
import Themes from '../components/pageComponents/settingsComponents/pages/Themes.js'
import introJs from 'intro.js';

const settingsList = ['Features', 'Customization', 'Themes', 'Scripts']
// corresponding tutorial hints
const settingsHints = ['Features is where you can change what you want to have and not have, currently not working :(', 'Customization is where you can customize and edit your preferences for visual stuff, currently works', 'Themes is where you can edit what color theme you want to have, currently not working.', 'Scripts is where you can add your own scripts to run, currently not working.'];

function Settings(props) {
    const [settingsState, setSettingsState] = useState(null);

    useEffect(() => {
        // add a timeout and change it to only start data-intro with certain tooltips of settings options
        if (window.shouldPresentFirstStartUp["settingstour"] == true) {
            setTimeout(() => {
                introJs(".settingOption").start()
            }, 1000)
            window.shouldPresentFirstStartUp["settingstour"] = false;
        }
    })

    function exitTool() {
        props.exitTool()
    }
    function goToSetting(setting) {
        setSettingsState(setting)
    }

    const settingsButton = settingsList.map((item, index) => {
        return <li className="settingOption" data-intro={settingsHints[index]} key={index} onClick={() => { goToSetting(item) }}>{item}</li>;
    })
    return (
        <div id="settingsWindow" className="tool">
            <button className="themedButton exitToolButton" onClick={exitTool}>❌</button>
            <div id="settingsSidebar">
                <ul>
                    <h1 id="settingsWindowTitle">Settings</h1>
                    {settingsButton}
                </ul>
                {settingsState == 'Customization' ? <Customization></Customization> : <></>}
                {settingsState == 'Features' ? <Features></Features> : <></>}
                {settingsState == 'Data' ? <Data></Data> : <></>}
                {settingsState == 'Themes' ? <Themes></Themes> : <></>}
            </div>
        </div>
    )
}

export default Settings