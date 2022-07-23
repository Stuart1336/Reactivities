import React from 'react';
import {  Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashbroad/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

function App() {
  const location = useLocation();

  return (
    //<></>等同於<Fragment></Fragment>
    <>
      <Route exact path='/' component={HomePage}/>
      <Route 
        path={'/(.+)'} //路徑符合 '/ + 任何東西'
        render={() => (
          <>
          <NavBar/>
          <Container style={{marginTop: '7em'}}>          
            <Route exact path='/activities' component={ActivityDashboard}/>
            <Route path='/activities/:id' component={ActivityDetails}/>
            {/* 當key改變時，react會重新創造一個新Component */}
            <Route key = {location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm}/>
          </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
