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
        this.props.deleteSectionProp(this.props.unique)
    }
    render () {
        var section = this.props.section
        return (
            <div className="section">
                <p>{this.props.section}
                <button onClick={this.handleChange}>➡️</button>
                <button onClick={this.onEdit}>✏️</button>
                <button onClick={this.onDelete}>❌</button>
                </p>
            </div>
        )
    }
}

export default Section