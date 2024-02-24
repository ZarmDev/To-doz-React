import React from 'react';

class Grades extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.exitTool = this.exitTool.bind(this)
    }
    exitTool() {
        this.props.exitTool()
    }
    render() {
        return (
            <div className="tool" id="grades">
                <h1>Grade Suggesting</h1>
                <label for="inputgrade">Input your grades is any format:</label>
                <br></br>
                <br></br>
                <input name="inputgrade" id="jupiterUser" type="text"></input>
                <input type="submit" value="Submit"></input>
                <button className="themedButton exitToolButton" onClick={this.exitTool}>❌</button>
            </div>
        )
    }
}

export default Grades;