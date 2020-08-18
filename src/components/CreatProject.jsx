import React from 'react';
import Modal from 'react-modal';
import API from '../API.js';

import { connect } from "react-redux";
// import { createStructuredSelector } from "reselect";

import { addProjectStartAsync} from '../redux/Projects/ProjectsActions';

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

const initialState = {
    modalIsOpen: false,
    projectName: "",
    projectDescription: "",
    projectStages: "default",
    projectType: "default",
    activeTabIndex: 0
};

Modal.setAppElement('#root');

class CreateProject extends React.Component {
    constructor(props) {
        super(props);

        this.state = initialState;

        this.openModal = this
            .openModal
            .bind(this);
        this.afterOpenModal = this
            .afterOpenModal
            .bind(this);
        this.closeModal = this
            .closeModal
            .bind(this);
    }

    switchStages(selectedStage){
        switch(selectedStage){
            case "1":
                return ([
                    <div key={0} className="create-proj-chips-wrapper">
                                        <a href="#" className="create-proj-one-chip">New Candidates</a>
                                        <a href="#" className="create-proj-one-chip">Uncontacted</a>
                                        <a href="#" className="create-proj-one-chip">Contacted</a>
                                        <a href="#" className="create-proj-one-chip">Replied</a>
                                        
                                    </div>
                ])
            case "2":
            
                return ([
                                        <div key={1} className="create-proj-chips-wrapper">      
                                        <a href="#" className="create-proj-one-chip">New Candidates</a>
                                        <a href="#" className="create-proj-one-chip">Uncontacted</a>
                                        <a href="#" className="create-proj-one-chip">Contacted</a>
                                        <a href="#" className="create-proj-one-chip">Replied</a>
                                        <a href="#" className="create-proj-one-chip">New Applicants</a>
                                        <a href="#" className="create-proj-one-chip">Phone Interview</a>
                                        <a href="#" className="create-proj-one-chip">Online Interview</a>
                                        <a href="#" className="create-proj-one-chip">Personal Meeting</a>
                                        <a href="#" className="create-proj-one-chip">Reference Check</a>
                                        <a href="#" className="create-proj-one-chip">Job-Offer</a>
                                        <a href="#" className="create-proj-one-chip">Hired</a>
                                </div>
                            ]);
            case "default":
                return ([
                    <div key={2} className="create-proj-chips-wrapper"></div>
                ]);
        }
    }

    mySwitchFunction(tabIndex){
        switch (tabIndex) {
           case 0:
              return ([
                <div key={0} className="create-proj-info-item">
                <div className="create-proj-block">
                    <label className="create-proj-info-label" htmlFor="project-title">Project Title</label>
                    <input
                        onChange={(e) => this.setState({projectName: e.target.value})}
                        className="create-proj-info-input"
                        type="text"
                        id="project-title"
                        value={this.state.projectName}
                        placeholder="Add a Project Title"/>
                </div>
                <div className="create-proj-block">
                    <label className="create-proj-info-label" htmlFor="project-descrip">Project Description</label>
                    <textarea
                        onChange={(e) => this.setState({projectDescription: e.target.value})}
                        className="create-proj-info-input create-proj-info-textarea"
                        type="text"
                        value={this.state.projectDescription}
                        id="project-descrip"
                        placeholder="Add Project Description"></textarea>
                </div>
            </div>,
              ]);
              case 1:
                            return ([
                                <div key={2} className="create-proj-info-item">
                                    <p className="create-proj-select-label">Add Hiring Process Template</p>
                                    <select value={this.state.projectStages}
                                        onChange={(e) => this.setState({projectStages: e.target.value})}
                                        className="create-proj-select">
                                        <option value="default">Select a template</option>
                                        <option value="1">Sourcing Process</option>
                                        <option value="2">Recruiting Process</option>
                                    </select>

                                    {/*  Chips block  */}
                                    {(this.switchStages(this.state.projectStages))}
                                    {/* end of create-proj-chips-wrapper  */} {/*  Bus Request block */}
                                    {/* <div className="pro-request">
                                        <span className="pro-request-descrip">Create Hiring Process is not avaiable for your current plan.</span>
                                        <a className="pro-request-link" href="#">Request access to Hireeex Business</a>
                                    </div> */}
                                </div>,
                              ]); 
        }
     }

