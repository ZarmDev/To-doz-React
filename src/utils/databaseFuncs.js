// useDatabase: true or false
// NOTE: usingjwt didn't fix it, still broken
export async function getDataFromSource(dbType) {
    // if (dbType === "localstorage" || dbType == null) {
    //     let itemsFromStorage = JSON.parse(localStorage.getItem('localItems'));
    //     let pinnedItemsFromStorage = JSON.parse(localStorage.getItem('localPinnedItems'));
    //     // // wait a second, if itemsFromStorage is empty that's a suspicous bug.. why am I filtering it then.
    //     // if (itemsFromStorage[0] == '') {
    //     //   itemsFromStorage = []
    //     // }
    //     // // this makes sense, if the pinned split is just an empty array, there are no pinned panes.
    //     // if (pinnedItemsFromStorage[0] == '') {
    //     //   pinnedItemsFromStorage = []
    //     // }
    //     return [itemsFromStorage, pinnedItemsFromStorage]
    // } else 
    if (dbType === "usingjwt") {
        const connectionString = localStorage.getItem('databaseConnection')
        const [user, password] = JSON.parse(localStorage.getItem('databaseUser'))
        const response = await fetch(`${connectionString}/signin`, {
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
            alert("Failed to fetch database, using localstorage instead.")
            getDataFromSource(false)
        } else {
            const super_secret_key = localStorage.getItem('SUPER_SECRET_KEY')
            const connectionString = localStorage.getItem('databaseConnection')
            const response2 = await fetch(`${connectionString}/api/getdata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${super_secret_key}`,
                },
                body: JSON.stringify({
                    username: user,
                    password: password
                }),
            });
            var data = await response2.json()
            data = data["data"]
            return [data["localItems"], data["localPinnedItems"]]
        }
    } else if (dbType === "usingonekey") {
        const connectionString = localStorage.getItem('databaseConnection')
        const [user, password] = JSON.parse(localStorage.getItem('databaseUser'))
        const super_secret_key = localStorage.getItem('SUPER_SECRET_KEY')
        var res = null;
        try {
            res = await fetch(`${connectionString}/api/getdata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${super_secret_key}`,
                },
                // body: JSON.stringify({
                //     username: user,
                //     password: password
                // }),
            });
            var data = await res.json();
            data = data["data"]
            var pinnedItems = data["localPinnedItems"];
            var items = data["localItems"]
            console.log(items);
            console.log(pinnedItems);
            return [JSON.parse(items), JSON.parse(pinnedItems)]
        } catch {
            try {
                return [false, res.statusText]
            } catch {
                return [false, "Unknown error. Either the server is offline or something is wrong. Maybe check server logs?"]
            }
        }
    }
}

export async function uploadDataToDB(newData) {
    const databaseConnection = localStorage.getItem('databaseConnection');
    const SUPER_SECRET_KEY = localStorage.getItem('SUPER_SECRET_KEY');
    // console.log(`${databaseConnection}/api/updatedata`)
    try {
        const response2 = await fetch(`${databaseConnection}/api/updatedata`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPER_SECRET_KEY}`,
            },
            body: JSON.stringify({
                data: newData
            }),
        });
        if (response2) {
            return true
        }
    } catch {
        return false
    }
    // console.log('response done')
    // if (!response2.ok) {
    //     alert(`Failed to update data. Status: ${response2.status} ${response2.statusText}. Make sure your site is running.`);
    // }
}

export async function uploadDataToSource(newData, dbType) {
    if (dbType === 'localStorage') {
        localStorage.setItem('localItems', newData["localItems"])
        localStorage.setItem('localPinnedItems', newData["localPinnedItems"])
    } else if (dbType === 'usingonekey') {
        // console.log(newData, 'test')
        uploadDataToDB(newData)
    }
}

export function getDataFromLocalStorage() {
    let itemsFromStorage = JSON.parse(localStorage.getItem('localItems'))
    let pinnedItemsFromStorage = JSON.parse(localStorage.getItem('localPinnedItems'))
    return [itemsFromStorage, pinnedItemsFromStorage]
}