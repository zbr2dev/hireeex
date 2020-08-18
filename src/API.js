import axios from 'axios';

axios.defaults.headers.common['Authorization'] = 'bearer ' + localStorage.getItem('Token');

axios.interceptors.response.use(response => {
    return response;
 }, error => {
   if (error.response.status === 401) {
    localStorage.removeItem('Token');
    window.location.reload();
   }
   return error.response;
 });

export const domain = "https://api.hireeex.com";
//export const domain = "http://localhost:60856";

export default {
    user() {
        return {
          getUser: () => axios.get(`${domain}/api/Account/UserInfo`),
          getUserInfo: () => axios.get(`${domain}/api/Account/GetUserDetailsInfo`),
          changePassword: (body) => axios.post(`${domain}/api/Account/ChangePassword`, body),
          updateUserInfo: (body) => axios.post(`${domain}/api/Account/UpdateUserInfo`, body), 
        //   getAll: () => axios.get(url),
        //   update: (toUpdate) =>  axios.put(url,toUpdate),
        //   create: (toCreate) =>  axios.put(url,toCreate),
        //   delete: ({ id }) =>  axios.delete(`${url}/${id}`)
        }
      },

    projects() {
        return {
            getAllProjects: () => axios.get(`${domain}/api/Projects`),
            createProject: (body) => axios.post(`${domain}/api/Projects`, body),
            deleteProject: (id) => axios.delete(`${domain}/api/Projects/${id}`),
            checkForCreatedProjects: () => axios.get(`${domain}/api/Projects/CheckForCreatedProjects`),
        }
    },

    sourcing() {
        return {
            getAllSourcings: (projectId) => axios.get(`${domain}/api/Sourcing/GetTasksList?projectId=${projectId}`),
            createSourcing: (id,body) => axios.post(`${domain}/api/Sourcing/CreateSourcing?projectId=${id}`, body),
            getSourcingCount: (id) => axios.get(`${domain}/api/Sourcing/GetSourcingCount?projectId=${id}`),
            startSourcingConfirmed: (projectId,sourcingId) => axios.get(`${domain}/api/Sourcing/StartSourcingConfirm?projectId=${projectId}&sourcingId=${sourcingId}`), 
            getTopFive: (id) => axios.get(`${domain}/api/Sourcing/GetTopFive?sourcingId=${id}`),
            goodFit: (sourcingId,candidateId) => axios.post(`${domain}/api/Sourcing/GoodFit?sourcingId=${sourcingId}&candidateId=${candidateId}`),
            badFit: (sourcingId,candidateId) => axios.post(`${domain}/api/Sourcing/BadFit?sourcingId=${sourcingId}&candidateId=${candidateId}`),
            deleteSourcing: (id) => axios.delete(`${domain}/api/Sourcing/DeleteTask?sourcingId=${id}`),
            getStageType: (id) => axios.get(`${domain}/api/Sourcing/GetStageType?sourcingId=${id}`),
            sourceMore: (id, count) => axios.post(`${domain}/api/Sourcing/SourceMore?sourcingId=${id}&count=${count}`),
            //getSouring: (id) => axios.get('${domain}/api/Sourcing/GetSourcingInfo'), TODO in WEBAPI
        }
    },

    filter() {
        return {
            getTitles: (history) => axios.get(`${domain}/api/Filters/GetTitles?history=${history}`),
            getSkills: () => axios.get(`${domain}/api/Filters/GetSkills`),
            getLocations: (history) => axios.get(`${domain}/api/Filters/GetLocations?history=${history}`),
            getCompanies: () => axios.get(`${domain}/api/Filters/GetCompanies`),
            getIndustries: () => axios.get(`${domain}/api/Filters/GetIndustries`),
            getFiltersById: (id) => axios.get(`${domain}/api/Filters/GetFiltersById/${id}`),
            getSuggestions: (body) => axios.post(`${domain}/api/Filters/GetSuggestions`, body),
        }
    },

    candidates() {
        return {
            getCandidatesBySourcing: (sourcingId, stageLevel) => axios.get(`${domain}/api/Candidates/GetCandidates?sourcingId=${sourcingId}&stageLevel=${stageLevel}`),
            candidateToNextStage: (id) => axios.post(`${domain}/api/Candidates/CandidateToNextStage?sourcingCandidateId=${id}`),
            getStagesCounts: (id) => axios.get(`${domain}/api/Candidates/GetStagesCounts?sourcingId=${id}`),
        }
    },

    toolbox() {
        return {
            generateBooleanSearch: (body) => axios.post(`${domain}/api/ToolBox/CreateBooleanSearch`, body),
            getSuggestions: (body) => axios.post(`${domain}/api/ToolBox/GetSuggestions`, body)
        }
    }
}