import React, { useState } from 'react';
import ChangeLog from '../components/pageComponents/startupComponents/changeLog';
import WelcomeScreen from '../components/pageComponents/startupComponents/welcomeScreen';
import Tutorial from '../components/pageComponents/startupComponents/tutorial';
import Themes from '../components/pageComponents/startupComponents/themes';
import Notifications from '../components/pageComponents/startupComponents/notifications';
import Unsupported from '../components/pageComponents/startupComponents/unsupported';

// MDN: https://developer.mozilla.org/en-US/docs/Web/API/Notification
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

const orderConfig = ['welcomeScreen', 'tutorial', 'themes', 'notifications', 'unsupported', 'changelog'];

function Startup(props) {
    const [order, setOrder] = useState(0);

    function selectedTheme(event) {
        const chosenTheme = event.target.innerText;
        if (chosenTheme == 'Light') {
            //
        } else if (chosenTheme == 'Dark') {
            //
        }
        // document.getElementById('reactThemes').style.display = 'none'
    }

    function allowNotifications() {
        notifyMe()
    }

    function start() {
        document.getElementById('firstStartUpWindow').style.display = 'none';
        // in 500ms, show tutorial based on if oldUser or not
        setTimeout(props.parentCallback(!props.oldUser), 500)
    }

    function next() {
        // exception for changelog
        if (props.oldUser) {
            start()
        } else {
            if (orderConfig[order + 1] == undefined) {
                start()
            } else {
                setOrder(order + 1)
            }
        }
    }

    var currentWindow;
    const currentOrder = orderConfig[order];
    console.log(currentOrder);
    if (props.oldUser) {
        currentWindow = <ChangeLog></ChangeLog>
    } else if (currentOrder == 'welcomeScreen') {
        currentWindow = <WelcomeScreen allowCookies={next}></WelcomeScreen>
    } else if (currentOrder == 'tutorial') {
        currentWindow = <Tutorial></Tutorial>
    } else if (currentOrder == 'themes') {
        currentWindow = <Themes selectedTheme={selectedTheme}></Themes>
    } else if (currentOrder == 'notifications') {
        currentWindow = <Notifications allowNotifications={allowNotifications}></Notifications>
    } else if (currentOrder == 'unsupported') {
        currentWindow = <Unsupported></Unsupported>
    } else if (currentOrder == 'changelog') {
        currentWindow = <ChangeLog></ChangeLog>
    }
    return (
        <div id="firstStartUpWindow">
            <div id="themes">
            </div>
            <div id="themeContainer">
                {currentWindow}
                <button id="themeContainerNext" className='bigThemedButton' onClick={next}>Continue?</button>
            </div>
        </div>
    )
}

export default Startup;