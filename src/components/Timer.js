import { clear } from '@testing-library/user-event/dist/clear';
import React from 'react'

class Timer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: 0,
            focus: false,
            checked: false
        }

        this.startTimer = this.startTimer.bind(this);
        this.getNumber = this.getNumber.bind(this);
        this.countDown = this.countDown.bind(this);
        this.showSeconds = this.showSeconds.bind(this);
        this.pauseTimer = this.pauseTimer.bind(this);
    }
    startTimer() {
        if (this.state.time != 0) {
            this.setState({
                focus: true,
                time: this.state.time
            })
            this.time = setInterval(this.countDown, 10)
        }
    }
    // 12 minutes == 720000
    // * 60000 = 60 seconds in a minute * 1000 for each second
    // 12 seconds == 12000
    // convert to miliseconds
    // to get seconds, divide by 100
    // to get minutes, divide by 1000
    // to get seconds, divide by 10000

    countDown() {
        console.log(this.state);
        this.setState({
            time: this.state.time -= 1000,
        })
        if (this.state.time == 0) {
            this.setState({
                time: 0,
                focus: false
            })
            clearInterval(this.time)
        }
    }

    getNumber(event) {
        console.log(event);
        let newNum = event;
        // convert to miliseconds
        newNum = newNum * 60000;
        this.setState({
            time: newNum
        })
    }

    showSeconds(event) {
        console.log(event.target.checked)
        let isChecked = event.target.checked;
        this.setState({
            checked: isChecked
        })
    }

    pauseTimer() {
        clearInterval(this.time)
        this.setState({
            focus: false
        })
    }

    render () {
        const totalSeconds = Math.round(this.state.time / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
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
                <input id="focusMinutesInput" disabled={this.state.focus} onChange={(event) => {this.getNumber(event.target.value)}} type="number"></input>
            </div>
        )
    }
}

export default Timer;