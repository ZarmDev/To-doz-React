import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';

function Dashboard(props) {
    const [elapsed, setElapsed] = useState(null);
    const [productivityStatus, setProductivityStatus] = useState({});

    const handleDayClick = (date) => {
        // Toggle productivity status for the selected date
        const updatedStatus = { ...productivityStatus };
        updatedStatus[date.toDateString()] = !updatedStatus[date.toDateString()];
        setProductivityStatus(updatedStatus);
    };

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
            {/* <h1 className='text-center'>Productivity Calendar</h1>
            <div className='calendar-container'>
                <Calendar onChange={handleDayClick} value={new Date()} />
            </div>
            <p className='text-center'>
                <span className='bold'>Selected Date:</span> {new Date().toDateString()}
            </p>
            {Object.keys(productivityStatus).map((date) => (
                <p key={date} className='text-center'>
                    {date}: {productivityStatus[date] ? 'Productive' : 'Not productive'}
                </p>
            ))} */}
        </div>
    )
}

export default Dashboard;