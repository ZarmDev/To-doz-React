import { clear } from '@testing-library/user-event/dist/clear';
import React, { useState } from 'react'

function notifyMe() {
    const message = "You have completed your focus session. Nice job! 👍"
    if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        const notification = new Notification(message);
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                const notification = new Notification(message);
            }
        });
    }
}

function Timer() {
    const [initialDate, setInitialDate] = useState(new Date());
    const [timer, setTimer] = useState(null);
    const [focusAmount, setfocusAmount] = useState(0);
    const [display, setDisplay] = useState(0);

    function sessionTimeout() {
        // var minutesElapsed = Math.abs((initialDate - new Date()) / 1000 / 60);
        let difference = new Date() - initialDate
        const totalSeconds = Math.round(difference / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const minuteDifference = Math.abs(focusAmount - minutes);
        console.log((focusAmount % 60), seconds);
        const secondDifference = Math.abs(60 - seconds);
        // console.log(minuteDifference, secondDifference, focusAmount);
        // this.state.checked is for checking if seconds should be shown
        const timeInString = `${String(minuteDifference)} minutes and ${String(secondDifference)} seconds`;

        setDisplay(timeInString);
        if (minutes > focusAmount) {
            //
        }
    };

    function startTimer() {
        setInitialDate(new Date());
        sessionTimeout()
        setTimer(setInterval(sessionTimeout, 1000));
    }

    function pauseTimer() {
        clearInterval(timer);
    }

    function showSeconds() {
        
    }

    function updateAmount(event) {
        const value = event.target.value;
        setfocusAmount(Number(value) - 1)
        if (value == '') {
            setDisplay(0)
        } else {
            setDisplay(`${value} minutes`)
        }
    }

    return (
        <div id="focusTimer">
            <h1>{display}</h1>
            <label for="showSec">Show time?</label>
            <input onClick={(event) => { showSeconds(event) }} id="showSeconds" name="showSec" type="checkbox"></input><br></br>
            <button className="themedButton" onClick={startTimer}>{'▶️'}</button>
            <button className="themedButton" onClick={pauseTimer}>{'⏸️'}</button>
            <p>Time to focus: </p>
            <input id="focusMinutesInput" autocomplete="off" disabled={timer != null} onChange={(event) => {updateAmount(event)}} type="focusAmount"></input>
        </div>
    )
}

export default Timer;