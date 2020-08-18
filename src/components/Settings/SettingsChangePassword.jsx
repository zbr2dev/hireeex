import React from 'react';
import API from '../../API.js';
import ReactNotification from 'react-notifications-component'

const initialState = {
    oldPass : "",
    newPass : "",
    newPassConfirm : "",
}

class SettingsChangePassword extends React.Component {
    constructor(props){
        super(props);

        this.state = initialState;

        this.addNotification = this.addNotification.bind(this);
        this.notificationDOMRef = React.createRef();
    }

    addNotification(type, title, message) {
        this.notificationDOMRef.current.addNotification({
          title: title,
          message: message,
          type: type,
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 3000 },
          dismissable: { click: true }
        });
      }

    changePassword(){
        if(this.state.newPass !== this.state.newPassConfirm){
            alert("New Pass and Confirm New Pass must match");
            return;
        }

        var body = {
            OldPassword: this.state.oldPass,
            NewPassword: this.state.newPass,
            ConfirmPassword: this.state.newPassConfirm,
        }

        console.log(body);

        API.user().changePassword(body).then(res => {
            // console.log(res);
            if(res.status===400){
                this.addNotification("warning", "Warning", "Current password is Wrong password");
                return;
            }
            this.setState(initialState);
            this.addNotification("success", "Success", "Settings updated successfully");
        })
        .catch(() => this.addNotification("warning", "Oops!", "Something went wrong"))
    }

    render(){
        return(
            <div className="settings-tab-password">
                <ReactNotification ref={this.notificationDOMRef} />
                <form>
                    <div className="form-group">
                        <label className="">Current Password</label>
                        <input value={this.state.oldPass} onChange={(e) => this.setState({oldPass: e.target.value})} name="currentPassword" placeholder="********" type="password" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label className="">New Password</label>
                        <input value={this.state.newPass} onChange={(e) => this.setState({newPass: e.target.value})} name="password" placeholder="********" type="password" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label className="">Confirm New Password</label>
                        <input value={this.state.newPassConfirm} onChange={(e) => this.setState({newPassConfirm: e.target.value})} name="confirmedPassword" placeholder="********" type="password" className="form-control" />
                    </div>
                    <div className="form-group">
                        <ul className="settings-tab-password-list">
                            <li className="text-success">Contain at least 8 characters</li>
                            <li className="text-danger">Passwords must match</li>
                            <li>Have at least one uppercase letter</li>
                            <li>Have at least one lowercase letter</li>
                            <li>Have at least one number</li>
                            <li>Have at least one special character (!, #, $, %, &amp;, etc.)</li>
                        </ul>
                    </div>
                    <div className="row text-sm-center">
                        <div className="col-sm-12 col-md-6">
                            <button type="button" onClick={() => this.changePassword()} className="change-pass-btn">Change Password</button>
                        </div>
                        {/* <div className="col-sm-12 col-md-6 text-center text-md-left">
                            <button className="forgot-pass-btn">Forgot password?</button>
                        </div> */}
                    </div>
                </form>
            </div>
        )
    }
}

export default SettingsChangePassword;