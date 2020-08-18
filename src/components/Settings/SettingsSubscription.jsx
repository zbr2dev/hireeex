import React from 'react';

class SettingsSubscription extends React.Component {

    
    render(){
        return(
            <div >
                {/*  SUBSCRIPTION DETAILS  */}
                <div className="subscription-detail">
                    <div className="row">
                        <div className="subscr-tab-title col-sm-12">Subscription Details</div>
                    </div>{/*  end of row */}
                    <div className="row">
                        <div className="col-sm-12">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td>Current Subscription:</td>
                                        <td>Business</td>
                                    </tr>
                                    <tr>
                                        <td>Subscription Status:</td>
                                        <td>Active</td>
                                    </tr>
                                    <tr>
                                        <td>Creation Date:</td>
                                        <td>2020</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>{/*  end of col-sm-12 */}
                    </div>{/*  end of row */}
                    {/* <div className="row">
                        <div className="text-center col-sm-12">
                            <a className="change-subscr-btn" role="button" href="/subscription">Change Subscription</a>
                        </div>
                    </div>{/*  end of row */}
                </div>{/* end of subscription-detail */}


                {/*  AVAILABILITY  */}
                <div className="availability">
                    <div className="row">
                        <div className="subscr-tab-title col-sm-12">Service Availability</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td>Contact Information:</td>
                                        <td>10000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>{/*  end of col-sm-12 */}
                    </div>{/*  end of row */}
                </div>{/* end of availability  */}

            </div>
        )
    }
}

export default SettingsSubscription;