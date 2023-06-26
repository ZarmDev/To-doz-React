import React from 'react';
import Timer from '../components/Timer.js'

function addBlur(state) {
  setTimeout(function () {document.getElementById('focusSession').className = `${document.getElementById('focusSession').className} window`}, 700)
}

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
    componentDidMount() {
      addBlur(this.state.sideBarToggled)
    }
    toggleSideBar() {
      addBlur(this.state.sideBarToggled)
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
                <button className="themedButton" id="startFocus" onClick={this.toggleSideBar}>{this.state.sideBarToggled ? '<' : ">"}</button>
                {/* <a href="https://www.flaticon.com/free-icons/arrow" title="arrow icons">Arrow icons created by Freepik - Flaticon</a> */}
                <button className="themedButton" id="exitFocus" onClick={this.exitFocus}>❌</button>
                <h1>Focus Session</h1>
                <Timer></Timer>
            </div>
        )
    }
}

export default FocusSession;