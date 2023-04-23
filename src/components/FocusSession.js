import React from 'react';
import Timer from '../components/Timer.js'

class FocusSession extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        timer: 0,
        sideBarToggled: false
      }  
      this.toggleSideBar = this.toggleSideBar.bind(this)
      this.exitFocus = this.exitFocus.bind(this)
    }

    toggleSideBar() {
      this.setState({
        sideBarToggled: !this.state.sideBarToggled
      })
    }

    exitFocus() {
      this.props.parentCallback()
    }

    render() {
        return (
            <div id="focusSession" class={this.state.sideBarToggled ? "focusSideBarOn" : "focusSideBarOff"}>
                {/* Sidebar, when you click the > it will do a quick animation (smooth) to the side and have a black blob (just like in youtube when forwarding) and can be extended back */}
                <button className="themedButton" id="startFocus" onClick={this.toggleSideBar}>{this.state.sideBarToggled ? '⬅' : "🠞"}</button>
                <button className="themedButton" id="exitFocus" onClick={this.exitFocus}>❌</button>
                <h1>Focus Session</h1>
                <Timer></Timer>
            </div>
        )
    }
}

export default FocusSession;