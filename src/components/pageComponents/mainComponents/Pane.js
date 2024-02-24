import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
    keyboard: {
        bindings: {
            tab: false,
            custom: {
                key: 13,
                shiftKey: true,
                handler: function () { /** do nothing */ }
            },
            handleEnter: {
                key: 13,
                handler: function () { /** do nothing */ }
            }
        }
    },
};

/*
When you edit the pane and click submit, it will
run props.editPaneProp(props.unique, pinned)
which will run the editPane function in the Main component.
*/

// var quillEditor = new Quill('#editor-container', {
//     modules: {
//         toolbar: tools
//     },
//     theme: 'snow'
// });

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
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
// const formats = [
//     'header',
//     'font',
//     'size',
//     'bold',
//     'italic',
//     'underline',
//     'strike',
//     'blockquote',
//     'list',
//     'bullet',
//     'indent',
//     'link',
//     'image',
//     'video',
// ]
const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'align',
    'link', 'image', 'background', 'color', 'emoji'
];

function Pane(props) {
    const [editing, setEditing] = useState(false);
    const [pinned, setPinned] = useState(false);
    var items = props.items.split('·');
    const [title, setTitle] = useState(items[0].split('|')[0]);
    const [description, setDescription] = useState(items[0].split('|')[1]);

    // Will run every time props.items is updated
    useEffect(() => {
        if (items[0].split('|')[0] == '' && items[0].split('|')[1] == '') {
            setEditing(true)
        }
    }, [props.items]);

    function onEdit(event) {
        setEditing(true)
        props.saveContentCallback(true);
        // props.editPaneProp(props.unique)
    }
    function onPin(event) {
        setPinned(true)
        // props.pinProp(props.unique)
    }
    function unPin(event) {
        setPinned(false)
        // props.unPinProp(props.unique)
    }
    // Button for changing text
    function onSubmit() {
        props.saveContentCallback(false);
        props.editPaneProp(props.unique, pinned, [title, description])
        setEditing(false)
    }
    function onDelete() {
        props.deletePaneProp(props.unique, pinned);
    }

    return (
        <div className={`${items[0].split('|')[2]}`}>
            {editing ? <div className="paneToolbar">
                <button className="themedButton popInEffect" onClick={onSubmit}>✅</button>
            </div> : <div data-intro={`This is a pane. You can edit it by clicking on the title or description. You can also pin it to the toolbar by clicking the pin button.`}>
                {/* <button className="themedButton" onClick={onEdit}>✏️</button> */}
                {pinned ? <div id="pin">
                    <button className="themedButtonClicked" onClick={unPin}>📌</button>
                </div> : <div id="pin">
                    <button className="themedButton pin-Button" onClick={onPin}>📌</button>
                </div>}
                <button className="themedButton x-Button" onClick={onDelete}>❌</button>
            </div>}
            {editing ?
                <div>
                    <div className='title'>
                        <p onInput={(event) => { console.log('test'); setTitle(event.target.innerHTML) }} contentEditable="true" suppressContentEditableWarning={true} dangerouslySetInnerHTML={{ __html: title }}></p>
                        {/* <ReactQuill modules={modules} formats={formats} value={title} theme="snow" /> */}
                    </div>
                    <div className='description'>
                        <ReactQuill onChange={setDescription} modules={modules} formats={formats} value={description} theme="snow" />
                    </div>
                    {/* <h1 contentEditable="true" suppressContentEditableWarning={true} className="title newp" dangerouslySetInnerHTML={{ __html: title }}></h1>
                    <p contentEditable="true" suppressContentEditableWarning={true} className="description newp" dangerouslySetInnerHTML={{ __html: description }}></p> */}
                </div> : <div onClick={(event) => { onEdit(event) }}>
                    <ReactMarkdown className="title" rehypePlugins={[rehypeRaw]} children={title}></ReactMarkdown><ReactMarkdown className="description" rehypePlugins={[rehypeRaw]} children={description}></ReactMarkdown>
                </div>}
        </div >
    )
}

export default Pane