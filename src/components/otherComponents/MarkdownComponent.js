import React from 'react';
import ReactMarkdown from "react-markdown";

function MarkdownComponent(props) {
    return (
        <div>
            <div className="markdown markdownBehind">
                <div>
                    <span>{props.fileName}</span>
                </div>
                <ReactMarkdown children={props.data}></ReactMarkdown>
            </div>
            <div className="markdown">
                <div>
                    <span>{props.fileName}</span>
                </div>
                <ReactMarkdown children={props.data}></ReactMarkdown>
            </div>
        </div>
    )
}

export default MarkdownComponent;