import React, { useEffect, useState } from 'react'
import './App.css';
import Sections from './windows/Sections.js'
import Main from './windows/Main.js'
import Startup from './windows/Startup.js'
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ToastContainer } from 'react-toastify';

// Present startup with first users
window.shouldPresentFirstStartUp = {
  "all": false
};
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
  // Set all the values to true
  window.shouldPresentFirstStartUp = {
    "all": true,
    "section": true,
    "main": true,
    "settingstour": true,
  };
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

function changeHue(condition, elem) {
  let hue = Math.floor(Math.random() * 360);
  const rateOfChange = 5;
  elem.style.filter = `hue-rotate(${hue}deg)`;
  let state = 0
  var hueChange = setInterval(function () {
    console.log(condition == true);
    if (condition == true) {
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
    console.log(hue);
    elem.style.filter = `hue-rotate(${hue}deg)`;
  }, 100)
}

// if goTo was given an assignment and it's the focusSession value
// then set a timeout to click the startSession in Main.js
window.miniFocusSession = (localStorage.getItem('goTo') != undefined && localStorage.getItem('goTo').split('|')[0] == 'focusSession');
if (window.miniFocusSession) {
  window.currentSection = localStorage.getItem('goTo').split('|')[1]
  localStorage.removeItem('goTo')
  setTimeout(() => {
    document.getElementById('startSession').click()
  }, 100)
}

function App() {
  // used to determine whether sections.js or main.js is shown (true or false)
  const [loading, setLoading] = useState(true);
  const [unsavedContent, setContent] = useState(false);

  useEffect(() => {
    if (window.shouldPresentFirstStartUp["all"] == true) {
      changeHue(() => document.getElementById('firstStartUpWindow').style.display == 'none', document.getElementById('themes'))
    }
  })

  // TODO: Use to check dark mode
  // const isDark = window.matchMedia("(prefers-color-scheme:dark)").matches;

  window.onbeforeunload = (event) => {
    if (unsavedContent) {
      event.preventDefault();
      event.returnValue = 'You have unsaved panes';
    }
  };

  return (
    <Provider store={store}>
      {(window.shouldPresentFirstStartUp["all"] == true || isOldUser) ? <Startup oldUser={isOldUser && !window.shouldPresentFirstStartUp["all"] == true} parentCallback={startTutorial}></Startup> : <></>}
      {/* annoyingly, to make sections work, I need to use a empty function as a prop */}
      {
        !window.miniFocusSession
          ? (loading || window.miniFocusSession
            ? <Sections reset={() => { }} parentCallback={setLoading} />
            : <Main saveContentCallback={setContent} parentCallback={setLoading} />
          )
          : <Main saveContentCallback={setContent} parentCallback={setLoading} />
      }
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Provider>
  );
}

export default App;