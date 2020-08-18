import React from 'react';
import SettingsProfile from './Settings/SettingsProfile';
import SettingsChangePassword from './Settings/SettingsChangePassword';
import SettingsSubscription from './Settings/SettingsSubscription';
import * as CustomJS from '../custom.js';

const MenuItems = [
    {
        name: "Profile"
    }, {
        name: "Change Password"
    }, {
        name: "Subscription"
    }
]

const Tabs = [
    <SettingsProfile/>,
    <SettingsChangePassword/>,
    <SettingsSubscription/>
]

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndexTabSettings: 0,
        }
    }

    componentDidMount() {
        CustomJS.addListenerOnResizeSettings();
    }

    componentWillUnmount(){
        CustomJS.removeListenerOnResizeSettings();
    }

    updateTabIndex(index){
        this.setState({activeIndexTabSettings: index});
    }

    render(){
        return <div className="settings-page-wrapper flex-column flex-sm-row" id="settings-page-wrapper">
        {/*  Left sidebar on the Settings page
        (with menu:Profile,Change Password,Subscription)  */}
        <div className="settings-sidebar" id="settings-sidebar">
            <p className="settings-sidebar-title text-center text-sm-left">account</p>
            <ul className="settings-sidebar-list">
                {MenuItems.map((e,i) => (<li key={i} 
                onClick={() => this.updateTabIndex(i)}
                className={`settings-tab ${this.state.activeIndexTabSettings === i ? "active" : ''}`}>{e.name}</li>))}
            </ul>
        </div>{/* end of settings-sidebar */}

        {/*  Settings page main content(tabs)  */}
        <div className="settings-main-content">
            <div id="settings-tab-info" className="settings-tab-info">
                {Tabs[this.state.activeIndexTabSettings]}
            </div>
        </div>{/* end of settings-main-content */}
    </div>
    }
}

export default Settings;