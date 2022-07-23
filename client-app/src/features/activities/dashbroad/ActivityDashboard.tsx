import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/Layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import ActivityFilter from "./ActivityFilter";
import ActivityList from "./ActivityList";

//{activities} : 將props做desturcturing
export default observer(function ActivityDashboard(){
    const {activityStore} = useStore();
    const {loadActivities, activityRegistry} = activityStore;

    useEffect(()=>{
      if(activityRegistry.size <= 1) loadActivities();
    }, [activityRegistry.size, loadActivities]) //加入dependency參數，避免useEffect重複呼叫setActivities
  
  if(activityStore.loadingInitial) return <LoadingComponent content='Loading app...' />

    return(
        <Grid>
            <Grid.Column width='10'> 
                <ActivityList/>
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilter />
            </Grid.Column>
        </Grid>
    )
})