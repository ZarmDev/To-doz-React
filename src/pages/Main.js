import React, { useEffect } from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom';
import Pane from '/workspaces/To-doz-React/src/components/Pane.js';
import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers';

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items: Object.values(JSON.parse(localStorage.getItem('localItems')))[0]
        }
        this.addPane = this.addPane.bind(this)
    }
    addPane() {
        this.setState({
            items: this.state.items.concat('Unnamed Pane|Description|pane·')
        })
    }
    handleChange() {
        console.log('T');
        var itemObj = JSON.parse(localStorage.getItem('localItems'));
        // set section in localstorage to the array of panes
        itemObj[window.currentSection] = this.state.items;
        localStorage.setItem('localItems', JSON.stringify(itemObj))
    }
    render() {
        // TEMPORARY solution, I am using count with the variable item for my key
        let count = 0
        var elementItems = this.state.items.split('·').map((item) => {
            count++
            return <Pane key={item + count} parentCallback={this.handleChange} items={item}></Pane>
        })
        // var itemObj = JSON.parse(localStorage.getItem('localItems'));
        // itemObj[window.currentSection] = this.state.items;
        // localStorage.setItem('localItems', JSON.stringify(itemObj))
        // console.log(this.state.items);
        return (
            <div id="panes">
                <div id="topbar">
                    <h1>To-doz</h1><button id="settings">Settings</button>
                </div>
                <button onClick={this.addPane} id="add">+</button>
                <div id="panes">
                    {elementItems}
                </div>
            </div>
        )
    }
}

export default Main