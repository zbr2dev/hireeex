import React from "react";
import {Link, withRouter} from "react-router-dom";

const SideBarMenu = (props) => <div>
    <ul id="main-menu">
        <li className="main-menu-item main-menu-first-item">
            <Link to={"/"}>
                <span>HIREEEX</span>
            </Link>
        </li>
            <li
                className={`main-menu-item ${props.location.pathname === "/projects" ? 
                "main-menu-item-active" : ''}` } >
                <Link to={"/projects"}>
                    <i className="fa fa-search" aria-hidden="true"></i>
                    <span>Talent Sourcing</span>
                </Link>
            </li>
            <li
                className={`main-menu-item ${props.location.pathname === "/toolbox" ? 
                "main-menu-item-active" : ''}` } >
                <Link to={"/toolbox"}>
                    <i className="fa fa-trello" aria-hidden="true"></i>
                    <span>Boolean String</span>
                </Link>
            </li>
            <li
                className={`main-menu-item ${props.location.pathname === "/settings" ? 
                "main-menu-item-active" : ''}` } >
                <Link to={"/settings"}>
                    <i className="fa fa-cog" aria-hidden="true"></i>
                    <span>Settings</span>
                </Link>
            </li>
    </ul>
</div>;

export default withRouter(SideBarMenu);