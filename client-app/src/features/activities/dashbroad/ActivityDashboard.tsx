import React from "react";
import { Grid } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface Props{
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id: string) => void;
    cancelSelectActivity: () => void;
    editMode: boolean;
    openForm: (id: string) => void;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
}

//{activities} : 將props做desturcturing
export default function ActivityDashboard({activities, selectedActivity, 
    selectActivity, cancelSelectActivity, editMode, openForm, closeForm, createOrEdit, deleteActivity}: Props){
    return(
        <Grid>
            <Grid.Column width='10'> 
                <ActivityList activities={activities} 
                selectActivity = {selectActivity}
                deleteActivity = {deleteActivity}
                 />
            </Grid.Column>
            <Grid.Column width='6'>
                {/* 當selectedActivity 有值才顯示ActivityDetails */}
                {/* 當editMode時，ActivityDetails不出現 */}
                {selectedActivity && !editMode &&
                <ActivityDetails
                    activity={selectedActivity} 
                    cancelSelectActivity = {cancelSelectActivity} 
                    openForm={openForm}
                />}
                {/* 當editMode == true，ActivityForm出現 */}
                {editMode &&
                <ActivityForm closeForm={closeForm} activity={selectedActivity} createOrEdit = {createOrEdit}/>}
            </Grid.Column>
        </Grid>
    )
}