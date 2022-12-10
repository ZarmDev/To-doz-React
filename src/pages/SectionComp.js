import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom/client';

class SectionComp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            shown: true
        };
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange() {
      console.log(this.props);
      this.props.parentCallback(false)
    }
    render () {
    return (
        <div className={this.state.shown == true ? "SectionComp" : "Test"}>
      <div id="topbar">
        <h1>To-doz</h1>
      </div>
      <div id="toolbar">
      <p id="sectionList">|||</p>
      <p id="add">+</p>
      </div>
      <div id="sections">
        <ul id="sectionsItems">
          <li onClick={this.handleChange}>Section1</li>
          <li>Example 2</li>
        </ul>
      </div>
      </div>
    );
    }
}

export default SectionComp;