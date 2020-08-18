const INITIAL_STATE = {
  candidates: [],
  stageType: '',
  isLoadingCandidates: false
  }
  
  const CandidatesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
     case "FETCH_STAGE_SUCCESS": 
     return {
       ...state,
       stageType: action.payload
     }
     case "FETCH_CANDIDATES_START": 
     return {
       ...state,
       isLoadingCandidates: true
     }

     case "FETCH_CANDIDATES_SUCCESS": 
     return {
       ...state,
       isLoadingCandidates: false,
       candidates: action.payload
     }
      default:
        return state
    }
  }
  
  export default CandidatesReducer
  