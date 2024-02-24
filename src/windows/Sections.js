import React from 'react';
import Section from '../components/pageComponents/sectionComponents/Section'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function undoSectionEdit(oldName, index) {
  let sectionElements = document.getElementsByClassName('section');
  sectionElements[index].getElementsByTagName('p')[0].innerText = oldName;
}

class SectionComp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shown: false,
      sections: Object.keys(JSON.parse(localStorage.getItem('localItems'))),
      pinnedSections: Object.keys(JSON.parse(localStorage.getItem('localPinnedItems'))),
      // pinned: JSON.parse(localStorage.getItem('localPinnedItems'))
    };
    this.goToSection = this.goToSection.bind(this)
    this.add = this.add.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }
  add() {
    let sectionName = `Unnamed Section${Math.floor(Math.random() * 20)}`;

    this.setState({
      sections: this.state.sections.concat(sectionName),
      pinnedSections: this.state.pinnedSections.concat(sectionName)
    })
  }
  onEdit(index, oldSectionName) {
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
      // toast("It's the same name...")
      // return false to prevent the data transfer for no reason
      return false
    }
    /**
     * Transfer data for the localItems
     */
    let sections = this.state.sections;
    let obj = JSON.parse(localStorage.getItem('localItems'));
    // Data transfer
    sections.splice(index, 1)
    sections.splice(index, 0, newSectionName)
    this.setState({
      sections: sections
    })
    // transfer
    obj[newSectionName] = obj[oldSectionName];
    window.currentSection = newSectionName;
    localStorage.setItem('localItems', JSON.stringify(obj))

    let sections2 = this.state.pinnedSections;
    let obj2 = JSON.parse(localStorage.getItem('localPinnedItems'));
    /**
     * Transfer data for the localPinnedItems
     */
    // Data transfer
    sections2.splice(index, 1)
    sections2.splice(index, 0, newSectionName)
    this.setState({
      pinnedSections: sections2
    })
    // transfer
    obj2[newSectionName] = obj2[oldSectionName];
    localStorage.setItem('localPinnedItems', JSON.stringify(obj2))
    this.props.reset()
  }
  onDelete(value) {
    // I don't trust this code
    const accident = prompt(`Are you sure you want to delete ${value}? (y/n)`)
    if (accident != 'y') {
      return false
    }
    var obj = this.state.sections;
    obj.splice(obj.indexOf(value), 1)
    this.setState({
      sections: obj
    })

    var obj = this.state.pinnedSections;
    obj.splice(obj.indexOf(value), 1)
    this.setState({
      pinnedSections: obj
    })
  }
  goToSection(value) {
    window.currentSection = value;
    // I have no idea how this works... lol
    try {
      this.props.parentCallback(false)
    } catch {
      this.props.reset()
    }
  }
  render() {
    let count = -1
    var elementItems = this.state.sections.map((item) => {
      count++
      return <Section unique={count} key={count} goToSectionProp={this.goToSection} deleteSectionProp={() => { this.onDelete(item) }} editSectionProp={(value) => { this.onEdit(value, item) }} section={item}></Section>
    })
    count = -1
    /*
    Doesn't really work, need to find pin item from all sections
    if (this.state.pinned != '') {
      var pinnedItems = this.state.pinned[window.currentSection].split('·').map((item) => {
        count++
        return <PinTitle key={count} item={item}></PinTitle>
      })
    }
    */
    let obj = JSON.parse(localStorage.getItem('localItems'));
    let objKeys = Object.keys(obj)
    // let objValues = Object.values(obj)
    let newObj = {};
    let sectionsState = this.state.sections
    let sectionsState2 = this.state.pinnedSections
    // For pinned
    let obj2 = JSON.parse(localStorage.getItem('localPinnedItems'));
    let newObj2 = {};
    for (var i = 0; i < sectionsState.length; i++) {
      // IF the object keys (ex: Unnamed Section) is not found in the localstorage, update it on the localstorage
      // console.log('loop', objKeys[i], sectionsState[i])
      if (objKeys.indexOf(sectionsState[i]) != -1) {
        // console.log(newObj[sectionsState[i]], obj[sectionsState[i]]);
        newObj[sectionsState[i]] = obj[sectionsState[i]];
        // console.log(newObj2[sectionsState[i]], obj2[sectionsState[i]]);
        newObj2[sectionsState2[i]] = obj2[sectionsState[i]];
      } else {
        newObj[sectionsState[i]] = 'Unnamed pane|Description|pane paneStyle';
        newObj2[sectionsState2[i]] = '';
      }
    }
    localStorage.setItem('localItems', JSON.stringify(newObj))
    localStorage.setItem('localPinnedItems', JSON.stringify(newObj2))
    return (
      <div>
        <div id="sectionToolbar">
          <button id="add" className="themedButton" onClick={this.add}>+</button>
        </div>
        <div id="sections">
          <ul id="sectionsItems">
            {elementItems}
          </ul>
        </div>
        {/* <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        /> */}
      </div>
    );
  }
}

export default SectionComp;