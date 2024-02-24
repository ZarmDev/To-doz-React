import Checkbox from "../Checkbox";

function Customization() {
    return (
        <div id="settingsContent">
            <h1>Customization</h1>
            <div>
                <h2>Sidebar</h2>
                {/* localValue: the "name" for localstorage */}
                <Checkbox localValue={'sidebarIsAlwaysOpen'}/>
            </div>
        </div>
    );
}

export default Customization;