import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";
import { useStore } from "../stores/store";

interface Props extends RouteProps{
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
}

export default function PrivateRoute({component: Component, ...rest}: Props){
    const {userStore: {isLoggedIn}} = useStore();
    return(
        //若無登入 ==> 導回首頁
        //若有登入 ==> 根據Route進入相應Component
        <Route 
            {...rest}
            render={(props) => isLoggedIn ? <Component {...props} /> : <Redirect to={'/'} />}
        />
    )
}