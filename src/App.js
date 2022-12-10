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
    'Unnamed section': 'Unnamed pane|Do homework|pane quietDown panenew·',
  }
  localStorage.setItem('localItems', JSON.stringify(data))
  window.currentSection = Object.keys(JSON.parse(localStorage.getItem('localItems')))[0];
} else {
  // Set to first section
  window.currentSection = Object.keys(JSON.parse(localStorage.getItem('localItems')))[0];
}


function App() {
  const [loading, setLoading] = useState("true")

  return (
    <>
      {loading ? <SectionComp parentCallback={setLoading} /> : <Main />}
    </>
  );
}

var items = document.getElementsByClassName('pane');

var allItems = ''
var splitC = '·'
console.log(localStorage.getItem('localItems'));
window.onload = function () {
  console.log()
  const splashscreen = document.getElementById('splashscreen');

  const sectionsItems = document.getElementById('sectionsItems');
  sectionsItems.addEventListener('click', function () {
    splashscreen.className = 'splashAnimate';
  })
  var saveItems = setInterval(function () {
    // Update the panes with how they are configured
    // checkConfig()
    // Push all pane text in one array with a format of Title|Description|config
    // Add oninput to all pane divs to trgiger a oninput
    for (var i = 0; i < items.length; i++) {
      if (items[i].className.includes('panelist')) {
        let t = items[i].getElementsByClassName('listItem');
        let ju = '';
        for (var w = 0; w < t.length; w++) {
          ju = ju.concat(t[w].innerText) + '⁅';
        }
        allItems += `${items[i].getElementsByClassName('newp')[0].innerText}|${ju}|${items[i].className}${splitC}`
      } else {  // Get all newp in each pane, newp[0] is title, newp[1] is description
        allItems += `${items[i].getElementsByClassName('newp')[0].innerText}|${items[i].getElementsByClassName('newp')[1].innerText}|${items[i].className}${splitC}`;
      }
      // Push code so it's:
      // Unnamed pane|Description|important
    }
    var itemObj = JSON.parse(localStorage.getItem('localItems'));
    // set section in localstorage to the array of panes
    itemObj[window.currentSection] = allItems;
    localStorage.setItem('localItems', JSON.stringify(itemObj))
    allItems = ''
  }, 1000)
}

export default App;
