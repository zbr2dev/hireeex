const INITIAL_STATE = {
  projects: [],
  isLoading: false,
  error: '',
  isDeleting: false,
  isDeleted: false,
}

const ProjectsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    //deleting

    case 'DELETE_PROJECT_START':
    
      return {
        ...state,
        isDeleting:true,
        isDeleted: false
      }
    case 'DELETE_PROJECT_SUCCESS':
 
    const newProjects =  state.projects.filter(item => item.Id !== action.payload);
   const newState = { 
          ...state,
          isDeleting:false,
          isDeleted: true,
          projects: newProjects
        }
  
        return newState
        case 'SET_DELETED_TO_FALSE':
          return {
            ...state,
            isDeleting:false,
            isDeleted: false,
          }
    case 'FETCH_PROJECTS_START':
    
        return {
          ...state,
          isLoading: true
        }
    case 'FETCH_PROJECTS_SUCCESS':

      return {
        ...state,
        projects: action.payload,
        isLoading: false
      }

      case 'FETCH_PROJECTS_FAILURE':

      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    default:
      return state
  }
}

export default ProjectsReducer
