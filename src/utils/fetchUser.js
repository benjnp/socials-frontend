import { jwtDecode } from "jwt-decode";

export const fetchUser = () => {
    const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear()
    return(jwtDecode(userInfo));
}