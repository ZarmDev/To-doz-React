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
    onEdit(value) {
      
    }
    onDelete(value) {
      // I don't trust this code
      var obj = this.state.sections;
      console.log(this.state.sections);
      obj.splice(obj.indexOf(value), 1)
      this.setState({
        sections: obj
      })
      console.log(this.state.sections);
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
            return <Section unique={count} key={count} goToSectionProp={this.goToSection} deleteSectionProp={() => {this.onDelete(item)}} editSectionProp={() => {this.onEdit(item)}} section={item}></Section>
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