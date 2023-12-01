import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom/client';

function notifyMe() {
    const message = "Notifications were turned on!"
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const notification = new Notification(message);
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification(message);
          // …
        }
      });
    }
  
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
  }

class Startup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            order: 'welcomeScreen'
        }
        this.allowCookies = this.allowCookies.bind(this)
        this.selectedTheme = this.selectedTheme.bind(this)
        this.allowNotifications = this.allowNotifications.bind(this)
    }

    allowCookies() {
        this.setState({
            order: 'themes'
        })
    }

    selectedTheme(event) {
        const chosenTheme = event.target.innerText;
        if (chosenTheme == 'Light') {
            //
        } else if (chosenTheme == 'Dark') {
            //
        }
        this.setState({
            order: 'notifications'
        })
        // document.getElementById('reactThemes').style.display = 'none'
    }
    
    allowNotifications() {
        this.setState({
            order: 'unsupported'
        })
        notifyMe()
    }

    start() {
        document.getElementById('firstStartUpWindow').style.display = 'none'
    }

    render() {
        return(
            <div id="firstStartUpWindow">
            <div id="themes">
            </div>
            <div id="themeContainer">
            {this.state.order == 'welcomeScreen' ? <div className="fadeInEffect">
                <h1>Welcome to To-Doz-React!</h1>
                <p>What is this project? It's a to-do list application which:
                </p>
                <ol>
                    <li>Is easy to use</li>
                    <li>Similar to to-do applications like notion</li>
                    <li>Is all in your browser (No logging/signing up neccesary)</li>
                </ol> <br></br>
                <p>Why was it made? For convience and because I couldn't find any
                    to-do applications that fit my needs.
                </p>
                <p>Before we start, this website uses <a href="https://www.freecodecamp.org/news/web-storage-localstorage-vs-sessionstorage-in-javascript/" target="_blank">localstorage</a> which is basically
                the equivalent to cookies.
                This localstorage is neccesary for the website to function because
                the site will literally not save your to-do's without it.
                So, by using this site you agree to allow localstorage.
                </p>
                <br></br>
                <button className="bigThemedButton" onClick={this.allowCookies}>Let's go!</button>
            </div> : <></>}
            {this.state.order == 'themes' ? <div className="fadeInEffect">
            <h1>Choose a theme:</h1>
            <p id="changeLater">(You can change this later.)</p>
            <div id="themeSelect">
                <div onClick={(event) => {this.selectedTheme(event)}}>
                    <p>Light</p>
                </div>
                <div onClick={(event) => {this.selectedTheme(event)}}>
                    <p>Dark</p>
                </div>
                <div onClick={(event) => {this.selectedTheme(event)}}>
                    <p>More coming soon...</p>
                </div>
            </div>
            <button onClick={this.start} className="bigThemedButton">Skip personalization</button>
            </div> : <></>}
            {this.state.order == 'notifications' ? <div id="notifications" className="fadeInEffect">
                <h1>Notification settings:</h1>
                <p>Do you want to have notifications for when you complete focus sessions and other features?
                (completly optional, and will not affect any features ^_^)
                </p>
                <button onClick={this.allowNotifications} className="bigThemedButton">Allow notifications</button>
            </div> : <></>}
            {this.state.order == 'unsupported' ? <div id="unsupported" className="fadeInEffect">
            <h1>Edge users:</h1>
                <p>If your using edge and want to use the focus session in the background, you have
                to put an exception for this website to not go to sleep (so the timer works in the
                background), this is pretty annoying so I'm looking for ways to fix it. If you
                want to do this, go to the settings and search for "Never put these sites to sleep"
                </p>
                <button onClick={this.start} className="bigThemedButton">I'm ready to start!</button>
            </div> : <></>}
            </div>
            </div>
        )
    }
}

export default Startup;