import React from "react";
import Creatable from "react-select/creatable";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import Popup from "reactjs-popup";
import * as CustomJS from "../custom.js";
import API from "../API.js";
import Loader from "react-loader-spinner";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  selectFiltersCompaniesList,
  selectFiltersLocationsList,
  selectFiltersSkillsList,
  selectFiltersTitlesList,
} from "../reselect/Filters";

import {
  fetchTitlesStartAsync,
  fetchSkillsStartAsync,
  fetchCompaniesStartAsync,
  fetchLocationsStartAsync,
} from "../redux/Filters/FiltersActions";

const defaultCount = "Open Web";
class Filters extends React.Component {
  constructor(props) {
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

      matchedCount: defaultCount,
      isCompaniesIncludedCurrent: false,
      isCompaniesExcludedCurrent: false,

      isLoading: true,
      isLoadingInsights: false,

      projectId: this.props.match.params.id,
      cached: false,
      isFirstLoad: true,
      cachedCompanies: null,
      showCached: false,
      // filtersDeleted: false,
      filterWidth: "auto",

      jbParseMode: false,
      searchTextAreaVal: "",
    };
    this.containerRef = React.createRef();
  }
  handleTextArea(event){
    this.setState({searchTextAreaVal: event.target.value}, () => { this.filtersChanged() });
  }
  handleShowMore(event) {
    let moreBtn = event.target;
    let lessExp = event.target.parentNode.classList.contains("less");
    let parentDiv = event.target.parentNode;

    if (lessExp) {
      moreBtn.innerHTML = "Less";
      parentDiv.classList.remove("less");
    } else {
      moreBtn.innerHTML = "Show More";
      parentDiv.classList.add("less");
    }
  }

  componentDidMount() {
    var sourcingFiltersId = this.props.match.params.sourcingFiltersId;
    if (sourcingFiltersId != undefined) {
      this.loadFiltersByHistoryId(sourcingFiltersId);
    }
    this.setState({ isLoading: false });
    if (window.innerWidth > 1159) {
      this.setState({
        filterWidth: window.innerWidth * 0.425,
      });

      window.addEventListener("resize", () =>
        this.setState({
          filterWidth: window.innerWidth * 0.425,
        })
      );
    }
  }

  loadFiltersByHistoryId(id) {
    API.filter()
      .getFiltersById(id)
      .then((res) => {
        this.setState({
          jobTitlesSelected: res.data.JobTitle.map((e) => ({
            value: e.Id,
            label: e.Name,
          })),
        });
        this.setState({
          skillsMandatorySelected: res.data.Mandatory.map((e) => ({
            value: e.Id,
            label: e.Name,
          })),
        });
        this.setState({
          skillsRelatedSelected: res.data.Related.map((e) => ({
            value: e.Id,
            label: e.Name,
          })),
        });
        this.setState({
          locationsSelected: res.data.Locations.map((e) => ({
            value: e.Id,
            label: e.Name,
          })),
        });
        this.setState({
          companiesIncludedSelected: res.data.CompaniesIncluded.map((e) => ({
            value: e.Id,
            label: e.Name,
          })),
        });
        this.setState({
          companiesExcludedSelected: res.data.CompaniesExcluded.map((e) => ({
            value: e.Id,
            label: e.Name,
          })),
        });
        this.setState({
          educationsSelected: res.data.Educations.map((e) => ({
            value: e.Id,
            label: e.Name,
          })),
        });

        this.setState({ isLoading: false });

        if (res.data.CompaniesIncluded.length > 0) {
          this.setState({
            isCompaniesIncludedCurrent: res.data.CompaniesIncluded[0].IsCurrent,
          });
        }

        if (res.data.CompaniesExcluded.length > 0) {
          this.setState({
            isCompaniesExcludedCurrent: res.data.CompaniesExcluded[0].IsCurrent,
          });
        }
      })
      .then(() => this.filtersChanged());
  }

  //---API CALLS START---
  ///GET TITLES
  getTitlesList(history) {
    this.props.fetchTitlesStartAsync(history);
  }

  getCompaniesList(id) {
    // console.log('get companies list')
    this.props.fetchCompaniesStartAsync(id);
  }

  getLocationsList(history) {
    this.props.fetchLocationsStartAsync(history);
  }

  getSkillsList() {
    // console.log('get skills list')
    this.props.fetchSkillsStartAsync();
  }

  filtersChanged() {
    if (this.isFiltersEmpty()) {
      console.log("FILTERS EMPTY");
      this.setState({
        cachedCompanies: [],
        cachedTableJobTitles: [],
        cachedTableLocations: [],
        cachedTableSkills: [],
        showCached: false,
        isFirstLoad: true,
      });
      return;
    } else if (!this.state.isFirstLoad && this.isExtraFiltersEmpty()) {
      this.setState({
        showCached: true,
      });
      return;
    } else this.setState({ showCached: false });
    var sourcingFiltersId = this.props.match.params.sourcingFiltersId;
    if (this.props.selectFiltersCompaniesList.length === 0) {
      this.getCompaniesList(sourcingFiltersId);
    }
    if (this.props.selectFiltersSkillsList.length === 0) {
      this.getSkillsList();
    }
    if (this.props.selectLocationsList.length === 0) {
      this.getLocationsList(true);
    }
    this.setState({ isLoadingInsights: true });
    if(!this.state.jbParseMode){
    var body = {
      JobTitle: this.state.jobTitlesSelected.map((e) => ({
        Id: e.value,
        Name: e.label,
      })),

      Mandatory: this.state.skillsMandatorySelected.map((e) => ({
        Id: e.value,
        Name: e.label,
      })),

      Related: this.state.skillsRelatedSelected.map((e) => ({
        Id: e.value,
        Name: e.label,
      })),
      Locations: this.state.locationsSelected.map((e) => ({
        Id: e.value,
        Name: e.label,
      })),
      CompaniesIncluded: this.state.companiesIncludedSelected.map((e) => ({
        Id: e.value,
        Name: e.label,
        IsCurrent: this.state.isCompaniesIncludedCurrent,
      })),
      CompaniesExcluded: this.state.companiesExcludedSelected.map((e) => ({
        Id: e.value,
        Name: e.label,
        IsCurrent: this.state.isCompaniesExcludedCurrent,
      })),
      Education: [],
    };
    API.filter()
      .getSuggestions(body)
      .then((res) => {
        let p = document.getElementById("advanced-filters");
        p.removeAttribute("hidden");
        p = document.getElementById("start-sourcing-btn");
        p.removeAttribute("hidden");
        if (this.state.isFirstLoad) {
          //!!!!!
          ///скидывает
          this.setState({
            isFirstLoad: false,
            cachedCompanies: res.data.Table.Companies.map((e) => ({
              name: e.Name,
              count: e.Count,
            })),

            cachedTableLocations: res.data.Table.Locations.map((e) => ({
              name: e.Name,
              count: e.Count,
            })),

            cachedTableJobTitles: res.data.Table.JobTitles.map((e) => ({
              name: e.Name,
              count: e.Count,
            })),

            cachedTableSkills: res.data.Table.Skills.map((e) => ({
              name: e.Name,
              count: e.Count,
            })),
          });
        }
        this.setState({
          jobTitlesSuggestions: res.data.Suggestions.JobTitles.map((e) => ({
            value: e.Id,
            label: e.Name,
          })),
        });
        this.setState({
          skillsMandatorySuggestions: res.data.Suggestions.Skills.map((e) => ({
            value: e.Id,
            label: e.Name,
          })),
        });
        this.setState({
          skillsRelatedSuggestions: res.data.Suggestions.Skills.map((e) => ({
            value: e.Id,
            label: e.Name,
          })),
        });
        this.setState({
          tableJobTitles: res.data.Table.JobTitles.map((e) => ({
            name: e.Name,
            count: e.Count,
          })),
        });
        this.setState({
          tableSkills: res.data.Table.Skills.map((e) => ({
            name: e.Name,
            count: e.Count,
          })),
        });
        this.setState({
          tableLocations: res.data.Table.Locations.map((e) => ({
            name: e.Name,
            count: e.Count,
          })),
        });
        this.setState({
          tableCompanies: res.data.Table.Companies.map((e) => ({
            name: e.Name,
            count: e.Count,
          })),
        });

        this.setState({
          locationsSelected: res.data.ParsedLocations.map((e) => ({
            value: e.Id,
            label: e.Name,
          })),
        });

        this.setState({ isLoadingInsights: false });
        this.setState({
          matchedCount: this.isFiltersEmpty() ? defaultCount : res.data.Count,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    }else {
      API.filter()
      .getSuggestions(this.state.searchTextAreaVal).then(res => console.log(res))
    }
  }

  //---API CALLS END---

  selectSuggestedTitle(suggestedObj) {
    this.setState(
      { jobTitlesSelected: [...this.state.jobTitlesSelected, suggestedObj] },
      () => this.filtersChanged()
    );
  }

  selectSuggestedMandatory(suggestedObj) {
    this.setState(
      {
        skillsMandatorySelected: [
          ...this.state.skillsMandatorySelected,
          suggestedObj,
        ],
      },
      () => this.filtersChanged()
    );
  }

  selectSuggestedRelated(suggestedObj) {
    this.setState(
      {
        skillsRelatedSelected: [
          ...this.state.skillsRelatedSelected,
          suggestedObj,
        ],
      },
      () => this.filtersChanged()
    );
  }

  handleChangeTitle = (newValue, actionMeta) => {
    if (newValue !== null && newValue.length > 0) {
      this.setState({ jobTitlesSelected: newValue }, () =>
        this.filtersChanged()
      );
    } else {
      this.setState({ jobTitlesSelected: [] }, () => {
        this.filtersChanged();
      });
    }
  };

  handleJobTitleInputChange = (newValue, actionMeta) => {
    if (newValue !== null && newValue.length > 2) {
      this.setState({
        jobTitlesShowList: this.props.selectFiltersTitlesList.filter((title) =>
          title.label.toLowerCase().startsWith(newValue.toLowerCase())
        ),
      });
    } else {
      this.setState({ jobTitlesShowList: [] });
    }
  };

  handleLocationInputChange = (newValue, actionMeta) => {
    if (newValue !== null && newValue.length > 2) {
      this.setState({ locationsShowList: this.props.selectLocationsList });
    } else {
      this.setState({ locationsShowList: [] });
    }
  };

  handleChangeSkillsInputChange = (newValue, actionMeta) => {
    if (newValue !== null && newValue.length > 1) {
      this.setState({
        skillsShowList: this.props.selectFiltersSkillsList.filter((title) =>
          title.label.toLowerCase().startsWith(newValue.toLowerCase())
        ),
      });
    } else {
      this.setState({ skillsShowList: [] });
    }
  };

  handleChangeCompaniesInputChange = (newValue, actionMeta) => {
    if (newValue !== null && newValue.length > 1) {
      this.setState({
        companiesIncludedShowList: this.props.selectFiltersCompaniesList.filter(
          (title) =>
            title.label.toLowerCase().startsWith(newValue.toLowerCase())
        ),
      });
    } else {
      this.setState({ companiesIncludedShowList: [] });
    }
  };

  handleChangeCompaniesExcludedInputChange = (newValue, actionMeta) => {
    if (newValue !== null && newValue.length > 1) {
      this.setState({
        companiesExceludedShowList: this.props.selectFiltersCompaniesList.filter(
          (title) =>
            title.label.toLowerCase().startsWith(newValue.toLowerCase())
        ),
      });
    } else {
      this.setState({ companiesExceludedShowList: [] });
    }
  };

  handleChangeLocation = (newValue, actionMeta) => {
    if (newValue !== null && newValue.length > 0) {
      this.setState({ locationsSelected: newValue }, () =>
        this.filtersChanged()
      );
    } else {
      this.setState({ locationsSelected: [] }, () => {
        if (!this.isFiltersEmpty()) this.filtersChanged();
      });
    }
  };

  handleChangeCompaniesIncluded = (newValue, actionMeta) => {
    if (newValue !== null && newValue.length > 0) {
      this.setState({ companiesIncludedSelected: newValue }, () =>
        this.filtersChanged()
      );
    } else {
      this.setState({ companiesIncludedSelected: [] }, () => {
        if (!this.isFiltersEmpty()) this.filtersChanged();
      });
    }
  };

  handleChangeCompaniesExcluded = (newValue, actionMeta) => {
    if (newValue !== null && newValue.length > 0) {
      this.setState({ companiesExcludedSelected: newValue }, () =>
        this.filtersChanged()
      );
    } else {
      this.setState({ companiesExcludedSelected: [] }, () => {
        if (!this.isFiltersEmpty()) this.filtersChanged();
      });
    }
  };

  resetAllSugestions() {
    this.setState({ jobTitlesSuggestions: [] });
    this.setState({ skillsMandatorySuggestions: [] });
    this.setState({ skillsRelatedSuggestions: [] });
  }

  handleChangeSkillsRelated = (newValue, actionMeta) => {
    if (newValue !== null && newValue.length > 0) {
      this.setState({ skillsRelatedSelected: newValue }, () =>
        this.filtersChanged()
      );
    } else {
      this.setState({ skillsRelatedSelected: [] }, () => {
        if (!this.isFiltersEmpty()) this.filtersChanged();
      });
    }
  };

  handleChangeSkillsMandatory = (newValue, actionMeta) => {
    if (newValue !== null && newValue.length > 0) {
      this.setState({ skillsMandatorySelected: newValue }, () =>
        this.filtersChanged()
      );
    } else {
      this.setState({ skillsMandatorySelected: [] }, () => {
        if (!this.isFiltersEmpty()) this.filtersChanged();
      });
    }
  };

  isFiltersEmpty() {
    if (
      this.state.jobTitlesSelected.length > 0 ||
      this.state.skillsMandatorySelected.length > 0 ||
      this.state.companiesIncludedSelected.length > 0 ||
      this.state.companiesExcludedSelected.length > 0 ||
      this.state.locationsSelected.length > 0 ||
      this.state.searchTextAreaVal.length > 0
    ) {
      return false;
    } else return true;
  }

  isExtraFiltersEmpty() {
    //extt
    if (
      this.state.jobTitlesSelected.length === 1 &&
      this.state.skillsMandatorySelected.length === 0 &&
      this.state.companiesIncludedSelected.length === 0 &&
      this.state.companiesExcludedSelected.length === 0 &&
      this.state.skillsRelatedSelected.length === 0 &&
      this.state.locationsSelected.length === 0
    ) {
      return true;
    }
    return false;
  }

  startSourcing() {
    if (
      !(
        this.state.jobTitlesSelected.length > 0 ||
        this.state.skillsMandatorySelected.length > 0 ||
        this.state.locationsSelected.length > 0 ||
        this.state.companiesIncludedSelected.length > 0 ||
        this.state.companiesExcludedSelected > 0 ||
        this.state.searchTextAreaVal.length > 0
      )
    )
      return;

    const body = {
      JobTitle: this.state.jobTitlesSelected.map((e) => ({
        Id: e.value,
        Name: e.label,
      })),
      Mandatory: this.state.skillsMandatorySelected.map((e) => ({
        Id: e.value,
        Name: e.label,
      })),
      Related: this.state.skillsRelatedSelected.map((e) => ({
        Id: e.value,
        Name: e.label,
      })),
      Locations: this.state.locationsSelected.map((e) => ({
        Id: e.value,
        Name: e.label,
      })),
      CompaniesIncluded: this.state.companiesIncludedSelected.map((e) => ({
        Id: e.value,
        Name: e.label,
        IsCurrent: this.state.isCompaniesIncludedCurrent,
      })),
      CompaniesExcluded: this.state.companiesExcludedSelected.map((e) => ({
        Id: e.value,
        Name: e.label,
        IsCurrent: this.state.isCompaniesExcludedCurrent,
      })),
      Educations: this.state.educationsSelected.map((e) => ({
        Id: e.value,
        Name: e.label,
      })),
    };

    API.sourcing()
      .createSourcing(this.state.projectId, body)
      .then((res) => {
        API.sourcing()
          .startSourcingConfirmed(this.state.projectId, res.data)
          .then((res) =>
            this.props.history.push(`/projects/${this.state.projectId}`)
          )
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div id="loader">
          <Loader type="Bars" color="#0089FF" height="60" width="60" />
        </div>
      );
    }

    if (this.isFiltersEmpty()) {
      var insights = (
        <div
          className="sourcing-right-info-empty"
          id="sourcing-right-info-empty"
        >
          <p>Add filters on the left side to see Talent Insights</p>
        </div>
      );
    } else if (this.state.isLoadingInsights) {
      var insights = (
        <div id="loader" style={{ backgroundColor: "transparent" }}>
          <Loader type="Bars" color="#0089FF" height="60" width="60" />
        </div>
      );
    } else if (this.state.matchedCount === 0) {
      var insights = (
        <div
          className="sourcing-right-info-empty"
          id="sourcing-right-info-empty"
        >
          <div className="inner-element-background">
            <div className="inner-element" style={{ fontWeight: "bold" }}>
              No Results
            </div>
            <div className="inner-element inner-element-padding-less">
              We couldn't find what you were looking for.
            </div>
            <div className="inner-element inner-element-padding-less">
              Please, enlarge the filters and try again!
            </div>
          </div>
        </div>
      );
    } else {
      var insights = (
        <div className="sourcing-right-info-filled">
          {/*  ONE TAB(INSIGHTS).Contains blue diagrams  */}
          <div className="sourcing-right-info-tab">
            {/*  ONE BLOCK WITH DIAGRAMS  */}
            {this.state.tableJobTitles.length ? (
              <div className="sourcing-right--item">
                <div className="sourcing-right--item-title">Job Titles</div>
                <div className="less">
                  <div className="sourcing-right--item-info">
                    {/*  One row with diagram  */}
                    {this.state.showCached
                      ? this.state.cachedTableJobTitles.map((e, i) => (
                        <div className="one-info-row" key={i}>
                          <div className="info-row-title">{e.name}</div>
                          <div className="info-row-diagram">
                            <p className="blue-diagram" />
                          </div>
                          <div className="info-row-number">{e.count}</div>
                        </div>
                      ))
                      : this.state.tableJobTitles.map((e, i) => (
                        <div className="one-info-row" key={i}>
                          <div className="info-row-title">{e.name}</div>
                          <div className="info-row-diagram">
                            <p className="blue-diagram" />
                          </div>
                          <div className="info-row-number">{e.count}</div>
                        </div>
                      ))}
                  </div>
                  {/* end of sourcing-right--item-info  */}
                  {this.state.tableJobTitles.length > 5 ? (
                    <div
                      onClick={this.handleShowMore}
                      className="sourcing-right--more-btn"
                    >
                      Show more
                    </div>
                  ) : (
                      ""
                    )}
                </div>
              </div>
            ) : (
                ""
              )}
            {/* end of sourcing-right--item */}
            {/*  ONE BLOCK WITH DIAGRAMS  */}
            {this.state.tableSkills.length ? (
              <div className="sourcing-right--item">
                <div className="sourcing-right--item-title">Skills</div>
                <div className="less">
                  <div className="sourcing-right--item-info">
                    {/*  One row with diagram  */}
                    {this.state.showCached
                      ? this.state.cachedTableSkills.map((e, i) => (
                        <div className="one-info-row" key={i}>
                          <div className="info-row-title">{e.name}</div>
                          <div className="info-row-diagram">
                            <p className="blue-diagram" />
                          </div>
                          <div className="info-row-number">{e.count}</div>
                        </div>
                      ))
                      : this.state.tableSkills.map((e, i) => (
                        <div className="one-info-row" key={i}>
                          <div className="info-row-title">{e.name}</div>
                          <div className="info-row-diagram">
                            <p className="blue-diagram" />
                          </div>
                          <div className="info-row-number">{e.count}</div>
                        </div>
                      ))}
                  </div>
                  {/* end of sourcing-right--item-info  */}
                  {this.state.tableSkills.length > 5 ? (
                    <div
                      onClick={this.handleShowMore}
                      className="sourcing-right--more-btn"
                    >
                      Show more
                    </div>
                  ) : (
                      ""
                    )}
                </div>
              </div>
            ) : (
                ""
              )}
            {/* end of sourcing-right--item */}
            {/*  ONE BLOCK WITH DIAGRAMS  */}
            {this.state.tableLocations.length ? (
              <div className="sourcing-right--item">
                <div className="sourcing-right--item-title">Locations</div>
                <div className="less">
                  <div className="sourcing-right--item-info">
                    {/*  One row with diagram  */}
                    {this.state.showCached
                      ? this.state.cachedTableLocations.map((
                        e,
                        i //HERE
                      ) => (
                          <div className="one-info-row" key={i}>
                            <div className="info-row-title">{e.name}</div>
                            <div className="info-row-diagram">
                              <p className="blue-diagram" />
                            </div>
                            <div className="info-row-number">{e.count}</div>
                          </div>
                        ))
                      : this.state.tableLocations.map((
                        e,
                        i //HERE
                      ) => (
                          <div className="one-info-row" key={i}>
                            <div className="info-row-title">{e.name}</div>
                            <div className="info-row-diagram">
                              <p className="blue-diagram" />
                            </div>
                            <div className="info-row-number">{e.count}</div>
                          </div>
                        ))}
                  </div>
                  {/* end of sourcing-right--item-info  */}
                  {this.state.tableLocations.length > 5 ? (
                    <div
                      onClick={this.handleShowMore}
                      className="sourcing-right--more-btn"
                    >
                      Show more
                    </div>
                  ) : (
                      ""
                    )}
                </div>
              </div>
            ) : (
                ""
              )}
            {/* end of sourcing-right--item */}
            {/*  ONE BLOCK WITH DIAGRAMS  */}
            {this.state.tableCompanies.length ? (
              <div className="sourcing-right--item">
                <div className="sourcing-right--item-title">Companies</div>
                <div className="less">
                  <div className="sourcing-right--item-info">
                    {/*  One row with diagram  */}
                    {this.state.showCached
                      ? this.state.cachedCompanies.map((e, i) => (
                        <div className="one-info-row" key={i}>
                          <div className="info-row-title">{e.name}</div>
                          <div className="info-row-diagram">
                            <p className="blue-diagram" />
                          </div>
                          <div className="info-row-number">{e.count}</div>
                        </div>
                      ))
                      : this.state.tableCompanies.map((e, i) => (
                        <div className="one-info-row" key={i}>
                          <div className="info-row-title">{e.name}</div>
                          <div className="info-row-diagram">
                            <p className="blue-diagram" />
                          </div>
                          <div className="info-row-number">{e.count}</div>
                        </div>
                      ))}
                  </div>
                  {/* end of sourcing-right--item-info  */}
                  {this.state.tableCompanies.length > 5 ? (
                    <div
                      onClick={this.handleShowMore}
                      className="sourcing-right--more-btn"
                    >
                      Show more
                    </div>
                  ) : (
                      ""
                    )}
                </div>
              </div>
            ) : (
                ""
              )}
            {/* end of sourcing-right--item */}
          </div>
          {/* end of sourcing-right-info-tab */}

          {/*  ONE TAB(PERSONA)  */}
          <div className="sourcing-right-info-tab" />
        </div>
      );
      {
        /* end of sourcing-right-info-filled */
      }
    }
    return (
      <div className="main-content job-filter" id="filters-main-content">
        <div className="main-content-item sourcing-content">
          {/*  LEFT PART WITH ALL FILTERRS  */}
          <div className="sourcing-left" id="left">
            {/*  MAIN FILTERS  */}
            <div className="main-filters">
              <div className="main-filters-title">
                <p className="main-filters-title-text">AI Sourcing</p>
                <button
                  onClick={() => {
                    this.setState({ jbParseMode: !this.state.jbParseMode });
                  }}
                >
                  JB Parse
                </button>
                <Popup
                  trigger={<span className="hint">?</span>}
                  position="bottom center"
                  on="hover"
                  closeOnDocumentClick
                  mouseLeaveDelay={150}
                  mouseEnterDelay={0}
                  contentStyle={{
                    padding: "8px",
                    border: "none",
                    color: "#fff",
                    background: "#000",
                  }}
                  arrow={true}
                >
                  <div className="hint-info">
                    Hireeex compiles and rankes candidate profiles from
                    professional communities like Stackoverflow, Twitter,
                    Github, Facebook, Habr, MoiKrug, Linkedin, Xing, Vkontakte
                    and others.
                  </div>
                </Popup>
                {/* <button className="resume-btn">Resume/ID Parsing</button> */}
              </div>
              <div className="main-filters-inner">
                {/*  ONE FILTER  */}
                <div
                  className="filter-item hide-arrow"
                  style={{ width: `${this.state.filterWidth}px` }}
                >
                  <div className="filter-title">
                    Enter a keyword
                    <Popup
                      trigger={<span className="hint">?</span>}
                      position="bottom center"
                      on="hover"
                      closeOnDocumentClick
                      mouseLeaveDelay={150}
                      mouseEnterDelay={0}
                      contentStyle={{
                        padding: "8px",
                        border: "none",
                        color: "#fff",
                        background: "#000",
                      }}
                      arrow={true}
                    >
                      <div className="hint-info">
                        Enter keywords. Example: "Frontend developer" OR
                        "Frontend developer in London". Use preposition "in" to
                        determine location.
                      </div>
                    </Popup>
                  </div>
                  {this.state.jbParseMode ? (
                    <textarea placeholder="Input search string" value={this.state.searchTextAreaVal} onChange={(e) => {this.handleTextArea(e)}} />
                  ) : (
                      <>
                        <div className="filter-select-row">
                          {/* <CreatableSelect
isClearable
onChange={this.handleChange}
onInputChange={this.handleInputChange}
// options={colourOptions}
/> */}
                          <Creatable
                            autosize={true}
                            isMulti
                            name="jobTitles"
                            options={this.state.jobTitlesShowList}
                            onChange={this.handleChangeTitle}
                            className="basic-multi-select multi-select-edit"
                            classNamePrefix="select"
                            maxMenuHeight="160px"
                            placeholder="Example: Frontend developer in London"
                            onInputChange={this.handleJobTitleInputChange}
                            value={this.state.jobTitlesSelected}
                            formatCreateLabel={(userInput) => `${userInput}`}

                          // styles={{width: '100px'}}
                          />
                        </div>
                        <div className="filter-select-options">
                          {this.state.jobTitlesSuggestions.map((name, i) => (
                            <p
                              onClick={() => this.selectSuggestedTitle(name)}
                              key={name.value}
                              className="filter-one-option"
                            >
                              {name.label}
                              <span>+</span>
                            </p>
                          ))}
                        </div>
                      </>
                    )}
                </div>
                {/* end of filter-item */}
                {/*  ONE FILTER  */}

                {/* end of filter-item */}
                {/*  ONE FILTER  */}

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
            {/*  ADVANCED FILTERS  */}
            {!this.state.jbParseMode && (
              <div id="advanced-filters" className="advanced-filters" hidden>
                {/*  HIDE ADVANCED FILERS ROW  */}
                <div
                  className="filter-item"
                  style={{ width: `${this.state.filterWidth}px` }}
                >
                  <div className="filter-title">Locations</div>
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
                      formatCreateLabel={(userInput) => `${userInput}`}
                    />
                  </div>
                </div>
                <div
                  className="filter-item"
                  style={{ width: `${this.state.filterWidth}px` }}
                >
                  <div className="filter-title">Skills</div>
                  <div className="filter-select-row">
                    <Select
                      isMulti
                      name="skillsRelated"
                      options={this.state.skillsShowList}
                      onInputChange={this.handleChangeSkillsInputChange}
                      onChange={this.handleChangeSkillsRelated}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Add Skills"
                      value={this.state.skillsRelatedSelected}
                      formatCreateLabel={(userInput) => `${userInput}`}
                    />
                  </div>
                  <div className="filter-select-options">
                    {this.state.skillsRelatedSuggestions.map((name, i) => (
                      <p
                        onClick={() => this.selectSuggestedRelated(name)}
                        key={name.value}
                        className="filter-one-option"
                      >
                        {name.label}
                        <span>+</span>
                      </p>
                    ))}
                  </div>
                </div>
                <div className="advanced-filters-title">
                  <p
                    className="hide-advanced-filters"
                    onClick={() =>
                      this.setState((state) => ({
                        allFiltersShow: !state.allFiltersShow,
                      }))
                    }
                  >
                    {this.state.allFiltersShow ? "Hide" : "Show"} Advanced
                    Filters
                  </p>
                  <div
                    className="advanced-filter-labels"
                    style={{
                      display: this.state.allFiltersShow ? "flex" : "none",
                    }}
                  >
                    <p
                      className="advanced-filter-not-applied"
                      style={{
                        display:
                          this.state.companiesIncludedSelected.length === 0
                            ? "flex"
                            : "none",
                      }}
                    >
                      0 advanced filters applied
                    </p>
                    <p
                      className="advanced-filter-applied"
                      style={{
                        display:
                          this.state.companiesIncludedSelected.length > 0
                            ? "flex"
                            : "none",
                      }}
                    >
                      <span className="applied-filters-number">1</span>
                      advanced filters applied
                    </p>
                  </div>
                </div>
                {/* end of advanced-filters-title */}
                {/*  ALL ADVANCED FILTERS  */}
                <div
                  className="advanced-filters-inner"
                  style={{
                    display: this.state.allFiltersShow ? "block" : "none",
                  }}
                >
                  {/* <div className="advanced-filter experience-filter">
                           <div className="filter-item">
                              <div className="filter-title" onClick={() => this.setState(state => ({filterExperienceShow: !state.filterExperienceShow}))}>
                                 <div className="filter-title-left">
                                    <i className="fa fa-angle-right" style={{display: !this.state.filterExperienceShow ? 'block' : 'none' }} aria-hidden="true"></i>
                                    <i className="fa fa-angle-down" style={{display: this.state.filterExperienceShow ? 'block' : 'none' }}  aria-hidden="true"></i>
                                    <span>Experience</span>
                                 </div>  
                                 <span className="filter-title-details">(Years in Current Company, Years in Current Role, Seniority)</span>
                              </div>
                              <div className="filter-item-info" style={{display: this.state.filterExperienceShow ? 'block' : 'none' }}>
                                 <div className="filter-subtitle">Years in Current Company</div>
                                 <div className="filter-select-row">
                                    <input className="filter-select-input" type="text" placeholder="Choose Experience Ranges From Below"/>
                                 </div>
                                 <div className="filter-select-options">
                                    <p className="filter-one-option"> 0.5 Years <span>+</span></p>
                                    <p className="filter-one-option">0.5-1 Years<span>+</span></p>
                                    <p className="filter-one-option">1-2 Years<span>+</span></p>
                                    <p className="filter-one-option">2-4 Years<span>+</span></p>
                                    <p className="filter-one-option">4+ Years<span>+</span></p>
                                 </div>
                              </div>
                           </div>
                        </div> */}
                  {/* end of experience-filter */}
                  <div className="advanced-filter experience-filter">
                    <div className="filter-item">
                      {/*  Filter title  */}
                      <div
                        className="filter-title"
                        onClick={() =>
                          this.setState((state) => ({
                            filterCompaniesShow: !state.filterCompaniesShow,
                          }))
                        }
                      >
                        <div className="filter-title-left">
                          <i
                            className="fa fa-angle-right"
                            style={{
                              display: !this.state.filterCompaniesShow
                                ? "block"
                                : "none",
                            }}
                            aria-hidden="true"
                          />
                          <i
                            className="fa fa-angle-down"
                            style={{
                              display: this.state.filterCompaniesShow
                                ? "block"
                                : "none",
                            }}
                            aria-hidden="true"
                          />
                          <span>Companies</span>
                        </div>
                      </div>
                      {/* end of filter-title  */}
                      {/*  Main part of filter  */}
                      <div
                        className="filter-item-info"
                        style={{
                          display: this.state.filterCompaniesShow
                            ? "block"
                            : "none",
                        }}
                      >
                        <div className="filter-chekboxes-row">
                          <div className="filter-chekboxes-inner">
                            <span>Companies</span>
                            <div className="filter-chekboxes-form" action="#">
                              <p
                                id="included-checkbox"
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({
                                    isCompaniesIncludedCurrent: !this.state
                                      .isCompaniesIncludedCurrent,
                                  });
                                }}
                                className="filter-chekboxes-item"
                              >
                                <input
                                  type="checkbox"
                                  name="checkbox"
                                  id="checkbox_id1"
                                  checked={
                                    this.state.isCompaniesIncludedCurrent
                                  }
                                />
                                <label htmlFor="checkbox_id1">
                                  Only Current Companies
                                  <Popup
                                    trigger={<span className="hint">?</span>}
                                    position="bottom center"
                                    on="hover"
                                    closeOnDocumentClick
                                    mouseLeaveDelay={150}
                                    mouseEnterDelay={0}
                                    contentStyle={{
                                      padding: "8px",
                                      border: "none",
                                      color: "#fff",
                                      background: "#000",
                                    }}
                                    arrow={true}
                                  >
                                    <div className="hint-info">
                                      Enlarge your search to companies that are
                                      similar to your input.
                                    </div>
                                  </Popup>
                                </label>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="filter-select-row">
                          <Select
                            isMulti
                            name="companiesIncluded"
                            onInputChange={
                              this.handleChangeCompaniesInputChange
                            }
                            options={this.state.companiesIncludedShowList}
                            onChange={this.handleChangeCompaniesIncluded}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Search From Specific Companies"
                            value={this.state.companiesIncludedSelected}
                            formatCreateLabel={(userInput) => `${userInput}`}
                          />
                        </div>
                        <div className="filter-chekboxes-row">
                          <div className="filter-chekboxes-inner">
                            <span>Excluded From Companies</span>
                            <div className="filter-chekboxes-form" action="#">
                              <p
                                id="excluded-checkbox"
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({
                                    isCompaniesExcludedCurrent: !this.state
                                      .isCompaniesExcludedCurrent,
                                  });
                                }}
                                className="filter-chekboxes-item"
                              >
                                <input
                                  type="checkbox"
                                  name="checkbox"
                                  id="checkbox_id3"
                                  checked={
                                    this.state.isCompaniesExcludedCurrent
                                  }
                                />
                                <label htmlFor="checkbox_id3">
                                  Only From Current Companies
                                </label>
                              </p>
                            </div>
                          </div>
                          {/*<a className="bulk-upload-link" href="#">Bulk upload</a>*/}
                        </div>
                        <div className="filter-select-row">
                          <Select
                            isMulti
                            name="companiesExcluded"
                            onInputChange={
                              this.handleChangeCompaniesExcludedInputChange
                            }
                            options={this.state.companiesExceludedShowList}
                            onChange={this.handleChangeCompaniesExcluded}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Add Excluded Company Names"
                            value={this.state.companiesExcludedSelected}
                            formatCreateLabel={(userInput) => `${userInput}`}
                          />
                        </div>
                      </div>
                      {/* end of filter-item-info */}
                      {/*<div className="filter-subtitle">Industry</div>
                                 <div className="filter-select-row">
                                    <input className="filter-select-input" type="text" placeholder="Select Industries"/>
                                 </div>*/}
                    </div>
                    {/* end of filter-item */}
                  </div>
                  {/* end of experience-filter */}
                </div>
              </div>
            )}

            <button
              id="start-sourcing-btn"
              onClick={() => this.startSourcing()}
              className="start-sourcing-btn"
              hidden
            >
              Start searching
            </button>
          </div>
          {/* end of sourcing-left */}
          {/*  RIGHT PART WITH DIAGRAMS  */}
          <div className="sourcing-right">
            {/*  TITLE OF RIGHT PART OF SOURCING TAB  */}
            <div className="sourcing-right-title">
              <div className="sourcing-right-tabs">
                <p className="sourcing-right--one-tab sourcing-right--one-tab-active">
                  Talent Insights
                </p>
                {/* <p className="sourcing-right--one-tab">Personas</p> */}
              </div>
              <div
                className="sourcing-candidates"
                style={{ textAlign: "right" }}
              >
                <span>Hireeex has</span>
                <span className="sourcing-candidates-number">
                  {this.isFiltersEmpty()
                    ? defaultCount
                    : this.state.matchedCount}
                </span>
                <span>profiles in pool</span>
                <p style={{ fontWeight: "bold", color: "red" }}>
                  {this.state.matchedCount !== 0
                    ? ""
                    : "*No results based on your filters. Enlarge your search criterias."}
                </p>
              </div>
            </div>
            {/* end of sourcing-right-title */}
            {/*  MAIN INFORMATION(DIAGRAMS)   */}
            <div
              className="sourcing-right-info"
              style={{
                display: this.state.isLoadingInsights ? "initial" : "flex",
              }}
            >
              {insights}
            </div>
            {/* end of sourcing-right-info */}
          </div>
          {/* end of sourcing-right */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  selectFiltersCompaniesList: selectFiltersCompaniesList,
  selectLocationsList: selectFiltersLocationsList,
  selectFiltersSkillsList: selectFiltersSkillsList,
  selectFiltersTitlesList: selectFiltersTitlesList,
});

const mapDispatchToProps = (dispatch) => ({
  fetchTitlesStartAsync: () => dispatch(fetchTitlesStartAsync()),
  fetchSkillsStartAsync: () => dispatch(fetchSkillsStartAsync()),
  fetchLocationsStartAsync: (history) =>
    dispatch(fetchLocationsStartAsync(history)),
  fetchCompaniesStartAsync: (id) => dispatch(fetchCompaniesStartAsync(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);
