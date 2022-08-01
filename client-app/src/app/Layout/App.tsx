import React, { useEffect } from 'react';
import {  Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashbroad/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestError from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import LoginForm from '../../features/user/LoginForm';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';

function App() {
  const location = useLocation();
  const {commonStore, userStore} = useStore();

  useEffect(() => {
    if(commonStore.token){
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    }else{
      commonStore.setAppLoaded();
    }
  },[userStore, commonStore])

  if(!commonStore.appLoaded) return <LoadingComponent content='Loading app...' />

  return (
    //<></>等同於<Fragment></Fragment>
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      <Route exact path='/' component={HomePage}/>
      <Route 
        path={'/(.+)'} //路徑符合 '/ + 任何東西'
        render={() => (
          <>
          <NavBar/>
          <Container style={{marginTop: '7em'}}>  
            {/* Switch: 一次只有一個路徑的component可出現 */}
            <Switch>
              <Route exact path='/activities' component={ActivityDashboard}/>
              <Route path='/activities/:id' component={ActivityDetails}/>
              {/* 當key改變時，react會重新創造一個新Component */}
              <Route key = {location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm}/>
              <Route path='/profiles/:username' component={ProfilePage}/>
              <Route path='/errors' component={TestError}/>
              <Route path='/server-error' component={ServerError}/>
              <Route path='/login' component={LoginForm}/>
              {/* 路徑不符合以上路徑->進入NotFound page */}
              <Route component={NotFound} /> 
            </Switch>        
          </Container> 
          </>
        )}
      />
    </>
  );
}

export default observer(App);
