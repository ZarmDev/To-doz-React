import React, { useEffect, useState } from 'react'
import './App.css';
import Sections from './windows/Sections.js'
import Main from './windows/Main.js'
import Startup from './windows/Startup.js'
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import BackupScreen from './modals/backupScreen'
import { changeHue } from './utils/cosmetics';
import { getDataFromLocalStorage, getDataFromSource, uploadDataToDB, uploadDataToSource } from './utils/databaseFuncs';
import { ToastContainer, toast } from 'react-toastify';

const databaseConnection = localStorage.getItem('dbType');
if (databaseConnection === 'usingonekey') {
  var data = await getDataFromSource(databaseConnection);
  console.log(data)
  if (Array.isArray(data) && data[0] == false) {
    setTimeout(() => {
      toast(`You are now in offline mode. Remember to not leave the site unless you get a notification saying your data was saved. `, {
        autoClose: 10000
      });
    }, 500)
    const [localItems, localPinnedItems] = getDataFromLocalStorage()
    localStorage.setItem('localItems', JSON.stringify(localItems))
    localStorage.setItem('localPinnedItems', JSON.stringify(localPinnedItems))
  } else {
    const [localItems, localPinnedItems] = data;
    console.log(localItems, localPinnedItems)
    localStorage.setItem('localItems', JSON.stringify(localItems))
    localStorage.setItem('localPinnedItems', JSON.stringify(localPinnedItems))
  }
}


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
var shouldShowBackup = false;

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
    shouldShowBackup = true;
  }
}

if (dataDoesntExist) {
  // Create a object that has all the data of items (placeholder)
  let data = {
    'Unnamed section': 'Unnamed pane|Do homework|pane paneStyle',
  }
  localStorage.setItem('localItems', JSON.stringify(data))
  localStorage.setItem('dbType', 'localstorage')
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
    'Unnamed section': "",
  }
  localStorage.setItem('localPinnedItems', JSON.stringify(data))
}

function startTutorial(shouldStart) {
  // shouldStart is provided from startup
  if (shouldStart) {
    introJs().start()
  }
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
  const [showBackupData, setBackupData] = useState(shouldShowBackup);

  useEffect(() => {
    if (window.shouldPresentFirstStartUp["all"] == true) {
      changeHue(() => document.getElementById('firstStartUpWindow').style.display == 'none', document.getElementById('themes'))
    }
  }, [])

  // TODO: Use to check dark mode
  // const isDark = window.matchMedia("(prefers-color-scheme:dark)").matches;

  window.onbeforeunload = (event) => {
    if (unsavedContent) {
      event.preventDefault();
      event.returnValue = 'You have unsaved panes';
    }
    // if lastSave is greater than window.lastRender then
    // the user put something and it wasn't saved
    if (window.paneNotSaved) {
      event.preventDefault();
      event.returnValue = 'Not everything has been saved to the DB';
    }
  };

  return (
    <div>
      {showBackupData ? (
        <BackupScreen parentCallback={() => { setBackupData(false) }} />
      ) : (
        <>
          {/* {(window.shouldPresentFirstStartUp["all"] == true || isOldUser) ? <Startup oldUser={isOldUser && !window.shouldPresentFirstStartUp["all"] == true} parentCallback={startTutorial}></Startup> : <></>} */}
          {(window.shouldPresentFirstStartUp["all"] == true) ? <Startup oldUser={isOldUser && !window.shouldPresentFirstStartUp["all"] == true} parentCallback={startTutorial}></Startup> : <></>}
          {/* annoyingly, to make sections work, I need to use a empty function as a prop */}
          {
            !window.miniFocusSession
              ? (loading || window.miniFocusSession
                ? <Sections reset={() => { }} parentCallback={setLoading} />
                : <Main saveContentCallback={setContent} parentCallback={setLoading} />
              )
              : null
          }
        </>
      )}
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
    </div>
  );
}

export default App;