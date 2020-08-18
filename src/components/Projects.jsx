
import React from "react";
import {Link} from "react-router-dom";
// import  { Redirect } from 'react-router-dom'
import CreateProject from './CreatProject';
import * as CustomJS from '../custom.js';
import Popup from 'reactjs-popup';
// import API from '../API.js';
import Loader from 'react-loader-spinner';
import DeleteModal from "./DeleteModal";
import ReactNotification from 'react-notifications-component'

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
    selectProjects,selectProjectsItems, selectProjectsIsLoading, selectIsDeleted,selectIsDeleting
  } from '../reselect/Projects';
  import { fetchProjectsStartAsync, deleteProjectStartAsync, setDeletedToFalse } from '../redux/Projects/ProjectsActions';
class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deleted: false,
            deletedProjectName: ''
        }
        this.loginModalRef = React.createRef();
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

    async componentDidMount() {
        await this.getProjectList();
        // CustomJS.addListenerOnResizeProj()
  
    }

    componentWillUnmount(){
        CustomJS.removeListenerOnResizeProj();
    }
    componentDidUpdate(prevProps) {

        //DID UPDATE
        if(!this.props.isLoading && this.loginModalRef.current && this.props.projectItems.length <= 0) {
            this.loginModalRef.current.openModal();
        }
     
        
        if(this.notificationDOMRef.current && this.props.isDeleted && this.state.deletedProjectName) {
            this.addNotification('success', 'Success', `${this.state.deletedProjectName} project successfully deleted`)
        }
    }

    // checkForCreatedProjects(){
    //     API.projects().checkForCreatedProjects()
    //     .then(res => {
    //         if(!res.data)
    //         this.loginModalRef.current.openModal();
    //     })
    // }

    async getProjectList(){
        await this.props.fetchProjectsStartAsync();
    }

    isStageRecruiting(e){
        {if(e.Stage===2){
                                                        
            return ([
                <>
                {this.props.isDeleted}
                    <p className="proj-one-categ">
        <span className="proj-categ-number">{e.NewApplicant}</span>New Applicants</p>
    <p className="proj-one-categ">
        <span className="proj-categ-number">{e.PhoneScreen}</span>Phone Interview</p>
    <p className="proj-one-categ">
        <span className="proj-categ-number">{e.OnlineInterview}</span>Online Interview</p>
    <p className="proj-one-categ">
        <span className="proj-categ-number">{e.OnSiteInterview}</span>Personal Meeting</p>
        <p className="proj-one-categ">
        <span className="proj-categ-number">{e.ReferenceCheck}</span>Reference Check</p>
        <p className="proj-one-categ">
        <span className="proj-categ-number">{e.Offer}</span>Job-Offer</p>
        <p className="proj-one-categ">
        <span className="proj-categ-number">{e.Hired}</span>Hired</p>
                </>
            ]);
        }}
    }
    async deleteProject(id,name){
        this.setState({deletedProjectName: name})
      await this.props.deleteProjectStartAsync(id);

    }

    render() {
    
        if(this.props.isLoading){
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
        
        if(this.props.projectItems.length===0){
            // console.log('0 project items')
            var mainbody = 
                <div className="flex-container">
    <div className="inner-element" style={{fontSize: '22px', fontWeight: 'bold'}}>No Projects</div>

<div className="inner-element">You have no projects yet. It's time to create your first project!</div>
<div className="inner-element create-proj-right">
                        <CreateProject 
                        onCreate={
                            (id, name)=> {
                                if(id)
                                {
                                    this.props.history.push(`/sourcing/${id}/createsourcing/`);
                                }
                            }
                        
                        }
                        ></CreateProject>
                    </div>
</div>;
        }
        else {
            // console.log('many project items')
            var mainbody = <div className="table-wrapper" id="table-wrapper">
            <table className="create-proj-table">
                <thead>
                    <tr>
                        <td></td>
                        <td className="table-proj-name-header">Project Name<i className="fa fa-caret-down" aria-hidden="true"></i>
                            <i className="fa fa-caret-up" aria-hidden="true"></i>
                        </td>
                        <td>Owner</td>
                        <td>Shared with</td>
                        <td className="table-created-header">Created<i className="fa fa-sort" aria-hidden="true"></i>
                        </td>
                        <td className="table-modified-header">Modified<i className="fa fa-sort" aria-hidden="true"></i>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {this
                        .props
                        .projectItems
                        .map((e) =>  {
                        // console.log('event', e.Id)
                        return (    <tr key={e.Id}>
                        
                        <td className="flag-td">
                                <i className="fa fa-bookmark-o" aria-hidden="true"></i>
                            </td>
                            <td className="proj-name-title">
                                <Link key={e.Id} to={"/projects/" + e.Id} className="proj-name-title-top">{e.Name}</Link>
                                <div className="proj-categ">
                                    <p className="proj-one-categ">
                                        <span className="proj-categ-number">{e.New}</span>New Candidates</p>
                                    <p className="proj-one-categ">
                                        <span className="proj-categ-number">{e.Uncontacted}</span>Uncontacted</p>
                                    <p className="proj-one-categ">
                                        <span className="proj-categ-number">{e.Contacted}</span>Contacted</p>
                                    <p className="proj-one-categ">
                                        <span className="proj-categ-number">{e.Replied}</span>Replied</p>
                                        {this.isStageRecruiting(e)}
                                    
                                </div>
                            </td>
                            <td>
                                <p className="top-row-user-circle">
                                    <span className="top-row-user-letters">{e.OwnerName}</span>
                                </p>
                            </td>
                            <td></td>
                            <td className="creation-date">{e.CreateDate}</td>
                            <td className="modif-date">{e.UpdateDate}</td>
                            <td className="create-proj-menu">
                                

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
                                        <span href="#">Edit</span>
                                        <DeleteModal
                                            onDelete={() => this.deleteProject(e.Id,e.Name)}
                                            message={`Are you sure you want to delete ${e.Name} Project?`}
                                            title='Delete Project'>
                                        </DeleteModal>
                                    </div>
                                </Popup>
                            </td>
    
                            </tr>)
                     
                        }
                        )}
                </tbody>
            </table>
        </div>;
        }

        return (

            <div>
                <ReactNotification ref={this.notificationDOMRef} />
                <div className="create-proj-row" id="create-proj-row"> 
                    <div className="create-proj-left">
                        <p className="total-proj">Total Projects: 
                            <span className="total-proj-number">{this.props.projectItems.length}</span>
                        </p>
                        <input hidden
                            type="text"
                            id="proj-search"
                            placeholder="Search a project"
                            title="Type in a name"/>
                        <select hidden className="create-proj-menu">
                            <option value="0">All active projects</option>
                            <option value="1">Bookmarked</option>
                        </select>
                    </div>
                    <div className="create-proj-right">
                        <CreateProject 
                        onCreate={(id, name)=> 
                            {
                                if(id)
                                {
                                    this.props.history.push(`/sourcing/${id}/createsourcing/`);
                                }
                        }}
                        ref={this.loginModalRef}></CreateProject>
                    </div>
                </div>

                <div className="main-content" id="projects-main-content">
                    {mainbody}
                </div>
            </div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    projects: selectProjects,
    projectItems : selectProjectsItems,
    isLoading: selectProjectsIsLoading,
    isDeleted: selectIsDeleted,
    isDeleting: selectIsDeleting
  });

  const mapDispatchToProps = dispatch => ({
    fetchProjectsStartAsync: () => dispatch(fetchProjectsStartAsync()),
    deleteProjectStartAsync: id => dispatch(deleteProjectStartAsync(id)),
    setDeletedToFalse: () => dispatch(setDeletedToFalse())
  });

export default connect(mapStateToProps, mapDispatchToProps)(Projects);