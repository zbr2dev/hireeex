import API from '../../API'

const fetchCandidatesStart = () => ({
    type: 'FETCH_CANDIDATES_START'
  })
  
  const fetchCandidatesFailure = err => ({
    type: 'FETCH_CANDIDATES_FAILURE',
    payload: err
  })
  
  const fetchCandidatesSuccess = titles => ({
    type: 'FETCH_CANDIDATES_SUCCESS',
    payload: titles
  })
  
  export const fetchCandidatesStartAsync = (id, index) => {
    return dispatch => {
      dispatch(fetchCandidatesStart())
      API.candidates().getCandidatesBySourcing(id, index).then(data=>dispatch(fetchCandidatesSuccess(data.data)))
    }
  }


  const fetchStageStart = () => ({
    type: 'FETCH_STAGE_START'
  })
  
  const fetchStageFailure = err => ({
    type: 'FETCH_STAGE_FAILURE',
    payload: err
  })
  
  const fetchStageSuccess = titles => ({
    type: 'FETCH_STAGE_SUCCESS',
    payload: titles
  })
  
  export const fetchStageStartAsync = id=> {
    return dispatch => {
      dispatch(fetchStageStart())
      API.sourcing().getStageType(id)
        .then(res => dispatch(fetchStageSuccess(res.data)))
        .catch(e => fetchStageFailure(e.message))
    }
  }