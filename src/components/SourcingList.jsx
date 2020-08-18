import React from 'react';
import {Link, withRouter} from "react-router-dom";
import API from '../API.js';
import * as CustomJS from '../custom.js';
import Loader from 'react-loader-spinner';
import Modal from 'react-modal';
import Popup from 'reactjs-popup';
import ReactNotification from 'react-notifications-component'
import DeleteModal from './DeleteModal';

Modal.setAppElement('#root');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class SourcingList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tasks : [],
            projectId : this.props.match.params.id,

            isOngoingSourcing: true,
            isLoading: true,
            sourceMoreId: null,
            sourceMoreCount: 0,
            modalIsOpen : []
        }

        this.openModal = this
            .openModal
            .bind(this);
        this.afterOpenModal = this
            .afterOpenModal
            .bind(this);
        this.closeModal = this
            .closeModal
            .bind(this);

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
          dismiss: { duration: 5000 },
          dismissable: { click: true }
        });
      }

    openModal(id) {
        this.setState({modalIsOpen : {
            [id] : true,
        }});
        this.setState({
            sourceMoreId: id,
            sourceMoreCount: 50
        });
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed. this.subtitle.style.color =
        // '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
        this.setState({
            sourceMoreId: null,
            sourceMoreCount: 0
        });
    }

    sourceMore(){
        API.sourcing().sourceMore(this.state.sourceMoreId,this.state.sourceMoreCount)
        .then(res => {
            if(res.status===200) {
                this.addNotification('success','Success','Sourcing new candidates was started');
                this.closeModal();
            }
            else{
                this.addNotification('danger','Oops!','Something went wrong');
            }
            this.getTasksList();
        })
    }

    getTasksList(){
        API.sourcing().getAllSourcings(this.state.projectId)
            .then(res => {
               this.setState({tasks: res.data, isLoading: false}, () => {
                    CustomJS.addListenerOnResizeSourcList();
                    let isOngoing = false;
                    res.data.map((task,i) => {
                        if(task.Status<2)
                            isOngoing = true;
                    })
                    if(isOngoing){
                        setTimeout(() => this.getTasksList(), 3000);
                    }
                });
            })
            .catch(err => {
                var obj = [{
                    Id: 1,
                    UserShortName: "TM",
                    Name: "SomeText",
                    Status: 1,
                    PeopleSearched: 0,
                    Analyzed: 50,
                    Sourced: 50,
                    Goal: 50,
                    CreateDate: "adasdad"
                }];
                var objs = [obj,obj,obj,obj];
                this.setState({tasks: objs, isLoading: false}, () => CustomJS.addListenerOnResizeSourcList());
            })
    }

    componentDidMount(){
        this.getTasksList();
    }
    componentWillUnmount(){
        CustomJS.removeListenerOnResizeSourcList();
    }

    deleteSourcing(id,name){
        API.sourcing().deleteSourcing(id)
            .then(() => {
                this.getTasksList();
                this.addNotification('success','Success',`${name} AI Task successfully deleted`);
            });
    }
    

    render(){
        if(this.state.isLoading){
            return(
               <div id="loader">
               <Loader 
            type="Bars"
            color="#0089FF"
            height="60"	
            width="60"
         />   
         </div>
            );
          }
          
          const allCandidates = this.state.tasks.map((task) => {
            return task.Id
        }).join('&')
        console.log(this.state.tasks)

        return(
            
            <div className="search-page-wrapper">
                <ReactNotification ref={this.notificationDOMRef} />
            <div className="main-content main-content-search">
                <div className="sourcing-list-links">
                    <div className="sourcing-list-links-box">
                        <Link to={`/projects/sourcing/${allCandidates}/candidates`}>Candidates{allCandidates}</Link>
                        <Link>Sourcing</Link>
                        <Link>Project Details</Link>
                    </div>
                </div>
                <p className="ai-search" id="ai-search"> Sourcing Tasks</p>
                <div className="search-wrapper" id="search-wrapper">
                    {this.state.tasks.map((task,i) => 
                    <div key={i} className="search-info">
                        <div className="search-top">
                            <p className="search-position">{task.Name}</p>
                            <div className="search-progress-wrapper">
                                {/* <button className="stop-task-btn">Click to stop AI Task</button> */}
                                <div className="progress search-progress" style={{display : (task.Status===2) ? 'none' : ''}}>
                                    <div className="progress-bar progress-bar-striped progress-bar-yellow" role="progressbar" style={{width : '40%'}}>Initialized</div>
                                    <div className="progress-bar progress-bar-striped progress-bar-green" 
                                    role="progressbar" style={{width : '30%', display : (task.Status > 0) ? 'block' : 'none'}}>Sourcing On-going</div>
                                </div>
                            </div>

                            <div className="search-inner-info">
                                <p className="search-date">{task.CreateDate}</p>
                                <p className="search-time"></p>
                                <p className="search-user-circle">
                                    <p className="top-row-user-circle"><span className="top-row-user-letters">{task.UserShortName}</span></p>
                                </p>
                            </div>
                        </div>{/* end of search-top  */}
                        <div className="search-main">
                            <table className="search-table">
                                <thead>
                                    <tr>
                                        <td>Status</td>
                                        {/* <td>People searched</td> */}
                                        <td>People Analyzed</td>
                                        <td>Sourced</td>
                                        <td>Goal</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="sourcing-cell">{task.Status===0 ? "Initializing" : task.Status===1 ? "Sourcing" : "Completed"  }</td>
                                        {/* <td>{task.PeopleSearched}</td> */}
                                        <td>{task.Analyzed}</td>
                                        <td>{task.Sourced}</td>
                                        <td>{task.Goal}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="search-btns-wrapper">
                                <div key={task.Id} className="search-btns-wrapper-left">
                                    <Link to={`/projects/sourcing/${task.Id}/candidates`}><button className="search-one-btn">Show Candidates</button></Link>
                                    <button onClick={this.openModal.bind(this, task.Id)} className="search-one-btn">Search More</button>
                                    <Modal className="createProjModal"
                                        portalClassName="ReactModalPortal modalPortalCreateProj "
                                        isOpen={this.state.modalIsOpen[task.Id]}
                                        onAfterOpen={this.afterOpenModal}
                                        onRequestClose={this.closeModal}
                                        style={customStyles}
                                        contentLabel="Example Modal">
                                        <div
                                            className="remodal"
                                            data-remodal-id="modal"
                                            role="dialog"
                                            aria-labelledby="modal1Title"
                                            aria-describedby="modal1Desc">
                                            {/*  TOP ROW OF "CREATE PROJECT" POPUP  */}
                                            <div className="create-proj-top-row">
                                                <p>Source More</p>
                                                <button
                                                    onClick={this.closeModal}
                                                    data-remodal-action="close"
                                                    className="remodal-close create-proj-close"
                                                    aria-label="Close"></button>
                                            </div>
                                            {/*  MAIN PART OF "CREATE PROJECT" POPUP */}
                                            <div className="create-proj-main">
                                                <div className="create-proj-info-wrapper">
                                                    <div className="create-proj-info-item">
                                                        <div className="create-proj-block select-arrow" style={{marginBottom: 0}}>
                                                            <p className="create-proj-info-label">Choose new candidates count to search</p>
                                                            <select onChange={(e) => {this.setState({sourceMoreCount: e.target.value})}} className="create-proj-select">
                                                                <option value="50">50</option>
                                                                <option value="100">100</option>
                                                                <option value="150">150</option>
                                                                <option value="200">200</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>{/*  end of create-proj-main  */} {/*  BOTTOM ROW OF "CREATE PROJECT" POPUP  */}
                                            <div className="create-proj-bottom-buttons ">
                                                <button onClick={this.closeModal} className="create-proj-btn create-proj-back-btn">Back</button>
                                                <button onClick={() => this.sourceMore()} className="create-proj-btn create-proj-create-btn">Source</button>
                                            </div>{/*  end of remodal-bottom-buttons  */}
                                        </div>
                                    </Modal>
                                    <button onClick={() => this.props.history.push(`/sourcing/${this.state.projectId}/createsourcing/${task.SourcingHistoryId}`)} className="search-one-btn">Create a Similar Task</button>
                                    {/* <button className="search-one-btn">Task details</button> */}
                                </div>
                                <div className="create-proj-menu">
                                <Popup
                                                trigger={
                                                    <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                                                }
                                                        position="bottom center"
                                                        on="click"
                                                        closeOnDocumentClick
                                                        closeOnEscape
                                                        mouseLeaveDelay={300}
                                                        mouseEnterDelay={0}
                                                        contentStyle={{ padding: "20px", border: "none" }}
                                                        arrow={false}
                                            >
                                                <div className="create-proj-menu-hidden">
                                                    <DeleteModal
                                                        onDelete={() => this.deleteSourcing(task.Id,task.Name)}
                                                        message={`Are you sure you want to delete ${task.Name} AI Task?`}
                                                        title='Delete AI Task'>
                                                    </DeleteModal>
                                                </div>
                                            </Popup>
                                            </div>
                            </div>{/* end of search-btns-wrapper  */}
                        </div>{/* end of search-main  */}
                    </div>
                    )}{/* end of search-info  */}
                    <Link to={`/sourcing/${this.props.match.params.id}/createsourcing/`}><span className="create-task">+ Create an AI Sourcing Task</span></Link>
                </div>{/* end of search-wrapper  */}
            </div>{/* end of main-content */}
        </div>
        )
    }
}

export default SourcingList;