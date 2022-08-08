import React from "react";
import { Grid, Tab, Header, List } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";

interface Props{
    profile: Profile
}

export default function ProfileAbout({profile} : Props){
    return(
        <Tab.Pane >
            <Grid>
                <Grid.Column width={16} >
                    <Header
                        floated="left"
                        icon='user'
                        content={profile.displayName}
                    />
                    
                </Grid.Column>
                <Grid.Column width={16}>
                    <List>
                        <List.Item>{profile.bio || 'Hello Nice to meet you!'}</List.Item>
                    </List>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}