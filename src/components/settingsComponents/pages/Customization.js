import Checkbox from "../components/Checkbox";

function Customization() {
    return (
        <div id="settingsContent">
            <h1>Customization</h1>
            <div>
                <h2>Sidebar</h2>
                {/* localValue: the "name" for localstorage */}
                <p>NOTE: must reload to have this take effect.</p>
                <Checkbox localValue={'sidebarIsAlwaysOpen'} labelValue={'Permanently open sidebar?'}/>
            </div>
        </div>
    );
}

export default Customization;