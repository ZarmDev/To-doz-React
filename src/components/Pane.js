import React, { useEffect, useState, memo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// remember to change .ql-editor>* if you change this value
const defaultFontValue = '20px';

// thanks to https://stackoverflow.com/users/5551593/andrew in https://stackoverflow.com/questions/38623716/how-to-add-custom-font-sizes-to-quilljs-editor
const fontSizeArr = ['8px', '9px', '10px', '12px', '14px', '16px', '20px', '24px', '32px', '42px', '54px', '68px', '84px', '98px'];
var Size = Quill.import('attributors/style/size');
Size.whitelist = fontSizeArr;
Quill.register(Size, true);

// thanks to https://stackoverflow.com/questions/43728080/how-to-add-font-types-on-quill-js-with-toolbar-options
const fontFamilyArr = ["Sans Serif", "monospace", "Roboto Condensed", "Times New Roman", "Calibri", "Calibri Light", "Sans-Serif"];
let fonts = Quill.import("attributors/style/font");
fonts.whitelist = fontFamilyArr;
Quill.register(fonts, true);

// thanks to https://stackoverflow.com/questions/42068335/quill-js-color-textbox
const modules = {
    toolbar: {
        container: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': fontFamilyArr }],
            [{ 'size': fontSizeArr }],
            [{ 'align': [] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }, { 'background': [] }, 'link', 'emoji'],
        ],
        handlers: {
            'color': function (value) {
                if (value == 'custom-color') value = window.prompt('Enter Hex Color Code');
                this.quill.format('color', value);
            }
        }
    },
    // pretty cool custom key bindings
    // keyboard: {
    //     bindings: {
    //         tab: false,
    //         custom: {
    //             key: 13,
    //             shiftKey: true,
    //             handler: function () {  }
    //         }
    //     }
    // },
};

/*
When you edit the pane and click submit, it will
run props.editPaneProp(props.unique, pinned)
which will run the editPane function in the Main component.
*/

// customize the color tool handler
// quillEditor.getModule('toolbar').addHandler('color', (value) => {

//     // if the user clicked the custom-color option, show a prompt window to get the color
//     if (value == 'custom-color') {
//         value = prompt('Enter Hex/RGB/RGBA');
//     }

//     quillEditor.format('color', value);
// });

// const modules = {
//     toolbar: [
//         [{ header: '1' }, { header: '2' }, { font: [] }],
//         [{ 'size': fontSizeArr }],
//         ['bold', 'italic', 'underline', 'strike'],
//         [{ 'color': ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color'] }],
//         [
//             { list: 'ordered' },
//             { list: 'bullet' },
//             // { indent: '-1' },
//             // { indent: '+1' },
//         ],
//         ['link', 'image', 'video'],
//         ['clean'],
//     ],
//     clipboard: {
//         // toggle to add extra line breaks when pasting HTML:
//         matchVisual: false,
//     },
// }
const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'align',
    'link', 'image', 'background', 'color', 'emoji'
];

function Pin() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pin"><path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" /></svg>
    )
}

function Trash() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
    )
}

function Pane(props) {
    const [editing, setEditing] = useState(false);
    const pinned = props.pinned;
    var items = props.items.split('·');
    // to save memory/runtime
    var splitup = items[0].split('|');
    var title = splitup[0];
    const [description, setDescription] = useState(splitup[1]);
    var attributes = splitup[2];

    function onEdit() {
        setEditing(true)
        props.saveContentCallback(true);
        props.editPaneProp(props.unique, pinned, description)
    }
    function onPin() {
        // setPinned(true)
        props.pinProp(props.unique)
    }
    function unPin() {
        // setPinned(false)
        props.unPinProp(props.unique)
    }
    // Button for changing text
    function onSubmit() {
        props.saveContentCallback(false);
        // it's [null, description] because it used to have title
        props.editPaneProp(props.unique, pinned, description)
        setEditing(false)
    }
    function onDelete() {
        props.deletePaneProp(props.unique, pinned);
    }

    return (
        <div className={attributes}>
            {editing ? <div className="paneToolbar">
                <button className="themedButton popInEffect" onClick={onSubmit}>✅</button>
            </div> : <div className="paneToolbar">
                {pinned ? <div className="themedButtonClicked pinButton" onClick={unPin}><Pin>📌</Pin></div> :
                    <div className="themedButton pinButton" onClick={onPin}><Pin>📌</Pin></div>}
                <div className="themedButton x-Button" onClick={onDelete}><Trash></Trash></div>
            </div>}
            {editing ?
                <div>
                    <p className="title" contentEditable="true" suppressContentEditableWarning={true} dangerouslySetInnerHTML={{ __html: title }}></p>
                    {/* <ReactQuill modules={modules} formats={formats} value={title} theme="snow" /> */}
                    <div className='description'>
                        {/* THE ONLY WAY REACT QUILL GETS A DEFAULT FONT-SIZE IS WITH THIS STYLE TRICK */}
                        <ReactQuill style={{ fontSize: defaultFontValue }} onChange={setDescription} modules={modules} formats={formats} value={description} theme="snow" />
                    </div>
                    {/* <h1 contentEditable="true" suppressContentEditableWarning={true} className="title newp" dangerouslySetInnerHTML={{ __html: title }}></h1>
                    <p contentEditable="true" suppressContentEditableWarning={true} className="description newp" dangerouslySetInnerHTML={{ __html: description }}></p> */}
                </div> : <div onClick={(event) => { onEdit(event) }}>
                    <p className='title' dangerouslySetInnerHTML={{ __html: title }}></p>
                    {/* THE ONLY WAY REACT QUILL GETS A DEFAULT FONT-SIZE IS WITH THIS STYLE TRICK */}
                    <p className='description' style={{ fontSize: defaultFontValue }} dangerouslySetInnerHTML={{ __html: description }}></p>
                    {/* <ReactMarkdown className="title" rehypePlugins={[rehypeRaw]} children={title}></ReactMarkdown>
                    <ReactMarkdown className="description" rehypePlugins={[rehypeRaw]} children={description}></ReactMarkdown> */}
                </div>}
        </div >
    )
}

export default memo(Pane);