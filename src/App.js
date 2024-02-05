import React, { useState } from 'react'
import './App.css';
import SectionComp from './windows/Sections.js'
import Main from './windows/Main.js'
import Startup from './windows/Startup.js'
import introJs from 'intro.js';
import { Provider } from 'react-redux';
import store from './redux/store';

const body = document.getElementsByTagName('body')[0];

// Present startup with first users
var shouldPresentFirstStartUp = false;
// Present changelog with old users
var isOldUser;


const url = 'https://api.github.com/repos/ZarmDev/To-doz-React/commits';

async function getCommits() {
  try {
    const response = await fetch(url);
    const commits = await response.json();
    const mostRecentCommit = commits[0];
    // Store commit number/url in localstorage
    return mostRecentCommit["commit"]["url"];
  } catch (error) {
    console.error(error);
  }
}

var currVersion = await getCommits();
const dataDoesntExist = localStorage.getItem('localItems') == undefined || Object.values(JSON.parse(localStorage.getItem('localItems')))[0] == ''

// if the user has seen this version before, don't show new version startup
if (localStorage.getItem('version') == currVersion) {
  isOldUser = false;
} else if (localStorage.getItem('version') == undefined || localStorage.getItem('version') != currVersion) {
  // if it's undefined, set it to the current version and show new version startup
  isOldUser = true;
  localStorage.setItem('version', currVersion)

  // well if it's a new user and new version, we want to show new user tutorial not the
  // changelog because they have never used the site
  if (!dataDoesntExist) {
    // it would be good to backup user data before trying to use the new version
    let backup = prompt('Want to backup your data? (y/n) Just in case, you should backup your data before using the new version.')
    if (backup == 'y') {
      localStorage.setItem('backup', localStorage.getItem('localItems'))
      localStorage.setItem('backupPinned', localStorage.getItem('localPinnedItems'))
      alert("Your data was backed up! In case this version breaks, your data is in the 'backup' key in the localstorage. You can also type localStorage.getItem('backup') in your console. Your pinned items is in the 'backupPinned' key.")
    }
  }
}

if (dataDoesntExist) {
  // Create a object that has all the data of items (placeholder)
  let data = {
    'Unnamed section': 'Unnamed pane|Do homework|pane paneStyle',
  }
  localStorage.setItem('localItems', JSON.stringify(data))
  window.currentSection = Object.keys(JSON.parse(localStorage.getItem('localItems')))[0];
  shouldPresentFirstStartUp = true;
} else {
  // Set to first section
  window.currentSection = Object.keys(JSON.parse(localStorage.getItem('localItems')))[0];
}

if (localStorage.getItem('localPinnedItems') == undefined) {
  // Unnamed pane|Do homework|pinnedPane
  var data = {
    'Unnamed section': '',
  }
  localStorage.setItem('localPinnedItems', JSON.stringify(data))
}

function startTutorial(shouldStart) {
  // shouldStart is provided from startup
  if (shouldStart) {
    introJs().start()
  }
}

function App() {
  const [loading, setLoading] = useState(true);
  const [unsavedContent, setContent] = useState(false);

  // TODO: Use to check dark mode
  const isDark = window.matchMedia("(prefers-color-scheme:dark)").matches;

  window.onbeforeunload = (event) => {
    if (unsavedContent) {
      event.preventDefault();
      event.returnValue = 'You have unsaved panes';
    }
  };


  return (
    <Provider store={store}>
      {(shouldPresentFirstStartUp || isOldUser) ? <Startup oldUser={isOldUser && shouldPresentFirstStartUp == false} parentCallback={startTutorial}></Startup> : <></>}
      {loading ? <SectionComp parentCallback={setLoading} /> : <Main saveContentCallback={setContent} parentCallback={setLoading}></Main>}
    </Provider>
  );
}

// This may be a bad practice, I'm using setInterval to add a CSS effect to startup.js
// and to get the time elapsed every second
window.onload = function () {
  // Startup effect (the background color)
  if (window.firstStartUp) {
    let hue = Math.floor(Math.random() * 360);
    const rateOfChange = 5;
    document.getElementById('themes').style.filter = `hue-rotate(${hue}deg)`;
    let state = 0
    var hueChange = setInterval(function () {
      if (document.getElementById('firstStartUpWindow').style.display == 'none') {
        clearInterval(hueChange)
      }
      if (state == 0) {
        hue += rateOfChange
        if (hue > 150) {
          state = 1
        }
      } else if (state == 1) {
        hue -= rateOfChange
        if (hue < -150) {
          state = 0
        }
      }
      document.getElementById('themes').style.filter = `hue-rotate(${hue}deg)`;
    }, 100)
  }
  // Add "time elapsed" since you opened the PWA - referenced in Dashboard in tools folder
  let startTime = Date.now();
  setInterval(function () {
    let timeElapsed = Date.now() - startTime;
    let seconds = Math.floor(timeElapsed / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    window.elapsedTime = `${hours} hours, ${minutes % 60} minutes and ${seconds % 60} seconds`;
  }, 1000)
}

export default App;