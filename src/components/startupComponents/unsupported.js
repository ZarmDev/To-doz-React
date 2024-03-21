import React from "react";

function Unsupported() {
    return (
        <div id="unsupported" className="fadeInEffect">
            <h1>Edge users:</h1>
            <p>If your using edge and want to use the focus session in the background, you have
                to put an exception for this website to not go to sleep (so the timer works in the
                background), this is pretty annoying so I'm looking for ways to fix it. If you
                want to do this, go to the settings and search for "Never put these sites to sleep"
            </p>
        </div>
    )
}

export default Unsupported;