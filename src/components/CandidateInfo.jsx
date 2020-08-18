import React from 'react';
import Modal from 'react-modal';

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

Modal.setAppElement('#root');

class CandidateInfo extends React.Component{

    constructor(props){
        super(props);
            this.state = {
                modalIsOpen: false,
                educationShow: false,
                experienceShow: false,
                skillsShow: false
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
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed. this.subtitle.style.color =
        // '#f00';
        this.props.createModalIndex(this.props.candidate)
        // console.log('props', this.props)
    }

    closeModal() {
        this.setState({modalIsOpen: false});
        this.props.deleteModalIndex();
    }

    fullInfoMore(event, desc) {

        let moreBtn = event.target;
        let lessExp=event.target.parentNode.classList.contains("less");
        let parentDiv=event.target.parentNode;
        let textDiv = parentDiv.firstChild;
        let paragText=parentDiv.getElementsByClassName("full-info-paragraph-text")[0];
        let elemHeight = parseInt(window.getComputedStyle(paragText, null).getPropertyValue("height"));
        // console.log(elemHeight);
        
        if (lessExp) {
            textDiv.innerHTML = desc;
            moreBtn.innerHTML = "Less";
            parentDiv.classList.remove("less");
        }
        else {
            textDiv.innerHTML = desc.substring(0,240);
            moreBtn.innerHTML = "More";
            parentDiv.classList.add("less");

        }
    }
    render(){
        console.log(this.props, 'PROPS')
        return( 
                
            <div>
                
                <span onClick={this.openModal}>{this.props.candidate.Name}</span>
                <Modal className="candidateModal"
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal">
                <div className="candidate-full-info-btns">
                    
                    <button onClick={this.closeModal} data-remodal-action="close" className="remodal-close" aria-label="Close"></button>
                    <button disabled={this.props.isFirstItem} className="candidate-full-info--prev-btn" onClick={()=>this.props.handleShowPrev(this.props.candidate)} >Prev</button>
                    <button disabled={this.props.isLastItem}  className="candidate-full-info--next-btn" onClick={()=>this.props.handleShowNext(this.props.candidate)}>Next</button>
                </div>
                <div className="remodal candidate-full-info" data-remodal-id="candidate-full-info" role="dialog">
                    
       
        <div className="candidate-full-info--top-row">
            {/* <a href="#">Open profile in a new window <i className="fa fa-external-link" aria-hidden="true"></i></a> */}
        </div>
        <div className="full-info-wrapper">
            <div className="full-info-left">
                <div className="full-info--one-block full-info--short-descrip">
                    <div className="full-candidate-info-top">
                        <div className="photo-block"><img src={this.props.modalCandidate.Photo} alt=""/></div>
                        <div className="short-descrip-text">
                           <div className="candidate-name">{this.props.modalCandidate.Name}</div>
                           <div className="candidate-row-under-name">
                                <div className="candidate-position">{this.props.modalCandidate.Position}</div>
                                {this.props.modalCandidate.OverallExperience ? 
                                <div className="candidate-experience">
                                    <p className="candidate-icon-wrapper">
                                        <i className="fa fa-star" aria-hidden="true"></i>
                                    </p>
                                    <span>{this.props.modalCandidate.OverallExperience} years experience</span>
                                </div> : ''}
                                {this.props.modalCandidate.Location ? 
                                <div className="candidate-location">
                                    <p className="candidate-icon-wrapper">
                                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                                    </p>
                                    <span>{this.props.modalCandidate.Location}</span>
                                </div> : ''}
                            </div>{/* end of candidate-row-under-name  */} 
                        </div>{/* end of short-descrip-text  */}
                    </div>{/* end of full-candidate-info-top  */}
                    <div className="full-candidate-info-bio">
                        {this.props.modalCandidate.AboutMe}
                    </div>
                    <div className="full-candidate-info-contacts">
                        

                        
                    <div className="candidate-phone-wrapper" style={{ flexDirection: 'column', }}>
                                             {this.props.modalCandidate.Phone && this.props.modalCandidate.Phone.split(';').map(e => 
                                                <div style={{display: 'flex', marginTop: '2px'}}>
                                                <div className="candidate-info-icon-wrapper"><i className="fa fa-phone" aria-hidden="true"></i></div>
                                                <span className="candidate-phone">{e}</span>
                                                </div>
                                               
                                                
                                                )}
                                 
                                
                                </div> 
                        
                                <div className="candidate-email-wrapper"  style={{ flexDirection: 'column'}}>
                               
                               {this.props.modalCandidate.Emails && this.props.modalCandidate.Emails.map((email, i) => <div style={{display: "flex"}}>   <div className="candidate-info-icon-wrapper"><i className="fa fa-envelope" aria-hidden="true"></i></div>
                                   <div>
                                       <p className="candidate-email-row">
                                           <span className="candidate-email">{email}</span>
                                           <i className="fa fa-clone" aria-hidden="true" onClick={() => this.props.copyToClipboard(email)}></i>
                                       </p>   
                                   </div> </div>)}
                                
                               </div>
                        {/* {this.props.candidate.Emails.map((email,i) =>
                        <div className="candidate-email-wrapper" key={i}>
                            <div className="candidate-info-icon-wrapper"><i className="fa fa-envelope" aria-hidden="true"></i></div>
                            <div>
                                <p>
                                    <span className="candidate-email">{email}</span>
                                    <i onClick={() => this.props.copyToClipboard(email)} className="fa fa-clone" aria-hidden="true"></i>
                                </p>
                            </div>
                            
                            {/* <p className="find-work-email">Find work emails</p> */}
                        {/* </div> */}
                       {/* // )} */} 

                        <div className="candidate-social-inner">
                        {this.props.modalCandidate.CandidateSocials && this.props.modalCandidate.CandidateSocials.map((social,j) => 
                            <p className="candidate-one-social-link" key={j}>
                                <a href={social.Url} target="_blank">
                                    <img src={social.Icon} alt={social.Name} className="candidate-social-url-logos" aria-hidden="true"></img>
                                </a>
                            </p>
                        )}
                        </div>
                    </div>
                </div>{/* end of full-info--short-descrip  */}

                {/*  DETAILS AND ACTIVITIES */}
                <div className="full-info--one-block full-info-details-activities">
                    <div className="full-info-blue-title">
                        {/*  TABS: DETAILS AND ACTIVITIES  */}
                        <div className="full-info-tab-wrapper">
                            <div className="full-info-tab active">Details</div>
                            {/* <div className="full-info-tab"> Activities</div> */}
                        </div>
                    </div>{/* end of full-info-blue-title  */}

                    {/*  TABS INFORMATION: DETAILS AND ACTIVITIES  */}
                    <div className="full-info-inside-tabs">

                        {/* ----------
                            DETAILS
                        ----------- */}
                        <div className="full-info-tab-content full-info-details">
                            {/*  EXPERIENCE  */}
                            <div className="details-info-item">
                                <div className="full-info--item-title" onClick={() => this.setState(state => ({experienceShow: !state.experienceShow}))}>
                                    <i className="fa fa-angle-right" style={{display: !this.state.experienceShow ? 'block' : 'none' }} aria-hidden="true"></i>
                                    <i className="fa fa-angle-down" style={{display: this.state.experienceShow ? 'block' : 'none' }} aria-hidden="true"></i>
                                    <span>Experience</span> 
                                    <span className="item-title-number">({this.props.modalCandidate.Experiences && this.props.modalCandidate.Experiences.length})</span>
                                </div>
                                <div className="full-info-item-text" style={{display: this.state.experienceShow ? 'block' : 'none' }}>
                                    {this.props.modalCandidate.Experiences && this.props.modalCandidate.Experiences.map((experience, j) => 
                                    <div className="full-info-paragraph" key={j} >
                                        <div className="full-info-paragraph-title">{experience.Name} @ {experience.CompanyName}</div>
                                        <div className="full-info-paragraph-date">{experience.Period}</div>
                                        <div className="full-info-paragraph-location">{experience.Location}</div>
                                        
                                        {(experience.Description) ? 
                                        <div className="less">
                                            <div className='full-info-paragraph-text'>
                                                {experience.Description.substring(0,240)}
                                            </div>
                                            {(experience.Description.length>240) ? <a  href="#"  onClick={(e) => this.fullInfoMore(e,experience.Description)} className="paragraph-more-btn">More</a> : ''}
                                            
                                            {/* <a href="#"  onClick={this.hideMoreBtns} className="paragraph-more-btn">More</a> */}

                                        </div> : ''}
                                        
                                    </div>
                                    )}
                                    {/* end of full-info-paragraph  */}
                                </div>{/* end of full-info-item-text  */}
                            </div>{/* end of details-info-item  */}

                            {/*  EDUCATION  */}
                            <div className="details-info-item">
                            <div className="full-info--item-title" onClick={() => this.setState(state => ({educationShow: !state.educationShow}))}>
                                    <i className="fa fa-angle-right" style={{display: !this.state.educationShow ? 'block' : 'none' }} aria-hidden="true"></i>
                                    <i className="fa fa-angle-down" style={{display: this.state.educationShow ? 'block' : 'none' }} aria-hidden="true"></i>
                                    <span>Education</span> 
                                    <span className="item-title-number">({this.props.modalCandidate.Educations && this.props.modalCandidate.Educations.length})</span>
                                </div>
                                <div className="full-info-item-text" style={{display: this.state.educationShow ? 'block' : 'none' }}>

                                    {/*  ONE INFO PARAGRAPH  */}
                                    {this.props.modalCandidate.Educations && this.props.modalCandidate.Educations.map((education, j) => 
                                    <div className="full-info-paragraph" key={j}>
                                        <div className="full-info-paragraph-title">{education.Name}</div>
                                        <div className="full-info-paragraph-date">{education.Period}</div>
                                        <div className="full-info-paragraph-location">{education.Location}</div>
                                        {(education.Description) ? 
                                        <div className="less">
                                            <div className='full-info-paragraph-text'>
                                                {education.Description.substring(0,240)}
                                            </div>
                                            {(education.Description.length>240 ? <a onClick={(e) => this.fullInfoMore(e,education.Description)} href="#" className="paragraph-more-btn">More</a> : '' )}
                                        </div>
                                        : ''}
                                    </div>
                                    )}
                                    {/* end of full-info-paragraph  */}

                                </div>{/* end of full-info-item-text  */}
                            </div>{/* end of details-info-item  */}

                            {/*  SKILLS  */}
                            <div className="details-info-item">
                            <div className="full-info--item-title" onClick={() => this.setState(state => ({skillsShow: !state.skillsShow}))}>
                                    <i className="fa fa-angle-right" style={{display: !this.state.skillsShow ? 'block' : 'none' }} aria-hidden="true"></i>
                                    <i className="fa fa-angle-down" style={{display: this.state.skillsShow ? 'block' : 'none' }} aria-hidden="true"></i>
                                    <span>Skills</span> 
                                    <span className="item-title-number">({this.props.modalCandidate.Skills && this.props.modalCandidate.Skills.length})</span>
                                </div>
                                {/*  LIST OF CANDIDATES SKILLS  */}
                                <div className="full-info-item-text skills-list" style={{display: this.state.skillsShow ? 'block' : 'none' }}>
                                    {this.props.modalCandidate.Skills && this.props.modalCandidate.Skills.map((skill,i) => 
                                        <p className="one-skill" key={i}>{skill}</p>
                                        )}
                                    
                                </div>
                            </div>{/* end of details-info-item */}
                        </div>{/* end of details  */}
                        
                        {/* -------------
                            ACTIVITIES
                        -------------- */}
                        <div className="full-info-tab-content full-info-activities">
                            {/*  Notes  */}
                            <div className="details-info-item">
                                <div className="full-info--item-title">
                                    <div className="full-info--item-title-left">
                                        <i className="fa fa-angle-right" aria-hidden="true"></i>
                                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                                        <span>Notes</span> 
                                        <span className="item-title-number">(0)</span>
                                    </div>
                                    <div className="full-info--item-right">
                                        <button className="activities-add-btn">Add</button>
                                    </div>
                                </div>{/* end of full-info--item-title  */}
                                <div className="full-info-item-text">
                                    <p className="info-is-absent">No notes are written for this candidate.</p>
                                </div>
                            </div>{/* end of details-info-item */}
                        </div>{/* end of activities  */}
                    </div>{/* end of full-info-inside-tabs  */}

                </div>{/* end of full-info-details-activities  */}
            </div>{/* end of full-info-left */}

            <div className="full-info-right">
                {/*  INSIGHTS  */}
                {/* <div className="full-info--one-block full-info-insights">
                    <div className="full-info-blue-title">Insights</div>
                    <div className="insights-inner">
                        <div className="one-insight">
                            <div className="insight-title">Availability</div>
                            <div className="progress"><div className="progress-bar" style={{width:'85%'}}></div></div>
                            <div className="insight-info"><p>low</p><p>high</p></div>
                        </div>
                        <div className="one-insight">
                            <div className="insight-title">Expertise</div>
                            <div className="insight-info"><p>Recruiter</p><p>92%</p></div>
                            <div className="progress"><div className="progress-bar" style={{width:'92%'}}></div></div>
                        </div>
                    </div>
                </div> */}
                {/* end of full-info-insights */}
            </div>{/* -end of full-info-right */}
        </div>{/* end of full-info-wrapper */}
    </div>{/* end of candidate-full-info popup */}
                </Modal>
            </div>
        )
    }
}

export default CandidateInfo;