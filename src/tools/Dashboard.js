import React, { useState, useEffect, memo } from 'react';
// import Calendar from 'react-calendar';
import CustomPieChart from 'src/components/CustomPieChart';
import { Exit } from 'src/components/SvgIcons';

// HELP OF AI
function getSizeOfAllLocalStorage() {
    let totalSize = 0;

    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            // JavaScript strings are UTF-16, so each character is 2 bytes
            totalSize += (key.length + localStorage[key].length) * 2;
        }
    }

    const sizeInMB = (totalSize / (1024 * 1024));

    return sizeInMB.toFixed(2) == 0 ? sizeInMB.toFixed(5) : sizeInMB.toFixed(2);
}

// HELP OF AI
function getSizeOfLocalStorageKey(keyName) {
    const item = localStorage.getItem(keyName);
    if (!item) return "0.00"; // Return 0 if key doesn't exist
    
    let totalSize = 0;
    // JavaScript strings are UTF-16, so each character is 2 bytes
    totalSize += (keyName.length + item.length) * 2;

    const sizeInMB = (totalSize / (1024 * 1024));

    return sizeInMB.toFixed(2) == 0 ? sizeInMB.toFixed(5) : sizeInMB.toFixed(2);
}

// Use memo to ensure that it doesn't get rerendered along with the elapsed time
const StorageBreakdown = memo(function StorageBreakdown() {
    const [sizeOfLocalStorage, setSizeOfLocalStorage] = useState();

    useEffect(() => {
        setSizeOfLocalStorage(getSizeOfAllLocalStorage());
    })

    const itemSize = parseFloat(getSizeOfLocalStorageKey('localItems'));
    const pinSize = parseFloat(getSizeOfLocalStorageKey('localPinnedItems'));
    var otherSize = parseFloat(sizeOfLocalStorage) - itemSize - pinSize;
    // If it's really small just let it be zero
    otherSize = otherSize < 0.001 ? 0 : otherSize;
    
    const data = [
        { name: 'Items', value: itemSize, color: '#0088FE' },
        { name: 'Pinned Items', value: pinSize, color: '#00C49F' },
        { name: 'Settings/Other Data', value: otherSize, color: '#FF8042' }
    ];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <CustomPieChart data={data}></CustomPieChart>
            {data.map((item, idx) => {
                return <p key={idx} style={{color: item.color}}>{item.name} ({item.value} MB)</p>;
            })}
            <p>Total LocalStorage size: {sizeOfLocalStorage} MB</p>
            <p>Note that "Other data" contains data from other sites hosted on my GitHub that use localstorage</p>
        </div>
    );
});

function Dashboard(props) {
    const [elapsed, setElapsed] = useState(null);
    const [productivityStatus, setProductivityStatus] = useState({});

    // const handleDayClick = (date) => {
    //     // Toggle productivity status for the selected date
    //     const updatedStatus = { ...productivityStatus };
    //     updatedStatus[date.toDateString()] = !updatedStatus[date.toDateString()];
    //     setProductivityStatus(updatedStatus);
    // };

    // Initialization
    useEffect(() => {
        setElapsed(performance.now())
        // Just to set a interval to update the elapsed time, not to actually change it
        setInterval(() => {
            setElapsed(performance.now())
        }, 1000)
    }, []);

    function exitTool() {
        props.exitTool()
    }

    let totalSeconds = elapsed / 1000;
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds = Math.floor(totalSeconds % 60);

    return (
        <div id="dashboard" className='tool'>
            <button className="themedButton exitToolButton" onClick={exitTool}><Exit></Exit></button>
            <p>Elapsed time since you opened To-doz: {hours} hours, {minutes} minutes and {seconds} seconds</p>
            <StorageBreakdown></StorageBreakdown>
            {/* <h1 className='text-center'>Productivity Calendar</h1>
            <div className='calendar-container'>
                <Calendar onChange={handleDayClick} value={new Date()} />
            </div>
            <p className='text-center'>
                <span className='bold'>Selected Date:</span> {new Date().toDateString()}
            </p>
            {Object.keys(productivityStatus).map((date) => (
                <p key={date} className='text-center'>
                    {date}: {productivityStatus[date] ? 'Productive' : 'Not productive'}
                </p>
            ))} */}
        </div>
    )
}

export default Dashboard;