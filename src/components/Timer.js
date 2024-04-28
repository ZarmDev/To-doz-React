import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// credits to MDN for this code
function notify(message) {
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

function roundThousandDown(num) {
    return (Math.floor(num / 1000) * 1000)
}

// TODO: Fix variable naming, pls forgive me....

class Timer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // time elapsed including before pauses
            totalTimeElapsed: 0,
            // when user last paused session
            lastPause: null,
            // time directly from the input (check getNumber function)
            time: 0,
            // time passed including totalTimeElapsed and time since the lastPause
            timePassed: null,
            // if a focus session is currently happening
            focus: false,
            // if user wants to see seconds (yeah i know terrible name)
            checked: false,
            // for clearing timer
            timerId: null,
            // if minimized
            minimizedFocusSession: false,
            isFocusHeaderShown: false
        }

        this.startTimer = this.startTimer.bind(this);
        this.getNumber = this.getNumber.bind(this);
        this.countDown = this.countDown.bind(this);
        this.showSeconds = this.showSeconds.bind(this);
        this.pauseTimer = this.pauseTimer.bind(this);
    }
    componentDidMount() {
        // you can just check if the window is minimized
        if (localStorage.getItem('lastFocusAmount') != null) {
            const lastFocusAmount = Number(localStorage.getItem('lastFocusAmount'));
            this.setState({
                time: lastFocusAmount,
                minimizedFocusSession: true
            })
            localStorage.removeItem('lastFocusAmount')
        }
        const focusHeader = document.getElementById('focusHeader');
        const style = window.getComputedStyle(focusHeader);
        const isFocusHeaderVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        console.log(isFocusHeaderVisible)
        this.setState({
            // if focusHeader is displayed on the screen
            isFocusHeaderShown: isFocusHeaderVisible
        })
    }
    // Clears the interval if component is removed
    componentWillUnmount() {
        clearInterval(this.state.timerId)
    }
    startTimer() {
        this.setState({
            lastPause: Date.now()
        })
        // if it started only now, start it!
        if (this.state.timePassed == null) {
            // trick to make it not show 0 on start
            this.setState({
                focus: true,
                timePassed: this.state.time
            })
            this.state.timerId = setInterval(this.countDown, 10)
            // if it's paused, continue it!
        } else if (this.state.time != 0 && this.state.focus == false) {
            this.setState({
                focus: true
            })
            this.state.timerId = setInterval(this.countDown, 1000)
        }
    }

    countDown() {
        // check if no time left, and end the focus session
        // let elapse = (this.state.totalTimeElapsed + roundThousandDown(Date.now() - this.state.lastPause));
        // let timeSet = this.state.time
        this.setState({
            timePassed: this.state.time - (this.state.totalTimeElapsed + roundThousandDown(Date.now() - this.state.lastPause))
        })
        if (Math.round(this.state.timePassed) == 0) {
            this.setState({
                totalTimeElapsed: 0,
                focus: false
            })
            clearInterval(this.state.timerId)
            notify("You have completed your focus session. Nice job! 👍")
        }
    }

    getNumber(event) {
        let newNum = event;
        // convert to miliseconds
        newNum = newNum * 60000;
        this.setState({
            time: newNum
        })
        // this is for the minimized window feature, this is probably inefficent
        localStorage.setItem('lastFocusAmount', newNum)
    }

    showSeconds(event) {
        let isChecked = event.target.checked;
        this.setState({
            checked: isChecked
        })
    }

    pauseTimer() {
        // if already paused...
        if (this.state.focus == false) {
            return;
        }
        // if you pause the timer, add the time passed since the last pause to the totalTimeElapsed
        clearInterval(this.state.timerId)
        this.setState({
            focus: false,
            totalTimeElapsed: this.state.totalTimeElapsed + (roundThousandDown(Date.now() - this.state.lastPause))
        })
            // }, () => {
        //     console.log(roundThousandDown(Date.now() - this.state.lastPause), Date.now() - this.state.lastPause);
        //     console.log(this.state.totalTimeElapsed)
        // })
    }
    render () {
        var minutes = null;
        var seconds = null;
        // if there was not a lastPause, then the session never intiated
        if (this.state.lastPause != null) {
            // so, use the timePassed in the state
            const totalSeconds = Math.round(this.state.timePassed / 1000);
            minutes = Math.floor(totalSeconds / 60);
            seconds = totalSeconds % 60;
        } else {
            // otherwise, just use the value given directly from the user
            // though, this may lead to 1.2 showing as 1.2 even though when you actually press start it becomes 1 and 5 seconds
            minutes = this.state.time / 60000;
            seconds = this.state.time % 60;
        }
        // this.state.checked is for checking if seconds should be shown
        var timeInString = this.state.checked ? `${String(minutes)} minutes and ${String(seconds)} seconds` : `${String(minutes)}`;
        if (minutes < 0 || seconds < 0) {
            timeInString += " (Computer has been asleep)";
        }
        document.title = timeInString;
        var percentage = null;
        if (this.state.minimizedFocusSession) {
            // If timePassed is null just use 0 otherwise put timePassed
            const timeInPercentage = (this.state.timePassed == null ? 1 : this.state.timePassed / this.state.time)
            // round to hundreth and multiply by 100
            percentage = timeInPercentage.toFixed(2) * 100;
        }
        // this is just bad practice. coulda used the value of this as the state (minimizedFocusSession)
        return (
            <div id="focusTimer">
                {this.state.isFocusHeaderShown == false && percentage == null ?
                <span>To make the minimized window work, you need to first input
                     some minutes in the original window and then press the *
                      button.</span> : <></>}
                {this.state.minimizedFocusSession ? <div id="focusProgressBar">
                    <CircularProgressbar
                    value={percentage}
                    text={`${percentage}%`}
                    strokeWidth='2'
                    backgroundPadding={0}
                    styles={buildStyles({
                        textSize: '16px',
                        pathTransitionDuration: 0.5
                    })}
                    />
                </div> : <></>}
                <h1 id="focusTime">{timeInString}</h1>
                <label for="showSec">Show time?</label>
                <input onClick={(event) => {this.showSeconds(event)}} id="showSeconds" name="showSec" type="checkbox"></input>
                <div id="focusSessionControls">
                    <button className="themedButton" onClick={this.startTimer}>{'▶️'}</button>
                    <button className="themedButton" onClick={this.pauseTimer}>{'⏸️'}</button>
                </div>
                <p>Time to focus: </p>
                <input id="focusMinutesInput" autocomplete="off" disabled={this.state.focus} onChange={(event) => {this.getNumber(event.target.value)}} type="number"></input>
            </div>
        )
    }
}

export default Timer;