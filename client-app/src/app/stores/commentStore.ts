import { makeAutoObservable, runInAction } from 'mobx';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { ChatComment } from './../models/comment';
import { store } from './store';
export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if(store.activityStore.selectedActivity){
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/chat?activityId=' + activityId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                }) //連線時提供jwt token
                .withAutomaticReconnect() //斷線時自動重新連線
                .configureLogging(LogLevel.Information) //記錄連線時的資訊
                .build();
            this.hubConnection.start().catch(error => console.log('Error establishing the connection', error));
                
            //連線成功，載入相關comment
            this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
                runInAction(() => {
                    //UTC時間尾端會有一個'Z'，但儲存在資料庫的時間資料，尾端不會加'Z'
                    //==> 從資料庫帶出時間資料後自己補'Z'
                    comments.forEach(comment => {
                        comment.createAt = new Date(comment.createAt + 'Z');
                    })
                    this.comments = comments
                });
                
            })

            //上傳新comment，通知同Group成員
            this.hubConnection.on('ReceiveComment', (comment: ChatComment) => {
                //SignalR的時間資料，尾端會自行加上'Z'
                runInAction(() => {
                    comment.createAt = new Date(comment.createAt);
                    this.comments.unshift(comment) //unshift將新增的comment放到array最前端
                });
            })
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error));
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id;

        try{
            //呼叫Hub當中的SendComment方法
            await this.hubConnection?.invoke("SendComment", values);
        }catch(error){
            console.log(error);
        }
    }
}