import React, { useEffect, useState } from 'react';
import Section from '../components/Section'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDataFromLocalStorage, uploadDataToSource } from 'src/utils/databaseFuncs';
import { PencilIcon } from 'src/components/SvgIcons';

function undoSectionEdit(oldName, index) {
  let sectionElements = document.getElementsByClassName('section');
  sectionElements[index].getElementsByTagName('p')[0].innerText = oldName;
}

function Sections(props) {
  const [editing, setEditing] = useState(false);
  const [sections, setSections] = useState(null);
  const [pinnedSections, setPinnedSections] = useState(null);
  // I don't know why this is here... I'll just keep it as comments for now...
  // const [firstRender, setFirstRender] = useState(false);
  const [didEdit, setDidEdit] = useState(false);
  const [styles, setStyles] = useState([
    { left: window.isMobile ? "25%" : (props.inMain ? "10%" : "40%") },
    { left: window.isMobile ? "60%" : (props.inMain ? "17%" : "55%") }
  ]);

  useEffect(() => {
    // const [localItems, localPinnedItems] = getDataFromLocalStorage();
    const localItems = props.passLocalItems;
    const localPinnedItems = props.passPinnedItems;
    let sections = Object.keys(localItems)
    let pinnedSections = Object.keys(localPinnedItems)
    setSections(sections)
    setPinnedSections(pinnedSections)
    // setFirstRender(true)
  }, [])

  // async function updateData() {
  //   // Make sure this only runs on rerenders, not the first time
  //   if (!firstRender) {
  //     return;
  //   }
  //   // ## Comparing the previous sections with new sections and putting in placeholders for each new key ##
  //   let [localItems, localPinnedItems] = getDataFromLocalStorage();
  //   // localItems = JSON.parse(localItems);
  //   // localPinnedItems = JSON.parse(localPinnedItems)
  //   let objKeys = Object.keys(localItems)
  //   // let objValues = Object.values(obj)
  //   let newObj = {};
  //   let sectionsState = sections;
  //   let sectionsState2 = pinnedSections;
  //   // For pinned
  //   let newObj2 = {};
  //   for (var i = 0; i < sectionsState.length; i++) {
  //     // IF the object keys (ex: Unnamed Section) is not found in the localstorage, update it on the localstorage
  //     // console.log('loop', objKeys[i], sectionsState[i])
  //     if (objKeys.indexOf(sectionsState[i]) != -1) {
  //       // console.log(newObj[sectionsState[i]], obj[sectionsState[i]]);
  //       newObj[sectionsState[i]] = localItems[sectionsState[i]];
  //       // console.log(newObj2[sectionsState[i]], obj2[sectionsState[i]]);
  //       newObj2[sectionsState2[i]] = localPinnedItems[sectionsState[i]];
  //     } else {
  //       newObj[sectionsState[i]] = 'Unnamed pane|Description|pane paneStyle';
  //       newObj2[sectionsState2[i]] = '';
  //     }
  //   }
  //   await uploadDataToSource({localItems: JSON.stringify(newObj), localPinnedItems:JSON.stringify(newObj2)}, localStorage.getItem('dbType'))
  // }

  async function add() {
    let sectionName = `Unnamed Section${Math.floor(Math.random() * 20)}`;
    setSections(sections.concat(sectionName))
    setPinnedSections(pinnedSections.concat(sectionName))

    let obj = JSON.parse(localStorage.getItem('localItems'));
    let obj2 = JSON.parse(localStorage.getItem('localPinnedItems'));

    obj[sectionName] = "Unnamed pane|Do homework|pane paneStyle";
    obj2[sectionName] = "";

    await uploadDataToSource({ localItems: JSON.stringify(obj), localPinnedItems: JSON.stringify(obj2) }, localStorage.getItem('dbType'))
  }

  function forceUpdate(index, oldSectionName) {
    const sectionElement = document.getElementsByClassName('section')[index];
    const pElement = sectionElement.getElementsByTagName('p')[0];
    pElement.innerText = oldSectionName;
  }

  async function onEdit(index, oldSectionName) {
    // First, make sure that the name isn't too long
    // Also, in the future "sanitize" the name just in case...
    let sectionElements = document.getElementsByClassName('section');
    let newSectionName = sectionElements[index].getElementsByTagName('p')[0].innerText;
    // Just in case you HAD a long section name before the update, it will change it for you
    if (oldSectionName.length > 50) {
      // Synthetically change the new section name
      // newSectionName = 'Unnamed section';
      toast("Your section name was reseted because it was too long")
      // Rerender sections to put it to the previous state
      forceUpdate(index, oldSectionName);
      return false;
    }
    else if (newSectionName.length > 50) {
      toast("Section name is too long!");
      // Undo the edit
      undoSectionEdit(oldSectionName, index)
      // Rerender sections to put it to the previous state
      forceUpdate(index, oldSectionName);
      return false
    } else if (newSectionName == '') {
      toast("You can't have an empty section name!");
      undoSectionEdit(oldSectionName, index)
      // Rerender sections to put it to the previous state
      forceUpdate(index, oldSectionName);
      return false
    } else if (newSectionName == oldSectionName) {
      // return false to prevent the data transfer for no reason
      // Rerender sections to put it to the previous state
      forceUpdate(index, oldSectionName);
      return false
    } else if (sections.includes(newSectionName)) {
      // Rerender sections to put it to the previous state
      forceUpdate(index, oldSectionName);
      toast("This section already exists!");
      return false;
    }

    let obj = JSON.parse(localStorage.getItem('localItems'));
    let obj2 = JSON.parse(localStorage.getItem('localPinnedItems'));
    obj[newSectionName] = obj[oldSectionName];
    delete obj[oldSectionName];
    obj2[newSectionName] = obj2[oldSectionName];
    delete obj2[oldSectionName];
    console.log(obj, obj2);

    sections.splice(index, 1)
    sections.splice(index, 0, newSectionName)

    // Update state arrays
    let newSections = [...sections];
    let newPinnedSections = [...pinnedSections];
    newSections[index] = newSectionName;
    newPinnedSections[index] = newSectionName;

    setSections(newSections);
    setPinnedSections(newPinnedSections);

    window.currentSection = newSectionName;
    if (props.inMain) {
      props.reloadMain();
    }

    await uploadDataToSource({ localItems: JSON.stringify(obj), localPinnedItems: JSON.stringify(obj2) }, localStorage.getItem('dbType'))
    setDidEdit(true);
  }

  async function onDelete(value) {
    const accident = prompt(`Are you sure you want to delete ${value}? (y/n)`)
    if (accident != 'y' && accident != 'Y') {
      return false
    }

    // Get the current data from localStorage
    let obj = JSON.parse(localStorage.getItem('localItems'));
    let obj2 = JSON.parse(localStorage.getItem('localPinnedItems'));

    // Sections arrays to be modified
    let newSections = [...sections];
    let newPinnedSections = [...pinnedSections];

    // Delete the section by name (TODO: indexof may be different for the sections array and the localstorage object)
    delete obj[value];
    delete obj2[value];

    // Remove the section locally in the items array, not localstorage
    const idxToRemove = newSections.indexOf(value);
    newSections.splice(idxToRemove, 0);
    window.currentSection = newSections.at(idxToRemove);
    newPinnedSections.splice(newPinnedSections.indexOf(value), 1)

    setSections(newSections)
    setPinnedSections(newPinnedSections);

    await uploadDataToSource({ localItems: JSON.stringify(obj), localPinnedItems: JSON.stringify(obj2) }, localStorage.getItem('dbType'))
    setDidEdit(true);

    // To ensure you aren't still using a old section
    if (props.inMain) {
      props.reloadMain();
    }
  }

  function goToSection(value) {
    window.currentSection = value;
    props.reloadMain(false);
    // So, since App.js already got the localstorage values, if we didn't edit anything we can just reuse those values in Main.js
    props.shouldReuseLocalStorage(!didEdit);
  }

  function editSections() {
    if (editing == true) {
      setEditing(false)
    } else {
      setEditing(true)
    }
  }

  var elementItems = null
  if (sections != null) {
    let count = -1
    elementItems = sections.map((item) => {
      count++
      return <Section unique={count} key={count} editing={editing} goToSectionProp={goToSection} deleteSectionProp={() => { onDelete(item) }} editSectionProp={(value) => { onEdit(value, item) }} section={item}></Section>
    })
  }

  const pencilStyle = editing ? "themedButton pencilEmphasis" : "themedButton";
  return (
    <div>
      <div id="sectionToolbar">
        <button style={styles[0]} className="themedButton" onClick={add}>+</button>
        <div style={styles[1]} className={pencilStyle} onClick={editSections}><PencilIcon /></div>
      </div>
      <div id="sections">
        <ul id="sectionsItems">
          {elementItems}
        </ul>
      </div>
    </div>
  );
};

export default Sections;