import API from '../../API'

//FETCH TITLES
//API.filter().getTitles(history)

const fetchTitlesStart = () => ({
  type: 'FETCH_TITLES_START'
})

const fetchTitlesFailure = err => ({
  type: 'FETCH_TITLES_FAILURE',
  payload: err
})

const fetchTitlesSuccess = titles => ({
  type: 'FETCH_TITLES_SUCCESS',
  payload: titles
})

export const fetchTitlesStartAsync = history => {
  return dispatch => {
    dispatch(fetchTitlesStart())
    API.filter()
      .getTitles(history)
      .then(res => res.data.map(e=>({
        value: e.Id,
        label: e.Name,
      })))
      .then(data => dispatch(fetchTitlesSuccess(data)))
      .catch(e => fetchTitlesFailure(e.message))
  }
}

const fetchSkillsStart = () => ({
  type: 'FETCH_SKILLS_START'
})

const fetchSkillsFailure = err => ({
  type: 'FETCH_SKILLS_FAILURE',
  payload: err
})

const fetchSkillsSuccess = data => ({
  type: 'FETCH_SKILLS_SUCCESS',
  payload: data
})

export const fetchSkillsStartAsync = () => {
  return dispatch => {
    dispatch(fetchSkillsStart())
    API.filter()
      .getSkills()
      .then(res => res.data.map( item=>({
        value: item.Id,
        label: item.Name,
      }))).then(data=>dispatch(fetchSkillsSuccess(data)))
      .catch(e => console.log('action error'))
  }
}

const fetchLocationsStart = () => ({
  type: 'FETCH_LOCATIONS_START'
})

const fetchLocationsFailure = err => ({
  type: 'FETCH_LOCATIONS_FAILURE',
  payload: err
})

const fetchLocationsSuccess = data => ({
  type: 'FETCH_LOCATIONS_SUCCESS',
  payload: data
})

export const fetchLocationsStartAsync = history => {
  return dispatch => {
    dispatch(fetchLocationsStart())
    API.filter()
      .getLocations(history)
      .then(res => res.data.map(e=>({
        value: e.Id,
        label: e.Name
     }))).then(res=>dispatch(fetchLocationsSuccess(res)))
      .catch(e => fetchLocationsFailure(e.message))
  }
}
///GET COMPANIES
const fetchCompaniesStart = () => ({
  type: 'FETCH_COMPANIES_START'
})

const fetchCompaniesFailure = err => ({
  type: 'FETCH_COMPANIES_FAILURE',
  payload: err
})

const fetchCompaniesSuccess = titles => ({
  type: 'FETCH_COMPANIES_SUCCESS',
  payload: titles
})

export const fetchCompaniesStartAsync = () => {
  return dispatch => {
    dispatch(fetchCompaniesStart())
    API.filter()
      .getCompanies()
      .then(res =>
        res.data.map(e => ({
          value: e.Id,
          label: e.Name
       }))
        )
        .then(result => dispatch(fetchCompaniesSuccess(result)))
      .catch(e => fetchCompaniesFailure(e.message))
  }
}