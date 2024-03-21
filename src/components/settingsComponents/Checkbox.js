import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../redux/store';

function Checkbox(props) {
    const dispatch = useDispatch();
    // Goes into the store and checks if it's checked
    const checked = useSelector((state) => {
        // console.log(props.localValue, state.sidebar);
        return state.sidebar[props.localValue]
    });

    const handleChange = (event) => {
        localStorage.setItem(props.localValue, event.target.checked);
        dispatch(toggleSidebar(event.target.checked));
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