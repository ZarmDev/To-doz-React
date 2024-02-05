import { clear } from '@testing-library/user-event/dist/clear';
import React from 'react'

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
class Timer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: 0,
            focus: false,
            checked: false,
            timerId: null
        }

        this.startTimer = this.startTimer.bind(this);
        this.getNumber = this.getNumber.bind(this);
        this.countDown = this.countDown.bind(this);
        this.showSeconds = this.showSeconds.bind(this);
        this.pauseTimer = this.pauseTimer.bind(this);
    }
    // Clears the interval if component is removed
    componentWillUnmount() {
        clearInterval(this.state.time)
    }
    startTimer() {
        if (this.state.time != 0 && this.state.focus == false) {
            this.setState({
                focus: true
            })
            this.state.timerId = setInterval(this.countDown, 1000)
            console.log(this.state.timerId);
        }
    }

    countDown() {
        const totalSeconds = Math.round(this.state.time / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        // this.state.checked is for checking if seconds should be shown
        const timeInString = `${String(minutes)} minutes and ${String(seconds)} seconds`;
        console.log(timeInString);
        this.setState({
            time: this.state.time -= 1000,
        })
        if (this.state.time == 0) {
            notifyMe()
            this.setState({
                time: 0,
                focus: false
            })
            clearInterval(this.state.timerId)
        }
    }

    getNumber(event) {
        let newNum = event;
        // convert to miliseconds
        newNum = newNum * 60000;
        this.setState({
            time: newNum
        })
    }

    showSeconds(event) {
        let isChecked = event.target.checked;
        this.setState({
            checked: isChecked
        })
    }

    pauseTimer() {
        clearInterval(this.state.timerId)
        this.setState({
            focus: false
        })
        console.log(this.state);
    }
    render () {
        /**
         * setInterval(() => {
        setElapsed(performance.now())
      }, 1000) let totalSeconds = elapsed / 1000;
      let hours = Math.floor(totalSeconds / 3600);
      let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
      let seconds = Math.floor(totalSeconds % 60); */
        const totalSeconds = Math.round(this.state.time / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        // this.state.checked is for checking if seconds should be shown
        const timeInString = this.state.checked ? `${String(minutes)} minutes and ${String(seconds)} seconds` : `${String(minutes)}`;
        document.title = timeInString;
        return (
            <div id="focusTimer">
                <h1>{timeInString}</h1>
                <label for="showSec">Show time?</label>
                <input onClick={(event) => {this.showSeconds(event)}} id="showSeconds" name="showSec" type="checkbox"></input><br></br>
                <button className="themedButton" onClick={this.startTimer}>{'▶️'}</button>
                <button className="themedButton" onClick={this.pauseTimer}>{'⏸️'}</button>
                <p>Time to focus: </p>
                <input id="focusMinutesInput" autocomplete="off" disabled={this.state.focus} onChange={(event) => {this.getNumber(event.target.value)}} type="number"></input>
            </div>
        )
    }
}

export default Timer;