// import React from 'react';
// import {Redirect} from 'react-router-dom';
// import ReactNotification from 'react-notifications-component';
// import Loader from 'react-loader-spinner';
// import {domain} from '../API.js';
// // import Creatable from 'react-select/creatable';

// class Login extends React.Component {
//   constructor (props) {
//     super (props);

//     this.state = {
//       errMessage: '',
//       isLoading: false,

//     };

//     this.addNotification = this.addNotification.bind (this);
//     this.notificationDOMRef = React.createRef ();
//     this.handleSubmit = this.handleSubmit.bind (this);

//   }

//   isUserLogedIn () {
//     if (localStorage.getItem ('Token') === null) {
//       return false;
//     }
//     return true;
//   }

//   addNotification (type, title, message) {
//     this.notificationDOMRef.current.addNotification ({
//       title: title,
//       message: message,
//       type: type,
//       insert: 'top',
//       container: 'top-right',
//       animationIn: ['animated', 'fadeIn'],
//       animationOut: ['animated', 'fadeOut'],
//       dismiss: {duration: 5000},
//       dismissable: {click: true},
//     });
//   }

// async locationReload () {
//   await setTimeout(function(){window.location.reload()}, 1000);
// }


//   handleSubmit (event) {
//     event.preventDefault ();
//     //loader
//     this.setState ({
//       isLoading: true,
//       errMessage: ''
//     });
//     var data = new FormData (event.target);
//     data.set ('grant_type', 'password');
//     fetch (`${domain}/Token`, {
//       method: 'POST',
//       body: 'grant_type=password&username=' +
//         data.get ('username') +
//         '&password=' +
//         data.get ('password'),
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     })
//       .then (res => {

//         if (res.status === 200) {
//             // this.setState ({
//             //     isLoading: true,
//             //     errMessage: ''
//             //   });
              
 
//           res.json ().then (obj => {
//             localStorage.setItem ('Token', obj.access_token);

            
    
//           }).then(this.locationReload())
//         } else {
//             this.setState({
//                 errMessage: 'Invalid Username or Password',
//                 isLoading: false,
//             },()=>{ console.log(this.state)})
//           this.addNotification (
//             'danger',
//             'Error!',
//             'Invalid Username or Password'
//           );
//           console.log(this.state)
//         }
//       })
//       .catch (err => console.log (err));
//   }
//   // shouldComponentUpdate(nextProps, nextState) {
//   //   if(!this.state.isLoading && nextState.isLoading) {
//   //     return true
//   //   }
//   //   if(!this.state.isLoading && !nextState.isLoading) {
//   //     return true
//   //   }
//   //   }
  
//   render () {
//     if (this.state.isLoading) {
//       return (
  
//         <div class="login-outer">
//         <ReactNotification ref={this.notificationDOMRef} />
//         <div className="login-wrapper">
    
//           <div className="login-title">Sign in to Hireeex</div>
//           <div className="login-main">
           
//             <Loader type="Bars" color="#0089FF" height="60" width="60" />
//           </div>
 
//         </div>
//       </div>
          
       
//       );
//     }
//     if (this.isUserLogedIn ()) {
//       return <Redirect to="/" />;
//     }
//     return (
//       <div class="login-outer">
//         <ReactNotification ref={this.notificationDOMRef} />
//         <div className="login-wrapper">
    
//           <div className="login-title">Sign in to Hireeex</div>
//           <div className="login-main">
//             <form onSubmit={this.handleSubmit}>
//               <div className="login-form login-form-padding">
//                 <div className="seperator-container" />
//                 <div className="login-input-error" />
//                 <div className="login-input-group position-relative form-group">
//                   <input
//                     id="username"
//                     name="username"
//                     type="text"
//                     placeholder=""
//                     required=""
//                   />
//                   <label>Email</label>
//                 </div>
//                 <div className="login-input-group position-relative form-group">
//                   <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     placeholder=""
//                     required=""
                 
//                   />
//                   <label>Password</label>
//                 </div>
//                 {/* <div className="text-right">
//                                     <button type="button" className="login-forgot-pass">Forgot password?</button>
//                                 </div> */}
//                 <button type="submit" className="login-submit-btn">
//                   Log in
//                 </button>
//                 {/* <p className="text-center">
//                                     <span className="dont-have-account">Don't have an account?</span>
//                                     <button type="button" className="login-sign-up">Sign Up</button>
//                                 </p> */}
//               </div>
//             </form>
           
