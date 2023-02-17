import { clear } from '@testing-library/user-event/dist/clear';
import React from 'react'

class Timer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: 0,
            focus: false,
            seconds: 0
        }

        this.startTimer = this.startTimer.bind(this);
        this.getNumber = this.getNumber.bind(this);
        this.countDown = this.countDown.bind(this);
    }
    startTimer() {
        if (this.state.time != 0) {
            this.setState({
                focus: true
            })
            this.time = setInterval(this.countDown, 1000)
        }
    }

    countDown() {
        console.log(this.state);
        if (this.state.seconds <= -59) {
            this.setState({
                time: this.state.time -= 1,
                seconds: 0
            })
            if (this.state.time == 0) {
                this.setState({
                    time: 0,
                    focus: false,
                    seconds: 0
                })
                clearInterval(this.time)
            }
        } else {
            this.setState({
                seconds: this.state.seconds -= 1
            })
        }
    }

    getNumber(event) {
        console.log(event);
        this.setState({
            time: event
        })
    }

    render () {
        return (
            <div id="focusTimer">
                <h1>{this.state.time}</h1>
                <button disabled={this.state.focus} onClick={this.startTimer}>Start Focus Timer</button>
                <p>Time to focus: </p>
                <input disabled={this.state.focus} onChange={(event) => {this.getNumber(event.target.value)}} type="number"></input>
            </div>
        )
    }
}

export default Timer;