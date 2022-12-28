import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom/client';

class Pane extends React.Component {
    constructor(props) {
        super(props)
    }
    onEdit = () => {
        this.props.editPaneProp(this.props.unique)
    }
    onDelete = () => {
        this.props.deletePaneProp(this.props.unique)
    }
    render () {
        var items = this.props.items.split('·')
        return (
            <div className={items[0].split('|')[2]}>
                <button onClick={this.onEdit}>✏️</button>
                <button onClick={this.onDelete}>❌</button>
                <h1 contentEditable="true" suppressContentEditableWarning={true} className="title newp">{items[0].split('|')[0]}</h1>
                <pre contentEditable="true" suppressContentEditableWarning={true} className="description newp">{items[0].split('|')[1]}</pre>
            </div>
        )
    }
}

export default Pane