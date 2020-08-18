import React from 'react';

import SidebarMenu from './SideBarMenu';
import TopNavBar from './TopNavBar';
import  { Redirect } from 'react-router-dom'


class Root extends React.Component {

    isUserLoggedIn(){
      return localStorage.getItem('Token') === null ? false : true;
    }

    render(){
      if(!this.isUserLoggedIn()) {
        return <Redirect to="/login" />
      }
        return(
            <div id="body">
      <SidebarMenu />
      
      <main id="main-tag">
        <TopNavBar/>
        {this.props.children}
      </main>
      </div>
        )
    }
}

export default Root;