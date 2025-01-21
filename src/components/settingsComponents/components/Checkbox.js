import { useState } from "react";

function Checkbox(props) {
    const [checked, setChecked] = useState(localStorage.getItem(props.localValue) == "true");

    const handleChange = (event) => {
        setChecked(event.target.checked);
        localStorage.setItem(props.localValue, event.target.checked);
    };

    return (
        <div>
            <label htmlFor={props.localValue}>{props.labelValue}</label>
            <input
                checked={checked}
                onChange={handleChange}
                name={props.localValue}
                type="checkbox"
            />
        </div>
    )
}

export default Checkbox;