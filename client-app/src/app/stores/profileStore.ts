import { Photo } from './../models/profile';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import agent from '../api/agent';
import { Profile } from "../models/profile";
import { store } from './store';

export default class ProfileStore{
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activeTab = 0;

    constructor(){
        makeAutoObservable(this);

        reaction(
            () => this.activeTab, 
            activeTab => {
                //點擊第三or第四的tab，才load追隨者資訊
                if(activeTab === 3 || activeTab === 4){
                    const predicate = activeTab === 3? 'followers' : 'following';
                    this.loadFollowing(predicate);
                }else{
                    this.followings = [];
                }
            }
        )
    }

    setActiveTab = (activeTab: any) =>{
        this.activeTab = activeTab;
    }

    get isCurrentUser(){
        if(store.userStore.user && this.profile){
            return store.userStore.user.username === this.profile.username;
        }

        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;

        try{
            const profile = await agent.Profiles.get(username);
            runInAction(() =>{
                this.profile = profile;
                this.loadingProfile = false;
            });

        }catch(error){
            console.log(error);
            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;

        try{
            const reponse  = await agent.Profiles.uploadPhoto(file);
            const photo = reponse.data;
            runInAction(() => {
                if(this.profile){
                    this.profile.photos?.push(photo);
                
                    if(photo.isMain && store.userStore.user){
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
                this.uploading = false;
            })
        }catch(error){
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;

        try{
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);

            runInAction(() => {
                if(this.profile && this.profile.photos){
                    this.profile.photos.find(x => x.isMain)!.isMain = false;
                    this.profile.photos.find(x => x.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                    this.loading = false;
                }
            })
        }catch(error){
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.loading = true;

        try{
            await agent.Profiles.deletePhoto(photo.id);

            runInAction(() => {
                if(this.profile && this.profile.photos){
                    this.profile.photos = this.profile.photos.filter(x => x.id !== photo.id);
                    this.loading = false;
                }
            })
        }catch(error){
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    //改變自己or他人profile的following狀態
    //要叫資料庫資料，所以要async await
    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;

        try{
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);

            runInAction(() => {
                //登入者追隨時
                
                //被追隨的人 follower數量 +- 1
                if(this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username === username)
                {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }
                //登入者的following數量 +-1
                if(this.profile && this.profile.username === store.userStore.user?.username){
                    following ? this.profile.followingCount++ : this.profile.followingCount--
                }
                //改變目前"自己"(followings的profile)的follower數量
                this.followings.forEach(profile => {
                    if(profile.username === username){
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }
                })
                this.loading = false;
            })
        }catch(error){
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    loadFollowing = async (predicate: string) => {
        this.loadingFollowings = true;

        try{
            const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() =>{
                this.followings = followings;
                this.loadingFollowings = false;
            })

        }catch(error){
            console.log(error);
            runInAction(() => this.loadingFollowings = false);
        }
    }
}