import './App.css';
import SectionComp from './SectionComp.js';

function App() {
  return (
    <SectionComp />
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
