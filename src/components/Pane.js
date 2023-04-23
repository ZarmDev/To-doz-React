import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom/client';

class Pane extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fading: false
        }
    }
    onEdit = (event) => {
        this.props.editPaneProp(this.props.unique)
    }
    onDelete = () => {
        this.props.deletePaneProp(this.props.unique)
    }
    onChange = (event) => {
        // Work in progress
    }
    fade = () => {
        this.setState({
            fading: true
        })
    }
    render () {
        var items = this.props.items.split('·')
        return (
            <div className={this.state.fading ? `fadeOutPane ${items[0].split('|')[2]}` : items[0].split('|')[2]}>
                <button className="themedButton" onClick={this.onEdit}>✏️</button>
                <button className="themedButton" onClick={() => {
                    this.fade()
                    setTimeout(this.onDelete, 200)
                }}>❌</button>
                <h1 onBlur={(event) => {this.onEdit(event)}} onInput={(event) => {this.onChange(event)}} contentEditable="true" suppressContentEditableWarning={true} className="title newp">{items[0].split('|')[0]}</h1>
                <pre onBlur={(event) => {this.onEdit(event)}} onInput={(event) => {this.onChange(event)}} contentEditable="true" suppressContentEditableWarning={true} className="description newp">{items[0].split('|')[1]}</pre>
            </div>
        )
    }
}

export default Pane