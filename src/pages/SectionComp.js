import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom/client';
import Section from '../components/Section'
import PinTitle from '../components/PinTitle';
class SectionComp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shown: true,
      sections: Object.keys(JSON.parse(localStorage.getItem('localItems'))),
      pinnedSections: Object.keys(JSON.parse(localStorage.getItem('localPinnedItems'))),
      // pinned: JSON.parse(localStorage.getItem('localPinnedItems'))
    };
    this.goToSection = this.goToSection.bind(this)
    this.add = this.add.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }
  componentDidMount() {
    console.log(localStorage.getItem('localPinnedItems'));
  }
  add() {
    let sectionName = `Unnamed Section${Math.floor(Math.random() * 20)}`;

    this.setState({
      sections: this.state.sections.concat(sectionName),
      pinnedSections: this.state.pinnedSections.concat(sectionName)
    })
  }
  onEdit(index, oldSectionName) {
    var sections = this.state.sections;
    var sectionElements = document.getElementsByClassName('section');
    var obj = JSON.parse(localStorage.getItem('localItems'));
    // Data transfer
    var data = obj[oldSectionName];
    var newSectionName = sectionElements[index].getElementsByTagName('p')[0].innerText;
    sections.splice(index, 1)
    console.log(sections, index);
    sections.splice(index, 0, newSectionName)
    console.log(JSON.parse(localStorage.getItem('localItems')));
    this.setState({
      sections: sections
    })
    // transfer
    obj[newSectionName] = obj[oldSectionName];
    window.currentSection = newSectionName;
    localStorage.setItem('localItems', JSON.stringify(obj))

    var sections = this.state.pinnedSections;
    var sectionElements = document.getElementsByClassName('section');
    var obj = JSON.parse(localStorage.getItem('localPinnedItems'));
    // Data transfer
    var data = obj[oldSectionName];
    var newSectionName = sectionElements[index].getElementsByTagName('p')[0].innerText;
    sections.splice(index, 1)
    console.log(sections, index);
    sections.splice(index, 0, newSectionName)
    console.log(JSON.parse(localStorage.getItem('localPinnedItems')));
    this.setState({
      pinnedSections: sections
    })
    // transfer
    obj[newSectionName] = obj[oldSectionName];
    window.currentSection = newSectionName;
    localStorage.setItem('localPinnedItems', JSON.stringify(obj))
    this.props.reset()
  }
  onDelete(value) {
    // I don't trust this code
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
    console.log(value);
    window.currentSection = value;
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
    console.log(sectionsState);
    for (var i = 0; i < sectionsState.length; i++) {
      if (objKeys.indexOf(sectionsState[i]) != -1) {
        newObj[sectionsState[i]] = obj[sectionsState[i]];
      } else {
        newObj[sectionsState[i]] = 'Unnamed pane|Description|pane';
      }
    }
    localStorage.setItem('localItems', JSON.stringify(newObj))

    let obj2 = JSON.parse(localStorage.getItem('localPinnedItems'));
    let objKeys2 = Object.keys(obj2)
    let newObj2 = {};
    let sectionsState2 = this.state.pinnedSections
    console.log(sectionsState2);
    for (var i = 0; i < sectionsState2.length; i++) {
      // If the object keys exist in the state (client), but not on the localstorage,
      // upload it to the localstorage (server but not actually a real server)
      if (objKeys2.indexOf(sectionsState2[i]) != -1) {
        // Transfer data to the object that will be uploaded to localstorage,
        // because the state and localstorage are seperate and you have
        // to update the localstorage with the state data
        newObj2[sectionsState2[i]] = obj2[sectionsState2[i]];
      } else {
        newObj2[sectionsState2[i]] = '';
      }
    }
    console.log(newObj2);
    localStorage.setItem('localPinnedItems', JSON.stringify(newObj2))
    return (
      <div className={this.state.shown == true ? "SectionComp" : "Test"}>
        {/* {this.state.pinned != '' ? <div id="pinned">
          <h2>Pinned panes:</h2>
          <div id="pinnedPanes">
            {pinnedItems}
          </div>
        </div> : <></>} */}
        <div id="toolbar">
          <button id="add" className="themedButton" onClick={this.add}>+</button>
        </div>
        <div id="sections">
          <ul id="sectionsItems">
            {elementItems}
          </ul>
        </div>
      </div>
    );
  }
}

export default SectionComp;