import React from 'react';

// Similar to windows 11 settings dropdown

class SettingsDropdown extends React.Component {
    constructor(props) {
        super(props)
    }
    render () {
        return (
            <div class="settingsDropdown">
                <h1>{this.props.title}</h1>
            </div>
        )
    }
}

export default SettingsDropdown;