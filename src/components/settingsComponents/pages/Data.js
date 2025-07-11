import React from 'react';
import { uploadDataToDB } from 'src/utils/databaseFuncs';

function Data() {
    async function addDatabaseConnection() {
        var connectionString = document.getElementById('databaseConnectionString').value;
        // remove slashes from the end to prevent errors
        if (connectionString[connectionString.length - 1] === '/') {
            connectionString = connectionString.slice(0, -1);
        }
        // TODO: For now, dbType is just 2 (using a super_secret_key)
        const dbType = 2;
        const password = document.getElementById('passwordForEncryptingDB').value;
        const user = document.getElementById('usernameForDB').value
        if (dbType === '1') {
            const response = await fetch(`${connectionString}/newuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user,
                    password: password
                }),
            });

            if (!response.ok) {
                alert(`Failed to create new user. Status: ${response.status} ${response.statusText}. Make sure your site is running.`);
            } else {
                var JWT = await response.json()
                JWT = JWT.token
                const newData = {
                    localItems: localStorage.getItem('localItems'),
                    localPinnedItems: localStorage.getItem('localPinnedItems')
                }
                await fetch(`${connectionString}/api/updatedata`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JWT}`,
                    },
                    body: JSON.stringify({
                        username: user,
                        password: password,
                        data: newData
                    }),
                });
                localStorage.setItem('databaseConnection', connectionString)
                localStorage.setItem('dbType', "usingjwt")
                localStorage.setItem('databaseUser', JSON.stringify([user, password]))
            }
        } else if (dbType === '2') {
            const super_secret_key = document.getElementById('superSecretKeyForDB').value;
            localStorage.setItem('SUPER_SECRET_KEY', super_secret_key)
            const newData = {
                localItems: localStorage.getItem('localItems'),
                localPinnedItems: localStorage.getItem('localPinnedItems')
            }
            localStorage.setItem('databaseConnection', connectionString)
            localStorage.setItem('dbType', "usingonekey")
            localStorage.setItem('databaseUser', JSON.stringify([user, password]))
            await uploadDataToDB(newData)
        }
    }

    function exportDataFile() {
        // USAGE OF AI + Me

        // Data you want to write to the file
        const localItems = localStorage.getItem('localItems');
        const localPinnedItems = localStorage.getItem('localPinnedItems');
        const data = localItems.length + "|" + localPinnedItems.length + "|" + localItems + localPinnedItems;

        // Create a new Blob object using the data
        const blob = new Blob([data], { type: 'text/plain' });

        // Create a link element
        const link = document.createElement("a");

        // Set the href attribute of the link to the blob URL
        link.href = URL.createObjectURL(blob);

        // Set the download attribute of the link to the desired file name
        link.download = "data.txt";

        // Programmatically click the link to trigger the download
        link.click();

        // Clean up by revoking the object URL
        URL.revokeObjectURL(link.href);
    }

    function exportBackupData() {
        // USAGE OF AI + Me

        // Data you want to write to the file
        const localItems = localStorage.getItem('backup');
        const localPinnedItems = localStorage.getItem('backupPinned');
        const data = localItems.length + "|" + localPinnedItems.length + "|" + localItems + localPinnedItems;

        // Create a new Blob object using the data
        const blob = new Blob([data], { type: 'text/plain' });

        // Create a link element
        const link = document.createElement("a");

        // Set the href attribute of the link to the blob URL
        link.href = URL.createObjectURL(blob);

        // Set the download attribute of the link to the desired file name
        link.download = "backup.txt";

        // Programmatically click the link to trigger the download
        link.click();

        // Clean up by revoking the object URL
        URL.revokeObjectURL(link.href);
    }

    function importDataFile(file) {
        if (file) {
            const reader = new FileReader();
            // Set up the onload callback
            reader.onload = function (e) {
                let result = e.target.result;
                let localItemsLength = parseInt(result.slice(0, result.indexOf('|')));
                // console.log(localItemsLength);
                // Remove that substring of the string
                result = result.slice(result.indexOf("|") + 1, result.length);
                let localPinnedItemsLength = parseInt(result.slice(0, result.indexOf('|')));
                // console.log(localPinnedItemsLength);
                // Remove that substring of the string
                result = result.slice(result.indexOf("|") + 1, result.length);
                let localItems = result.slice(0, localItemsLength);
                result = result.slice(localItemsLength, result.length);
                let localPinnedItems = result.slice(0, localPinnedItemsLength);
                // console.log(localItems);
                // console.log(localPinnedItems);
                localStorage.setItem('localItems', localItems);
                localStorage.setItem('localPinnedItems', localPinnedItems);
                // Force reload so user gets updated ata
                window.location.reload();
            };
            // Read the file as text
            reader.readAsText(file);
        }
    }

    return (
        <div id="settingsContent">
            <h1>Data</h1>
            <div>
                <h2>Connect Database (Experimental! Use caution.)</h2>
                <p>Clone <a href="https://github.com/ZarmDev/To-doz-Backend">To-doz-Backend</a> and then deploy it to any hosting provider.</p>
                <p>
                    <b>There are instructions on the repository for how to set it up.</b>
                    <br></br>
                    <b>NOTE:</b> For most hosting providers,
                    it will take ~50 seconds for the database to startup.
                    As a result, it can be very inconvenient to use.
                </p>
                <div id="dbForm">
                    <label for="connection">Your database site: </label>
                    <input id="databaseConnectionString" name="connection" type="text" placeholder="Enter a URL." required></input>
                    <br></br><label>Are you using: </label>
                    <select required>
                        <option>Default configuration</option>
                        <option disabled>JWT Tokens</option>
                    </select>
                    <br></br><label>Would you like to encrypt the database? (Unavailable) </label> <input type='checkbox' disabled></input>
                    <br></br>
                    <label name="usernameForDB">What's your username (only for JWT tokens) </label>
                    <input for="usernameForDB" id="usernameForDB" disabled></input>
                    {/* Only if encrypt checked */}
                    {/* TODO: Can't encrypt using passwords yet... */}
                    <br></br><label>What's your password (only for JWT tokens) </label>
                    <input id="passwordForEncryptingDB" disabled></input>
                    {/* Only if one key checked */}
                    <br></br><label>What's your SUPER_SECRET_KEY? (only for one key configuration) </label>
                    <input id="superSecretKeyForDB"></input>
                </div>
                <button className="longThemedButton" onClick={addDatabaseConnection}>Connect! (Be careful, you can not go back!)</button>
                <h2>Import/Export Data (note: your settings are not in the data)</h2>
                <label for="file">Import file (OVERRIDES CURRENT DATA)</label>
                <br></br>
                <input type="file" id="file" name="file" onChange={(e) => { importDataFile(e.target.files[0]) }} />
                <br></br>
                <br></br>
                <button className="longThemedButton"  onClick={exportDataFile}>Export data to file</button>
                <br></br>
                <br></br>
                <button className="longThemedButton"  onClick={exportBackupData}>Export backup data (incase you lost your data or had issues)</button>
            </div>
        </div>
    )
}

export default Data;