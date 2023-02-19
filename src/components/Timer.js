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
    }
    startTimer() {
        if (this.state.time != 0) {
            this.setState({
                focus: true,
                time: this.state.time * 60
            })
            this.time = setInterval(this.countDown, 1000)
        }
    }

    countDown() {
        console.log(this.state);
        this.setState({
            time: this.state.time -= 1,
        })
        if (this.state.time == 0) {
            this.setState({
                time: 0,
                focus: false,
            })
            clearInterval(this.time)
        }
    }

    getNumber(event) {
        console.log(event);
        this.setState({
            time: event
        })
    }

    showSeconds(event) {
        console.log(event.target.checked)
        let isChecked = event.target.checked;
        this.setState({
            checked: isChecked
        })
    }

    render () {
        return (
            <div id="focusTimer">
                <h1>{this.state.checked ? `${String(Math.round(this.state.time / 60))} minutes and ${String(this.state.time % 60)} seconds` : String(Math.round(this.state.time / 60))}</h1>
                <label for="showSec">Show seconds?</label>
                <input onClick={(event) => {this.showSeconds(event)}} id="showSeconds" name="showSec" type="checkbox"></input><br></br>
                <button disabled={this.state.focus} onClick={this.startTimer}>Start Focus Timer</button>
                <p>Time to focus: </p>
                <input disabled={this.state.focus} onChange={(event) => {this.getNumber(event.target.value)}} type="number"></input>
            </div>
        )
    }
}

export default Timer;