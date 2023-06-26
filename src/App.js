import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './App.css';
import SectionComp from './pages/SectionComp'
import Main from './pages/Main'
import Themes from './components/Themes'

const body = document.getElementsByTagName('body')[0];
const toolbar = document.getElementById('toolbar');

// Check if localItems is defined
//localStorage.clear()

// To keep track variables in the window

var firstStartUp = undefined;

if (localStorage.getItem('localItems') == undefined || Object.values(JSON.parse(localStorage.getItem('localItems')))[0] == '') {
  // Create a object that has all the data of items (placeholder)
  let data = {
    'Unnamed section': 'Unnamed pane|Do homework|pane',
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

// Call root.unmount(); on Themes if neccessary

function App() {
  const [loading, setLoading] = useState("true")
  return (
    <>
      {firstStartUp ? <Themes></Themes> : <></>}
      {loading ? <SectionComp parentCallback={setLoading} /> : <Main parentCallback={setLoading}></Main>}
    </>
  );
}

var items = document.getElementsByClassName('pane');

// First start up

window.onload = function () {
if (firstStartUp) {
  let hue = Math.floor(Math.random() * 360);
  document.getElementById('themes').style.filter = `hue-rotate(${hue}deg)`;
  let state = 0
  var hueChange = setInterval(function() {
    if (document.getElementById('reactThemes').style.display == 'none') {
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
}

export default App;