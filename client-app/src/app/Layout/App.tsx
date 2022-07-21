import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashbroad/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined)
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(()=>{
    agent.Activities.list().then(response => {
      let activities: Activity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0]; //取得日期部分
        activities.push(activity);
      })
      setActivities(activities);
      setLoading(false);
    })
  }, []) //加入dependency參數，避免useEffect重複呼叫setActivities

function handleSelectActivity(id: string){
  setSelectedActivity(activities.find(x => x.id === id))
}

function handleCancelSelectActivity(){
  setSelectedActivity(undefined)
}

function handleFormOpen(id?:string){
  id ? handleSelectActivity(id) : handleCancelSelectActivity();
  setEditMode(true);
}

function handleFormClose(){
  setEditMode(false);
}

function handleCreateOrEditActivity(activity: Activity){
  setSubmitting(true);
  //activity.id有值 ==> Edit ==> 以id找出舊的activity並刪除他，把修改後的activity加入activities陣列當中
  //activity.id沒有值==> Create ==> 給予新activity一個ID後，將新activity加入activities陣列當中
  if(activity.id){
    agent.Activities.update(activity).then(() =>{
      setActivities([...activities.filter(x=>x.id !== activity.id), activity])
      setEditMode(false);
      setSelectedActivity(activity);
      setSubmitting(false);
    })
  }else{
    activity.id = uuid();
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity]);
      setEditMode(false);
      setSelectedActivity(activity);
      setSubmitting(false);
    })
  }
}

function handleDeleteActivity(id: string){
  setSubmitting(true);
  agent.Activities.delete(id).then(() => {
    setActivities([...activities.filter(x=>x.id !== id)]);
    setSubmitting(false);
  })
}

if(loading) return <LoadingComponent content='Loading app...' />

  return (
    //<></>等同於<Fragment></Fragment>
    <>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
        activities={activities} 
        selectedActivity={selectedActivity}
        selectActivity={handleSelectActivity}
        cancelSelectActivity={handleCancelSelectActivity}
        editMode = {editMode}
        openForm = {handleFormOpen}
        closeForm = {handleFormClose}
        createOrEdit = {handleCreateOrEditActivity}
        deleteActivity={handleDeleteActivity}
        submitting = {submitting}
        />
      </Container>
        
    </>
  );
}

export default App;
