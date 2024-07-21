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
                console.log(JWT);
                const newData = {
                    localItems: localStorage.getItem('localItems'),
                    localPinnedItems: localStorage.getItem('localPinnedItems')
                }
                const response2 = await fetch(`${connectionString}/api/updatedata`, {
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
                        <option>Normal configuration (one key configuration)</option>
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
                <button onClick={addDatabaseConnection}>Connect! (Be careful, you can not go back!)</button>
                <h2>Import/Export JSON (coming soon)</h2>
            </div>
        </div>
    )
}

export default Data;