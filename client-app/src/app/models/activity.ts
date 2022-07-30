import { act } from "react-dom/test-utils";
import { Profile } from "./profile";

export interface Activity {
    id:          string;
    title:       string;
    date:        Date | null;
    description: string;
    category:    string;
    city:        string;
    venue:       string;
    hostUsername: string;
    isCancelled: boolean;
    isGoing: boolean;
    isHost: boolean;
    host?: Profile;
    attendees: Profile[];
}

//將ActivityFormValues資料轉換到Activity
export class Activity implements Activity{
    constructor(init?: ActivityFormValues) {
        Object.assign(this, init)
    }
}

//將從API得到的Activity資料，轉換成ActivityForm型態
export class ActivityFormValues{
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description: string = '';
    date: Date | null = null;
    city: string = '';
    venue: string = '';

    constructor(activity?: ActivityFormValues) {
        //已有activity => 修改
        if(activity){
            this.id = activity.id;
            this.title = activity.title;
            this.category = activity.category;
            this.description = activity.description;
            this.date = activity.date;
            this.city = activity.city;
            this.venue = activity.venue;
        }
    }
}