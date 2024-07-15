import React from "react";
import ChangeLog from "src/components/startupComponents/changeLog";
import BackupModal from "./backupComponents/backup";

function BackupScreen(props) {

    function next(shouldBackup) {
        if (shouldBackup) {
            const dbType = localStorage.getItem('dbType');
            // TODO: Use the global getDataFromSource function.
            // if (dbType === "localstorage") {
            //     localStorage.setItem('backup', localStorage.getItem('localItems'))
            //     localStorage.setItem('backupPinned', localStorage.getItem('localPinnedItems'))    
            // } else {

            // }
        }
        props.parentCallback()
    }
    return (
        <div>
            <div id="firstStartUpWindow">
                <div id="themes">
                </div>
                <div id="themeContainer">
                    <ChangeLog show={["CHANGELOG.md"]}></ChangeLog>
                    <BackupModal parentCallback={next}></BackupModal>
                </div>
            </div>
        </div>
    )
}

export default BackupScreen;