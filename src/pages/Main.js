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
            items: JSON.parse(localStorage.getItem('localItems'))[window.currentSection],
            showSidebar: true
        }
        this.addPane = this.addPane.bind(this)
        this.editPane = this.editPane.bind(this)
        this.deletePane = this.deletePane.bind(this)
        this.toggleSidebar = this.toggleSidebar.bind(this)
        this.reset = this.reset.bind(this)
    }
    addPane() {
        this.setState({
            items: this.state.items.concat('·Unnamed Pane|Description|pane')
        })
    }
    editPane(value, unique) {
        var tempItems = this.state.items.split('·')
        var panes = document.getElementsByClassName('pane');
        console.log(panes, unique);
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
        console.log(tempItems);
        this.setState({
            items: tempItems.join('·')
        })
        if (tempItems.length == 0) {
            this.editPane(0)
        }
    }
    toggleSidebar() {
        if (this.state.showSidebar == true) {
            this.setState({
                showSidebar: false
            })
        } else {
            this.setState({
                showSidebar: true
            })
        }
        console.log(this.state.showSidebar);
    }
    reset() {
        this.setState({
            items: JSON.parse(localStorage.getItem('localItems'))[window.currentSection],
            showSidebar: true
        })
    }
    render() {
        // TEMPORARY solution, I am using count with the variable item for my key
        let count = -1
        var elementItems = this.state.items.split('·').map((item) => {
            count++
            return <Pane key={count} editPaneProp={(value) => {this.editPane(value)}} deletePaneProp={this.deletePane} items={item} unique={count}></Pane>
        })
        let obj = JSON.parse(localStorage.getItem('localItems'));
        obj[window.currentSection] = this.state.items
        console.log(this.state.items);
        localStorage.setItem('localItems', JSON.stringify(obj))
        return (
            <div id="panes">
                <p onClick={this.toggleSidebar} className={this.state.showSidebar ? 'sidebarOnToggle' : 'sidebarOffToggle'} id="toggleSidebar">{this.state.showSidebar ? '>' : '<'}</p>
                {this.state.showSidebar ? <div id="sidebar">
                <SectionComp reset={this.reset}></SectionComp>
                </div> : <></>}
                <div id="main">
                <div id="topbar" className={this.state.showSidebar ? 'sidebarOn' : 'sidebarOff'}>
                    <div id="topHeader"><h1>{window.currentSection}</h1>
                    <button id="settings">Settings</button></div>
                    <button onClick={this.addPane} id="add">+</button>
                </div>
                <div id="panesElements" className={this.state.showSidebar ? 'sidebarOn' : 'sidebarOff'}>
                    {elementItems}
                </div>
                </div>
            </div>
        )
    }
}

export default Main