import API from '../../API'

const getUserStart = () => ({
    type: 'GET_USER_START'
  })

  const getUserFailure = err => ({
    type: 'GET_USER_FAILURE',
    payload: err
  })

  const getUserSuccess = data => ({
    type: 'GET_USER_SUCCESS',
    payload: data
  })

  export const getUserStartAsync = () => {
    return dispatch => {
      API.user().getUser().then(res=> {
          const data = {Name: `${res.data.FirstName} ${res.data.LastName}`,
          Email: res.data.Email,
          ShortName: res.data.FirstName.charAt(0) + res.data.LastName.charAt(0),
      }
     return data
      }).then(res=>dispatch(getUserSuccess(res)))
      .catch(e=>console.log("ERROR"))
    }
  }