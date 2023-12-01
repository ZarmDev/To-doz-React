import React from 'react';

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // Using state to make sure component updates
            elapsed: performance.now()
        }
        this.exitTool = this.exitTool.bind(this)
    }

    componentDidMount() {
        // Just to set a interval to update the elapsed time, not to actually change it
        this.state.interval = setInterval(() => this.setState({ elapsed: performance.now() }), 1000)
    }

    exitTool() {
        this.props.exitTool()
    }

    render() {
        let totalSeconds = this.state.elapsed / 1000;
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        let seconds = Math.floor(totalSeconds % 60);
        return (
            <div id="dashboard" className='tool'>
                <button className="themedButton exitToolButton" onClick={this.exitTool}>❌</button>
                <p>Elapsed time since you opened To-doz: {hours} hours, {minutes} minutes and {seconds} seconds</p>
            </div>
        )
    }
}

export default Dashboard;