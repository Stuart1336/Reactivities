import { observer } from "mobx-react-lite";
import React, { SyntheticEvent } from "react";
import { Button, Reveal } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";

interface Props{
    profile: Profile;
}

export default observer(function FollowButton({profile}: Props){
    const {profileStore, userStore} = useStore();
    const {updateFollowing, loading} = profileStore;

    //自己不能追隨自己
    if(userStore.user?.username === profile.username) return null

    function handleFollow(e: SyntheticEvent, username: string){
        //不停掉submit event，當button被按到時，同一頁的Link會被觸發
        e.preventDefault();
        profile.following ? updateFollowing(username, false) : updateFollowing(username, true);
    }

    return(
        <Reveal animated="move">
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button 
                    fluid 
                    color="teal" 
                    content={profile.following ? "Following" : "Not following"} />
            </Reveal.Content>
            <Reveal.Content hidden style={{ width: '100%' }}>
                <Button
                    fluid
                    basic
                    color={profile.following ? 'red' : 'green'}
                    content={profile.following ? "Unfollow" : "Follow"}
                    onClick={e => handleFollow(e, profile.username)}
                    loading={loading}
                />
            </Reveal.Content>
        </Reveal>
    )
})