//           </div>
//           {/* <Loader type="Bars" color="#0089FF" height="60" width="60" /> */}
//         </div>
//       </div>
//     );
//   }
// }

// export default Login;


import React from 'react';
import {Redirect} from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import Loader from 'react-loader-spinner';
import {domain} from '../API.js';
// import Creatable from 'react-select/creatable';

class Login extends React.Component {
  constructor (props) {
    super (props);

    this.state = {
      errMessage: '',
      isLoading: false,

    };

    this.addNotification = this.addNotification.bind (this);
    this.notificationDOMRef = React.createRef ();
    this.handleSubmit = this.handleSubmit.bind (this);

  }

  isUserLogedIn () {
    if (localStorage.getItem ('Token') === null) {
      return false;
    }
    return true;
  }

  addNotification (type, title, message) {
    this.notificationDOMRef.current.addNotification ({
      title: title,
      message: message,
      type: type,
      insert: 'top',
      container: 'top-right',
      animationIn: ['animated', 'fadeIn'],
      animationOut: ['animated', 'fadeOut'],
      dismiss: {duration: 5000},
      dismissable: {click: true},
    });
  }

async locationReload () {
  await setTimeout(function(){window.location.reload()}, 1000);
}


  handleSubmit (event) {
    event.preventDefault ();
    //loader
  
    var data = new FormData (event.target);
    data.set ('grant_type', 'password');
    fetch (`${domain}/Token`, {
      method: 'POST',
      body: 'grant_type=password&username=' +
        data.get ('username') +
        '&password=' +
        data.get ('password'),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then (res => {

        if (res.status === 200) {
            this.setState ({
                isLoading: true,
                errMessage: ''
              });
              
 
          res.json ().then (obj => {
            localStorage.setItem ('Token', obj.access_token);

            
    
          }).then(this.locationReload())
        } else {
            this.setState({
                errMessage: 'Invalid Username or Password',
                isLoading: false,
            },()=>{ console.log(this.state)})
          this.addNotification (
            'danger',
            'Error!',
            'Invalid Username or Password'
          );
          console.log(this.state)
        }
      })
      .catch (err => alert('API ERROR'));
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   if(!this.state.isLoading && nextState.isLoading) {
  //     return true
  //   }
  //   if(!this.state.isLoading && !nextState.isLoading) {
  //     return true
  //   }
  //   }
  
  render () {
    if (this.state.isLoading) {
      return (
  
        <div class="login-outer">
        <ReactNotification ref={this.notificationDOMRef} />
        <div className="login-wrapper">
    
          <div className="login-title">Sign in to Hireeex</div>
          <div className="login-main">
           
            <Loader type="Bars" color="#0089FF" height="60" width="60" />
          </div>
 
        </div>
      </div>
          
       
      );
    }
    if (this.isUserLogedIn ()) {
      return <Redirect to="/" />;
    }
    return (
      <div class="login-outer">
        <ReactNotification ref={this.notificationDOMRef} />
        <div className="login-wrapper">
    
          <div className="login-title">Sign in to Hireeex</div>
          <div className="login-main">
            <form onSubmit={this.handleSubmit}>
              <div className="login-form login-form-padding">
                <div className="seperator-container" />
                <div className="login-input-error" />
                <div className="login-input-group position-relative form-group">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder=""
                    required=""
                  />
                  <label>Email</label>
                </div>
                <div className="login-input-group position-relative form-group">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder=""
                    required=""
                 
                  />
                  <label>Password</label>
                </div>
                {/* <div className="text-right">
                                    <button type="button" className="login-forgot-pass">Forgot password?</button>
                                </div> */}
                <button type="submit" className="login-submit-btn">
                  Log in
                </button>
                {/* <p className="text-center">
                                    <span className="dont-have-account">Don't have an account?</span>
                                    <button type="button" className="login-sign-up">Sign Up</button>
                                </p> */}
              </div>
            </form>
           
          </div>
          {/* <Loader type="Bars" color="#0089FF" height="60" width="60" /> */}
        </div>
      </div>
    );
  }
}

export default Login;
