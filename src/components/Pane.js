import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom/client';
import { marked } from 'marked';
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

/*
When you edit the pane and click submit, it will
run this.props.editPaneProp(this.props.unique, this.state.pinned)
which will run the editPane function in the Main component.

*/

class Pane extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
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
    render () {
        var items = this.props.items.split('·');
        var title = items[0].split('|')[0];
        var description = items[0].split('|')[1];

        console.log(title, description)
        //console.log(String.raw`${description}`, typeof description);
        return (
            <div className={`${items[0].split('|')[2]}`}>
                {this.state.editing ? <div>
                <button className="themedButton popOutEffect">✏️</button>
                <button className="themedButton popOutEffect">❌</button>
                <button className="themedButton popInEffect" onClick={this.onSubmit}>✅</button>
                </div> : <div>
                <button className="themedButton" onClick={this.onEdit}>✏️</button>
                <button className="themedButton" onClick={this.onDelete}>❌</button>
                {this.state.pinned ? <div id="pin">
                <button className="themedButtonClicked" onClick={this.unPin}>📌</button>
                </div> : <div id="pin">
                <button className="themedButton" onClick={this.onPin}>📌</button>
                </div>}
                </div>}
                {this.state.editing ? 
                <div>
                <h1 onInput={(event) => {this.onChange(event)}} contentEditable="true" suppressContentEditableWarning={true} className="title newp" dangerouslySetInnerHTML={{__html: title}}></h1>
                <p onInput={(event) => {this.onChange(event)}} contentEditable="true" suppressContentEditableWarning={true} className="description newp" dangerouslySetInnerHTML={{__html: description}}></p>
                </div> : <div onClick={(event) => {this.onEdit(event)}}>
                <ReactMarkdown className="title" rehypePlugins={[rehypeRaw]} children={title}></ReactMarkdown><ReactMarkdown className="description" rehypePlugins={[rehypeRaw]} children={description}></ReactMarkdown>
                </div>}
                </div>
        )
    }
}

export default Pane