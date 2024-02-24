import React, { useState, useEffect } from 'react';

function Dashboard(props) {
    const [elapsed, setElapsed] = useState(null);

    useEffect(() => {
        setElapsed(performance.now())
        // Just to set a interval to update the elapsed time, not to actually change it
        setInterval(() => {
            setElapsed(performance.now())
        }, 1000)
    }, []);

    function exitTool() {
        props.exitTool()
    }

    let totalSeconds = elapsed / 1000;
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds = Math.floor(totalSeconds % 60);
    return (
        <div id="dashboard" className='tool'>
            <button className="themedButton exitToolButton" onClick={exitTool}>❌</button>
            <p>Elapsed time since you opened To-doz: {hours} hours, {minutes} minutes and {seconds} seconds</p>
        </div>
    )
}

export default Dashboard;