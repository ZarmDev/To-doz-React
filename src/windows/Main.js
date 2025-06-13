import React, { useState, useEffect, useRef } from 'react';
import Pane from '../components/Pane';
import Sections from '../windows/Sections';
import FocusSession from '../tools/FocusSession';
import Settings from '../tools/Settings';
import Grades from '../tools/Grades';
import Dashboard from '../tools/Dashboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import introJs from 'intro.js';
import { uploadDataToDB } from 'src/utils/databaseFuncs';
import { SidebarIcon } from 'src/components/SvgIcons';

var toolbarOffset = 0;
const defaultPaneValue = '...||pane paneStyle';
var wasOffline = false;

const Undo = ({ onUndo }) => {
    function handleClick() {
        onUndo();
    };

    return (
        <div>
            <h3>
                Pane deleted <button className="mediumThemedButton" onClick={() => { handleClick() }}>UNDO</button>
            </h3>
        </div>
    );
};

// specifically made for Main.js
function getDataFromLocalStorageForMainJS(localItems, localPinnedItems) {
    let itemsFromStorage = localItems[window.currentSection].split('·');
    let pinnedItemsFromStorage = localPinnedItems[window.currentSection].split('·');
    // wait a second, if itemsFromStorage is empty that's a suspicous bug.. why am I filtering it then.
    if (itemsFromStorage[0] == '') {
        itemsFromStorage = []
    }
    // makes sense, if the pinned split is just an empty array, there are no pinned panes.
    if (pinnedItemsFromStorage[0] == '') {
        pinnedItemsFromStorage = []
    }
    return [itemsFromStorage, pinnedItemsFromStorage]
}

