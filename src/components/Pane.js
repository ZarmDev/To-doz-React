import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom/client';
import { marked } from 'marked';
import ReactMarkdown from 'react-markdown'

class Pane extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fading: false,
            editing: false,
            pinned: this.props.pinned
        }
    }
    componentDidMount() {
        let items = this.props.items.split('·')
        if (items[0].split('|')[0] == '' && items[0].split('|')[1] == '') {
            this.setState({
                editing: true
            })
        }
    }
    onEdit = (event) => {
        this.setState({
            editing: true
        })
        // this.props.editPaneProp(this.props.unique)
    }
    onPin = (event) => {
        this.props.pinProp(this.props.unique)
    }
    unPin = (event) => {
        this.props.unPinProp(this.props.unique)
    }
    // Button for changing text
    onSubmit = (event) => {
        this.props.editPaneProp(this.props.unique, this.state.pinned)
        this.setState({
            editing: false
        })
    }
    onDelete = () => {
        this.props.deletePaneProp(this.props.unique, this.state.pinned)
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
        var title = items[0].split('|')[0];
        var description = items[0].split('|')[1];
        return (
            <div className={this.state.fading ? `fadeOutPane ${items[0].split('|')[2]}` : items[0].split('|')[2]}>
                {this.state.editing ? <div>
                <button className="themedButton popOutEffect">✏️</button>
                <button className="themedButton popOutEffect">❌</button>
                <button className="themedButton popInEffect" onClick={this.onSubmit}>✅</button>
                </div> : <div>
                <button className="themedButton" onClick={this.onEdit}>✏️</button>
                <button className="themedButton" onClick={() => {
                    this.fade()
                    setTimeout(this.onDelete, 200)
                }}>❌</button>
                {this.state.pinned ? <div id="pin">
                <button className="themedButtonClicked" onClick={this.unPin}>📌</button>
                </div> : <div id="pin">
                <button className="themedButton" onClick={this.onPin}>📌</button>
                </div>}
                </div>}
                {this.state.editing ? <div>
                <div className="title">
                <h1 onBlur={(event) => {this.onEdit(event)}} onInput={(event) => {this.onChange(event)}} contentEditable="true" suppressContentEditableWarning={true} className="title newp">{title}</h1>
                </div>
                <div className="description">
                <p onBlur={(event) => {this.onEdit(event)}} onInput={(event) => {this.onChange(event)}} contentEditable="true" suppressContentEditableWarning={true} className="description newp">{description}</p>
                </div>
                </div> : 
                <div>
                <ReactMarkdown className="title">{`## ${title}`}</ReactMarkdown><ReactMarkdown className="description">{description}</ReactMarkdown>
                </div>}
                </div>
        )
    }
}

export default Pane