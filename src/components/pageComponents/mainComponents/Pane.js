import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { Editor } from '@tinymce/tinymce-react';

/*
When you edit the pane and click submit, it will
run props.editPaneProp(props.unique, pinned)
which will run the editPane function in the Main component.
*/

const config = {
    selector: '.title',
    menubar: false,
    inline: true,
    body_class: 'title',
    plugins: [
        'link', 'lists', 'powerpaste',
        'autolink', 'tinymcespellchecker'
    ],
    toolbar: [
        'undo redo | bold italic underline | fontfamily fontsize',
        'forecolor backcolor | alignleft aligncenter alignright alignfull | numlist bullist outdent indent'
    ],
    valid_elements: 'p[style],strong,em,span[style],a[href],ul,ol,li',
    valid_styles: {
        '*': 'font-size,font-family,color,text-decoration,text-align'
    },
    powerpaste_word_import: 'clean',
    powerpaste_html_import: 'clean',
}
const config2 = {
    selector: '.description',
    menubar: false,
    inline: true,
    body_class: 'description',
    plugins: [
        'link', 'lists', 'powerpaste',
        'autolink', 'tinymcespellchecker'
    ],
    toolbar: [
        'undo redo | bold italic underline | fontfamily fontsize',
        'forecolor backcolor | alignleft aligncenter alignright alignfull | numlist bullist outdent indent'
    ],
    valid_elements: 'p[style],strong,em,span[style],a[href],ul,ol,li',
    valid_styles: {
        '*': 'font-size,font-family,color,text-decoration,text-align'
    },
    powerpaste_word_import: 'clean',
    powerpaste_html_import: 'clean',
}

function Pane(props) {
    const [editing, setEditing] = useState(false);
    const [pinned, setPinned] = useState(false);

    const titleRef = useRef(null);
    const logTitle = () => {
        if (titleRef.current) {
            console.log(titleRef.current.getContent());
            return titleRef.current.getContent();
        }
    };

    const descriptionRef = useRef(null);
    const logDescription = () => {
        if (descriptionRef.current) {
            console.log(descriptionRef.current.getContent());
            return descriptionRef.current.getContent();
        }
    };

    // Will run every time props.items is updated
    useEffect(() => {
        let items = props.items.split('·')
        if (items[0].split('|')[0] == '' && items[0].split('|')[1] == '') {
            setEditing(true)
        }
    }, [props.items]);

    function onEdit(event) {
        setEditing(true)
        props.saveContentCallback(true);
        console.log(props.unsavedcontent);
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
    function onSubmit(event) {
        props.saveContentCallback(false);
        const textValue = [logTitle(), logDescription()];
        props.editPaneProp(props.unique, pinned, textValue)
        setEditing(false)
    }
    function onDelete() {
        props.deletePaneProp(props.unique, pinned);
    }
    var items = props.items.split('·');
    var title = items[0].split('|')[0];
    var description = items[0].split('|')[1];

    return (
        <div className={`${items[0].split('|')[2]}`}>
            {editing ? <div className="paneToolbar">
                <button className="themedButton popInEffect" onClick={onSubmit}>✅</button>
            </div> : <div>
                {/* <button className="themedButton" onClick={onEdit}>✏️</button> */}
                {pinned ? <div id="pin">
                    <button className="themedButtonClicked" onClick={unPin}>📌</button>
                </div> : <div id="pin">
                    <button className="themedButton pin-Button" onClick={onPin}>📌</button>
                </div>}
                <button className="themedButton x-Button" onClick={onDelete}>❌</button>
            </div>}
            {editing ?
                <div data-intro={`This is a pane. You can edit it by clicking on the title or description. You can also pin it to the toolbar by clicking the pin button.`}>
                    <div className='title'>
                    <Editor
                        onInit={(evt, editor) => titleRef.current = editor}
                        initialValue={title}
                        init={config}
                    />
                    </div>
                    <div className='description'>
                    <Editor
                        onInit={(evt, editor) => descriptionRef.current = editor}
                        initialValue={description}
                        init={config2}
                    />
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