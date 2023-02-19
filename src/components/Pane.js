import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom/client';

class Pane extends React.Component {
    constructor(props) {
        super(props)
    }
    onEdit = (event) => {
        this.props.editPaneProp(this.props.unique)
    }
    onDelete = () => {
        this.props.deletePaneProp(this.props.unique)
    }
    onChange = (event) => {
        console.log('let me l')
        let scrollW = event.target.scrollWidth;
        console.log(scrollW, 'SUP');
        let eventParent = event.target.parentElement;
        if (scrollW <= 140) {
            eventParent.style.gridColumn = '1 / span 1'
        } else if (scrollW <= 250) {
            // eventParent.style.gridColumn = '1 / span 2'
        } else if (scrollW <= 350) {
            // eventParent.style.gridColumn = '1 / span 3'
        }
    }
    render () {
        var items = this.props.items.split('·')
        return (
            <div className={items[0].split('|')[2]}>
                <button onClick={this.onEdit}>✏️</button>
                <button onClick={this.onDelete}>❌</button>
                <h1 onBlur={(event) => {this.onEdit(event)}} onInput={(event) => {this.onChange(event)}} contentEditable="true" suppressContentEditableWarning={true} className="title newp">{items[0].split('|')[0]}</h1>
                <pre onBlur={(event) => {this.onEdit(event)}} onInput={(event) => {this.onChange(event)}} contentEditable="true" suppressContentEditableWarning={true} className="description newp">{items[0].split('|')[1]}</pre>
            </div>
        )
    }
}

export default Pane