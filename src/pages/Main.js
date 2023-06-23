import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Pane from '../components/Pane';
import SectionComp from './SectionComp';
import FocusSession from '../components/FocusSession';
import Settings from '../pages/Settings'

let mobile = navigator.userAgentData.mobile;

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pinned: JSON.parse(localStorage.getItem('localPinnedItems'))[window.currentSection],
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
        if (mobile == false) {
            // Add on to existing list of items
            if (this.state.items != '') {
                this.setState({
                    items: this.state.items.concat('·||pane')
                })
            } else {
                this.setState({
                    items: '||pane'
                })
            }
        }
    }
    editPane(value, isPinned) {
        if (isPinned == false) {
            var tempItems = this.state.items.split('·')
            var panes = document.getElementsByClassName('pane');
            var currPane = panes[value]
            let title = currPane.getElementsByClassName('title')[0].innerText;
            let description = currPane.getElementsByClassName('description')[0].innerText;
            let className = currPane.className;
            //Filter out keywords: · and |
            let filterCheck = false
            let filteredTitle = ''
            let filteredDescription = ''
            for (let i = 0; i < title.length; i++) {
                if (!(title[i] == '·' || title[i] == '|')) {
                    filterCheck = true
                    filteredTitle += title[i]
                }
            }
            for (let z = 0; z < description.length; z++) {
                if (!(description[z] == '·' || description[z] == '|')) {
                    filterCheck = true
                    filteredDescription += description[z]
                }
            }
            tempItems[value] = `${filteredTitle}|${filteredDescription}|${className}`;
            this.setState({
                items: tempItems.join('·')
            })
            if (filterCheck) {
                alert(`Your pane contained letters that don't work on To-doz, it will be filtered out after you exit this prompt`)
            }
        } else {
            var tempItems = this.state.pinned.split('·')
            var panes = document.getElementsByClassName('pinnedPane');
            var currPane = panes[value]
            let title = currPane.getElementsByClassName('title')[0].innerText;
            let description = currPane.getElementsByClassName('description')[0].innerText;
            let className = currPane.className;
            //Filter out keywords: · and |
            let filterCheck = false
            let filteredTitle = ''
            let filteredDescription = ''
            for (let i = 0; i < title.length; i++) {
                if (!(title[i] == '·' || title[i] == '|')) {
                    filterCheck = true
                    filteredTitle += title[i]
                }
            }
            for (let z = 0; z < description.length; z++) {
                if (!(description[z] == '·' || description[z] == '|')) {
                    filterCheck = true
                    filteredDescription += description[z]
                }
            }
            tempItems[value] = `${filteredTitle}|${filteredDescription}|${className}`;
            this.setState({
                pinned: tempItems.join('·')
            })
            if (filterCheck) {
                alert(`Your pane contained letters that don't work on To-doz, it will be filtered out after you exit this prompt`)
            }
        }
    }
    deletePane(value, isPinned) {
        if (isPinned == false) {
            var tempItems = this.state.items.split('·')
            if (tempItems.length == 0) {
                return false
            }
            tempItems.splice(value, 1)
            this.setState({
                items: tempItems.join('·')
            })
        } else {
            var tempItems = this.state.pinned.split('·')
            if (tempItems.length == 0) {
                return false
            }
            tempItems.splice(value, 1)
            this.setState({
                pinned: tempItems.join('·')
            })
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
    pinProp(value) {
        var tempItems = this.state.items.split('·')
        let item = tempItems.splice(value, 1)[0]
        item = item.split('|')
        // If pinned is empty
        if (this.state.pinned != '') {
            this.setState({
                items: tempItems.join('·'),
                pinned: this.state.pinned.concat(`·${item[0]}|${item[1]}|pinnedPane`)
            })
        } else {
            this.setState({
                items: tempItems.join('·'),
                pinned: `${item[0]}|${item[1]}|pinnedPane`
            })
        }
    }
    unPinProp(value) {
        var tempItems = this.state.pinned.split('·')
        let item = tempItems.splice(value, 1)[0]
        item = item.split('|')
        this.setState({
            pinned: tempItems.join('·'),
            items: this.state.items.concat(`·${item[0]}|${item[1]}|pane`)
        })
    }
    render() {
        // TEMPORARY solution, I am using count with the variable item for my key
        let count = -1
        // SECURITY vulnerability, if you put · you can break the system...
        console.log(`Pinned: `, this.state.pinned);
        console.log(`Items: `, this.state.items);
        // console.log(`-------------------------`);
        if (this.state.pinned != '') {
            var pinnedItems = this.state.pinned.split('·').map((item) => {
                count++
                return <Pane key={count} pinned={true} unPinProp={(value) => { this.unPinProp(value) }} editPaneProp={(unique, pinned) => { this.editPane(unique, pinned) }} deletePaneProp={(unique, pinned) => { this.deletePane(unique, pinned) }} items={item} unique={count}></Pane>
            })
        }
        count = -1
        if (this.state.items != '') {
            var elementItems = this.state.items.split('·').map((item) => {
                count++
                return <Pane key={count} pinned={false} pinProp={(value) => { this.pinProp(value) }} editPaneProp={(unique, pinned) => { this.editPane(unique, pinned) }} deletePaneProp={(unique, pinned) => { this.deletePane(unique, pinned) }} items={item} unique={count}></Pane>
            })
        }
        let obj = JSON.parse(localStorage.getItem('localItems'));
        obj[window.currentSection] = this.state.items
        localStorage.setItem('localItems', JSON.stringify(obj))

        let obj2 = JSON.parse(localStorage.getItem('localPinnedItems'));
        obj2[window.currentSection] = this.state.pinned
        localStorage.setItem('localPinnedItems', JSON.stringify(obj2))

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
                    </div>
                    <div id="panesElements" className={this.state.showSidebar ? 'sidebarOn' : 'sidebarOff'}>
                        {pinnedItems}
                        {elementItems}
                        <button className="themedButton" onClick={this.addPane} id="addPane">+</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Main