import React, { useEffect, useRef, useState } from 'react';
import Section from '../components/Section'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDataFromLocalStorage, uploadDataToSource } from 'src/utils/databaseFuncs';

function undoSectionEdit(oldName, index) {
  let sectionElements = document.getElementsByClassName('section');
  sectionElements[index].getElementsByTagName('p')[0].innerText = oldName;
}

function PencilIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>
  )
}

function Sections(props) {
  const [editing, setEditing] = useState(false);
  const [sections, setSections] = useState(null);
  const [pinnedSections, setPinnedSections] = useState(null);
  const [firstRender, setFirstRender] = useState(false);

  useEffect(() => {
    const [localItems, localPinnedItems] = getDataFromLocalStorage();
    let sections = Object.keys(localItems)
    let pinnedSections = Object.keys(localPinnedItems)
    setSections(sections)
    setPinnedSections(pinnedSections)
    setFirstRender(true)
  }, [])

  async function updateData() {
    // Make sure this only runs on rerenders, not the first time
    if (!firstRender) {
      return;
    }
    // ## Comparing the previous sections with new sections and putting in placeholders for each new key ##
    let [localItems, localPinnedItems] = getDataFromLocalStorage();
    // localItems = JSON.parse(localItems);
    // localPinnedItems = JSON.parse(localPinnedItems)
    let objKeys = Object.keys(localItems)
    // let objValues = Object.values(obj)
    let newObj = {};
    let sectionsState = sections;
    let sectionsState2 = pinnedSections;
    // For pinned
    let newObj2 = {};
    for (var i = 0; i < sectionsState.length; i++) {
      // IF the object keys (ex: Unnamed Section) is not found in the localstorage, update it on the localstorage
      // console.log('loop', objKeys[i], sectionsState[i])
      if (objKeys.indexOf(sectionsState[i]) != -1) {
        // console.log(newObj[sectionsState[i]], obj[sectionsState[i]]);
        newObj[sectionsState[i]] = localItems[sectionsState[i]];
        // console.log(newObj2[sectionsState[i]], obj2[sectionsState[i]]);
        newObj2[sectionsState2[i]] = localPinnedItems[sectionsState[i]];
      } else {
        newObj[sectionsState[i]] = 'Unnamed pane|Description|pane paneStyle';
        newObj2[sectionsState2[i]] = '';
      }
    }
    await uploadDataToSource({localItems: JSON.stringify(newObj), localPinnedItems:JSON.stringify(newObj2)}, localStorage.getItem('dbType'))
  }

  function add() {
    let sectionName = `Unnamed Section${Math.floor(Math.random() * 20)}`;
    setSections(sections.concat(sectionName))
    setPinnedSections(pinnedSections.concat(sectionName))
  }
  function onEdit(index, oldSectionName) {
    // First, make sure that the name isn't too long
    // Also, in the future "sanitize" the name just in case...
    let sectionElements = document.getElementsByClassName('section');
    let newSectionName = sectionElements[index].getElementsByTagName('p')[0].innerText;
    // Just in case you HAD a long section name before the update, it will change it for you
    if (oldSectionName.length > 50) {
      // Synthetically change the new section name
      newSectionName = 'Unnamed section';
      toast("Your section name was reseted because it was too long")
    }
    else if (newSectionName.length > 50) {
      toast("Section name is too long!");
      // Undo the edit
      undoSectionEdit(oldSectionName, index)
      return false
    } else if (newSectionName == '') {
      toast("You can't have an empty section name!");
      undoSectionEdit(oldSectionName, index)
      return false
    } else if (newSectionName == oldSectionName) {
      // return false to prevent the data transfer for no reason
      return false
    }
    /**
     * Transfer data for the localItems
     */
    let obj = JSON.parse(localStorage.getItem('localItems'));
    // Data transfer
    sections.splice(index, 1)
    sections.splice(index, 0, newSectionName)
    setSections(sections)
    // transfer
    obj[newSectionName] = obj[oldSectionName];
    window.currentSection = newSectionName;
    localStorage.setItem('localItems', JSON.stringify(obj))

    let sections2 = pinnedSections;
    let obj2 = JSON.parse(localStorage.getItem('localPinnedItems'));
    /**
     * Transfer data for the localPinnedItems
     */
    // Data transfer
    sections2.splice(index, 1)
    sections2.splice(index, 0, newSectionName)
    setPinnedSections(sections2)
    // transfer
    obj2[newSectionName] = obj2[oldSectionName];
    localStorage.setItem('localPinnedItems', JSON.stringify(obj2))
    updateData();
  }
  function onDelete(value) {
    // I don't trust this code
    const accident = prompt(`Are you sure you want to delete ${value}? (y/n)`)
    if (accident != 'y' && accident != 'Y') {
      return false
    }
    
    let newSections = [...sections];
    newSections.splice(newSections.indexOf(value), 1)
    setSections(newSections)

    let newPinnedSections = pinnedSections;
    newPinnedSections.splice(newPinnedSections.indexOf(value), 1)
    setPinnedSections(newPinnedSections);

    updateData();
  }
  function goToSection(value) {
    window.currentSection = value;
    props.reloadMain(false)
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

  const pencilEmphasis = editing ? "solid red 1px" : "";
  return (
    <div>
      <div id="sectionToolbar">
        <button id="add" className="themedButton" onClick={add}>+</button>
        <div style={{ border: pencilEmphasis }} id="editSections" className="themedButton" onClick={editSections}><PencilIcon /></div>
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