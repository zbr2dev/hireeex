import React from "react";
import CandidateInfo from "./CandidateInfo";
import * as CustomJS from '../custom.js';
import API from '../API.js';
import Loader from 'react-loader-spinner';
import ReactNotification from 'react-notifications-component';
import Pagination from '../components/Pagination';

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {fetchStageStartAsync,fetchCandidatesStartAsync} from '../redux/Candidates/CandidatesActions';
import {selectCandidatesStage, selectCandidatesList, selectCandidatesIsLoading} from '../reselect/Candidates'

const ITEMS_PER_PAGE = 20;
class Candidates extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalIndex: null,
            isFirstItem: false,
            isLastItem: false,
            modalCandidate: {},
            candidates: [],
            stageType: null,
            activeTabIndex: 0,
            Tabs: [{
                Name: "New Candidates",
                Count: 0,
            },
            {
                Name: "Uncontacted",
                Count: 0,
            },
            {
                Name: "Contacted",
                Count: 0,
            },
            {
                Name: "Replied",
                Count: 0,
            },
            {
                Name: "New Applicants",
                Count: 0,
            },
            {
                Name: "Phone Interview",
                Count: 0,
            },
            {
                Name: "Online Interview",
                Count: 0,
            },
            {
                Name: "Personal Meeting",
                Count: 0,
            },
            {
                Name: "Reference Check",
                Count: 0,
            },
            {
                Name: "Job-Offer",
                Count: 0,
            },
            {
                Name: "Hired",
                Count: 0,
            },],

            isLoading: true,
            isLoadingCandidates: false,
            activeCandidate: '',
            candidatesToShow: [],
            currentPage : 1,
            isFirstPage: true,
            isLastPage: false,
            isFirstLoad: true,
            cachedCandidates: [],
        }

        this.handleShowMore = this.handleShowMore.bind(this);

        this.addNotification = this.addNotification.bind(this);
        this.notificationDOMRef = React.createRef();
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.handleShowNext = this.handleShowNext.bind(this);
        this.handleShowPrevious = this.handleShowPrevious.bind(this);
        this.createModalIndex = this.createModalIndex.bind(this);
        this.deleteModalIndex = this.deleteModalIndex.bind(this);
        this.moveToNextPage = this.moveToNextPage.bind(this)
        this.moveToPrevPage = this.moveToPrevPage.bind(this)


    }
    componentDidMount() {
        console.log('this props from mount', this.props)
        this.getStageType();
        
        this.loadCandidates();
      
        // this.setState({
        //    candidatesToShow: 
        // })
        this.props.selectCandidatesList && this.setState({
            candidatesToShow: this.props.selectCandidatesList.slice(40, ITEMS_PER_PAGE*3)
        })
        // if(this.state.currentPage === 1)
    }
    // handleClick(event) {
    //     this.setState({
    //       currentPage: Number(event.target.id)
    //     });
    //   }

    
    moveToNextPage() {
        this.setState({
            currentPage: this.state.currentPage+1
        })
    }

    moveToPrevPage() {
        this.setState({
            currentPage: this.state.currentPage-1
        })
    }
    createModalIndex(candidate) {
        if(this.state.activeTabIndex === 0 && this.state.cachedCandidates.length > 0) {
            const index = this.state.cachedCandidates.indexOf(candidate);
            const modalCandidate = this.state.cachedCandidates[index]
            if(index===this.state.cachedCandidates.length-1) {
                this.setState({
                    isLastItem: true
                })
            }
            else {
                this.setState({
                    isLastItem: false
                })
            }
            if(index===0) {
                this.setState({
                    isFirstItem: true
                })
            }
            else {
                this.setState({
                    isFirstItem: false
                })
            }
            this.setState({
                modalIndex: index,
                modalCandidate
            });
            return
        }
        const index = this.props.selectCandidatesList.indexOf(candidate);
        const modalCandidate = this.props.selectCandidatesList[index]
        if(index===this.props.selectCandidatesList.length-1) {
            this.setState({
                isLastItem: true
            })
        }
        else {
            this.setState({
                isLastItem: false
            })
        }
        if(index===0) {
            this.setState({
                isFirstItem: true
            })
        }
        else {
            this.setState({
                isFirstItem: false
            })
        }
        // console.log('Index of modal candidate', index);
        this.setState({
            modalIndex: index,
            modalCandidate
        })
    }

    deleteModalIndex() {
        // console.log('modal index will be null')
        this.setState({
            modalIndex: null
        })
    }
    addNotification(type, title, message) {
        // alert(999)
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

    handleShowMore(event) {
        let moreBtn = event.target;
        let lessExp=event.target.parentNode.classList.contains("less");
        let parentDiv=event.target.parentNode;
       
        if (lessExp) {
            moreBtn.innerHTML = "Less";
            parentDiv.classList.remove("less");
        }
        else {
            moreBtn.innerHTML = "More";
            parentDiv.classList.add("less");
        }
    }
    handleShowNext() {
        this.setState({
            isFirstItem: false
        })
        // когда открывается первый раз - берем текущий индекс и запихиваем его в модал кандидейтИндекс
        // потом с нажатием кнопки некст - увеличиваем модалКандидейтИндекс на 1
        //с закрытиыем - модал кандидейт индекс = 0
        const modalCandidate = this.props.selectCandidatesList[this.state.modalIndex+1];
        if(this.state.modalIndex+1===this.props.selectCandidatesList.length-1) {
            this.setState({
                isLastItem: true
            })
        }
      
        else {
            this.setState({
                isLastItem: false
            })
        }
        this.setState({
            modalIndex: this.state.modalIndex+1,
            modalCandidate
        })
        // console.log('modal candidate', modalCandidate)
    }

    handleShowPrevious(candidate) {

        const modalCandidate = this.props.selectCandidatesList[this.state.modalIndex-1];
        if(this.state.modalIndex-1 === 0) {
            this.setState({
                isFirstItem: true,
            })
        }
        else {
            this.setState({
                isFirstItem: false
            })
        }
        this.setState({
            modalIndex: this.state.modalIndex-1,
            modalCandidate,
            isLastItem: false
        })
        // console.log('modal candidate', modalCandidate)
         
     }
    
    loadStages(){

        if(!this.props.match.params.sourcingId) {
            return 
        }
        API.candidates().getStagesCounts(this.props.match.params.sourcingId)
        .then(res => 
            // console.log(res, 'res')
            res.data.map((e) => {
                this.state.Tabs[e.Id].Count = e.Count;
                this.forceUpdate();
            })
            );
    }

    getStageType(){
        this.props.fetchStageStartAsync(this.props.match.params.sourcingId)
      
    }
    
    loadCandidates(){
        // console.log(this.state.cachedCandidates.length,this.state.activeTabIndex, 'check' )
        if(this.state.cachedCandidates.length > 0 && this.state.activeTabIndex === 0) {
            // console.log('return');
            return;
        }
        // console.log('is loading candidates')
        // console.log(this.props)
        // console.log(this.state)
        this.setState({isLoadingCandidates: true});
        this.loadStages();
        this.props.fetchCandidatesStartAsync(this.props.match.params.sourcingId, this.state.activeTabIndex)
        API.candidates().getCandidatesBySourcing(this.props.match.params.sourcingId, this.state.activeTabIndex)
        .then(res => {
            if(this.state.isFirstLoad && this.state.activeTabIndex === 0)  {
                // alert(1);
                this.setState({isFirstLoad: false},
                this.setState({cachedCandidates: res.data})
                    )
            }
            this.setState({candidates: res.data, isLoading: false}, () => 
        {
            CustomJS.addListenerOnResizeCandidCat(); 
            this.setState({isLoadingCandidates: false});
        })})
            .catch(err => {
                console.log(err);

            })
    }

    moveToNextStage(id,candName){
        this.setState({
            cachedCandidates: [],
            isFirstLoad: true
        })
        API.candidates().candidateToNextStage(id)
            .then((res) => {
                if(res.data){
                    this.addNotification('warning','Warning',`Candidate ${candName} already in ${this.state.Tabs[res.data].Name}`);
                }
                else{
                    this.addNotification('success','Success',`Candidate ${candName} successfully moved to ${this.state.Tabs[(this.state.activeTabIndex + 1)].Name}`);
                }
                this.setState({candidates: this.props.selectCandidatesList.filter(function(person) { 
                    return person.Id !== id; 
                })});
                this.loadStages();
            });

        // this.loadCandidates()
    }

    changeActiveTabIndex(index){
        //console.log(this.props, 'active tab change')
        this.setState({activeTabIndex: index}, () => {
            // if(!this.props.selectCandidatesList) {
            //     this.loadCandidates()
            // }
            this.loadCandidates()
        });
    }
    componentWillUnmount(){
        CustomJS.removeListenerOnResizeCandidCat();
    }

    getStages(tabindex){
        switch(tabindex){
            case 2:
                    return <>
                    {this.state.Tabs.map((e,i) => 
                    <div onClick={() => this.changeActiveTabIndex(i)} className={`candidate-category-tab ${this.state.activeTabIndex===i ? 'active' : ''}`} key={i}>
                                <div className="candidate-category-tab-number">{e.Count}</div>
                                <div className="candidate-category-tab-name">{e.Name}</div>
                            </div>
                    )}
        
                            <div className="candidate-category-tab candidate-category-add-tab">
                                <span>+</span>
                            </div>
                </>;
            case 1:
                    return <>
                    {this.state.Tabs.slice(0,4).map((e,i) => 
                    <div onClick={() => this.changeActiveTabIndex(i)} className={`candidate-category-tab ${this.state.activeTabIndex===i ? 'active' : ''}`} key={i}>
                                <div className="candidate-category-tab-number">{e.Count}</div>
                                <div className="candidate-category-tab-name">{e.Name}</div>
                            </div>
                    )}
        
                            <div className="candidate-category-tab candidate-category-add-tab">
                                <span>+</span>
                            </div>
                </>;
        }
        
    }

    copyToClipboard(email){
        navigator.clipboard.writeText(email); 
        this.addNotification('success','','Email copied to clipboard');
    }

    render() {

        

        const indexOfLast = this.state.currentPage * ITEMS_PER_PAGE;
        const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
        const currentCandidates =  (this.state.cachedCandidates.length > 0 && this.state.activeTabIndex === 0) ? this.state.cachedCandidates.slice(indexOfFirst, indexOfLast) : this.props.selectCandidatesList.slice(indexOfFirst, indexOfLast);
        const pageNumbers = []
        const toCeil = (this.state.cachedCandidates.length > 0 && this.state.activeTabIndex === 0) ? this.state.cachedCandidates.length / ITEMS_PER_PAGE : this.props.selectCandidatesList.length / ITEMS_PER_PAGE;
        console.log('to ceil', toCeil)
        for (let i = 1; i <= Math.ceil(toCeil); i++) {
            pageNumbers.push(i);
          }
          console.log(pageNumbers)

        //   console.log('PAGE NUMBERS', pageNumbers)
      
        // const renderCandidates = this.props.selectCandidatesList

        // console.log('stateee', this.state)
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

          

          if(this.props.selectCandidatesIsLoading){
              var candidates = <div id="loader">
              <Loader 
           type="Bars"
           color="#0089FF"
           height="60"	
           width="60"
        />   
        </div>;
          }
          else{
          if(currentCandidates.length>0){
              
              var candidates = currentCandidates
                
                .map((e,i) => <div key={i} className="one-candidate">
                    <div className="one-candidate-left">
                        {/* <input
                            type="checkbox"
                            className="candidate-checkbox"
                            id="candidate1"
                            name="candidate1"/>  */}
                        <div className="candidate-photo-block">
                            <div className="candidate-photo"><img src={e.Photo} alt=""/></div>
                            <div className="candidate-quick-info">
                                {/*  Views  */}
                                {/* <div className="candidate-quick-info-item candidate-views">
                                    <p className="candidate-icon-wrapper">
                                        <i className="fa fa-eye" aria-hidden="true"></i>
                                    </p>
                                    <p className="candidate-quick-info-row">
                                        <span>6</span>
                                        <span>Views</span>
                                    </p>
                                </div> */}
                                {/*  Notes  */}
                                {/* <div className="candidate-quick-info-item candidate-notes">
                                    <p className="candidate-icon-wrapper">
                                        <i className="fa fa-sticky-note-o" aria-hidden="true"></i>
                                    </p>
                                    <p className="candidate-quick-info-row">
                                        <span>0</span>
                                        <span>Notes</span>
                                    </p>
                                </div> */}
                                {/*  Projects  */}
                                {/* <div className="candidate-quick-info-item candidate-projects">
                                    <p className="candidate-icon-wrapper">
                                        <i className="fa fa-briefcase" aria-hidden="true"></i>
                                    </p>
                                    <p className="candidate-quick-info-row">
                                        <span>0</span>
                                        <span>Projects</span>
                                    </p>
                                </div> */}
                            </div>{/* end of candidate-quick-info */}
                            <div className="candidate-fit candidate-fit-under-photo">
                                <button onClick={() => this.moveToNextStage(e.Id,e.Name)} className="candidate-fit-btn candidate-fit-btn-approve">
                                    <i className="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                    <span className="fit-btn-text">Move To Next Stage</span>
                                </button>
                            </div>{/* end of candidate-fit  */}
                        </div>{/* end of candidate-photo-block */}

                        <div className="candidate-main-info">
                            {/*  candidates name */}
                            <div className="candidate-name">
                                <CandidateInfo 
                                    candidate = {e}
                                    handleShowNext = {this.handleShowNext}
                                    handleShowPrev={this.handleShowPrevious}
                                    copyToClipboard = {this.copyToClipboard}
                                    createModalIndex = {this.createModalIndex}
                                    deleteModalIndex = {this.deleteModalIndex}
                                    isFirstItem={this.state.isFirstItem}
                                    isLastItem={this.state.isLastItem}
                                    modalCandidate={this.state.modalCandidate}>
                                    
                                 
                                </CandidateInfo>
                            </div>
                            {/*  position + experience years + location */}
                            <div className="candidate-row-under-name">
                            <div className="candidate-position">{e.Position}</div>
                                <div className="exper-and-location-wrapper">
                                    {e.OverallExperience ? 
                                    <div className="candidate-experience">
                                        <p className="candidate-icon-wrapper">
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                        </p>
                                        <span>{e.OverallExperience} years experience</span>
                                    </div> : ''
                                    }
                                    {e.Location ?
                                    <div className="candidate-location">
                                        <p className="candidate-icon-wrapper">
                                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                                        </p>
                                        <span>{e.Location}</span>
                                    </div> : ''
                                    }
                                </div> 
                            </div>{/* end of candidate-row-under-name  */} {/*  Experience(full text) + Education + Tags  */}
                            <div className="candidate-inner">
                                {/*  Experience  */}
                                
                                {e.Experiences.length> 0 ? 
                                <div className="candidate-inner-item candidate-experience-full">
                                    <p className="candidate-icon-wrapper">
                                        <i className="fa fa-suitcase" aria-hidden="true"></i>
                                    </p>
                                    <div className="less">
                                        {e.Experiences.map((experience,j) => 
                                            <p className="candidate-experience-text" key={j}>
                                                {experience.Name} @ {experience.CompanyName + (experience.Period ? ', Period: ' + experience.Period : '')}
                                                {/* <span className="candidate-show-more-btn candidate-experience-more"> More</span> */}
                                                {/* {(e.Experiences.length === j+1) ? <span onClick={this.handleShowMoreExper} className="candidate-show-more-btn candidate-experience-more"> More</span> : ''} */}
                                            </p>
                                            
                                        )}
                                        {e.Experiences.length>1 ? <span onClick={this.handleShowMore} id="candidate-experience-more" className="candidate-show-more-btn"> More</span> 
                                        : ''}
                                    </div> 
                                    
                                </div> : ''}
                                
                                {/*  Education  */}
                                {e.Educations.length > 0 ? 
                                <div className="candidate-inner-item candidate-education">
                                    <p className="candidate-icon-wrapper">
                                        <i className="fa fa-graduation-cap" aria-hidden="true"></i>
                                    </p>
                                    <div className="less">
                                    {e.Educations.map((educ, j) => 
                                        <p className="candidate-experience-text" key={j}>
                                            {educ.Name} {educ.Description}, Period: {educ.Period}
                                        </p>
                                    )}
                                    {e.Educations.length>1 ? <span onClick={this.handleShowMore} id="candidate-experience-more" className="candidate-show-more-btn"> More</span> 
                                        : ''}
                                    </div>
                                    
                                </div> : ''}
                                
                               
                                {/*  Tags  */}
                                {e.Skills.length>0 ? 
                                <div className="candidate-inner-item candidate-tags-wrapper">
                                    <p className="candidate-icon-wrapper">
                                        <i className="fa fa-tags" aria-hidden="true"></i>
                                    </p>
                                    <div className="candidate-tags-inner less">
                                        {/* <p className="candidate-add-tag"><span className="plus-add-tag">+</span><span>Add Tag</span></p> */}
                                        {e.Skills.map((skill,j) => 
                                        <p className="candidate-tag" key={j}>{skill}</p>                                                                
                                            )}
                                        {e.Skills.length < 9 ? '' : <span onClick={this.handleShowMore} className="candidate-show-more-btn">More</span>}
                                    </div>{/* end of candidate-tags-inner  */}

                                    
                                </div> : ''}
                                {/* end of candidate-tags-wrapper  */}
                            </div>{/* end of candidate-inner  */}
                            <div className="one-candidate-below">
                        {/*  Phone + email + social-links  */}
                        <div className="candidate-contacts">
                            
                                
                                
                            <div className="candidate-email-wrapper"  style={{ flexDirection: 'column'}}>
                               
                            {e.Emails.map((email) => <div style={{display: "flex"}}>   <div className="candidate-info-icon-wrapper"><i className="fa fa-envelope" aria-hidden="true"></i></div>
                                <div>
                                    <p className="candidate-email-row">
                                        <span className="candidate-email">{email}</span>
                                        <i className="fa fa-clone" aria-hidden="true" onClick={() => this.copyToClipboard(email)}></i>
                                    </p>   
                                </div> </div>)}
                             
                            </div>
                            {/* )} */}
                            {/*  Phone  */}
                            {
                                (e.Phone) ? 
                   
                                <div className="candidate-phone-wrapper" style={{ flexDirection: 'column', }}>
                                             {e.Phone.split(';').map(e => 
                                                <div style={{display: 'flex', margin: '10px', marginLeft: '0'}}>
                                                <div className="candidate-info-icon-wrapper"><i className="fa fa-phone" aria-hidden="true"></i></div>
                                                <span className="candidate-phone">{e}</span>
                                                </div>
                                               
                                                
                                                )}
                                 
                                
                                </div>
                            // <p>{e.Phone}</p>
                                 : ''
                            }  
                            
                            {/*  Social links  */}
                            <div className="candidate-social-wrapper">
                                {/* <p className="candidate-social-title">Find work emails</p> */}
                                <div className="candidate-social-inner">
                                    {e.CandidateSocials.map((social,j) => 
                                        <p className="candidate-one-social-link" key={j}>
                                            <a href={social.Url} target="_blank">
                                            <img src={social.Icon} alt={social.Name} className="candidate-social-url-logos" aria-hidden="true"></img>
                                            </a>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/*  GOOD FIT / NOT A FIT  */}
                            <div className="candidate-fit">
                                <button onClick={() => this.moveToNextStage(e.Id,e.Name)} className="candidate-fit-btn candidate-fit-btn-approve">
                                    <i className="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                    <span className="fit-btn-text">Move To Next Stage</span>
                                </button>
                            </div>{/* end of candidate-fit  */}
                        </div>{/* end of candidate-contacts */}
                        <div className="candidate-menu-dots">
                            <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                        </div>
                    </div>{/* end of one-candidate-right */}
                        </div>{/* end of candidate-main-info  */}
                    </div>{/* end of one-candidate-left */}

                    <div className="one-candidate-right">
                        {/*  Phone + email + social-links  */}
                        <div className="candidate-contacts">
                            
                                
                                
                            <div className="candidate-email-wrapper"  style={{ flexDirection: 'column'}}>
                               
                            {e.Emails.map((email) => <div style={{display: "flex"}}>   <div className="candidate-info-icon-wrapper"><i className="fa fa-envelope" aria-hidden="true"></i></div>
                                <div>
                                    <p className="candidate-email-row">
                                        <span className="candidate-email">{email}</span>
                                        <i className="fa fa-clone" aria-hidden="true" onClick={() => this.copyToClipboard(email)}></i>
                                    </p>   
                                </div> </div>)}
                             
                            </div>
                            {/* )} */}
                            {/*  Phone  */}
                            {
                                (e.Phone) ? 
                   
                                <div className="candidate-phone-wrapper" style={{ flexDirection: 'column', }}>
                                             {e.Phone.split(';').map(e => 
                                                <div style={{display: 'flex', margin: '10px', marginLeft: '0'}}>
                                                <div className="candidate-info-icon-wrapper"><i className="fa fa-phone" aria-hidden="true"></i></div>
                                                <span className="candidate-phone">{e}</span>
                                                </div>
                                               
                                                
                                                )}
                                 
                                
                                </div>
                            // <p>{e.Phone}</p>
                                 : ''
                            }  
                            
                            {/*  Social links  */}
                            <div className="candidate-social-wrapper">
                                {/* <p className="candidate-social-title">Find work emails</p> */}
                                <div className="candidate-social-inner">
                                    {e.CandidateSocials.map((social,j) => 
                                        <p className="candidate-one-social-link" key={j}>
                                            <a href={social.Url} target="_blank">
                                            <img src={social.Icon} alt={social.Name} className="candidate-social-url-logos" aria-hidden="true"></img>
                                            </a>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/*  GOOD FIT / NOT A FIT  */}
                            <div className="candidate-fit">
                                <button onClick={() => this.moveToNextStage(e.Id,e.Name)} className="candidate-fit-btn candidate-fit-btn-approve">
                                    <i className="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                    <span className="fit-btn-text">Move To Next Stage</span>
                                </button>
                            </div>{/* end of candidate-fit  */}
                        </div>{/* end of candidate-contacts */}
                        <div className="candidate-menu-dots">
                            <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                        </div>
                    </div>{/* end of one-candidate-right */}
                </div>);
          }
          else {
              if(this.state.activeTabIndex>0){
              var candidates = <div className="flex-container inner-element-background">
                                    <div className="inner-element">There are no candidates in the {this.state.Tabs[this.state.activeTabIndex].Name} stage.</div>
                                    <div className="inner-element">You can <span style={{color: '#1f8ceb'}}>engage your qualified candidates from the {this.state.Tabs[this.state.activeTabIndex - 1].Name} stage now.</span></div>
                               </div>;
              } 
          }
        }

        return (

            <div>
                <ReactNotification ref={this.notificationDOMRef} />
                <div className="candidate-categories-wrapper" id="candidate-categories-wrapper">
                    {(this.getStages(this.props.selectCandidatesStage))}
                </div>{/* end of candidate-categories-wrapper */}

                <div className="main-content main-content-candidates">

                    {/* ----------------------------
                CANDIDATES SORTING ROW
            ----------------------------- */}
                    <div className="candidate-sorting" id="candidate-sorting">
                        {/* <div className="candidate-sorting-results">
                            <input type="checkbox" name="checkbox" id="candidate-sorting" value="value"/>
                            <label htmlFor="candidate-sorting">Found 50 results</label>
                        </div>
                        <div className="candidate-sorting-wrapper">
                            <div className="candidate-sorting-archived">
                                <span>Archived candidates</span>
                                <span>(0)</span>
                            </div>
                            <div className="candidate-sorting-best-match">
                                <select>
                                    <option value="1">Sort by best match1</option>
                                    <option value="2">Sort by best match2</option>
                                    <option value="3">Sort by best match2</option>
                                </select>
                            </div>
                        </div> */}
                    </div>

                    {/* -------------
                CANDIDATES
            --------------- */}
                    <div className="main-content-item candidates-content">
                       <div className="candidates-content-wrapper candidates-with-categories-wrapper" id="candidates-with-categories-wrapper">
                            <div className="all-candidates candidates-category-tab-content">
                                {candidates}
                            </div>
                            {this.state.candidates.length > 0 && <Pagination pageNumbers={pageNumbers} currentPage={this.state.currentPage}  moveToPrevPage={this.moveToPrevPage} moveToNextPage={this.moveToNextPage} pagesQuantity={pageNumbers.length}></Pagination>}

                        </div>
                      
                        {/* end of candidates-content-wrapper */}
                        
                    </div>{/* end of candidates-content */} 
         
                </div>{/* end of main-content */}
               
            </div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    selectCandidatesStage: selectCandidatesStage,
    selectCandidatesList: selectCandidatesList,
    selectCandidatesIsLoading: selectCandidatesIsLoading
})

const mapDispatchToProps = dispatch => ({
    fetchStageStartAsync: id => dispatch(fetchStageStartAsync(id)),
    fetchCandidatesStartAsync: (id, index) =>dispatch(fetchCandidatesStartAsync(id, index))
})

export default connect(mapStateToProps, mapDispatchToProps)(Candidates);
//посчитать количество страниц
// поделить весь массив кандидатов на массив с подмассивами - > элементы которые отображаются сейчас
// функция колбек в пагинацию