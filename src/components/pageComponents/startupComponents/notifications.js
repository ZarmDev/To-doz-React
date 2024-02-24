import React from "react";

function ApiKeys(props) {
    return (
        <div id="notifications" className="fadeInEffect">
            <h1>Notification settings:</h1>
            <p>Do you want to have notifications for when you complete focus sessions and other features?
                (completly optional, and will not affect any features ^_^)
            </p>
            <button onClick={props.allowNotifications} className="bigThemedButton">Allow notifications</button>
        </div>
    )
}

export default ApiKeys;