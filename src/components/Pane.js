import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom/client';

class Pane extends React.Component {
    constructor(props) {
        super(props)
    }
    render () {
        var items = this.props.items.split('·')
        console.log(this.props.parentCallback);
        return (
            <div className={items[0].split('|')[2]}>
                <h1 onInput={this.props.parentCallback} contentEditable="true" suppressContentEditableWarning={true} className="title newp">{items[0].split('|')[0]}</h1>
                <pre onInput={this.props.parentCallback} contentEditable="true" suppressContentEditableWarning={true} className="description newp">{items[0].split('|')[1]}</pre>
            </div>
        )
    }
}

export default Pane