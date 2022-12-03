import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import './App.css';
import SectionComp from './components/SectionComp'
import Main from './components/Main'

function App() {
  const [loading, setLoading] = useState("true")

  return (
    <>
    <h1>{loading}</h1>
    {loading ? <SectionComp parentCallback={setLoading}/> : <Main />}
    </>
  );
}

window.onload = function () {
  const splashscreen = document.getElementById('splashscreen');

    const sectionsItems = document.getElementById('sectionsItems');
    sectionsItems.addEventListener('click', function () {
      splashscreen.className = 'splashAnimate';
    })
}

export default App;
