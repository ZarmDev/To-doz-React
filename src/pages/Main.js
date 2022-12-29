import React, { useEffect } from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom';
import Pane from '/workspaces/To-doz-React/src/components/Pane.js';
import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers';
import SectionComp from './SectionComp';

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items: JSON.parse(localStorage.getItem('localItems'))[window.currentSection]
        }
        this.addPane = this.addPane.bind(this)
        this.editPane = this.editPane.bind(this)
        this.deletePane = this.deletePane.bind(this)
    }
    addPane() {
        this.setState({
            items: this.state.items.concat('·Unnamed Pane|Description|pane')
        })
    }
    editPane(value) {
        var tempItems = this.state.items.split('·')
        var panes = document.getElementsByClassName('pane');
        console.log(panes, value);
        var currPane = panes[value]
        console.log(currPane);
        let title = currPane.getElementsByClassName('title')[0];
        let description = currPane.getElementsByClassName('description')[0];
        let className = currPane.className;
        tempItems[value] = `${title.innerText}|${description.innerText}|${className}`;
        console.log(tempItems)
        this.setState({
            items: tempItems.join('·')
        })
    }
    deletePane(value) {
        var tempItems = this.state.items.split('·')
        tempItems.splice(value, 1)
        console.log(tempItems.length);
        this.setState({
            items: tempItems.join('·')
        })
        if (tempItems.length == 0) {
            this.editPane(0)
        }
    }
    render() {
        // TEMPORARY solution, I am using count with the variable item for my key
        let count = -1
        var elementItems = this.state.items.split('·').map((item) => {
            count++
            return <Pane key={count} editPaneProp={this.editPane} deletePaneProp={this.deletePane} items={item} unique={count}></Pane>
        })
        let obj = JSON.parse(localStorage.getItem('localItems'));
        obj[window.currentSection] = this.state.items
        console.log(this.state.items);
        localStorage.setItem('localItems', JSON.stringify(obj))
        return (
            <div id="panes">
                <div id="sidebar">
                <SectionComp parentCallback={this.props.parentCallback}></SectionComp>
                </div>
                <div>
                <div id="topbar">
                    <button id="settings">Settings</button><button onClick={this.addPane} id="add">+</button>
                </div>
                <div id="panesElements">
                    {elementItems}
                </div>
                </div>
            </div>
        )
    }
}

export default Main