const INITIAL_STATE = {
data: ''
}

const UserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_USER_START': 
    console.log('GET USER STARt')

    case 'GET_USER_SUCCESS':
      return {
        ...state,
        data: action.payload
      }

    
    default:
      return state
  }
}

export default UserReducer
