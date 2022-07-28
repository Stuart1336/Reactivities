import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore{
    error: ServerError | null = null;
    token: string | null = window.localStorage.getItem('jwt');
    appLoaded = false;

    constructor(){
        makeAutoObservable(this);

        //網頁初次載入時不會啟動
        //當token改變時，才會修改localStorage
        reaction(
            () => this.token,
            token => {
                if(token){
                    window.localStorage.setItem('jwt', token);
                }else{
                    window.localStorage.removeItem('jwt');
                }
            }
        )
    }

    setServerError = (error: ServerError) => {
        this.error = error;
    }

    setToken = (token: string | null) => {
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}