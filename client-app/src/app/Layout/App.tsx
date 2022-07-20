import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashbroad/ActivityDashboard';
import {v4 as uuid} from 'uuid';

function App() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined)
  const [editMode, setEditMode] = useState(false);

  useEffect(()=>{
    axios.get<Activity[]>("http://localhost:5000/api/activities").then(response => {
      setActivities(response.data);
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
  //activity.id有值 ==> Edit ==> 以id找出舊的activity並刪除他，把修改後的activity加入activities陣列當中
  //activity.id沒有值==> Create ==> 給予新activity一個ID後，將新activity加入activities陣列當中
  activity.id ? 
  setActivities([...activities.filter(x=>x.id !== activity.id), activity])
  : setActivities([...activities, {...activity, id: uuid()}]);
  setEditMode(false);
  setSelectedActivity(activity);
}

function handleDeleteActivity(id: string){
  setActivities([...activities.filter(x=>x.id !== id)]);
}

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
        deleteActivity={handleDeleteActivity}/>
      </Container>
        
    </>
  );
}

export default App;
