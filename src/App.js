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

var firstStartUp = false;

if (localStorage.getItem('localItems') == undefined || Object.values(JSON.parse(localStorage.getItem('localItems')))[0] == '') {
  // Create a object that has all the data of items (placeholder)
  var data = {
    'Unnamed section': 'Unnamed pane|Do homework|pane',
  }
  localStorage.setItem('localItems', JSON.stringify(data))
  window.currentSection = Object.keys(JSON.parse(localStorage.getItem('localItems')))[0];
  firstStartUp = true
} else {
  // Set to first section
  window.currentSection = Object.keys(JSON.parse(localStorage.getItem('localItems')))[0];
}
firstStartUp = false


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

var allItems = ''
var splitC = '·'
console.log(localStorage.getItem('localItems'));

// First start up

window.onload = function () {
if (firstStartUp) {
  document.getElementById('themes').style.filter = `hue-rotate(${Math.floor(Math.random() * 360)}deg)`;
}
}

export default App;