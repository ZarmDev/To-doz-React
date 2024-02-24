import React from "react";

function Themes(props) {
    return (
        <div className="fadeInEffect">
            <h1>Choose a theme:</h1>
            <p id="changeLater">(You can change this later.)</p>
            <div id="themeSelect">
                <div onClick={(event) => { props.selectedTheme(event) }}>
                    <p>Light</p>
                </div>
                <div onClick={(event) => { props.selectedTheme(event) }}>
                    <p>Dark</p>
                </div>
                <div onClick={(event) => { props.selectedTheme(event) }}>
                    <p>More coming soon...</p>
                </div>
            </div>
        </div>
    )
}

export default Themes;