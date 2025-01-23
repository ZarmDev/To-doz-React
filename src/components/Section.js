import React from 'react';

function Section(props) {
    function handleChange() {
        // needed here
        props.goToSectionProp(props.section)
    }
    function onEdit() {
        // this.props.unique not needed here, just for reference
        props.editSectionProp(props.unique)
    }
    function onDelete() {
        // this.props.unique not needed here, just for reference
        props.deleteSectionProp()
    }
    return (
        <div className="section">
            {props.editing ? <p onBlur={onEdit} suppressContentEditableWarning={true} contentEditable="true">{props.section}</p> : <p>{props.section}</p>}
            <button className="themedButton" onClick={handleChange} style={{ left: '72%' }}>➡️</button>
            {/* <button className="themedButton" onClick={this.onEdit}>✏️</button> */}
            <button className="themedButton" onClick={onDelete} style={{ left: '87%' }}>❌</button>
        </div>
    )
}

export default Section;