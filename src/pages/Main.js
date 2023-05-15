import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Pane from '../components/Pane';
import SectionComp from './SectionComp';
import FocusSession from '../components/FocusSession';
import Settings from '../pages/Settings'

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items: JSON.parse(localStorage.getItem('localItems'))[window.currentSection],
            showSidebar: false,
            focusSessionOpen: false,
            settingsOpen: false
        }
        this.addPane = this.addPane.bind(this)
        this.editPane = this.editPane.bind(this)
        this.deletePane = this.deletePane.bind(this)
        this.toggleSidebar = this.toggleSidebar.bind(this)
        this.reset = this.reset.bind(this)
        this.setFocusOn = this.setFocusOn.bind(this)
        this.setFocusOff = this.setFocusOff.bind(this)
        this.openSettings = this.openSettings.bind(this)
        this.closeSettings = this.closeSettings.bind(this)
    }
    addPane() {
        this.setState({
            items: this.state.items.concat('·Unnamed Pane|Description|pane')
        })
    }
    editPane(value, unique) {
        var tempItems = this.state.items.split('·')
        var panes = document.getElementsByClassName('pane');
        var currPane = panes[value]
        let title = currPane.getElementsByClassName('title')[0];
        let description = currPane.getElementsByClassName('description')[0];
        let className = currPane.className;
        tempItems[value] = `${title.innerText}|${description.innerText}|${className}`;
        this.setState({
            items: tempItems.join('·')
        })
    }
    deletePane(value) {
        var tempItems = this.state.items.split('·')
        tempItems.splice(value, 1)
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
    }
    reset() {
        this.setState({
            items: JSON.parse(localStorage.getItem('localItems'))[window.currentSection],
            showSidebar: true
        })
    }
    setFocusOn() {
        this.setState({
            focusSessionOpen: true
        })
    }
    setFocusOff() {
        this.setState({
            focusSessionOpen: false
        })
    }
    openSettings() {
        this.setState({
            settingsOpen: true
        })
    }
    closeSettings() {
        this.setState({
            settingsOpen: false
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
        localStorage.setItem('localItems', JSON.stringify(obj))
        document.title = window.currentSection;
        return (
            <div id="panes">
                {this.state.settingsOpen ? <Settings parentCallback={this.closeSettings}></Settings> : <></>}
                {this.state.focusSessionOpen ? <FocusSession parentCallback={this.setFocusOff}></FocusSession> : <></>}
                <button onClick={this.toggleSidebar} className={this.state.showSidebar ? 'sidebarOnToggle' : 'sidebarOffToggle'} id="toggleSidebar">{this.state.showSidebar ? '>' : '<'}</button>
                {this.state.showSidebar ? <div id="sidebar">
                <SectionComp reset={this.reset}></SectionComp>
                </div> : <></>}
                <div id="main">
                <div id="topbar" className={this.state.showSidebar ? 'sidebarOn' : 'sidebarOff'}>
                    <div id="topHeader">
                        <h1>{window.currentSection}</h1>
                        <button className="bigThemedButton" onClick={this.setFocusOn} id="startSession">Start a focus session</button>
                        <button className="bigThemedButton" onClick={this.openSettings} id="settings">Settings</button>
                    </div>
                    <button class="themedButton" onClick={this.addPane} id="addPane">+</button>
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