import Checkbox from "../components/Checkbox";

function Customization() {
    return (
        <div id="settingsContent">
            <h1>Customization</h1>
            <div>
                <h2>Sidebar</h2>
                {/* localValue: the "name" for localstorage */}
                <p>Please reload for the changes to take effect.</p>
                <Checkbox localValue={'sidebarIsAlwaysOpen'} labelValue={'Permanently open sidebar?'}/>
            </div>
        </div>
    );
}

export default Customization;