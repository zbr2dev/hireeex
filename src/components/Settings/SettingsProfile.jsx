import React from 'react';
import ReactNotification from 'react-notifications-component'
import API from '../../API.js';

class SettingsProfile extends React.Component {
    constructor(props){
        super(props);
        this.loadUserInfoDetails();
        this.state = {
            firstName: '',
            lastName: '',
            companyName: '',
            position: '',
            phone: '',
            email: '',
            firstName: '',
        }

        this.addNotification = this.addNotification.bind(this);
        this.notificationDOMRef = React.createRef();
    }

    componentDidMount() {
        this.loadUserInfoDetails();
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
          dismiss: { duration: 5000 },
          dismissable: { click: true }
        });
      }

    loadUserInfoDetails(){
        API.user().getUserInfo()
        .then(res => {
            console.log(res);
            this.setState({
                firstName: res.data.FirstName,
                lastName: res.data.LastName,
                companyName: res.data.CompanyName,
                position: res.data.Position,
                email: res.data.Email,
                phone: res.data.Phone,
            })
        })
    }

    updateUserInfo(){
        var body = {
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            CompanyName: this.state.companyName,
            Position: this.state.position,
            Email: this.state.email,
            Phone: this.state.phone, 
        };

        API.user().updateUserInfo(body)
        .then(() => this.addNotification("success", "Success", "Settings updated successfully"))
        .catch(() => this.addNotification("warning", "Oops!", "Something went wrong"));
    }

    render(){
        return(
            <div>
                <ReactNotification ref={this.notificationDOMRef} />
                <form>
                    <div className="row form-group">
                        <div className="first-name-row col-sm-12 col-md-6">
                            <label>First Name <span className="red-star">*</span></label>
                            <input onChange={(e) => this.setState({firstName: e.target.value})} name="firstname" placeholder="First Name" type="text" className="form-control" value={this.state.firstName} />
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <label className="">Last Name <span className="red-star">*</span></label>
                            <input onChange={(e) => this.setState({lastName: e.target.value})} name="lastname" placeholder="Last Name" type="text" className="form-control" value={this.state.lastName} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="">Title</label>
                        <input onChange={(e) => this.setState({position: e.target.value})} name="current_title" placeholder="Title" type="text" className="form-control" value={this.state.position} />
                    </div>

                    <div className="form-group">
                        <label className="">Company</label>
                        <input onChange={(e) => this.setState({companyName: e.target.value})} name="current_employer" placeholder="Company" type="text" className="form-control" value={this.state.companyName} />
                    </div>
                    <div className="form-group">
                        <label className="">Telephone</label>
                        <input onChange={(e) => this.setState({phone: e.target.value})} name="phone_number" placeholder="(8)-926-1245678" type="text" className="form-control" value={this.state.phone} />
                    </div>
                    <div className="form-group">
                        <label className="">Email </label>
                        <input onChange={(e) => console.log("'email can't be changed")} disabled name="email" placeholder="email" type="email" className="form-control" value={this.state.email} />
                    </div>
                    <div className="text-center text-md-right form-group form-group-save">
                        <button onClick={() => this.updateUserInfo()} className="settings-btn settings-next-btn" type="button">Save</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default SettingsProfile;