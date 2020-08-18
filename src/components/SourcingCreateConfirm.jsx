import React from 'react';
import * as CustomJS from '../custom.js';
import API from '../API.js';
import Loader from 'react-loader-spinner';

class SourcingCreateConfirm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            candidates: [],
            projectId: this.props.match.params.projectId,
            sourcingFiltersId: this.props.match.params.id,

            isSourcingButtonEnabled: false,

            isCandidatesAvailable: true,

            isLoading: true
        }
    }

    startSourcingConfirmed(){
        API.sourcing().startSourcingConfirmed(this.state.projectId, this.state.sourcingFiltersId)
        .then(res => this.props.history.push(`/projects/${this.state.projectId}`))
        .catch(err => console.log(err))
    }

    componentDidMount() {
        API.sourcing().getTopFive(this.state.sourcingFiltersId)
        .then(res => { 
            this.setState({candidates: res.data, isLoading: false}, ()=> CustomJS.addListenerOnResizeSourcCandid());
            if(res.data.length===0){
                this.setState({isCandidatesAvailable: false});
            }
        })
        .catch(err=> { 
            console.log(err);
            var objs = {
                Id: "SomeText",
                Name: "SomeText",
                Position: "asda",
                Country: "asd",
                Skills: ['some','some'],
                Photo: "https://www.gravatar.com/avatar/9289673e43507b8902ce7598be9cdb9f?s=328&amp;d=identicon&amp;r=PG",
            };
            // console.log(objs);
            this.setState({candidates: [objs,objs,objs,objs,objs]}, () => {
                // console.log(this.state.candidates);
            });
        });
    }
    componentWillUnmount(){
        CustomJS.removeListenerOnResizeSourcCandid();
    }

    onGoodFit(candidate){
        this.removeFromCandidatesList(candidate)
        API.sourcing().goodFit(this.state.sourcingFiltersId, candidate.Id)
        .then(res=> this.removeFromCandidatesList(candidate))
        .catch(err=> console.log(err));
    }

    onBadFit(candidate){
        API.sourcing().badFit(this.state.sourcingFiltersId, candidate.Id)
        .then(res=> this.removeFromCandidatesList(candidate))
        .catch(err=> console.log(err));
    }

    removeFromCandidatesList(candidate){
        var array = [...this.state.candidates]; // make a separate copy of the array
        var index = array.indexOf(candidate);
        // console.log(index);
        if (index !== -1) {
            array.splice(index, 1);
            this.setState(
                {
                    candidates: array,
                    isSourcingButtonEnabled: array.length===0 ? true : false
                }   
            );
        }
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

        return(
            <div className="main-content-item candidates-content candidates-content-right-track" id="main-content-item-sourcing">
                <div className="candidates-content-wrapper" id="candidates-content-wrapper">
                    {/* ------------------------
                        ARE WE ON RIGHT TRACK
                    ------------------------- */}
                    {this.state.isCandidatesAvailable ?
                    <div className="right-track">
                        <p className="right-track-title">Is the search right? Calibrate search results</p>
                        <p className="right-track-descrip">Below are 5 examples of candidates' profiles based on your filters. Calibrate the samples by "Good Fit" or "Not a Fit". Click "Start searching" to find talents or Refine search.</p>
                    </div> 
                    :
                    <div className="right-track">
                        <p className="right-track-title">It takes longer to find talents for your requirements.</p>
                        <p className="right-track-descrip">Please click '<span style={{fontWeight : 'bold'}}>Refine search</span>' and enlarge your search filters.</p>
                        <p className="right-track-descrip">If you click '<span style={{fontWeight : 'bold'}}>Start searching</span>' we'll do our best to find candidates based your criterias. it may take longer and give fewer profiles.</p>
                    </div>
                    }
                    {/*  Wrapper for all candidates  */}
                    <div className="all-candidates">
                        {this.state.candidates.map((e,i) => 

                        <div key={i} className="one-candidate">
                            <div className="one-candidate-left">
                                <input type="checkbox" className="candidate-checkbox" id="candidate1" name="candidate1" />
                                {/*  PHOTO AND INFORMATION UNDER CANDIDATE PHOTO(VIEWS, NOTES,PROJECTS)  */}
                                <div className="candidate-photo-block">
                                    <div className="candidate-photo"><img src={e.Photo} alt=""/></div>
                                    <div className="candidate-quick-info">
                                        {/* <div className="candidate-quick-info-item candidate-views">
                                            <p className="candidate-icon-wrapper">
                                                <i className="fa fa-eye" aria-hidden="true"></i>
                                            </p>
                                            <p className="candidate-quick-info-row">
                                                <span>6</span>
                                                <span>Views</span>
                                            </p>
                                        </div> 
                                        <div className="candidate-quick-info-item candidate-notes">
                                            <p className="candidate-icon-wrapper">
                                                <i className="fa fa-sticky-note-o" aria-hidden="true"></i>
                                            </p>
                                            <p className="candidate-quick-info-row">
                                                <span>0</span>
                                                <span>Notes</span>
                                            </p>
                                        </div>
                                        <div className="candidate-quick-info-item candidate-projects">
                                            <p className="candidate-icon-wrapper">
                                                <i className="fa fa-briefcase" aria-hidden="true"></i>
                                            </p>
                                            <p className="candidate-quick-info-row">
                                                <span>0</span>
                                                <span>Projects</span>
                                            </p>
                                        </div> */}
                                    </div>{/* end of candidate-quick-info */}
                                </div>{/* end of candidate-photo-block */}


                                <div className="candidate-main-info">
                                    {/*  candidates name */}
                                    <div className="candidate-name" style={{cursor: 'default'}}><div>{e.Name}</div></div>
                                    {/*  position + experience years + location */}
                                    <div className="candidate-row-under-name">
                                        <div className="candidate-position">{e.Position}</div>
                                        {e.OverallExperience ? 
                                        <div className="candidate-experience">
                                            <i className="fa fa-star" aria-hidden="true"></i>
                                            <span>{e.OverallExperience} years experience</span>
                                        </div> : ''
                                        }
                                        {e.Country ? 
                                        <div className="candidate-location">
                                            <p className="candidate-icon-wrapper">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                            </p>
                                            <span>{e.Country}</span>
                                        </div> : ''
                                        }
                                    </div>{/* end of candidate-row-under-name  */}

                                    {/*  Experience(full text) + Education + Tags  */}
                                    <div className="candidate-inner">
                                        {/*  Experience  */}
                                        {e.Experiences ? 
                                        <div className="candidate-inner-item candidate-experience-full">
                                            <p className="candidate-icon-wrapper">
                                                <i className="fa fa-suitcase" aria-hidden="true"></i>
                                            </p>
                                            <div> 
                                                <p className="candidate-experience-text">
                                                    {e.Experiences}
                                                </p>
                                            </div>
                                        </div> : ''
                                        }
                                        {/*  Education  */}
                                        {e.Educations ? 
                                        <div className="candidate-inner-item candidate-education">
                                            <p className="candidate-icon-wrapper">
                                                <i className="fa fa-graduation-cap" aria-hidden="true"></i>
                                            </p>
                                            <p className="candidate-experience-text">
                                                {e.Educations}
                                            </p>   
                                        </div> : ''
                                        }
                                        {/*  Tags  */}
                                        {e.Skills.length>0 ?
                                        <div className="candidate-inner-item candidate-tags-wrapper">
                                            <p className="candidate-icon-wrapper">
                                                <i className="fa fa-tags" aria-hidden="true"></i>
                                            </p>
                                            <div className="candidate-tags-inner">
                                                {/* <p className="candidate-add-tag"><span className="plus-add-tag">+</span><span>Add Tag</span></p> */}
                                                {e.Skills.splice(0,19).map((u) =>
                                                    <p className="candidate-tag">{u}</p>
                                                )}
                                            </div>{/* end of candidate-tags-inner  */}
                                        </div> : ''
                                        }{/* end of candidate-tags-wrapper  */}
                                    </div>{/* end of candidate-inner  */}
                                </div>{/* end of candidate-main-info  */}
                            </div>{/* end of one-candidate-left */}

                            <div className="one-candidate-right">
                                
                                <div className="candidate-contacts">
                                    {/* <div className="candidate-email-wrapper">
                                        <i className="fa fa-envelope" aria-hidden="true"></i>
                                        <span className="candidate-email">{e.Email}</span>
                                        <i className="fa fa-clone" aria-hidden="true"></i>
                                    </div>
                                    <div className="candidate-phone-wrapper">
                                        <i className="fa fa-phone" aria-hidden="true"></i>
                                        <span className="candidate-phone">{e.Phone}</span>
                                    </div>
                                    <div className="candidate-social-wrapper">
                                        <p className="candidate-social-title">Find work emails</p>
                                        <div className="candidate-social-inner">
                                            <p className="candidate-one-social-link">
                                                <a href="#"><i className="fa fa-google-plus" aria-hidden="true"></i></a>
                                            </p>
                                            <p className="candidate-one-social-link">
                                                <a href="#"><i className="fa fa-linkedin-square" aria-hidden="true"></i></a>
                                            </p>
                                        </div>
                                    </div> */}

                                    <div className="candidate-fit">
                                        <button onClick={() => this.onGoodFit(e)} className="candidate-fit-btn candidate-fit-btn-approve">
                                            <i className="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                            <span className="fit-btn-text">Good Fit</span>
                                        </button>
                                        <button onClick={() => this.onBadFit(e)} className="candidate-fit-btn candidate-fit-btn-disapprove">
                                            <i className="fa fa-thumbs-o-down" aria-hidden="true"></i>
                                            <span className="fit-btn-text">Not a Fit</span>
                                            {/* <a href="#"><i className="fa fa-caret-down" aria-hidden="true"></i></a> */}
                                        </button>
                                    </div>
                                </div>
                                <div className="candidate-menu-dots"><i className="fa fa-ellipsis-h" aria-hidden="true"></i></div>
                            </div>
                    </div>
                    )}

                        
                    </div>{/* end of all-candidates */}

                    {/* --------------------------------------------------------------------
                        FIXED ROW with Buttons: "Refine your search" and "Start sourcing"
                    --------------------------------------------------------------------- */}
                    <div className="candidates-fixed-btns-row" id="candidates-fixed-btns-row">
                        <button onClick={() => this.props.history.push(`/sourcing/${this.state.projectId}/createsourcing/${this.state.sourcingFiltersId}`)}className="candidates-fixed-btn candidates-refine-search-btn">Refine search</button>
                        <button onClick={() => this.startSourcingConfirmed()} className="candidates-fixed-btn candidates-start-sourcing-btn" disabled={!this.state.isSourcingButtonEnabled}>Start searching</button>
                    </div>
                </div>{/* end of candidates-content-wrapper */} 
            </div>
            
        )
    }
}

export default SourcingCreateConfirm; 