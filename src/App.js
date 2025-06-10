import React, { useEffect, useState } from 'react'
import './App.css';
import Sections from './windows/Sections.js'
import Main from './windows/Main.js'
import Startup from './windows/Startup.js'
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import BackupScreen from './modals/backupScreen'
import { changeHue } from './utils/cosmetics';
import { getDataFromLocalStorage, getDataFromSource } from './utils/databaseFuncs';
import { ToastContainer, toast } from 'react-toastify';
// import { addItem, getAllItems, getTransaction, openDB } from './utils/indexedDB-test';

// ## CHECK THE TYPE OF DATABASE CONNECTION AND BASED ON THAT SET THE LOCALSTORAGE ##
const databaseConnection = localStorage.getItem('dbType');
if (databaseConnection === 'usingonekey') {
  var data = await getDataFromSource(databaseConnection);
  console.log(data)
  // data[0] == false -> This is checking if the function was unable to connect to the database
  // Array.isArray(data) -> Just to check if data[0] can be accessed. However, it's redundant
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
    // console.log(localItems, localPinnedItems)
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
  console.log("WTF???")
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

function addElemHint(id, message) {
  const elem = document.getElementById(id);
  elem.setAttribute('data-intro', message);
}

function waitForMainToLoad(intro) {
  var addHint = setInterval(() => {
    // Just check any element in Main.js
    const elem = document.getElementById('startSession');
    if (elem != null) {
      addElemHint('startSession', "Here, you can start a focus session with any amount of minutes and you can use the spotify integration. Note that the focus session WILL work even when the computer is asleep (it checks the difference between dates and doesn't just subtract it every second)")
      addElemHint('settings', "Here, you can customize the features, colors, themes, etc. If you click it, you will see a full tour of the settings.")
      addElemHint('checkGrades', "Here, you can see the time elapsed since you opened To-Doz. In the future, you will be able to see the amount you focused on that day, a graph of your progress, your streak, etc.")
      const panes = document.getElementsByClassName('pane');
      if (panes.length != 0) {
        panes[0].setAttribute('data-intro', "This is a pane. You can edit it by clicking on the title or description. You can also pin it to the toolbar by clicking the pin button. NOTE: Although you CAN add images, do know that adding lots of images significantly impacts the performance.")
      }
      intro.addHints();
      intro.start();
      clearInterval(addHint);
    }
  }, 500)
}

function addHintsToPage(intro) {
  const firstSection = document.getElementsByClassName('section')[0];
  firstSection.setAttribute('data-intro', "This is section, you can edit it by clicking on the text and you can delete it by clicking the X. Each section contains panes, which we will get to in a moment. Also, please note that the edit (pencil) button does nothing. In the future, you will be able to customize the section.")
  intro.addHints();
  intro.start();
  waitForMainToLoad(intro);
}

function startTutorial(shouldStart) {
  const intro = introJs();
  // shouldStart is provided from startup
  if (shouldStart) {
    addHintsToPage(intro);
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
          {(window.shouldPresentFirstStartUp["all"] == true) ? <Startup oldUser={isOldUser && !window.shouldPresentFirstStartUp["all"] == true} parentCallback={startTutorial}></Startup> : <></>}
          {
            !window.miniFocusSession
              ? (loading || window.miniFocusSession
                ? <Sections reloadMain={setLoading} />
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