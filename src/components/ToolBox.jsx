import React from "react";
import Creatable  from "react-select/creatable";
import Select from 'react-select'
import Popup from 'reactjs-popup';
import * as CustomJS from '../custom.js';
import API from '../API.js';
import Loader from 'react-loader-spinner';

class ToolBox extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            jobTitlesShowList: [],
            jobTitlesList: [],
            jobTitlesSelected: [],
            jobTitlesSuggestions: [],
            skillsShowList: [],
            skillsList: [],
            skillsMandatorySelected: [],
            skillsMandatorySuggestions: [],
            skillsRelatedSelected: [],
            skillsRelatedSuggestions: [],
            industriesShowList: [],
            industriesList: [],
            industriesSelected: [],
            companiesList: [],
            companiesIncludedShowList: [],
            companiesExceludedShowList: [],
            companiesIncludedSelected: [],
            companiesExcludedSelected: [],
            educationsList: [],
            educationsSelected: [],
            locationsShowList: [],
            locationsList: [],
            locationsSelected: [],
            yearsOfExperience: [],
            yearsOfCurrentCompany: [],

            tableJobTitles: [],
            tableSkills: [],
            tableLocations: [],
            tableCompanies: [],

            filterExperienceShow: false,
            filterCompaniesShow: false,
            allFiltersShow: true,

            isCompaniesIncludedCurrent: false,
            isCompaniesExcludedCurrent: false,

            isLoading: true,
            isLoadingInsights: false,

            generatedSearch: null,

            projectId: this.props.match.params.id,
        }
    }

    componentDidMount(){
        this.getTitlesList(false);
        this.getSkillsList();
        this.getIndustries();
    }

    //Start Title
    getTitlesList(history){
        API.filter().getTitles(history)
       .then(res => {
           this.setState({jobTitlesList: res.data.map(e => ({
               value: e.Id,
               label: e.Name,
           }))});
       })
       .catch(err=> {
           console.log(err);
       });
    }

    handleChangeTitle = (newValue, actionMeta) => {
        if(newValue !== null && newValue.length>0){
        this.setState({jobTitlesSelected: newValue}, () => this.filtersChanged());
        }
        else{
        this.setState({jobTitlesSelected: []});
        }
    }

    handleJobTitleInputChange = (newValue, actionMeta) => {
        if(newValue !== null && newValue.length>2) {
           this.setState({jobTitlesShowList: this.state.jobTitlesList.filter(title => title.label.toLowerCase().startsWith(newValue.toLowerCase()))});
        }
        else {
           this.setState({jobTitlesShowList: []})
        }
      }
      //End of Title

      //Start Skill
      getSkillsList(){
        API.filter().getSkills()
        .then(res => {
           this.setState({skillsList: res.data.map(e => ({
              value: e.Id,
              label: e.Name
           }))});
        })
        .catch(err=> {
           console.log(err);
        });
     }

     handleChangeSkillsInputChange = (newValue, actionMeta) => {
        if(newValue !== null && newValue.length>1) {
           this.setState({skillsShowList: this.state.skillsList.filter(title => title.label.toLowerCase().startsWith(newValue.toLowerCase()))});
        }
        else {
           this.setState({skillsShowList: []})
        }
      }

      handleChangeSkillsRelated = (newValue, actionMeta) => {
        if(newValue !== null && newValue.length>0){
           this.setState({skillsRelatedSelected: newValue}, () => this.filtersChanged());
           }
           else{
           this.setState({skillsRelatedSelected: []});
           }
      }
  
      handleChangeSkillsMandatory = (newValue, actionMeta) => {
        if(newValue !== null && newValue.length>0){
           this.setState({skillsMandatorySelected: newValue}, () => this.filtersChanged());
           }
           else{
           this.setState({skillsMandatorySelected: []});
           }
      }
      //End of Skill

      //Start Location
          getLocationsList(history){
            API.filter().getLocations(history)
            .then(res => {
               this.setState({locationsList: res.data.map(e => ({
                  value: e.Id,
                  label: e.Name
               }))});
            })
            .catch(err => console.log(err));
         }

      handleChangeLocation = (newValue, actionMeta) => {
        if(newValue !== null && newValue.length>0){
           this.setState({locationsSelected: newValue});
        }
        else{
           this.setState({locationsSelected: []});
        }
      }

      handleLocationInputChange = (newValue, actionMeta) => {
        if(newValue !== null && newValue.length>2) {
           this.setState({locationsShowList: this.state.locationsList});
        }
        else {
           this.setState({locationsShowList: []})
        }
      }
      //End of Location

      //Start Industries
      getIndustries(){
        API.filter().getIndustries()
        .then(res => {
           this.setState({industriesList: res.data.map(e => ({
              value: e.Id,
              label: e.Name
           }))});
        })
        .catch(err=> {
           console.log(err);
        });
      }

      handleChangeIndustries = (newValue, actionMeta) => {
        if(newValue !== null && newValue.length>0){
           this.setState({industriesSelected: newValue});
        }
        else{
           this.setState({industriesSelected: []});
        }
      }

      handleChangeIndustriesInputChange = (newValue, actionMeta) => {
        if(newValue !== null && newValue.length>1) {
           this.setState({industriesShowList: this.state.industriesList.filter(title => title.label.toLowerCase().startsWith(newValue.toLowerCase()))});
        }
        else {
           this.setState({industriesShowList: []})
        }
      }
      //End of Industries

      //Start of Suggestions
      filtersChanged(){
        this.setState({isLoadingInsights: true});
        var body = {
           JobTitle: this.state.jobTitlesSelected.map(e => ({
              Id: e.value,
              Name: e.label})),
  
           Mandatory: this.state.skillsMandatorySelected.map(e => ({
              Id: e.value,
              Name: e.label})),
  
           Related: this.state.skillsRelatedSelected.map(e => ({
              Id: e.value,
              Name: e.label})),
           Locations: [],
           CompaniesIncluded: [],
           CompaniesExcluded: [],
           Education: [],
        }
           API.toolbox().getSuggestions(body)
        .then(res => {
            this.setState({jobTitlesSuggestions: res.data.Suggestions.JobTitles.map(e => ({
                value: e.Id,
                label: e.Name
            }))});
            this.setState({skillsMandatorySuggestions: res.data.Suggestions.Skills.map(e => ({
              value: e.Id,
              label: e.Name
            }))});
            this.setState({skillsRelatedSuggestions: res.data.Suggestions.Skills.map(e => ({
              value: e.Id,
              label: e.Name
            }))});
        })
        .catch(err => {
           console.log(err);
        })
      }

      selectSuggestedTitle(suggestedObj){
        this.setState({ jobTitlesSelected: [...this.state.jobTitlesSelected, suggestedObj] }, () => this.filtersChanged());
      }
  
      selectSuggestedMandatory(suggestedObj){
        this.setState({ skillsMandatorySelected: [...this.state.skillsMandatorySelected, suggestedObj] }, () => this.filtersChanged());
      }
  
      selectSuggestedRelated(suggestedObj){
        this.setState({ skillsRelatedSelected: [...this.state.skillsRelatedSelected, suggestedObj] }, () => this.filtersChanged());
      }

      //End of Suggestions

      isFiltersEmpty(){
        if(this.state.jobTitlesSelected.length>0 || this.state.skillsMandatorySelected.length>0 ||
           this.state.skillsRelatedSelected.length>0 || this.state.locationsSelected.length>0)
        { return false; }
        else
        return true;
     }

     generateBooleanSearch(){
        if(!this.isFiltersEmpty())
        {
            const body = {
                JobTitle : this.state.jobTitlesSelected.map(e => e.label),
                Mandatory : this.state.skillsMandatorySelected.map(e => e.label),
                Related : this.state.skillsRelatedSelected.map(e => e.label),
                Locations : this.state.locationsSelected.map(e => e.label),
                Industry : this.state.industriesSelected.map(e => e.label),
            };
            API.toolbox().generateBooleanSearch(body)
            .then(res => {
                this.setState({generatedSearch: res.data}, () => { console.log(this.state.generatedSearch)})
            })
        }
     }
      
    render(){
        return (
            <div className="main-content" id="filters-main-content">
            <div className="main-content-item sourcing-content">
   {/*  LEFT PART WITH ALL FILTERRS  */}
   <div className="sourcing-left">
      {/*  MAIN FILTERS  */}
      <div className="main-filters">
         <div className="main-filters-title">
            <p className="main-filters-title-text">Build Boolean String Manually</p>
            {/* <button className="resume-btn">Resume/ID Parsing</button> */}
         </div>
         <div className="main-filters-inner">
            {/*  ONE FILTER  */}
            <div className="filter-item toolbox-filter">
               <div className="filter-title">Job Titles</div>
               <div className="filter-select-row">
               <Creatable 
                    isMulti
                    name="jobTitles"
                    options={this.state.jobTitlesShowList}
                    onChange={this.handleChangeTitle}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    maxMenuHeight = "160px"
                    placeholder="Add Job Titles"
                    onInputChange={this.handleJobTitleInputChange}
                    value = {this.state.jobTitlesSelected}
                    formatCreateLabel={userInput => `${userInput}`}>
                </Creatable>
               </div>
               <div className="filter-select-options">
                   {this.state.jobTitlesSuggestions.map((name,i) => <p onClick={() => this.selectSuggestedTitle(name)} key={name.value} className="filter-one-option">{name.label}<span>+</span></p>)}
               </div>
            </div>
            {/* end of filter-item */}
            {/*  ONE FILTER  */}
            <div className="filter-item">
               <div className="filter-title">Skills</div>
               <div className="filter-subtitle">Required Skills
                  <Popup
                     trigger={
                        <span className="hint">?</span>
                     }
                           position="bottom center"
                           on="hover"
                           closeOnDocumentClick
                           mouseLeaveDelay={150}
                           mouseEnterDelay={0}
                           contentStyle={{ padding: "8px", border: "none",color:"#fff",background: "#000" }}
                           arrow={true}
                  >
                     <div className="hint-info">
                           Skills or keywords that are prioritized when matching and ranking candidates. Multiple mandatory skills match and rank candidate based on the relevance between them.
                     </div>
                  </Popup>
               </div>
               {/* end of filter-subtitle */}

               <div className="filter-select-row">
               <Select 
                    isMulti
                    name="skillsMandatory"
                    options={this.state.skillsShowList}
                    onInputChange={this.handleChangeSkillsInputChange}
                    onChange={this.handleChangeSkillsMandatory}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    maxMenuHeight = "160px"
                    placeholder="Add Required Skills"
                    value={this.state.skillsMandatorySelected}
                    formatCreateLabel={userInput => `${userInput}`}>
                </Select>
               </div>
               <div className="filter-select-options">
                    {this.state.skillsMandatorySuggestions.map((name,i) => <p onClick={() => this.selectSuggestedMandatory(name)} key={name.value} className="filter-one-option">{name.label}<span>+</span></p>)}
               </div>
               <div className="filter-subtitle">Optional Skills
                  <Popup
                     trigger={
                        <span className="hint">?</span>
                     }
                           position="bottom center"
                           on="hover"
                           closeOnDocumentClick
                           mouseLeaveDelay={150}
                           mouseEnterDelay={0}
                           contentStyle={{ padding: "8px", border: "none",color:"#fff",background: "#000" }}
                           arrow={true}
                  >
                     <div className="hint-info">
                           Skills or keywords that improve candidate matching and ranking but are not required.
                     </div>
                  </Popup>
               </div>
               <div className="filter-select-row">
               <Select 
                    isMulti
                    name="skillsRelated"
                    options={this.state.skillsShowList}
                    onInputChange={this.handleChangeSkillsInputChange}
                    onChange={this.handleChangeSkillsRelated}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Add Optional Skills"
                    value={this.state.skillsRelatedSelected}
                    formatCreateLabel={userInput => `${userInput}`}>
                </Select>
               </div>
               <div className="filter-select-options">
                    {this.state.skillsRelatedSuggestions.map((name,i) => <p onClick={() => this.selectSuggestedRelated(name)} key={name.value} className="filter-one-option">{name.label}<span>+</span></p>)}
               </div>
            </div>
            {/* end of filter-item */}
            <div className="filter-item">
               <div className="filter-title">Industries</div>
               <div className="filter-select-row">
               <Creatable 
                    isMulti
                    name="jobTitles"
                    options={this.state.industriesShowList}
                    onChange={this.handleChangeIndustries}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    maxMenuHeight = "160px"
                    placeholder="Add Job Titles"
                    onInputChange={this.handleChangeIndustriesInputChange}
                    value = {this.state.industriesSelected}
                    formatCreateLabel={userInput => `${userInput}`}>
                </Creatable>
               </div>
            </div>
            {/*  ONE FILTER  */}
            <div className="filter-item">
               <div className="filter-title">Locations
                  <Popup
                     trigger={
                        <span className="hint">?</span>
                     }
                        position="bottom center"
                        on="hover"
                        closeOnDocumentClick
                        mouseLeaveDelay={150}
                        mouseEnterDelay={0}
                        contentStyle={{ padding: "8px", border: "none",color:"#fff",background: "#000" }}
                        arrow={true}
                  >
                     <div className="hint-info">
                           You can add locations of cities and countries.
                     </div>
                  </Popup>
               </div>
               {/* end of filter-title */}
               <div className="filter-select-row">
               <Creatable 
                    isMulti
                    name="locations"
                    options={this.state.locationsShowList}
                    onInputChange={this.handleLocationInputChange}
                    onChange={this.handleChangeLocation}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Add Location"
                    value={this.state.locationsSelected}
                    formatCreateLabel={userInput => `${userInput}`}>
                </Creatable>
               </div>
               {/* end of locations-info */}
            </div>
            {/* end of filter-item */}
            {/*  ONE FILTER  */}
            {/* <div className="filter-item">
               <div className="filter-title">Years of experience                           
                  <Popup
                     trigger={
                        <span className="hint">?</span>
                     }
                        position="bottom center"
                        on="hover"
                        closeOnDocumentClick
                        mouseLeaveDelay={150}
                        mouseEnterDelay={0}
                        contentStyle={{ padding: "8px", border: "none",color:"#fff",background: "#000" }}
                        arrow={true}
                  >
                     <div className="hint-info">
                           The total years of working experience.
                     </div>
                  </Popup>
               </div>
               <div className="filter-select-row">
                  <input className="filter-select-input" type="text" placeholder="Choose Experience Ranges From Below"/>
               </div>
               <div className="filter-select-options">
                  <p className="filter-one-option">0-2 Years<span>+</span></p>
                  <p className="filter-one-option">2-4 Years<span>+</span></p>
                  <p className="filter-one-option">4-5 Years<span>+</span></p>
                  <p className="filter-one-option">6-8 Years<span>+</span></p>
                  <p className="filter-one-option">8-10 Years<span>+</span></p>
                  <p className="filter-one-option">10+ Years<span>+</span></p>
               </div>
            </div> */}
            {/* end of filter-item */}
         </div>
         {/* end of main-filters-inner  */}
      </div>
      {/* end of main-filters */}
      <button onClick={() => this.generateBooleanSearch()} className="start-sourcing-btn">Build Boolean String</button>

      {this.state.generatedSearch ? 
        <div className="main-filters">
        <div className="main-filters-title">
           {/* <button className="resume-btn">Resume/ID Parsing</button> */}
        </div>
        <div className="main-filters-title">
           <p className="main-filters-title-text">Search Talents Now</p>
           {/* <button className="resume-btn">Resume/ID Parsing</button> */}
        </div>
        <div className="main-filters-inner">
            {/*  ONE FILTER  */}
            <div className="filter-item">
               <div className="filter-title">Boolean String</div>
               <div className="filter-select-row">
                    {this.state.generatedSearch}
               </div>
            </div>
            
        </div>
        <div className="main-filters-inner">
            {/*  ONE FILTER  */}
            <div className="filter-item">
               <div className="filter-title">Linkedin Web browsing</div>
               <div className="filter-select-row">
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=site:linkedin.com/in ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/google.svg" alt="Google" title="Google"/>
                        </a>
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.bing.com/search?q=site:linkedin.com/in ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/bing.svg" alt="Bing" title="Bing"/>
                        </a>
               </div>
            </div>
            <div className="filter-item">
               <div className="filter-title">General Networks</div>
               <div className="filter-select-row">
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=site:facebook.com/people/ ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/facebook.svg" alt="Facebook" title="Facebook"/>
                        </a>
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=site:hh.ru/resume/ ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/hh.svg" alt="HH" title="HH"/>
                        </a>
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=site:upwork.com/o/profiles/users/ ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/upwork.svg" alt="Upwork" title="Upwork"/>
                        </a>
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=site:xing.com/profile/ ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/xing.svg" alt="Xing" title="Xing"/>
                        </a>
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=filetype:(pdf OR doc OR docx OR rtf) (resume OR cv) -job -jobs -sample ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/cv.svg" alt="Resume" title="Resume"/>
                        </a>
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=site:viadeo.com/*/profile ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/viadeo.svg" alt="Viadeo" title="Viadeo"/>
                        </a>
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=site:vk.com/profile ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/vk.svg" alt="VKontakte" title="VKontakte"/>
                        </a>
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=site:https://www.superjob.ru/resume/ ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/superjob.svg" alt="Superjob" title="Superjob"/>
                        </a>
               </div>
            </div>
            <div className="filter-item">
               <div className="filter-title">IT</div>
               <div className="filter-select-row">
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=site:stackoverflow.com/users ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/stackoverflow.svg" alt="Stackoverflow" title="Stackoverflow"/>
                        </a>
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=site:career.habr.com -inurl:(vacancies|companies|courses|resumes|education_centers) ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/moikrug.svg" alt="Moikrug" title="MoiKrug"/>
                        </a>
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=site:https://itmozg.ru/resume/show/ ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/itmozg.svg" alt="Itmozg" title="Itmozg"/>
                        </a>
               </div>
            </div>
            <div className="filter-item">
               <div className="filter-title">Creative, designers</div>
               <div className="filter-select-row">
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=site:behance.net -inurl:stats intext:"project views" ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/behance.svg" alt="Behance" title="Behance"/>
                        </a>
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=site:dribbble.com intext:elsewhere ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/dribbble.svg" alt="Dribbble" title="Dribbble"/>
                        </a>
               </div>
            </div>
            <div className="filter-item">
               <div className="filter-title">Medical</div>
               <div className="filter-select-row">
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=site:zocdoc.com/doctor/ ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/zocdoc.svg" alt="Zocdoc" title="Zocdoc"/>
                        </a>
                        <a style={{marginRight:"10px"}} target="_blank" href={`https://www.google.com/search?q=site:https://docdoc.ru/doctor ${encodeURIComponent(this.state.generatedSearch)}`}>
                            <img height="38px" src="https://www.hireeex.com/img/webicons/svg/docdoc.svg" alt="Docdoc" title="Docdoc"/>
                        </a>
               </div>
            </div>

        </div>
        </div>
        : ''
      }
   </div>
   {/* end of sourcing-left */}
</div>
</div>
        );
    }
}

export default ToolBox;