function Main(props) {
    // if we need a scrollbar (too much buttons)
    const toolbarScroll = useRef(false);
    // the last deleted pane
    const lastDeletedPane = useRef('');

    const [items, setItems] = useState(() => {
        if (props.reuseLocalStorage != null) {
            // If we are provided with already parsed localstorage, we can reuse it
            return getDataFromLocalStorageForMainJS(props.reuseLocalStorage, props.reuseLocalPinnedStorage)[0];
        } else {
            return getDataFromLocalStorageForMainJS(
                JSON.parse(localStorage.getItem('localItems')), 
                JSON.parse(localStorage.getItem('localPinnedItems'))
            )[0];
        }
    });

    const [pinned, setPinned] = useState(() => {
        if (props.reuseLocalStorage != null) {
            // If we are provided with already parsed localstorage, we can reuse it
            return getDataFromLocalStorageForMainJS(props.reuseLocalStorage, props.reuseLocalPinnedStorage)[1];
        } else {
            return getDataFromLocalStorageForMainJS(
                JSON.parse(localStorage.getItem('localItems')), 
                JSON.parse(localStorage.getItem('localPinnedItems'))
            )[1];
        }
    });

    // Which tool (window) is open ex: focussession, settings, grades
    const [toolOpen, setToolOpen] = useState(false)
    const [showSidebar, setShowSidebar] = useState(localStorage.getItem('sidebarIsAlwaysOpen') == 'true');

    // TODO: maybe use a window object from the localstorage?
    // TODO: when you finished deciding, find all showSidebar and replace it in file
    //showSidebar: (localStorage.getItem('sidebarIsAlwaysOpen') == 'true') ? true : false,

    useEffect(() => {
        // Present the tutorial for Main.js
        if (window.shouldPresentFirstStartUp["main"] == true) {
            introJs().start()
            window.shouldPresentFirstStartUp["main"] = false;
        }
        // Add toolbar scroll if more than 7 children or the user is on mobile
        if (document.getElementById('toolbar').children.length > 4 || window.isMobile) {
            toolbarScroll.current = true;
            toolbarOffset = document.getElementById('toolbar').offsetWidth
        }
    }, [])

    function addPane() {
        // Add on to existing list of items
        if (items.length != 0) {
            setItems(items.concat('...||pane paneStyle'))
        } else {
            // wait so runs when there's no items? isnt that impossible.?
            setItems(['...||pane paneStyle'])
        }
    }
    // textValue: [title, description]
    function editPane(unique, isPinned, description) {
        if (isPinned == false) {
            // copy items array, not the reference in memory
            var tempItems = Array.from(items)
            var panes = document.getElementsByClassName('pane');
            var currPane = panes[unique]
            let title = currPane.getElementsByClassName('title')[0].innerText;
            // let description = currPane.getElementsByClassName('description')[0].innerHTML;
            // let title = textValue[0];
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
            setItems(tempItems)
            if (filterCheck) {
                toast(`Your pane contained letters that don't work on To-doz, it was filtered out.`)
            }
        } else {
            var tempItems = Array.from(pinned)
            var panes = document.getElementsByClassName('pinnedPane');
            var currPane = panes[unique]
            let title = currPane.getElementsByClassName('title')[0].innerText;
            // let description = currPane.getElementsByClassName('description')[0].innerHTML;
            // let title = textValue[0];
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
            setPinned(tempItems)
            if (filterCheck) {
                toast(`Your pane contained letters that don't work on To-doz, it was filtered out.`)
            }
        }
    }

    function undoDelete(originalIndex, wasPinned, itemToRestore) {
        if (wasPinned) {
            // Copy pinned array and insert item to restore
            setPinned(prev => {
                const arr = [...prev];
                arr.splice(originalIndex, 0, itemToRestore);
                return arr;
            });
        } else {
            // Copy items array and insert item to restore
            setItems(prev => {
                const arr = [...prev];
                arr.splice(originalIndex, 0, itemToRestore);
                return arr;
            });
        }
    }

    function deletePane(unique, isPinned) {
        // If the pane is not pinned and there is only one pane, don't delete it
        if (!isPinned && items.length == 1) {
            return false
        }
        if (isPinned == false) {
            var tempItems = Array.from(items)
            // Don't delete if item length is zero
            if (tempItems.length == 0) {
                return false
            }
            // Remove the index (unique)
            let removedItem = tempItems.splice(unique, 1);
            setItems(tempItems)
            lastDeletedPane.current = removedItem[0]
        } else {
            var tempItems = Array.from(pinned)
            if (tempItems.length == 0) {
                return false
            }
            let removedItem = tempItems.splice(unique, 1);
            setPinned(tempItems)
            lastDeletedPane.current = removedItem[0]
        }

        // Store the data to prevent it from having outdated information (just like when you bind values to a function)
        const deletedIndex = unique;
        const wasPinned = isPinned;
        const deletedItem = lastDeletedPane.current;

        toast(() => (
            <Undo onUndo={() => undoDelete(deletedIndex, wasPinned, deletedItem)} />
        ), {});

        return true
    }
    function toggleSidebar() {
        if (showSidebar == true) {
            setShowSidebar(false);
        } else {
            setShowSidebar(true);
        }
    }
    // To rerender all the items, pinned and the sidebar when user changes section from sidebar
    function reRender() {
        const [itemsFromStorage, pinnedItemsFromStorage] = getDataFromLocalStorageForMainJS(JSON.parse(localStorage.getItem('localItems')), JSON.parse(localStorage.getItem('localPinnedItems')));
        setItems(itemsFromStorage)
        setPinned(pinnedItemsFromStorage)

        setShowSidebar(true);
    }
    function closeTool() {
        setToolOpen('')
    }
    function openTool(tool) {
        setToolOpen(tool)
    }
    function pinProp(unique) {
        var tempItems = Array.from(items)
        // IMPORTANT. it gets the length BEFORE the item is spliced so it doesn't modify the length.
        let lengthOfItems = tempItems.length
        let item = tempItems.splice(unique, 1)[0]
        item = item.split('|')
        // If pinned has panes
        if (pinned.length != 0) {
            // if there is one unpinned item, then we gotta fill in the gap
            if (lengthOfItems == 1) {
                setItems([defaultPaneValue])
                setPinned(pinned.concat(`${item[0]}|${item[1]}|pinnedPane paneStyle`))
            } else {
                setItems(tempItems)
                setPinned(pinned.concat(`${item[0]}|${item[1]}|pinnedPane paneStyle`))
            }
        } else {
            // if pinned has no panes
            // if there is only one item and that got pinned, then we gotta add a default pane to fill it's place
            if (lengthOfItems == 1) {
                setItems([defaultPaneValue])
                setPinned(pinned.concat(`${item[0]}|${item[1]}|pinnedPane paneStyle`))
            } else {
                setItems(tempItems)
                setPinned(pinned.concat(`${item[0]}|${item[1]}|pinnedPane paneStyle`))
            }
        }
    }
    function unPinProp(unique) {
        var tempPinnedItems = Array.from(pinned);
        let item = tempPinnedItems.splice(unique, 1)[0]
        item = item.split('|')
        setPinned(tempPinnedItems)
        setItems(items.concat(`${item[0]}|${item[1]}|pane paneStyle`))
    }

    function showLessEffect() {
        const MIN_MARGIN_LEFT = 50; // set minimum unique to 10 pixels

        const toolbar = document.getElementById('toolbar');
        let firstButton = toolbar.firstChild.style;
        // get the number version without the 'px' of the marginLeft
        let marginLeftInNumber = Math.abs(Number(firstButton.marginLeft.slice(0, firstButton.marginLeft.indexOf('px'))));
        marginLeftInNumber = Math.max(marginLeftInNumber, MIN_MARGIN_LEFT); // ensure minimum unique is met
        // Divide the width of entire scrollbar by amount of buttons
        let moveBy = toolbarOffset / (toolbar.children.length + 3);
        // Get the width of entire scrollbar and subtract by the 5 visible buttons at the end
        if (marginLeftInNumber > 50) {
            // Round down so if it's a decimal like 0.090 or something it won't move back by another 100px
            let newNumber = Math.round(marginLeftInNumber - moveBy);
            firstButton.marginLeft = `${-newNumber}px`;
        } else {
            // Just making it look nice, so it's not too close to the button :)
            firstButton.marginLeft = '15px';
        }
    }
    function showMoreEffect() {
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
        if (marginLeftInNumber > toolbarOffset - 300) {
            firstButton.marginLeft = prevMarginLeft;
        }
    }

    if (pinned.length != 0) {
        var pinnedItems = pinned.map((item, idx) => {
            return (
                <Pane
                    key={idx}
                    saveContentCallback={props.saveContentCallback}
                    pinned={true}
                    pinProp={(unique) => { pinProp(unique) }}
                    unPinProp={(unique) => { unPinProp(unique) }}
                    editPaneProp={(unique, pinned, description) => { editPane(unique, pinned, description) }}
                    deletePaneProp={(unique, pinned) => { deletePane(unique, pinned) }}
                    items={item}
                    unique={idx}
                ></Pane>
            )
        })
    }
    if (items.length != 0) {
        var elementItems = items.map((item, idx) => {
            return (
                <Pane
                    key={idx}
                    saveContentCallback={props.saveContentCallback}
                    pinned={false}
                    pinProp={(unique) => { pinProp(unique) }}
                    unPinProp={(unique) => { unPinProp(unique) }}
                    editPaneProp={(unique, pinned, description) => { editPane(unique, pinned, description) }}
                    deletePaneProp={(unique, pinned) => { deletePane(unique, pinned) }}
                    items={item}
                    unique={idx}
                ></Pane>
            )
        })
    }

    document.title = window.currentSection;

    let stateLocalItems = JSON.parse(localStorage.getItem('localItems'));
    stateLocalItems[window.currentSection] = items.join('·')
    localStorage.setItem('localItems', JSON.stringify(stateLocalItems))

    let statePinnedItems = JSON.parse(localStorage.getItem('localPinnedItems'));
    statePinnedItems[window.currentSection] = pinned.join('·')
    localStorage.setItem('localPinnedItems', JSON.stringify(statePinnedItems))

    if (localStorage.getItem('dbType') === 'usingonekey') {
        const newData = {
            localItems: localStorage.getItem('localItems'),
            localPinnedItems: localStorage.getItem('localPinnedItems')
        }
        let attempt = uploadDataToDB(newData)
        // if it tried to connect but didn't work, set wasOffline = true
        // was just made to make sure it notifys one time if you are suddenly offline
        console.log(attempt, wasOffline)
        if (attempt == false && wasOffline == false) {
            wasOffline = true;
            toast("Your database has disconnected.")
            // if the user wasOffline and if the connection was successful, tell user
        } else if (attempt == true && wasOffline == true) {
            wasOffline = false;
            toast("Reconnected to the server! Your data was saved!")
        }
    }

    let currentToolOpen = undefined;
    if (toolOpen == 'focussession') {
        currentToolOpen = <FocusSession exitTool={() => { closeTool('focussession') }}></FocusSession>
    } else if (toolOpen == 'settings') {
        currentToolOpen = <Settings exitTool={() => { closeTool('settings') }}></Settings>
    } else if (toolOpen == 'grades') {
        currentToolOpen = <Grades exitTool={() => { closeTool('grades') }}></Grades>
    } else if (toolOpen == 'dashboard') {
        currentToolOpen = <Dashboard exitTool={() => { closeTool('dashboard') }}></Dashboard>
    }

    return (
        <div id="panes">
            {/* Which "tool" or "window" is open */}
            {currentToolOpen}
            {/* If the sidebar should be always open */}
            {localStorage.getItem('alwaysShowSidebar') ? <div>
                <div id="sidebar">
                    <Sections reloadMain={reRender} passLocalItems={stateLocalItems} passPinnedItems={statePinnedItems} shouldReuseLocalStorage={() => {}} inMain={true}></Sections>
                </div></div> : <div><button onClick={toggleSidebar} className={showSidebar ? 'sidebarOnToggle' : 'sidebarOffToggle'} id="toggleSidebar"><SidebarIcon></SidebarIcon></button>
                {showSidebar ? <div id="sidebar">
                    <Sections reloadMain={reRender} passLocalItems={stateLocalItems} passPinnedItems={statePinnedItems} shouldReuseLocalStorage={() => {}} inMain={true}></Sections>
                </div> : <></>}</div>}
            {/* Where all the pane stuff is */}
            <div id="main">
                <div id="topbar" className={showSidebar ? 'sidebarOn' : 'sidebarOff'}>
                    <div id="topHeader">
                        <h1>{window.currentSection}</h1>
                        {toolbarScroll.current ? <button id="showLess" className="simpleThemedButton" onClick={showLessEffect}>{'<'}</button> : <></>}
                        <div id="toolbar">
                            <button className="bigThemedButton" onClick={() => { openTool('focussession') }} id="startSession">Start a focus session</button>
                            <button className="bigThemedButton" onClick={() => { openTool('settings') }} id="settings">Settings</button>
                            <button className="bigThemedButton" onClick={() => { openTool('dashboard') }} id="checkGrades">Dashboard</button>
                            {/* <button className="bigThemedButton" onClick={() => { openTool('grades')}} id="checkGrades">Grades</button>
                                <button className='bigThemedButton' onClick={() => { openTool('templates')}} id="findTemplates">Templates</button>
                                <button className="bigThemedButton" onClick={() => { openTool('grades')}} id="checkGrades">Plugins</button> */}
                        </div>
                        {toolbarScroll.current ? <button id="showMore" className="simpleThemedButton" onClick={showMoreEffect}>{'>'}</button> : <></>}
                    </div>
                </div>
                <div id="panesElements" className={showSidebar ? 'sidebarOn' : 'sidebarOff'}>
                    {pinnedItems}
                    {elementItems}
                    <button className="themedButton" onClick={addPane} id="addPane">+</button>
                </div>
            </div>
        </div>
    )
}

export default Main