    nextTabAction(){
        if(this.state.activeTabIndex<1)
            this.setState({activeTabIndex : this.state.activeTabIndex + 1});
        else
            this.createNewProject();
    }

    backTabAction(){
        if(this.state.activeTabIndex>0)
            this.setState({activeTabIndex : this.state.activeTabIndex - 1});
        else
            this.closeModal();
    }

    async createNewProject() {
    
        
        const input = {
            Name: this.state.projectName, 
            Description: this.state.projectDescription,
            Stage: this.state.projectStages,
            Type: this.state.projectType
        };
        this.props.addProjectStartAsync(input)
        API.projects().createProject(input)
        .then(res => {
            // console.log('then props')
                this.props.onCreate(res.data.ID, this.state.projectName); 
                this.closeModal(); 
                this.reset();
            }
            );
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    reset() {
        this.setState(initialState);
    }

    afterOpenModal() {
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    

    render() {
        return (
            <div>
                <button onClick={this.openModal} className="create-proj-btn">Create a Project</button>
                <Modal className="createProjModal"
                    portalClassName="ReactModalPortal modalPortalCreateProj "
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal">
                    <div
                        className="remodal create-proj-remodal"
                        data-remodal-id="modal"
                        role="dialog"
                        aria-labelledby="modal1Title"
                        aria-describedby="modal1Desc">
                        {/*  TOP ROW OF "CREATE PROJECT" POPUP  */}
                        <div className="create-proj-top-row">
                            <p>Create a Project</p>
                            <button
                                onClick={this.closeModal}
                                data-remodal-action="close"
                                className="remodal-close create-proj-close"
                                aria-label="Close"></button>
                        </div>
                        {/*  MAIN PART OF "CREATE PROJECT" POPUP */}
                        <div className="create-proj-main">
                            {/*  Block with steps  */}
                            <div className="create-proj-steps-wrapper">
                                <div
                                className={`create-proj-one-step ${this.state.projectName.trim()=="" ? '' 
                                : " create-proj-one-step-finished"} ${this.state.activeTabIndex===0 ? " create-proj-one-step-current" : ''}`}>
                                    <span className="step-number">1</span>
                                    <i className="fa fa-check" aria-hidden="true"></i>
                                    <span className="step-name">Basics</span>
                                </div>
                                <div
                                    className={`create-proj-one-step ${this.state.projectStages=="default" ? '' 
                                    : " create-proj-one-step-finished"} 
                                    ${this.state.activeTabIndex===1 ? " create-proj-one-step-current" : ''}`}>
                                    <span className="step-number">2</span>
                                    <i className="fa fa-check" aria-hidden="true"></i>
                                    <span className="step-name">Stages</span>
                                </div>
                            </div>

                            {/*  BLOCK WITH STEPS INFORMATION   */}
                            <div className="create-proj-info-wrapper">
                                {this.mySwitchFunction(this.state.activeTabIndex)}
                            </div>{/* end of create-proj-info-wrapper  */}
                        </div>{/*  end of create-proj-main  */} {/*  BOTTOM ROW OF "CREATE PROJECT" POPUP  */}
                        <div className="create-proj-bottom-buttons ">
                            <button onClick={() => this.backTabAction()} className="create-proj-btn create-proj-back-btn">Cancel</button>
                            <button onClick={() => this.nextTabAction()} className="create-proj-btn create-proj-create-btn">{(this.state.activeTabIndex<1 ? 'Next' : 'Create')}</button>
                        </div>{/*  end of remodal-bottom-buttons  */}
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    addProjectStartAsync : input => dispatch(addProjectStartAsync(input))
  });
export default connect(null, mapDispatchToProps)(CreateProject)