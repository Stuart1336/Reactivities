import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/Layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";
import ActivtiyDetailedChats from "./ActivtiyDetailedChats";

export default observer (function ActivityDetails(){
    const {activityStore} = useStore();
    const {selectedActivity: activity, loadActivity, loadingInitial} = activityStore
    const {id} = useParams<{id: string}>();

    useEffect(() => {
        if(id) loadActivity(id);
    },[id,loadActivity]) //dependency: 當id或loadActivity改變時才會觸發useEffect

    if(loadingInitial || !activity) return <LoadingComponent />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity}/>
                <ActivityDetailedInfo activity={activity}/>
                <ActivtiyDetailedChats />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar />
            </Grid.Column>
        </Grid>
    )
})