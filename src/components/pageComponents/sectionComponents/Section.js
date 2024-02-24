import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ReactDOM from 'react-dom/client';

class Section extends React.Component {
    constructor(props) {
        super(props)
    }
    handleChange = () => {
        // needed here
        this.props.goToSectionProp(this.props.section)
    }
    onEdit = () => {
        // this.props.unique not needed here, just for reference
        this.props.editSectionProp(this.props.unique)
    }
    onDelete = () => {
        // this.props.unique not needed here, just for reference
        this.props.deleteSectionProp()
    }
    render () {
        return (
            <div className="section" data-intro={`This is section, you can edit it by clicking on the text and you can delete it by clicking the X. Each section contains panes, which we will get to in a moment. Also, please note that the edit (pencil) button does nothing. In the future, you will be able to customize the section.`}>
                <p onBlur={this.onEdit} suppressContentEditableWarning={true} contentEditable="true">{this.props.section}</p>
                <br></br>
                <button className="themedButton" onClick={this.handleChange}>➡️</button>
                <button className="themedButton" onClick={this.onEdit}>✏️</button>
                <button className="themedButton" onClick={this.onDelete}>❌</button>
            </div>
        )
    }
}

export default Section