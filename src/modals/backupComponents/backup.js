import React, { useEffect } from "react";

function BackupModal(props) {
    useEffect(() => {
        document.getElementById('changeLogWindow').style.width = 'auto';
        document.getElementById('themeContainer').style = `width: 100vw;
        height: 100vh;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 50px;`
    }, [])
    return (
        <div id="backupModal">
            <h1>A new version has arrived!</h1>
            <h2>Would you like to:</h2>
            <button id="backupData" className="themedButton" onClick={() => {props.parentCallback(true)}}>Backup your data</button>
            <button id="XbackupData" className="themedButton" onClick={() => {props.parentCallback(false)}}>Not backup your data</button>
            <p><b>How is it backed up?</b> <br></br>
                The data is backed up in a seperate key in your localstorage.
                Generally, I backup my data every update, but, it depends on
                how important the data is and if you trust the developer to
                not break the app 😅
                It will take TWICE the storage it originally took which will
                probably be ~35 mb for a user with a lot of sections.
                <b>What if I'm using the database feature?</b>
                Then you definitely want to backup your data incase anything
                happens.
            </p>
        </div>
    )
}

export default BackupModal;