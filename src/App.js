import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Router, Route, Switch } from 'react-router-dom'
//import './App.css';

import './font-awesome.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './reset.css'
import './style.css'
import 'react-notifications-component/dist/theme.css'

//import { Router, Route, browserHistory } from "react-router";

import Root from './components/Root'
import SideBarMenu from './components/SideBarMenu'
//import Candidates from './components/Candidates'
import TopNavBar from './components/TopNavBar'
//import Projects from './components/Projects'
//import Filters from './components/Filters'
//import Settings from './components/Settings'
import Sourcing from './components/Sourcing'
import Login from './components/Login'
//import SourcingCreateConfirm from './components/SourcingCreateConfirm'
//import SourcingList from './components/SourcingList'
//import ToolBox from './components/ToolBox'

const Projects = React.lazy(() => import('./components/Projects'))
const Filters = React.lazy(() => import('./components/Filters'))
const Candidates = React.lazy(() => import('./components/Candidates'))
const SourcingList = React.lazy(() => import('./components/SourcingList'))
const Settings = React.lazy(() => import('./components/Settings'))
const ToolBox = React.lazy(() => import('./components/ToolBox'))
const SourcingCreateConfirm = React.lazy(() => import('./components/SourcingCreateConfirm'))
// const SideBarMenu = React.lazy(() => './components/SideBarMenu')

// const TopNavBar = React.lazy(() => './components/TopNavBar')
// const Projects = React.lazy(() => './components/Projects')

// const Settings = React.lazy(() => './components/Settings')
// const Sourcing = React.lazy(() => './components/Sourcing')
// const Login = React.lazy(() => './components/Login')
// const SourcingCreateConfirm = React.lazy(
//   () => './components/SourcingCreateConfirm'
// )
// const SourcingList = React.lazy(() => './components/SourcingList')
// const ToolBox = React.lazy(() => './components/ToolBox')

class App extends React.Component {
  render () {
    return (
      <BrowserRouter>
        {' '}
        <Switch>
          <Route path='/login' component={Login} />
          {/* this is not how you declare a parent <Route path="/" component={Root}/> */}
          <Root>
            <Suspense fallback={null}>
              <Route exact path='/' component={Projects} />
              <Route
                path='/sourcing/:id/createsourcing/:sourcingFiltersId?'
                component={Filters}
              />
              <Route exact path='/projects' component={Projects} />
              <Route path='/candidates' component={Candidates} />
              <Route exact path="/projects/:id" component={SourcingList} />
              <Route exact path="/projects/sourcing/:sourcingId/candidates" component={Candidates} />
              <Route path="/settings" component={Settings} />
            <Route path="/toolbox" component={ToolBox} /> 
            <Route path="/sourcing/:projectId/confirmsourcing/:id" component={SourcingCreateConfirm} />
            </Suspense>

            
              

              
             
             
          
            
          </Root>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App
