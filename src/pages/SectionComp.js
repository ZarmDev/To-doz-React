import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom/client';
import Section from '/workspaces/To-doz-React/src/components/Section.js'

class SectionComp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            shown: true,
            sections: Object.keys(JSON.parse(localStorage.getItem('localItems')))
        };
        this.goToSection = this.goToSection.bind(this)
        this.add = this.add.bind(this)
        this.onEdit = this.onEdit.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }
    add() {
      this.setState({
        sections: this.state.sections.concat(`Unnamed Section${Math.floor(Math.random() * 20)}`)
      })
    }
    onEdit(index, oldSectionName) {
      var sections = this.state.sections;
      var sectionElements = document.getElementsByClassName('section');
      var obj = JSON.parse(localStorage.getItem('localItems'));
      // Data transfer
      var data = obj[oldSectionName];
      var newSectionName = sectionElements[index].getElementsByTagName('p')[0].innerText;
      console.log(sections, index);
      sections.splice(index, 1)
      console.log(sections, index);
      sections.splice(index, 0, newSectionName)
      console.log(JSON.parse(localStorage.getItem('localItems')));
      this.setState({
        sections: sections
      })
      // transfer
      obj[newSectionName] = obj[oldSectionName];
      console.log(obj[oldSectionName]);
      localStorage.setItem('localItems', JSON.stringify(obj))
    }
    onDelete(value) {
      // I don't trust this code
      var obj = this.state.sections;
      obj.splice(obj.indexOf(value), 1)
      this.setState({
        sections: obj
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
    render () {
      let count = -1
        var elementItems = this.state.sections.map((item) => {
            count++
            return <Section unique={count} key={count} goToSectionProp={this.goToSection} deleteSectionProp={() => {this.onDelete(item)}} editSectionProp={(value) => {this.onEdit(value, item)}} section={item}></Section>
        })
        let obj = JSON.parse(localStorage.getItem('localItems'));
        let objKeys = Object.keys(obj)
        let objValues = Object.values(obj)
        let newObj = {};
        let sectionsState = this.state.sections
        for (var i = 0; i < sectionsState.length; i++) {
          if (objKeys.indexOf(sectionsState[i]) != -1) {
            newObj[sectionsState[i]] = obj[sectionsState[i]];
          } else {
            newObj[sectionsState[i]] = 'Unnamed pane|Description|pane';
          }
        }
        localStorage.setItem('localItems', JSON.stringify(newObj))
    return (
        <div className={this.state.shown == true ? "SectionComp" : "Test"}>
      <div id="toolbar">
      <p id="add" onClick={this.add}>+</p>
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