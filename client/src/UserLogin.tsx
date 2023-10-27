import { createContext, useState } from "react";

export const userLoginContext = createContext({});

const UserLoginProvider = (props: any) => {
    const [userLogin, setUserLogin] = useState(localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token') as any ):null);

    return (
        <userLoginContext.Provider value={[userLogin, setUserLogin]}>   
            {props.children}
        </userLoginContext.Provider>
    )
}
export default UserLoginProvider;

