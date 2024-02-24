import React from 'react';
import Pane from '../components/pageComponents/mainComponents/Pane';
import Sections from '../windows/Sections';
import FocusSession from '../tools/FocusSession';
import Settings from '../tools/Settings';
import Grades from '../tools/Grades';
import Dashboard from '../tools/Dashboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import introJs from 'intro.js';

var mobile = window.matchMedia("(max-width: 800px)").matches;
var toolbarOffset = 0;

const Undo = ({ onUndo, closeToast }) => {
    const handleClick = () => {
        onUndo();
        closeToast();
    };

    return (
        <div>
            <h3>
                Pane deleted <button className="themedButton" onClick={() => {handleClick()}}>UNDO</button>
            </h3>
        </div>
    );
};

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pinned: JSON.parse(localStorage.getItem('localPinnedItems'))[window.currentSection],
            items: JSON.parse(localStorage.getItem('localItems'))[window.currentSection],
            showSidebar: (localStorage.getItem('sidebarIsAlwaysOpen') == 'true') ? true : false,
            // Which tool (window) is open ex: focussession, settings, grades
            toolOpen: false,
            // if we need a scrollbar (too much buttons)
            toolbarScroll: false,
            // this is for the scroll (carousel) effect on the toolbar
            highestPointOfScroll: 0,
            // keep track of the last pane that was deleted
            lastDeletedPane: ''
        }
        this.addPane = this.addPane.bind(this)
        this.editPane = this.editPane.bind(this)
        this.deletePane = this.deletePane.bind(this)
        this.toggleSidebar = this.toggleSidebar.bind(this)
        this.reset = this.reset.bind(this)
        this.openTool = this.openTool.bind(this)
        this.showMoreEffect = this.showMoreEffect.bind(this)
        this.undoDelete = this.undoDelete.bind(this)
    }
    componentDidMount() {
        // Present the tutorial for Main.js
        if (window.shouldPresentFirstStartUp["main"] == true) {
            introJs().start()
            window.shouldPresentFirstStartUp["main"] = false;
        }
        // Add toolbar scroll if more than 7 children or the user is on mobile
        if (document.getElementById('toolbar').children.length > 4 || mobile) {
            this.setState({
                toolbarScroll: true
            })
            toolbarOffset = document.getElementById('toolbar').offsetWidth
        }
    }
    addPane() {
        // Add on to existing list of items
        if (this.state.items != '') {
            this.setState({
                items: this.state.items.concat('·||pane paneStyle')
            })
        } else {
            this.setState({
                items: '||pane paneStyle'
            })
        }
    }
    // textValue: [title, description]
    editPane(unique, isPinned, textValue) {
        console.log(textValue);
        if (isPinned == false) {
            var tempItems = this.state.items.split('·')
            var panes = document.getElementsByClassName('pane');
            var currPane = panes[unique]
            // let title = currPane.getElementsByClassName('title')[0].innerHTML;
            // let description = currPane.getElementsByClassName('description')[0].innerHTML;
            let title = textValue[0];
            let description = textValue[1];
            let className = currPane.className;
            //Filter out keywords: · and |
            let filterCheck = false
            let filteredTitle = ''
            let filteredDescription = ''
            for (let i = 0; i < title.length; i++) {
                if (!(title[i] == '·' || title[i] == '|')) {
                    filteredTitle += title[i]
                } else {
                    filterCheck = true
                }
            }
            for (let z = 0; z < description.length; z++) {
                if (!(description[z] == '·' || description[z] == '|')) {
                    filteredDescription += description[z]
                } else {
                    filterCheck = true
                }
            }
            console.log(`${filteredTitle}|${filteredDescription}|${className}`)
            tempItems[unique] = `${filteredTitle}|${filteredDescription}|${className}`;
            this.setState({
                items: tempItems.join('·')
            })
            if (filterCheck) {
                toast(`Your pane contained letters that don't work on To-doz, it was filtered out.`)
            }
        } else {
            var tempItems = this.state.pinned.split('·')
            var panes = document.getElementsByClassName('pinnedPane');
            var currPane = panes[unique]
            // let title = currPane.getElementsByClassName('title')[0].innerHTML;
            // let description = currPane.getElementsByClassName('description')[0].innerHTML;
            let title = textValue[0];
            let description = textValue[1];
            let className = currPane.className;
            //Filter out keywords: · and |
            let filterCheck = false
            let filteredTitle = ''
            let filteredDescription = ''
            for (let i = 0; i < title.length; i++) {
                if (!(title[i] == '·' || title[i] == '|')) {
                    filteredTitle += title[i]
                } else {
                    filterCheck = true
                }
            }
            for (let z = 0; z < description.length; z++) {
                if (!(description[z] == '·' || description[z] == '|')) {
                    filteredDescription += description[z]
                } else {
                    filterCheck = true
                }
            }
            tempItems[unique] = `${filteredTitle}|${filteredDescription}|${className}`;
            this.setState({
                pinned: tempItems.join('·')
            })
            if (filterCheck) {
                toast(`Your pane contained letters that don't work on To-doz, it was filtered out.`)
            }
        }
    }
    deletePane(unique, isPinned) {
        // Note: Removed fadeOutPane because it's inefficient
        // If the pane is not pinned and there is only one pane, don't delete it
        if (!isPinned && this.state.items.split('·').length == 1) {
            return false
        }
        if (isPinned == false) {
            var tempItems = this.state.items.split('·')
            if (tempItems.length == 0) {
                return false
            }
            let removedItem = tempItems.splice(unique, 1);
            console.log(removedItem);
            this.setState({
                items: tempItems.join('·'),
                lastDeletedPane: removedItem[0]
            })
        } else {
            var tempItems = this.state.pinned.split('·')
            if (tempItems.length == 0) {
                return false
            }
            let removedItem = tempItems.splice(unique, 1);
            console.log(removedItem, tempItems);
            this.setState({
                pinned: tempItems.join('·'),
                lastDeletedPane: removedItem[0]
            })
        }
        toast(<Undo onUndo={() => {this.undoDelete(unique, isPinned)}} />, {
            // hook will be called whent the component unmount
            // onClose: () => console.log('test')
        });
        return true
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
    // I don't exactly remember why I made this, but its to rerender everything
    reset() {
        this.setState({
            items: JSON.parse(localStorage.getItem('localItems'))[window.currentSection],
            pinned: JSON.parse(localStorage.getItem('localPinnedItems'))[window.currentSection],
            showSidebar: true
        })
    }
    closeTool() {
        this.setState({
            toolOpen: ''
        })
    }
    openTool(tool) {
        this.setState({
            toolOpen: tool
        })
    }
    pinProp(unique) {
        var tempItems = this.state.items.split('·')
        let item = tempItems.splice(unique, 1)[0]
        item = item.split('|')
        let lengthOfItems = this.state.items.split('·').length
        // If pinned is empty
        console.log(lengthOfItems, this.state.items)
        if (this.state.pinned != '') {
            if (lengthOfItems == 1) {
                this.setState({
                    items: 'Unnamed pane|Description|pane paneStyle',
                    pinned: this.state.pinned.concat(`·${item[0]}|${item[1]}|pinnedPane paneStyle`)
                })
            } else {
                this.setState({
                    items: tempItems.join('·'),
                    pinned: this.state.pinned.concat(`·${item[0]}|${item[1]}|pinnedPane paneStyle`)
                })
            }
        } else {
            if (lengthOfItems == 1) {
                this.setState({
                    items: 'Unnamed pane|Description|pane paneStyle',
                    pinned: `${item[0]}|${item[1]}|pinnedPane paneStyle`
                })
            } else {
                this.setState({
                    items: tempItems.join('·'),
                    pinned: `${item[0]}|${item[1]}|pinnedPane paneStyle`
                })
            }
        }
    }
    unPinProp(unique) {
        var tempItems = this.state.pinned.split('·')
        let item = tempItems.splice(unique, 1)[0]
        item = item.split('|')
        this.setState({
            pinned: tempItems.join('·'),
            items: this.state.items.concat(`·${item[0]}|${item[1]}|pane paneStyle`)
        })
    }
    undoDelete(unique, pinned) {
        if (pinned) {
            var tempItems = this.state.pinned.split('·');
            tempItems.splice(unique, 0, this.state.lastDeletedPane);
            this.setState({
                pinned: tempItems.join('·'),
                lastDeletedPane: '',
            })
        } else if (!pinned) {
            var tempItems = this.state.items.split('·');
            tempItems.splice(unique, 0, this.state.lastDeletedPane);
            this.setState({
                items: tempItems.join('·'),
                lastDeletedPane: '',
            })
        }
    }
    showLessEffect() {
        const MIN_MARGIN_LEFT = 50; // set minimum unique to 10 pixels

        const toolbar = document.getElementById('toolbar');
        let firstButton = toolbar.firstChild.style;
        // get the number version without the 'px' of the marginLeft
        let marginLeftInNumber = Math.abs(Number(firstButton.marginLeft.slice(0, firstButton.marginLeft.indexOf('px'))));
        marginLeftInNumber = Math.max(marginLeftInNumber, MIN_MARGIN_LEFT); // ensure minimum unique is met
        // Divide the width of entire scrollbar by amount of buttons
        let moveBy = toolbarOffset / (toolbar.children.length + 3);
        // Get the width of entire scrollbar and subtract by the 5 visible buttons at the end
        console.log(marginLeftInNumber, moveBy);
        if (marginLeftInNumber > 50) {
            // Round down so if it's a decimal like 0.090 or something it won't move back by another 100px
            let newNumber = Math.round(marginLeftInNumber - moveBy);
            firstButton.marginLeft = `${-newNumber}px`;
        } else {
            // Just making it look nice, so it's not too close to the button :)
            firstButton.marginLeft = '15px';
        }
    }
    showMoreEffect() {
        const toolbar = document.getElementById('toolbar');
        let firstButton = toolbar.firstChild.style;

        // get the number version without the 'px' of the marginLeft
        let marginLeftInNumber = Math.abs(Number(firstButton.marginLeft.slice(0, firstButton.marginLeft.indexOf('px'))));

        // Divide the width of entire scrollbar by amount of buttons
        let moveBy = toolbarOffset / (toolbar.children.length + 3);
        // Just to make it faster
        moveBy *= 2;

        let prevMarginLeft = firstButton.marginLeft;

        // Add to margin
        let newNumber = marginLeftInNumber + moveBy;
        firstButton.marginLeft = `${-newNumber}px`;

        // If it's too far, just set it to 0
        console.log(firstButton.marginLeft, toolbarOffset - 300)
        if (marginLeftInNumber > toolbarOffset - 300) {
            firstButton.marginLeft = prevMarginLeft;
        }
    }
    render() {
        let count = -1
        if (this.state.pinned != '') {
            var pinnedItems = this.state.pinned.split('·').map((item) => {
                count++
                return (
                    // Why are there so many props pointing to the parent of main?
                    // I think I messed up here
                    <Pane
                        key={count}
                        saveContentCallback={this.props.saveContentCallback}
                        pinned={true}
                        pinProp={(unique) => { this.pinProp(unique) }}
                        unPinProp={(unique) => { this.unPinProp(unique) }}
                        editPaneProp={(unique, pinned) => { this.editPane(unique, pinned) }}
                        deletePaneProp={(unique, pinned) => { this.deletePane(unique, pinned) }}
                        undoDelete={(unique, pinned) => { this.undoDelete(unique, pinned) }}
                        items={item}
                        unique={count}
                    ></Pane>
                )
            })
        }
        count = -1
        if (this.state.items != '') {
            var elementItems = this.state.items.split('·').map((item) => {
                count++
                return (
                    <Pane
                        key={count}
                        saveContentCallback={this.props.saveContentCallback}
                        pinned={false}
                        pinProp={(unique) => { this.pinProp(unique) }}
                        unPinProp={(unique) => { this.unPinProp(unique) }}
                        editPaneProp={(unique, pinned, textValue) => { this.editPane(unique, pinned, textValue) }}
                        deletePaneProp={(unique, pinned) => { this.deletePane(unique, pinned) }}
                        undoDelete={(unique) => { this.undoDelete(unique) }}
                        items={item}
                        unique={count}
                    ></Pane>
                )
            })
        }
        let obj = JSON.parse(localStorage.getItem('localItems'));
        obj[window.currentSection] = this.state.items
        localStorage.setItem('localItems', JSON.stringify(obj))

        let obj2 = JSON.parse(localStorage.getItem('localPinnedItems'));
        obj2[window.currentSection] = this.state.pinned
        localStorage.setItem('localPinnedItems', JSON.stringify(obj2))

        document.title = window.currentSection;

        let currentToolOpen = undefined;
        if (this.state.toolOpen == 'focussession') {
            currentToolOpen = <FocusSession exitTool={() => { this.closeTool('focussession') }}></FocusSession>
        } else if (this.state.toolOpen == 'settings') {
            currentToolOpen = <Settings exitTool={() => { this.closeTool('settings') }}></Settings>
        } else if (this.state.toolOpen == 'grades') {
            currentToolOpen = <Grades exitTool={() => { this.closeTool('grades') }}></Grades>
        } else if (this.state.toolOpen == 'dashboard') {
            currentToolOpen = <Dashboard exitTool={() => { this.closeTool('dashboard') }}></Dashboard>
        }
        let sidebarIsAlwaysOpen = localStorage.getItem('sidebarIsAlwaysOpen');
        return (
            <div id="panes">
                {/* Which "tool" or "window" is open */}
                {currentToolOpen}
                {/* If the sidebar should be always open */}
                {sidebarIsAlwaysOpen == 'true' ? <div>
                <div id="sidebar">
                    <Sections reset={this.reset}></Sections>
                </div></div> : <div><button onClick={this.toggleSidebar} className={this.state.showSidebar ? 'sidebarOnToggle' : 'sidebarOffToggle'} id="toggleSidebar">{this.state.showSidebar ? '>' : '<'}</button>
                {this.state.showSidebar ? <div id="sidebar">
                    <Sections reset={this.reset}></Sections>
                </div> : <></>}</div>}
                {/* Where all the pane stuff is */}
                <div id="main">
                    <div id="topbar" className={this.state.showSidebar ? 'sidebarOn' : 'sidebarOff'}>
                        <div id="topHeader">
                            <h1>{window.currentSection}</h1>
                            {this.state.toolbarScroll ? <button id="showLess" className="simpleThemedButton" onClick={this.showLessEffect}>{'<'}</button> : <></>}
                            <div id="toolbar">
                                <button className="bigThemedButton" onClick={() => { this.openTool('focussession') }} id="startSession" data-intro="Here, you can start a focus session with any amount of minutes and you can use the spotify integration.">Start a focus session</button>
                                <button className="bigThemedButton" onClick={() => { this.openTool('settings') }} id="settings" data-intro="Here, you can customize the features, colors, themes, etc. If you click it, you will see a full tour of the settings.">Settings</button>
                                <button className="bigThemedButton" onClick={() => { this.openTool('dashboard')}} id="checkGrades" data-intro="Here, you can see the time elapsed since you opened To-Doz. In the future, you will be able to see the amount you focused on that day, a graph of your progress, your streak, etc.">Dashboard</button>
                                {/* <button className="bigThemedButton" onClick={() => { this.openTool('grades')}} id="checkGrades">Grades</button>
                                <button className='bigThemedButton' onClick={() => { this.openTool('templates')}} id="findTemplates">Templates</button>
                                <button className="bigThemedButton" onClick={() => { this.openTool('grades')}} id="checkGrades">Plugins</button> */}
                            </div>
                            {this.state.toolbarScroll ? <button id="showMore" className="simpleThemedButton" onClick={this.showMoreEffect}>{'>'}</button> : <></>}
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