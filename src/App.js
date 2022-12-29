import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './App.css';
import SectionComp from './pages/SectionComp'
import Main from './pages/Main'

// Check if localItems is defined
//localStorage.clear()
if (localStorage.getItem('localItems') == undefined || Object.values(JSON.parse(localStorage.getItem('localItems')))[0] == '') {
  // Create a object that has all the data of items (placeholder)
  var data = {
    'Unnamed section': 'Unnamed pane|Do homework|pane',
  }
  localStorage.setItem('localItems', JSON.stringify(data))
  window.currentSection = Object.keys(JSON.parse(localStorage.getItem('localItems')))[0];
} else {
  // Set to first section
  window.currentSection = Object.keys(JSON.parse(localStorage.getItem('localItems')))[0];
}


function App() {
  const [loading, setLoading] = useState("true")
  console.log(loading);
  return (
    <>
      {loading ? <SectionComp parentCallback={setLoading} /> : <Main parentCallback={setLoading}></Main>}
    </>
  );
}

var items = document.getElementsByClassName('pane');

var allItems = ''
var splitC = '·'
console.log(localStorage.getItem('localItems'));
/*
window.onload = function () {
  const splashscreen = document.getElementById('splashscreen');

  const sectionsItems = document.getElementById('sectionsItems').getElementsByTagName('li');
  for (var i = 0; i < sectionsItems.length; i++) {
    console.log(sectionsItems[i]);
    sectionsItems[i].addEventListener('click', function () {
      splashscreen.className = 'splashAnimate';
    })
  }
}
*/
export default App;