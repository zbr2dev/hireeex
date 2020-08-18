const INITIAL_STATE = {
    titlesList: [],
    error: '',
    skillsList: [],
    locationsList: [],
    companiesList: []
  }
  
  const FiltersReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "FETCH_TITLES_SUCCESS": return {
          ...state,
          titlesList: action.payload
      }

      case "FETCH_SKILLS_SUCCESS": 

      return {
        ...state,
        skillsList: action.payload
    }

    case "FETCH_LOCATIONS_SUCCESS": 

      return {
        ...state,
        locationsList: action.payload
    }

    case "FETCH_COMPANIES_SUCCESS": 
    return {
      ...state,
      companiesList: action.payload
  }
      default:
        return state
    }
  }
  
  export default FiltersReducer
  