import React, { useState } from 'react'
import './App.css';
import SectionComp from './windows/Sections.js'
import Main from './windows/Main.js'
import Startup from './windows/Startup.js'

const body = document.getElementsByTagName('body')[0];

var firstStartUp = undefined;

if (localStorage.getItem('localItems') == undefined || Object.values(JSON.parse(localStorage.getItem('localItems')))[0] == '') {
  // Create a object that has all the data of items (placeholder)
  let data = {
    'Unnamed section': 'Unnamed pane|Do homework|pane paneStyle',
  }
  localStorage.setItem('localItems', JSON.stringify(data))
  window.currentSection = Object.keys(JSON.parse(localStorage.getItem('localItems')))[0];
  firstStartUp = true
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

function App() {
  const [loading, setLoading] = useState(true);
  const [unsavedContent, setContent] = useState(false);

  const isDark = window.matchMedia("(prefers-color-scheme:dark)").matches;

  window.onbeforeunload = (event) => {
    if (unsavedContent) {
      event.preventDefault();
      event.returnValue = 'You have unsaved panes';
    }
  };

  return (
    <>
      {firstStartUp ? <Startup></Startup> : <></>}
      {loading ? <SectionComp parentCallback={setLoading} /> : <Main saveContentCallback={setContent} parentCallback={setLoading}></Main>}
    </>
  );
}

// CSS Effects :)

window.onload = function () {
  // Startup effect (the background color)
  if (firstStartUp) {
    let hue = Math.floor(Math.random() * 360);
    document.getElementById('themes').style.filter = `hue-rotate(${hue}deg)`;
    let state = 0
    var hueChange = setInterval(function() {
      if (document.getElementById('firstStartUpWindow').style.display == 'none') {
        clearInterval(hueChange)
      }
      if (state == 0) {
        hue += 1
        if (hue > 150) {
          state = 1
        }
      } else if (state == 1) {
        hue -= 1
        if (hue < -150) {
          state = 0
        }
      }
      document.getElementById('themes').style.filter = `hue-rotate(${hue}deg)`;
    }, 100)
  }
  // Add "time elapsed" since you opened the PWA - referenced in Dashboard in tools folder
  let startTime = Date.now();
  setInterval(function() {
    let timeElapsed = Date.now() - startTime;
    let seconds = Math.floor(timeElapsed / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    window.elapsedTime = `${hours} hours, ${minutes % 60} minutes and ${seconds % 60} seconds`;
  }, 1000)
}


export default App;