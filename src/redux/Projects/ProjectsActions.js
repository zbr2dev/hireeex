import API from '../../API'

//FETCH ALL PROJECTS
const fetchProjectsStart = () => ({
  type: 'FETCH_PROJECTS_START'
})

const fetchProjectsFailure = err => ({
  type: 'FETCH_PROJECTS_FAILURE',
  payload: err
})

const fetchProjectsSuccess = projects => ({
  type: 'FETCH_PROJECTS_SUCCESS',
  payload: projects
})

export const fetchProjectsStartAsync = () => {
  return dispatch => {
    dispatch(fetchProjectsStart())
    API.projects()
      .getAllProjects()
      .then(res => {
        if (!res.data) {
          API.projects()
            .checkForCreatedProjects()
            .then(res => dispatch(fetchProjectsSuccess(res.data)))
        } else {
          return dispatch(fetchProjectsSuccess(res.data))
        }
      })
      .catch(e => dispatch(fetchProjectsFailure(e.message)))
  }
}

//DELETE SINGLE PROJECT

const deleteProjectStart = id => ({
  type: 'DELETE_PROJECT_START',
  payload: id
})

const deleteProjectSuccess = id => ({
  type: 'DELETE_PROJECT_SUCCESS',
  payload: id
})

const deleteProjectFailure = () => ({
  type: 'DELETE_PROJECT_FAILURE'
})

export const setDeletedToFalse = () => ({
  type: 'SET_DELETED_TO_FALSE'
})
export const deleteProjectStartAsync = id => {
  return dispatch => {
    dispatch(deleteProjectStart())
    API.projects()
      .deleteProject(id)
      .then(res => {
        // console.log(res, 'RES DELETED')
        dispatch(deleteProjectSuccess(id))
      })
      .catch(e => console.log(e))
  }
}

export const addProjectStart = () => ({
  type: 'ADD_PROJECT_START'
})

export const addProjectSuccess = () => ({
  type: 'ADD_PROJECT_Success'
})

export const addProjectStartAsync = input => {
  return dispatch => {
    dispatch(addProjectStart())
    API.projects()
      .createProject(input)
      .then(res => dispatch(addProjectSuccess))
      .catch(e => console.log(e.message))
  }
}
