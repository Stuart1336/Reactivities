import { history } from './../../index';
import { runInAction } from 'mobx';
import { UserFormValues } from './../models/user';
import { makeAutoObservable } from 'mobx';
import { User } from "../models/user";
import agent from '../api/agent';
import { store } from './store';

export default class UserStore{
    user: User | null = null;
    
    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn(){
        return !!this.user;
    }

    login = async (cred: UserFormValues) => {
        try{
            const user = await agent.Account.login(cred);
            store.commonStore.setToken(user.token);
            //在await之後，為了要觀測(observe)store裡面任何值的改變
            //this.xxx = xxx 都要放在runInAction中
            runInAction(() => {this.user = user;})
            history.push("/activities");
            store.modalStore.closeModal();
        }catch(error){
            throw error;
        }
    }

    logout = () =>{
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        this.user = null;
        history.push('/'); //回首頁
    }

    getUser = async () => {
        try{
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
        }catch(error){
            console.log(error);
        }
    }

    register = async (cred: UserFormValues) => {
        try{
            const user = await agent.Account.register(cred);
            store.commonStore.setToken(user.token);
            runInAction(() => {this.user = user;})
            history.push("/activities");
            store.modalStore.closeModal();
        }catch(error){
            throw error;
        }
    }

    setImage = (image: string) => {
        if(this.user){
            this.user.image = image;
        }
    }
}