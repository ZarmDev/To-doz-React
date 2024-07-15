import React, { useEffect, useState } from "react";
import MarkdownComponent from "../MarkdownComponent";

function ChangeLog(props) {
    const [readme, setReadMe] = useState('');
    const [changelog, setChangeLog] = useState('');

    useEffect(() => {
        const url = 'https://raw.githubusercontent.com/ZarmDev/To-doz-React/main/README.md'
        fetch(url, {
            headers: {
                'Content-Type': 'text/plain'
            }
        })
            .then(response => response.text())
            .then(data => {
                setReadMe(data)
            })
        const url2 = 'https://raw.githubusercontent.com/ZarmDev/To-doz-React/main/CHANGELOG.md'
        fetch(url2, {
            headers: {
                'Content-Type': 'text/plain'
            }
        })
            .then(response => response.text())
            .then(data => {
                setChangeLog(data)
            })
    }, [])


    return (
        <div id="changeLogWindow">
            {props.show.includes('README.md') ? 
            <MarkdownComponent data={readme} fileName="README.md" /> : <></>}
            {props.show.includes('CHANGELOG.md') ? 
            <MarkdownComponent data={changelog} fileName="CHANGELOG.md" />
            : <></>}
        </div>
    )
}

export default ChangeLog;