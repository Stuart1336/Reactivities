import { observer } from "mobx-react-lite";
import React from "react";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

//{activities} : 將props做desturcturing
export default observer(function ActivityDashboard(){
    const {activityStore} = useStore();
    const {selectedActivity, editMode} = activityStore

    return(
        <Grid>
            <Grid.Column width='10'> 
                <ActivityList/>
            </Grid.Column>
            <Grid.Column width='6'>
                {/* 當selectedActivity 有值才顯示ActivityDetails */}
                {/* 當editMode時，ActivityDetails不出現 */}
                {selectedActivity && !editMode &&
                <ActivityDetails/>}
                {/* 當editMode == true，ActivityForm出現 */}
                {editMode &&
                <ActivityForm
                    />}
            </Grid.Column>
        </Grid>
    )
})