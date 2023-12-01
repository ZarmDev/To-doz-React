import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom/client';
import { marked } from 'marked';
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/*
When you edit the pane and click submit, it will
run this.props.editPaneProp(this.props.unique, this.state.pinned)
which will run the editPane function in the Main component.
*/

const Undo = ({ onUndo, closeToast }) => {
    const handleClick = () => {
        onUndo();
        closeToast();
    };

    return (
        <div>
            <h3>
                Pane deleted <button className="themedButton" onClick={handleClick}>UNDO</button>
            </h3>
        </div>
    );
};

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
        this.props.saveContentCallback(true);
        console.log(this.props.unsavedcontent);
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
        this.props.saveContentCallback(false);
        this.props.editPaneProp(this.props.unique, this.state.pinned)
        this.setState({
            editing: false
        })
    }
    onDelete = () => {
        toast(<Undo onUndo={() => this.props.undoDelete(this.props.unique, this.props.pinned)} />, {
            // hook will be called whent the component unmount
            // onClose: () => console.log('test')
        });
        this.props.deletePaneProp(this.props.unique, this.state.pinned)
    }
    onChange = (event) => {
        // Work in progress
    }
    render() {
        var items = this.props.items.split('·');
        var title = items[0].split('|')[0];
        var description = items[0].split('|')[1];

        return (
            <div className={`${items[0].split('|')[2]}`}>
                {this.state.editing ? <div>
                    {/* <button className="themedButton popOutEffect">✏️</button> */}
                    <button className="themedButton x-Button popOutEffect">❌</button>
                    <button className="themedButton popInEffect" onClick={this.onSubmit}>✅</button>
                </div> : <div>
                    {/* <button className="themedButton" onClick={this.onEdit}>✏️</button> */}
                    {this.state.pinned ? <div id="pin">
                        <button className="themedButtonClicked" onClick={this.unPin}>📌</button>
                    </div> : <div id="pin">
                        <button className="themedButton pin-Button" onClick={this.onPin}>📌</button>
                    </div>}
                    <button className="themedButton x-Button" onClick={this.onDelete}>❌</button>
                </div>}
                {this.state.editing ?
                    <div>
                        <h1 onInput={(event) => { this.onChange(event) }} contentEditable="true" suppressContentEditableWarning={true} className="title newp" dangerouslySetInnerHTML={{ __html: title }}></h1>
                        <p onInput={(event) => { this.onChange(event) }} contentEditable="true" suppressContentEditableWarning={true} className="description newp" dangerouslySetInnerHTML={{ __html: description }}></p>
                    </div> : <div onClick={(event) => { this.onEdit(event) }}>
                        <ReactMarkdown className="title" rehypePlugins={[rehypeRaw]} children={title}></ReactMarkdown><ReactMarkdown className="description" rehypePlugins={[rehypeRaw]} children={description}></ReactMarkdown>
                    </div>}
            </div >
        )
    }
}

export default Pane