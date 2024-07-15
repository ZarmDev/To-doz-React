import React from 'react';
import SettingsDropdown from '../components/SettingsDropdown.js';

const theme = ["Use system default?·radio", "Dynamic Theme Enabled?·radio", "Spotlight Mode·radio"]

class Themes extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="settingsContent">
            <h1>Themes</h1>
            <div>
                <p>Still working on this...</p>
                {/* <SettingsDropdown title="Themes" children={theme}></SettingsDropdown> */}
            </div>
            </div>
        )
    }
}

export default Themes;