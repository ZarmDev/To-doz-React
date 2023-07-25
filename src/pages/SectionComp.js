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
  // componentDidMount() {
  //   console.log(localStorage.getItem('localPinnedItems'));
  // }
  add() {
    let sectionName = `Unnamed Section${Math.floor(Math.random() * 20)}`;

    this.setState({
      sections: this.state.sections.concat(sectionName),
      pinnedSections: this.state.pinnedSections.concat(sectionName)
    })
  }
  onEdit(index, oldSectionName) {
    let sections = this.state.sections;
    let sectionElements = document.getElementsByClassName('section');
    let obj = JSON.parse(localStorage.getItem('localItems'));
    // Data transfer
    let data = obj[oldSectionName];
    let newSectionName = sectionElements[index].getElementsByTagName('p')[0].innerText;
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
    let sectionElements2 = document.getElementsByClassName('section');
    let obj2 = JSON.parse(localStorage.getItem('localPinnedItems'));
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