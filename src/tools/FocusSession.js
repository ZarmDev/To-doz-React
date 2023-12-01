import React from 'react';
import Timer from '../components/mainComponents/focusComponents/Timer.js'


class FocusSession extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        timer: 0,
        sideBarToggled: false
      }  
      this.toggleSideBar = this.toggleSideBar.bind(this)
      this.exitTool = this.exitTool.bind(this)
    }
    toggleSideBar() {
      this.setState({
        sideBarToggled: !this.state.sideBarToggled
      })
    }

    exitTool() {
      this.props.exitTool()
    }

    render() {
        return (
            <div id="focusSession" className={this.state.sideBarToggled ? "focusSideBarOn tool" : "focusSideBarOff tool"}>
                <button className="themedButton" id="startFocus" onClick={this.toggleSideBar}>{this.state.sideBarToggled ? '<' : ">"}</button>
                {/* <a href="https://www.flaticon.com/free-icons/arrow" title="arrow icons">Arrow icons created by Freepik - Flaticon</a> */}
                <button className="themedButton exitToolButton" onClick={this.exitTool}>❌</button>
                <h1>Focus Session</h1>
                <Timer></Timer>
            </div>
        )
    }
}

export default FocusSession;