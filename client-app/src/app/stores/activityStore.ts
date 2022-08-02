import { Profile } from './../models/profile';
import { store } from './store';
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import {format} from 'date-fns';

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    //makeAutoObservable會自動偵測class內的屬性和動作
    constructor(){
        makeAutoObservable(this)
    }
    
    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
            a.date!.getTime() - b.date!.getTime()
        );
    }

    get groupedActivity(){
        //組裝出由array組成的object。object的key為activity.date，將同日期的activity組成一組
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key:string]: Activity[]})
        )
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try
        {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                this.setActivity(activity);
            })

            this.setLoadingInitial(false);
        }catch(error){
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id :string)=> {
        //從本機記憶體尋找activity
        let activity = this.getActivity(id);
        if(activity){
            this.selectedActivity = activity;
            return activity;
        }
        //若記憶體中無activity，則重新呼叫API，抓取activity
        else{
            this.loadingInitial = true;
            try{
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                })
                this.setLoadingInitial(false);
                return activity;
            }catch(error){
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user; //取得登入者資訊
        if(user){
            //若此登入者有在活動的參加者名單(attendees)上 => activity.isGoing = true
            activity.isGoing = activity.attendees!.some(
                x => x.username === user.username
            )
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find(x=> x.username === activity.hostUsername);
        }

        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id :string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try{
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);

            //ActivityFormValues中沒有hostUsername和attendees
            //要自己補上
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
            })
        }catch(error){
            console.log(error);
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        try{
            await agent.Activities.update(activity);

            runInAction(() => {
                if(activity.id){
                    //用seperate opration更新activity屬性
                    //更新的屬性會自動覆寫舊有屬性??
                    let updateActivity = {...this.getActivity(activity.id), ...activity}
                    this.activityRegistry.set(activity.id, updateActivity as Activity)
                    this.selectedActivity = updateActivity as Activity;
                }
                
            })
        }catch(error){
            console.log(error);
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;

        try{
            await agent.Activities.delete(id);

            runInAction(() => {
                this.activityRegistry.delete(id)
                this.loading = false;
            })
        }catch(error){
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;

        try
        {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                //若user有參加該活動 => 把user從該活動的參加者名單剔除，isGoing改為false
                if(this.selectedActivity?.isGoing){
                    this.selectedActivity.attendees = 
                        this.selectedActivity.attendees?.filter(x => x.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                }else{
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                //set會根據key自動更新map裡的物件
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })

        }catch(error){
            console.log(error);
        }finally{
            runInAction(() => this.loading = false);
        }
    }

    cancelActivityToggle = async () => {
        this.loading = true;

        try{
            this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
            this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
        }catch(error){
            console.log(error)
        }finally{
            runInAction(() => this.loading = false);
        }
    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }
}