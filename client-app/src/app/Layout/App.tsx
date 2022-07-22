import React, { useEffect} from 'react';
import {  Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashbroad/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  const {activityStore} = useStore();

  useEffect(()=>{
    activityStore.loadActivities();
  }, [activityStore]) //加入dependency參數，避免useEffect重複呼叫setActivities

if(activityStore.loadingInitial) return <LoadingComponent content='Loading app...' />

  return (
    //<></>等同於<Fragment></Fragment>
    <>
      <NavBar/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard/>
      </Container>
        
    </>
  );
}

export default observer(App);
