//取得使用者資料
export interface User {
    username: string;
    displayName:string;
    token: string;
    image?: string;
}

//登入畫面用
export interface UserFormValues{
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}