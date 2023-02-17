import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom/client';

class Themes extends React.Component {
    constructor(props) {
        super(props)
        this.selectedTheme = this.selectedTheme.bind(this)
    }

    selectedTheme(event) {
        const chosenTheme = event.target.innerText;
        if (chosenTheme == 'Light') {
            //
        } else if (chosenTheme == 'Dark') {
            //
        }
        document.getElementById('reactThemes').style.display = 'none'
    }

    render() {
        return(
            <div id="reactThemes">
            <div id="themes">
            </div>
            <div id="themeContainer">
            <h1>Choose a theme:</h1>
            <div id="themeSelect">
                <div onClick={(event) => {this.selectedTheme(event)}}>
                    <p>Light</p>
                </div>
                <div onClick={(event) => {this.selectedTheme(event)}}>
                    <p>Dark</p>
                </div>
            </div>
            </div>
            </div>
        )
    }
}

export default Themes;