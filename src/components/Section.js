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
        var section = this.props.section
        return (
            <div className="section">
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