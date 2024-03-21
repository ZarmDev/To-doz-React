import React from 'react';

const introValue = `This is section, you can edit it by clicking on the text and you can delete it by clicking the X. Each section contains panes, which we will get to in a moment. Also, please note that the edit (pencil) button does nothing. In the future, you will be able to customize the section.`

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
            <div className="section" {...(this.props.unique === 0 ? { 'data-intro': introValue } : {})}>
                <p onBlur={this.onEdit} suppressContentEditableWarning={true} contentEditable="true">{this.props.section}</p>
                <button className="themedButton" onClick={this.handleChange} style={{left: 72 + '%'}}>➡️</button>
                {/* <button className="themedButton" onClick={this.onEdit}>✏️</button> */}
                <button className="themedButton" onClick={this.onDelete} style={{left: 87 + '%'}}>❌</button>
            </div>
        )
    }
}

export default Section