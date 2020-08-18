import React from 'react';
import Popup from 'reactjs-popup';
import * as CustomJS from '../custom.js';
import {Link, withRouter} from 'react-router-dom';

import {connect} from 'react-redux';
import {getUserStartAsync} from '../redux/User/userActions';
import {createStructuredSelector} from 'reselect';
import {selectUserData} from '../reselect/User.js';

class TopNavBar extends React.Component {
  constructor (props) {
    super (props);
    this.getHistoryBar = this.getHistoryBar.bind (this);
  }

  getUserData () {
    this.props.getUserStartAsync ();
  }

  componentDidMount () {
    this.getUserData ();
    CustomJS.addListenerOnResizeSearch ();
    document
      .getElementById ('top-row-search')
      .addEventListener ('click', () => {
        document.getElementById ('top-row-search').classList.add ('hidden');
      });
  }
  componentWillUnmount () {
    CustomJS.removeListenerOnResizeSearch ();
  }

  logOut () {
    localStorage.removeItem ('Token');
    window.location.reload ();
  }

  getHistoryBar () {
    const pathName = window.location.pathname;
    if (
      pathName === '/projects' ||
      pathName === '/'
    )
      return (
        <p className="top-row-breadcrumbs">
          <Link to="/projects">Projects</Link>
        </p>
      );
    if (pathName === '/settings')
      return (
        <p className="top-row-breadcrumbs">
          <Link to={"/settings"}>Settings</Link>
        </p>
      );
      if (pathName === '/toolbox')
      return (
        <p className="top-row-breadcrumbs">
          <Link to={"/toolbox"}>Toolbox</Link>
        </p>
      );
  }

  render () {
    return (
      <div id="top-row">
        <div className="top-row-left">
          {/*  Hamburger-menu  */}
          <div
            className="hamburger"
            id="nav-icon3"
            onClick={() => CustomJS.hamburgerClick ()}
          >
            <div id="nav-icon3">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          {/*  Breadcrums  */}
          {this.getHistoryBar ()}
        </div>
        {/*  end of top-row-left */}

        {/*  Search form  */}
        <div className="top-row-icons-wrapper">

          {/* <div className="top-row-icon-item top-row-dialogue">
    <i className="fa fa-comments" aria-hidden="true"></i>
</div>

<div className="top-row-icon-item top-row-question">
    <i className="fa fa-question-circle" aria-hidden="true">
        <span className="red-circle"></span>
    </i>
    <div className="icon-item-hidden-menu question-hidden-menu">
        <ul>
            <li>
                <a href="#" className="question-hidden-menu-link">help center</a>
            </li>
            <li>
                <a href="#" className="question-hidden-menu-link">what's new
                    <span className="red-circle"></span>
                </a>
            </li>
        </ul>
    </div>
</div>
<div className="top-row-icon-item top-row-bell">
    <i className="fa fa-bell" aria-hidden="true"></i>
    <div className="icon-item-hidden-menu bell-hidden-menu">
        <p>No notifications</p>
    </div>
</div> */}

          {/*  USER CIRCLE ICON  */}
          <div className="top-row-icon-item top-row-user">

            <Popup
              trigger={
                <div className="menu-item">
                  <p className="top-row-user-circle">
                    <span className="top-row-user-letters">
                      {this.props.userData.ShortName}
                    </span>
                  </p>
                </div>
              }
              position="bottom center"
              on="click"
              closeOnDocumentClick
              mouseLeaveDelay={300}
              mouseEnterDelay={0}
              contentStyle={{padding: '20px', border: 'none'}}
              arrow={false}
            >
              <div className="menu">
                <div className="menu-item user-hidden-menu-name">
                  {this.props.userData.Name}
                </div>
                <div className="menu-item user-hidden-menu-email">
                  {this.props.userData.Email}
                </div>
                <div className="menu-item text-right">
                  <button
                    onClick={this.logOut}
                    className="user-hidden-menu-logout"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </Popup>
          </div>{/* end of top-row-user */}
          {/* <input
          hidden
          type="text"
          id="top-row-search"
          //onKeyUp="myFunction()"
          placeholder="Search by candidates or projects"
          title="Type in a name"
        /> */}

        </div>{/* end of top-row-icons-wrapper */}
        <input
          hidden
          type="text"
          id="top-row-search"
          //onKeyUp="myFunction()"
          placeholder="Search by candidates or projects"
          title="Type in a name"
        />
        {' '}
        {/*  Block with few icons(dialogue, question, bell, user name in circle)  */}

      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector ({
  userData: selectUserData,
});

const mapDispatchToProps = dispatch => ({
  getUserStartAsync: () => dispatch (getUserStartAsync ()),
});

export default connect (mapStateToProps, mapDispatchToProps) (
  withRouter (TopNavBar)
);
