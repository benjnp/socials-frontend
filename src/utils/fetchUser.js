import { jwtDecode } from "jwt-decode";

export const fetchUser = () => {
    const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear()
    if (userInfo)
        return(jwtDecode(userInfo));
    else
        return null

}